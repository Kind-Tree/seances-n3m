/* ==========================================================================
   Moteur d'animation 2D des séances — terrain de volley vu du dessus.

   Repère, en mètres :
     x : le long du terrain. Filet en x = 0, camp A en x < 0, camp B en x > 0.
     y : en travers, de 0 à 9. Le camp A regarde vers +x : son poste 4 est en
         y petit, son poste 2 en y grand. Le camp B est le symétrique.

   Une scène contient des pions (joueurs), des ballons et des objets, puis des
   étapes. Chaque étape a un titre, une phrase et une liste d'actions :
   un tableau = actions l'une après l'autre, P(...) = actions en même temps.

   Le rendu ne garde aucun état : dessiner(t) recalcule toute l'image à
   l'instant t, ce qui permet la pause, le pas à pas et le retour en arrière.
   ========================================================================== */
(function (global) {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const U = 100;            // unités SVG par mètre
  const R_PION = 0.56;      // rayon d'un pion, en mètres
  const R_BALLON = 0.3;     // rayon du ballon posé au sol, en mètres
  const COURSE = 4.4;       // vitesse de course, en m/s à la vitesse x1
  const AMORCE = 0.45;      // temps laissé pour lire avant la première action d'une étape
  const TENUE = 0.8;        // arrêt sur image après la dernière action d'une étape
  const CADENCE = 1.5;      // rythme de lecture à la vitesse x1 de l'interface (1 = temps réel de la scène)

  const VUES = {
    tout: { x0: -11.8, x1: 11.8, y0: -2.2, y1: 11.2 },
    A: { x0: -11.8, x1: 1.7, y0: -1.5, y1: 10.5 },
    B: { x0: -1.7, x1: 11.8, y0: -1.5, y1: 10.5 }
  };

  // Types de trajectoire du ballon : durée = b + k × distance ; h = hauteur relative ;
  // p = profil (arc, desc = frappe qui descend, plat, sol) ; trait = style de la trace.
  const VOLS = {
    service:   { b: 0.55, k: 0.045, h: 0.62, p: "arc",  trait: "plein" },
    attaque:   { b: 0.20, k: 0.030, h: 0.85, p: "desc", trait: "fort" },
    passe:     { b: 0.75, k: 0.060, h: 1.00, p: "arc",  trait: "tirets" },
    transi:    { b: 0.80, k: 0.060, h: 1.00, p: "arc",  trait: "tirets" },
    recep:     { b: 0.62, k: 0.065, h: 0.80, p: "arc",  trait: "tirets" },
    defense:   { b: 0.62, k: 0.065, h: 0.85, p: "arc",  trait: "tirets" },
    manchette: { b: 0.60, k: 0.060, h: 0.75, p: "arc",  trait: "tirets" },
    relance:   { b: 0.80, k: 0.050, h: 1.00, p: "arc",  trait: "tirets" },
    bidouille: { b: 0.45, k: 0.060, h: 0.50, p: "arc",  trait: "points" },
    poussee:   { b: 0.50, k: 0.050, h: 0.65, p: "arc",  trait: "tirets" },
    lancer:    { b: 0.45, k: 0.050, h: 0.60, p: "arc",  trait: "tirets" },
    sol:       { b: 0.18, k: 0.030, h: 0.70, p: "desc", trait: "plein" },
    rebond:    { b: 0.55, k: 0.060, h: 0.95, p: "arc",  trait: "tirets" },
    roule:     { b: 0.30, k: 0.120, h: 0.00, p: "sol",  trait: "points" },
    main:      { b: 0.25, k: 0.050, h: 0.22, p: "plat", trait: "points" }
  };

  // ---------- Géométrie ----------
  const POSTES = { 1: [-7.0, 7.3], 2: [-1.7, 7.3], 3: [-1.7, 4.5], 4: [-1.7, 1.7], 5: [-7.0, 1.7], 6: [-7.3, 4.5] };
  const miroir = (p) => [-p[0], 9 - p[1]];
  // camp("B") transforme des coordonnées écrites pour le camp A en coordonnées du camp B.
  const camp = (c) => (c === "B" ? (x, y) => [-x, 9 - y] : (x, y) => [x, y]);
  const poste = (c, n, dx, dy) => camp(c)(POSTES[n][0] + (dx || 0), POSTES[n][1] + (dy || 0));
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const lerp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const doux = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- Actions ----------
  const avec = (base, ...autres) => Object.assign(base, ...autres.map((o) => o || {}));
  const actions = {
    // Vol du ballon vers un joueur (identifiant) ou un point [x, y].
    // Options : d (durée), delai, sol (tombe au sol), tenu (attrapé), de (point de départ forcé), h (hauteur).
    B: (id, vers, type, o) => avec({ k: "vol", id: id, vers: vers, type: type || "passe" }, o),
    // Déplacement d'un joueur vers un point. Options : d, delai.
    M: (id, vers, o) => avec({ k: "mv", id: id, vers: vers }, o),
    // Actions en même temps.
    P: (...enfants) => ({ k: "par", enfants: enfants }),
    // Attente.
    W: (d) => ({ k: "att", d: d }),
    // Saut (attaque) : le pion grossit un instant.
    S: (id, o) => avec({ k: "saut", id: id, d: 0.5 }, o),
    // Bloc : une barre apparaît côté filet devant chaque joueur cité.
    BL: (ids, o) => avec({ k: "bloc", ids: [].concat(ids), d: 0.9 }, o),
    // Bulle de parole.
    D: (id, texte, o) => avec({ k: "dit", id: id, texte: texte, d: 1.7 }, o),
    // Texte qui s'élève depuis un point ou un joueur (« +2 », « Point ! »).
    PT: (ou, texte, o) => avec({ k: "pop", ou: ou, texte: texte, d: 1.9 }, o),
    // Le ballon apparaît (dans les mains d'un joueur ou en un point) ou disparaît.
    A: (id, chez) => ({ k: "app", id: id, chez: chez }),
    X: (id) => ({ k: "disp", id: id }),
    // Zone repère allumée ou éteinte.
    Z: (id, on) => ({ k: "zone", id: id, on: on !== false }),
    // Met un joueur en évidence.
    F: (id, o) => avec({ k: "flash", id: id, d: 1.1 }, o),
    // Oriente un joueur (angle en degrés dans le repère du terrain, 0 = vers +x).
    O: (id, angle) => ({ k: "face", id: id, angle: angle }),
    // Flèche d'option, sans ballon : montre une autre trajectoire possible jusqu'à la fin de l'étape.
    FL: (de, vers, label, o) => avec({ k: "fleche", de: de, vers: vers, label: label || "" }, o)
  };

  // ---------- Scène ----------
  function Scene() {
    this.joueurs = {};
    this.ordreJ = [];
    this.ballons = {};
    this.ordreB = [];
    this.objets = [];
    this.zones = {};
    this.etapes = [];
    this.vue = VUES.tout;
    this.alertes = [];
    this._chapitre = "";
  }

  Scene.prototype.cadre = function (v) {
    this.vue = typeof v === "string" ? VUES[v] : v;
    return this;
  };
  // Pion joueur. eq : "a" (orange), "b" (blanc), "c" (gris). Options : lib (libéro), nom, face (angle), sens.
  Scene.prototype.j = function (id, pos, label, eq, o) {
    if (this.joueurs[id]) throw new Error("Joueur déjà défini : " + id);
    this.joueurs[id] = avec({ id: id, x: pos[0], y: pos[1], t: label == null ? "" : String(label), eq: eq || "a" }, o);
    this.ordreJ.push(id);
    return this;
  };
  Scene.prototype.coach = function (id, pos, o) {
    return this.j(id, pos, "Co", "coach", o);
  };
  // Ballon : dans les mains d'un joueur (identifiant), posé en un point [x, y], ou caché (rien).
  Scene.prototype.ballon = function (id, ou) {
    this.ballons[id] = { id: id, chez: typeof ou === "string" ? ou : null, pt: Array.isArray(ou) ? ou : null };
    this.ordreB.push(id);
    return this;
  };
  Scene.prototype.banc = function (x, y, o) {
    this.objets.push(avec({ k: "banc", x: x, y: y, long: 2.4, large: 0.55, sens: "y" }, o));
    return this;
  };
  Scene.prototype.caddie = function (x, y) {
    this.objets.push({ k: "caddie", x: x, y: y });
    return this;
  };
  Scene.prototype.plot = function (x, y) {
    this.objets.push({ k: "plot", x: x, y: y });
    return this;
  };
  Scene.prototype.frite = function (y) {
    this.objets.push({ k: "frite", y: y });
    return this;
  };
  // Trait pointillé au sol (séparation de deux petits terrains, par exemple).
  Scene.prototype.trait = function (x0, y0, x1, y1) {
    this.objets.push({ k: "trait", x0: x0, y0: y0, x1: x1, y1: y1 });
    return this;
  };
  Scene.prototype.note = function (x, y, texte, o) {
    this.objets.push(avec({ k: "note", x: x, y: y, texte: texte }, o));
    return this;
  };
  // Zone repère. forme : "rect" {x0, y0, x1, y1} ou "rond" {x, y, r}. Options : label, on (visible au départ).
  Scene.prototype.zone = function (id, forme, o) {
    this.zones[id] = avec({ id: id, forme: forme, on: true }, o);
    return this;
  };
  Scene.prototype.chapitre = function (nom) {
    this._chapitre = nom;
    return this;
  };
  Scene.prototype.etape = function (titre, texte, arbre) {
    this.etapes.push({ titre: titre, texte: texte || "", arbre: arbre || [], chapitre: this._chapitre });
    return this;
  };

  function hauteur(e, u) {
    const v = VOLS[e.type];
    const H = e.h != null ? e.h : v.h;
    if (v.p === "arc") return (e.sol ? 0.2 * (1 - u) : 0.2) + H * 4 * u * (1 - u);
    if (v.p === "desc") return H * (1 - (e.sol ? 1 : 0.8) * u);
    if (v.p === "plat") return H;
    return 0;
  }

  Scene.prototype.posJoueur = function (id, t) {
    const j = this.joueurs[id];
    let pos = [j.x, j.y];
    const piste = j.piste;
    if (!piste) return pos;
    for (let i = 0; i < piste.length; i++) {
      const s = piste[i];
      if (t >= s.t1) pos = s.p1;
      else if (t > s.t0) return lerp(s.p0, s.p1, doux((t - s.t0) / (s.t1 - s.t0)));
      else break;
    }
    return pos;
  };

  // Position des mains d'un joueur qui tient un ballon.
  Scene.prototype.main = function (id, t) {
    const p = this.posJoueur(id, t);
    const j = this.joueurs[id];
    const s = j.sens != null ? j.sens : p[0] <= 0 ? 1 : -1;
    return [p[0] + 0.5 * s, p[1] - 0.44];
  };

  // État d'un ballon à l'instant t : null s'il est caché, sinon { p, h, vol, u }.
  Scene.prototype.posBallon = function (id, t) {
    const etats = this.ballons[id].etats;
    let s = etats[0];
    for (let i = 1; i < etats.length && etats[i].t0 <= t; i++) s = etats[i];
    if (s.k === "cache") return null;
    if (s.k === "pose") return { p: s.pt, h: 0 };
    if (s.k === "tenu") return { p: this.main(s.par, t), h: 0.22 };
    const e = s.ev;
    const u = borne((t - e.t0) / (e.t1 - e.t0), 0, 1);
    return { p: lerp(e.p0, e.p1, u), h: hauteur(e, u), vol: e, u: u };
  };

  Scene.prototype.indexEtape = function (t) {
    const et = this.etapes;
    for (let i = et.length - 1; i >= 0; i--) if (t >= et[i].t0) return i;
    return 0;
  };

  // Calcule les horaires et les trajectoires de toutes les actions.
  Scene.prototype.compiler = function () {
    const sc = this;
    const J = sc.joueurs;
    const BA = sc.ballons;
    const est = {};      // dernière position connue de chaque élément, pour estimer les durées
    const porteur = {};  // joueur qui tient chaque ballon, pendant la planification
    const arrivee = {};  // fin du dernier déplacement planifié de chaque joueur
    const evts = [];
    let t = 0;

    sc.ordreJ.forEach((id) => { est[id] = [J[id].x, J[id].y]; });
    sc.ordreB.forEach((id) => {
      const b = BA[id];
      if (b.chez && !J[b.chez]) throw new Error("Ballon « " + id + " » : porteur inconnu « " + b.chez + " »");
      porteur[id] = b.chez;
      est[id] = b.chez ? est[b.chez] : b.pt;
    });

    const ptEstime = (vers, ou) => {
      if (Array.isArray(vers)) return vers;
      if (J[vers]) return est[vers];
      throw new Error("Cible inconnue « " + vers + " » (" + ou + ")");
    };
    const estMv = (n) => n && n.k === "mv";

    function planifier(n, t0, ie) {
      if (!n) return t0;
      if (Array.isArray(n)) {
        n.forEach((c) => { t0 = planifier(c, t0, ie); });
        return t0;
      }
      const ou = "étape " + (ie + 1);
      if (n.k === "par") {
        let fin = t0;
        // Les déplacements d'abord : ils servent à estimer la durée des vols du même groupe.
        n.enfants.filter(estMv).concat(n.enfants.filter((c) => !estMv(c))).forEach((c) => {
          fin = Math.max(fin, planifier(c, t0, ie));
        });
        return fin;
      }
      if (n.k === "att") return t0 + n.d;
      const td = t0 + (n.delai || 0);
      if (n.k === "mv") {
        if (!J[n.id]) throw new Error("Joueur inconnu « " + n.id + " » (" + ou + ")");
        const d = n.d != null ? n.d : 0.28 + dist(est[n.id], n.vers) / COURSE;
        evts.push(avec({}, n, { t0: td, t1: td + d, ie: ie }));
        est[n.id] = n.vers;
        arrivee[n.id] = td + d;
        return td + d;
      }
      if (n.k === "vol") {
        if (!BA[n.id]) throw new Error("Ballon inconnu « " + n.id + " » (" + ou + ")");
        if (!VOLS[n.type]) throw new Error("Type de vol inconnu « " + n.type + " » (" + ou + ")");
        const de = n.de ? ptEstime(n.de, ou) : porteur[n.id] ? est[porteur[n.id]] : est[n.id];
        if (!de) throw new Error("Le ballon « " + n.id + " » n'est pas en jeu (" + ou + ")");
        const a = ptEstime(n.vers, ou);
        const v = VOLS[n.type];
        let d = n.d != null ? n.d : v.b + v.k * dist(de, a);
        // Le ballon n'arrive pas avant le joueur qui court le jouer.
        if (!Array.isArray(n.vers) && arrivee[n.vers] != null && arrivee[n.vers] > td + d - 0.04) {
          if (n.d != null || v.p === "desc") sc.alertes.push("Étape " + (ie + 1) + " : « " + n.vers + " » arrive après le ballon (" + n.type + ")");
          d = arrivee[n.vers] - td + 0.06;
        }
        evts.push(avec({}, n, { t0: td, t1: td + d, ie: ie }));
        est[n.id] = a;
        porteur[n.id] = n.tenu && !Array.isArray(n.vers) ? n.vers : null;
        return td + d;
      }
      if (n.k === "app") {
        if (!BA[n.id]) throw new Error("Ballon inconnu « " + n.id + " » (" + ou + ")");
        porteur[n.id] = Array.isArray(n.chez) ? null : n.chez;
        est[n.id] = ptEstime(n.chez, ou);
        evts.push(avec({}, n, { t0: td, t1: td, ie: ie }));
        return t0;
      }
      if (n.k === "disp") {
        porteur[n.id] = null;
        est[n.id] = null;
        evts.push(avec({}, n, { t0: td, t1: td, ie: ie }));
        return t0;
      }
      // Effets sans durée dans le déroulé : saut, bloc, bulle, texte, zone, mise en évidence, orientation.
      if (n.k === "fleche") {
        [n.de, n.vers].forEach((x) => { if (!Array.isArray(x) && !J[x]) throw new Error("Flèche : repère inconnu « " + x + " » (" + ou + ")"); });
        evts.push(avec({}, n, { t0: td, t1: td, ie: ie }));
        return t0;
      }
      if (n.id && n.k !== "zone" && !J[n.id]) throw new Error("Joueur inconnu « " + n.id + " » (" + ou + ")");
      (n.ids || []).forEach((id) => { if (!J[id]) throw new Error("Joueur inconnu « " + id + " » (" + ou + ")"); });
      if (n.k === "zone" && !sc.zones[n.id]) throw new Error("Zone inconnue « " + n.id + " » (" + ou + ")");
      evts.push(avec({}, n, { t0: td, t1: td + (n.d || 0), ie: ie }));
      return t0;
    }

    sc.etapes.forEach((e, i) => {
      e.t0 = t;
      e.fin = planifier(e.arbre, t + AMORCE, i);
      const lecture = 0.8 + 0.042 * (e.titre.length + e.texte.length);
      e.t1 = Math.max(e.fin + TENUE, t + lecture);
      t = e.t1;
    });
    sc.duree = t;
    evts.sort((a, b) => a.t0 - b.t0);
    sc.evts = evts;

    // Trajectoires des joueurs.
    evts.filter((e) => e.k === "mv").forEach((e) => {
      const j = J[e.id];
      j.piste = j.piste || [];
      const prec = j.piste[j.piste.length - 1];
      if (prec && prec.t1 > e.t0 + 1e-6) sc.alertes.push("Étape " + (e.ie + 1) + " : deux déplacements de « " + e.id + " » se chevauchent");
      e.p0 = sc.posJoueur(e.id, e.t0);
      e.p1 = e.vers;
      j.piste.push(e);
    });

    const proche = (pt, tt) => {
      let meilleur = null;
      let dmin = 1.0;
      sc.ordreJ.forEach((id) => {
        const d = dist(sc.posJoueur(id, tt), pt);
        if (d < dmin) { dmin = d; meilleur = id; }
      });
      return meilleur;
    };

    // Trajectoires des ballons.
    sc.ordreB.forEach((id) => {
      const b = BA[id];
      b.etats = [b.chez ? { t0: -1, k: "tenu", par: b.chez } : b.pt ? { t0: -1, k: "pose", pt: b.pt } : { t0: -1, k: "cache" }];
    });
    evts.filter((e) => e.k === "vol" || e.k === "app" || e.k === "disp").forEach((e) => {
      const b = BA[e.id];
      if (e.k === "app") {
        b.etats.push(Array.isArray(e.chez) ? { t0: e.t0, k: "pose", pt: e.chez } : { t0: e.t0, k: "tenu", par: e.chez });
        return;
      }
      if (e.k === "disp") {
        b.etats.push({ t0: e.t0, k: "cache" });
        return;
      }
      const dernier = b.etats[b.etats.length - 1];
      if (dernier.t0 > e.t0 + 1e-6) sc.alertes.push("Étape " + (e.ie + 1) + " : deux vols du ballon « " + e.id + " » se chevauchent");
      let de;
      if (e.de) de = Array.isArray(e.de) ? e.de : sc.main(e.de, e.t0);
      else {
        const etat = sc.posBallon(e.id, e.t0);
        if (!etat) throw new Error("Le ballon « " + e.id + " » est caché au moment de son vol (étape " + (e.ie + 1) + ")");
        de = etat.p;
      }
      let a;
      if (Array.isArray(e.vers)) a = e.vers;
      else {
        e.cible = e.vers;
        if (e.tenu) a = sc.main(e.vers, e.t1);
        else {
          const pj = sc.posJoueur(e.vers, e.t1);
          const n = dist(de, pj) || 1;
          a = [pj[0] + ((de[0] - pj[0]) / n) * 0.64, pj[1] + ((de[1] - pj[1]) / n) * 0.64];
        }
      }
      e.p0 = de;
      e.p1 = a;
      e.frappeur = proche(de, e.t0);
      if (dist(de, a) < 0.35) sc.alertes.push("Étape " + (e.ie + 1) + " : vol très court du ballon « " + e.id + " »");
      b.etats.push({ t0: e.t0, k: "vol", ev: e });
      b.etats.push(e.tenu && e.cible ? { t0: e.t1, k: "tenu", par: e.cible } : { t0: e.t1, k: "pose", pt: a });
    });

    // Flèches d'option : du bord du pion de départ jusqu'au point (ou au bord du pion) d'arrivée.
    evts.filter((e) => e.k === "fleche").forEach((e) => {
      const centre = (x) => (Array.isArray(x) ? x : sc.posJoueur(x, e.t0));
      const c0 = centre(e.de);
      const c1 = centre(e.vers);
      const n = dist(c0, c1) || 1;
      const ux = (c1[0] - c0[0]) / n;
      const uy = (c1[1] - c0[1]) / n;
      e.p0 = Array.isArray(e.de) ? c0 : [c0[0] + ux * 0.62, c0[1] + uy * 0.62];
      e.p1 = Array.isArray(e.vers) ? c1 : [c1[0] - ux * 0.62, c1[1] - uy * 0.62];
      e.pLabel = e.ou || (Array.isArray(e.vers) ? [e.p1[0] + ux * 0.55, e.p1[1] + uy * 0.55] : [(e.p0[0] + e.p1[0]) / 2, (e.p0[1] + e.p1[1]) / 2]);
    });

    // Contrôles : pions superposés ou hors cadre à la fin de chaque étape.
    const v = sc.vue;
    sc.etapes.forEach((e, i) => {
      const pos = sc.ordreJ.map((id) => [id, sc.posJoueur(id, e.fin)]);
      for (let a = 0; a < pos.length; a++) {
        const p = pos[a][1];
        if (p[0] < v.x0 + 0.4 || p[0] > v.x1 - 0.4 || p[1] < v.y0 + 0.4 || p[1] > v.y1 - 0.4) {
          sc.alertes.push("Étape " + (i + 1) + " : « " + pos[a][0] + " » sort du cadre");
        }
        for (let b = a + 1; b < pos.length; b++) {
          if (dist(p, pos[b][1]) < 0.95) sc.alertes.push("Étape " + (i + 1) + " : « " + pos[a][0] + " » et « " + pos[b][0] + " » se superposent");
        }
      }
    });
    return sc;
  };

  // ---------- Rendu SVG ----------
  function el(nom, attrs, parent) {
    const n = document.createElementNS(NS, nom);
    if (attrs) Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
    if (parent) parent.appendChild(n);
    return n;
  }

  // options : portrait (terrain vertical), surCadre(vb) appelé dès que le cadre change, pour dimensionner le SVG.
  function Rendu(svg, scene, options) {
    options = options || {};
    this.svg = svg;
    this.scene = scene;
    this.portrait = !!options.portrait;
    this.surCadre = options.surCadre || null;
    this.g = 1;
    this.tDernier = 0;
    this.construire();
  }

  Rendu.prototype.map = function (p) {
    return this.portrait ? [p[1] * U, -p[0] * U] : [p[0] * U, p[1] * U];
  };

  // Grossissement des pions et des textes quand le terrain est affiché petit.
  Rendu.prototype.mesurer = function () {
    const r = this.svg.getBoundingClientRect();
    const pxParMetre = r.width && r.height ? Math.min(r.width / this.vb.w, r.height / this.vb.h) * U : 24;
    return borne(21 / pxParMetre, 1, 1.5);
  };

  // À appeler quand la taille ou l'orientation de la zone d'affichage change.
  Rendu.prototype.ajuster = function (portrait) {
    const change = portrait !== this.portrait;
    this.portrait = portrait;
    this.cadrer();
    const g = this.mesurer();
    if (change || Math.abs(g - this.g) > 0.04) {
      this.construire();
      this.dessiner(this.tDernier);
    }
  };

  Rendu.prototype.cadrer = function () {
    const v = this.scene.vue;
    const a = this.map([v.x0, v.y0]);
    const b = this.map([v.x1, v.y1]);
    this.vb = { x: Math.min(a[0], b[0]), y: Math.min(a[1], b[1]), w: Math.abs(a[0] - b[0]), h: Math.abs(a[1] - b[1]) };
    this.svg.setAttribute("viewBox", [this.vb.x, this.vb.y, this.vb.w, this.vb.h].join(" "));
    if (this.surCadre) this.surCadre(this.vb);
  };

  Rendu.prototype.construire = function () {
    const self = this;
    const svg = this.svg;
    const sc = this.scene;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    this.cadrer();
    const g = (this.g = this.mesurer());
    const vb = this.vb;

    const pt = (x, y) => self.map([x, y]);
    const rect = (x0, y0, x1, y1, cls, parent, extra) => {
      const a = pt(x0, y0);
      const b = pt(x1, y1);
      return el("rect", avec({ x: Math.min(a[0], b[0]), y: Math.min(a[1], b[1]), width: Math.abs(a[0] - b[0]), height: Math.abs(a[1] - b[1]), class: cls }, extra), parent);
    };
    const ligne = (x0, y0, x1, y1, cls, parent) => {
      const a = pt(x0, y0);
      const b = pt(x1, y1);
      return el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: cls }, parent);
    };
    const texte = (x, y, str, cls, taille, parent) => {
      const a = pt(x, y);
      const n = el("text", { x: a[0], y: a[1], class: cls, "font-size": taille * U * g, "text-anchor": "middle", dy: "0.35em" }, parent);
      n.textContent = str;
      return n;
    };

    const defs = el("defs", null, svg);
    const fleche = el("marker", { id: "fleche", viewBox: "0 0 10 10", refX: 8.5, refY: 5, markerWidth: 36 * g, markerHeight: 36 * g, markerUnits: "userSpaceOnUse", orient: "auto" }, defs);
    el("path", { d: "M0 1.2 L10 5 L0 8.8 z", class: "fleche" }, fleche);
    const flecheOption = el("marker", { id: "fleche-option", viewBox: "0 0 10 10", refX: 8.5, refY: 5, markerWidth: 30 * g, markerHeight: 30 * g, markerUnits: "userSpaceOnUse", orient: "auto" }, defs);
    el("path", { d: "M0 1.2 L10 5 L0 8.8 z", class: "fleche option" }, flecheOption);

    // Décor : zone libre, terrain, lignes, filet.
    const decor = el("g", { class: "decor" }, svg);
    el("rect", { x: vb.x, y: vb.y, width: vb.w, height: vb.h, class: "sol-libre" }, decor);
    rect(-9, 0, 9, 9, "sol-terrain", decor);
    rect(-3, 0, 3, 9, "sol-avant", decor);
    rect(-9, 0, 9, 9, "ligne contour", decor);
    ligne(-3, 0, -3, 9, "ligne", decor);
    ligne(3, 0, 3, 9, "ligne", decor);
    ligne(0, -0.95, 0, 9.95, "filet", decor);
    [-0.95, 9.95].forEach((y) => {
      const c = pt(0, y);
      el("circle", { cx: c[0], cy: c[1], r: 0.14 * U, class: "poteau" }, decor);
    });
    [0, 9].forEach((y) => {
      const c = pt(0, y);
      el("circle", { cx: c[0], cy: c[1], r: 0.11 * U, class: "antenne" }, decor);
    });
    if (sc.vue.y0 <= -2) texte(0, -1.58, "FILET", "repere", 0.3, decor);

    // Objets fixes.
    const objets = el("g", { class: "objets" }, svg);
    sc.objets.forEach((o) => {
      if (o.k === "banc") {
        const dx = (o.sens === "x" ? o.long : o.large) / 2;
        const dy = (o.sens === "x" ? o.large : o.long) / 2;
        rect(o.x - dx, o.y - dy, o.x + dx, o.y + dy, "banc", objets, { rx: 0.08 * U });
      } else if (o.k === "caddie") {
        rect(o.x - 0.5, o.y - 0.5, o.x + 0.5, o.y + 0.5, "caddie", objets, { rx: 0.14 * U });
        [[-0.2, -0.2], [0.2, -0.16], [0, 0.2]].forEach((d) => {
          const c = pt(o.x + d[0], o.y + d[1]);
          el("circle", { cx: c[0], cy: c[1], r: 0.17 * U, class: "caddie-ballon" }, objets);
        });
      } else if (o.k === "plot") {
        const c = pt(o.x, o.y);
        el("circle", { cx: c[0], cy: c[1], r: 0.16 * U * g, class: "plot" }, objets);
      } else if (o.k === "trait") {
        ligne(o.x0, o.y0, o.x1, o.y1, "trait", objets);
      } else if (o.k === "frite") {
        ligne(-0.34, o.y, 0.34, o.y, "frite", objets);
      } else if (o.k === "note") {
        texte(o.x, o.y, o.texte, "note" + (o.fort ? " fort" : ""), o.taille || 0.42, objets);
      }
    });

    // Zones repères.
    this.nZones = {};
    const zones = el("g", { class: "zones" }, svg);
    Object.keys(sc.zones).forEach((id) => {
      const z = sc.zones[id];
      const grp = el("g", { class: "zone" }, zones);
      const f = z.forme;
      let ancre;
      if (f.r != null) {
        const c = pt(f.x, f.y);
        el("circle", { cx: c[0], cy: c[1], r: f.r * U }, grp);
        ancre = [c[0], c[1] - f.r * U - 0.34 * U * g];
      } else {
        rect(f.x0, f.y0, f.x1, f.y1, "", grp, { rx: 0.12 * U });
        ancre = pt((f.x0 + f.x1) / 2, (f.y0 + f.y1) / 2);
      }
      if (z.label) {
        if (z.ou) ancre = pt(z.ou[0], z.ou[1]);
        const n = el("text", { x: ancre[0], y: ancre[1], class: "zone-label", "font-size": 0.42 * U * g, "text-anchor": "middle", dy: "0.35em" }, grp);
        n.textContent = z.label;
      }
      self.nZones[id] = { n: grp, vu: null };
    });

    // Traces des vols et des déplacements.
    this.traces = [];
    const traces = el("g", { class: "traces" }, svg);
    sc.evts.forEach((e) => {
      if (e.k !== "vol" && e.k !== "mv") return;
      const cls = e.k === "mv" ? "trace t-course" : "trace t-" + VOLS[e.type].trait;
      const n = el("line", { class: cls, "stroke-width": (e.k === "mv" ? 5 : VOLS[e.type].trait === "fort" ? 9 : 6) * g }, traces);
      if (e.k === "vol") n.setAttribute("marker-end", "url(#fleche)");
      n.style.display = "none";
      self.traces.push({ e: e, n: n, vu: false });
    });

    // Flèches d'option (autres trajectoires possibles).
    this.options = [];
    sc.evts.forEach((e) => {
      if (e.k !== "fleche") return;
      const a = self.map(e.p0);
      const b = self.map(e.p1);
      const grp = el("g", { class: "option" }, traces);
      el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: "trace t-option", "stroke-width": 5 * g, "marker-end": "url(#fleche-option)" }, grp);
      if (e.label) {
        const c = self.map(e.pLabel);
        const tx = el("text", { x: c[0], y: c[1], class: "option-label", "font-size": 0.4 * U * g, "text-anchor": "middle", dy: "0.35em" }, grp);
        tx.textContent = e.label;
      }
      grp.style.display = "none";
      self.options.push({ e: e, n: grp, vu: false });
    });

    // Pions.
    this.pions = {};
    const pions = el("g", { class: "pions" }, svg);
    sc.ordreJ.forEach((id) => {
      const j = sc.joueurs[id];
      const grp = el("g", { class: "pion eq-" + j.eq + (j.lib ? " lib" : "") }, pions);
      const R = R_PION * U;
      let nez = null;
      if (j.face != null || sc.evts.some((e) => e.k === "face" && e.id === id)) {
        nez = el("path", { d: "M" + R * 0.72 + " " + -R * 0.5 + " L" + R * 1.42 + " 0 L" + R * 0.72 + " " + R * 0.5 + " z", class: "nez" }, grp);
      }
      if (j.eq === "coach") el("rect", { x: -R, y: -R, width: 2 * R, height: 2 * R, rx: 0.16 * U, class: "corps" }, grp);
      else el("circle", { r: R, class: "corps" }, grp);
      const txt = el("text", { "text-anchor": "middle", dy: "0.35em", "font-size": (j.t.length > 1 ? 0.6 : 0.74) * U }, grp);
      txt.textContent = j.t;
      if (j.nom) {
        const nom = el("text", { class: "nom", "text-anchor": "middle", y: R + 0.44 * U, "font-size": 0.4 * U }, grp);
        nom.textContent = j.nom;
      }
      self.pions[id] = { n: grp, nez: nez };
    });

    // Effets : anneaux de contact, impacts au sol, mains au bloc.
    this.effets = [];
    const effets = el("g", { class: "effets" }, svg);
    const ajouterEffet = (type, e, n) => {
      n.style.display = "none";
      self.effets.push({ type: type, e: e, n: n, vu: false });
    };
    sc.evts.forEach((e) => {
      if (e.k === "vol") {
        if (e.frappeur) ajouterEffet("anneau", { t0: e.t0, d: 0.38, id: e.frappeur }, el("circle", { class: "anneau" }, effets));
        if (e.tenu && e.cible) ajouterEffet("anneau", { t0: e.t1, d: 0.38, id: e.cible }, el("circle", { class: "anneau" }, effets));
        if (e.sol) ajouterEffet("impact", { t0: e.t1, d: 0.6, pt: e.p1 }, el("circle", { class: "impact" }, effets));
      } else if (e.k === "bloc") {
        e.ids.forEach((id) => {
          const grp = el("g", { class: "mains eq-" + sc.joueurs[id].eq }, effets);
          el("line", { class: "mains-bord", "stroke-width": 30 * g }, grp);
          el("line", { class: "mains-trait", "stroke-width": 18 * g }, grp);
          ajouterEffet("bloc", { t0: e.t0, d: e.d, id: id }, grp);
        });
      } else if (e.k === "flash") {
        ajouterEffet("flash", { t0: e.t0, d: e.d, id: e.id }, el("circle", { class: "flash" }, effets));
      }
    });

    // Ballons.
    this.nBallons = {};
    const ballons = el("g", { class: "ballons" }, svg);
    sc.ordreB.forEach((id) => {
      const ombre = el("circle", { r: R_BALLON * U, class: "ombre" }, ballons);
      const grp = el("g", { class: "ballon" }, ballons);
      const r = R_BALLON * U;
      el("circle", { r: r, class: "cuir" }, grp);
      el("path", { d: "M" + -r * 0.92 + " " + -r * 0.2 + " Q0 " + -r * 0.75 + " " + r * 0.92 + " " + -r * 0.2 + " M" + -r * 0.55 + " " + r * 0.78 + " Q" + -r * 0.1 + " 0 " + r * 0.3 + " " + -r * 0.93, class: "couture" }, grp);
      self.nBallons[id] = { n: grp, ombre: ombre, vu: null };
    });

    // Bulles et textes qui s'élèvent.
    this.bulles = [];
    const dessus = el("g", { class: "dessus" }, svg);
    sc.evts.forEach((e) => {
      if (e.k === "dit") {
        const taille = 0.5 * U * g;
        const large = e.texte.length * taille * 0.56 + 0.5 * U * g;
        const haut = taille * 1.7;
        const grp = el("g", { class: "bulle" }, dessus);
        el("rect", { x: -large / 2, y: -haut / 2, width: large, height: haut, rx: haut / 2 }, grp);
        const tx = el("text", { "text-anchor": "middle", dy: "0.35em", "font-size": taille }, grp);
        tx.textContent = e.texte;
        grp.style.display = "none";
        self.bulles.push({ e: e, n: grp, large: large, haut: haut, vu: false });
      } else if (e.k === "pop") {
        const tx = el("text", { class: "pop", "text-anchor": "middle", "font-size": 0.62 * U * g }, dessus);
        tx.textContent = e.texte;
        tx.style.display = "none";
        self.bulles.push({ e: e, n: tx, pop: true, large: e.texte.length * 0.62 * U * g * 0.6, vu: false });
      }
    });
  };

  function montrer(o, oui) {
    if (o.vu !== oui) {
      o.n.style.display = oui ? "" : "none";
      o.vu = oui;
    }
    return oui;
  }

  Rendu.prototype.dessiner = function (t) {
    const self = this;
    const sc = this.scene;
    const g = this.g;
    const vb = this.vb;
    const ie = sc.indexEtape(t);
    this.tDernier = t;

    // Impulsions (saut, bloc, contact) : le pion grossit un instant.
    const impulsion = {};
    const orientation = {};
    sc.evts.forEach((e) => {
      if (e.t0 > t) return;
      if (e.k === "face") orientation[e.id] = e.angle;
      const u = (t - e.t0) / (e.d || 1);
      if (u >= 1) return;
      const s = Math.sin(Math.PI * u);
      if (e.k === "saut") impulsion[e.id] = Math.max(impulsion[e.id] || 0, 0.26 * s);
      else if (e.k === "bloc") e.ids.forEach((id) => { impulsion[id] = Math.max(impulsion[id] || 0, 0.2 * s); });
    });

    sc.ordreJ.forEach((id) => {
      const p = self.map(sc.posJoueur(id, t));
      const pion = self.pions[id];
      pion.n.setAttribute("transform", "translate(" + p[0].toFixed(1) + " " + p[1].toFixed(1) + ") scale(" + (g * (1 + (impulsion[id] || 0))).toFixed(3) + ")");
      if (pion.nez) {
        const j = sc.joueurs[id];
        const angle = orientation[id] != null ? orientation[id] : j.face != null ? j.face : 0;
        pion.nez.setAttribute("transform", "rotate(" + (self.portrait ? angle - 90 : angle) + ")");
      }
    });

    sc.ordreB.forEach((id) => {
      const nb = self.nBallons[id];
      const etat = sc.posBallon(id, t);
      if (!montrer(nb, !!etat)) {
        nb.ombre.style.display = "none";
        return;
      }
      const p = self.map(etat.p);
      const k = g * (1 + 0.85 * etat.h);
      nb.n.setAttribute("transform", "translate(" + p[0].toFixed(1) + " " + p[1].toFixed(1) + ") scale(" + k.toFixed(3) + ")");
      const dec = 0.36 * U * etat.h * g;
      nb.ombre.style.display = "";
      nb.ombre.setAttribute("cx", (p[0] + dec).toFixed(1));
      nb.ombre.setAttribute("cy", (p[1] + dec).toFixed(1));
      nb.ombre.setAttribute("r", (R_BALLON * U * g * (1 + 0.2 * etat.h)).toFixed(1));
      nb.ombre.setAttribute("opacity", (0.42 - 0.2 * Math.min(1, etat.h)).toFixed(2));
    });

    // Traces : visibles pendant l'étape en cours, une fois l'action commencée.
    this.traces.forEach((tr) => {
      const e = tr.e;
      if (!montrer(tr, e.ie === ie && t >= e.t0)) return;
      let u = borne((t - e.t0) / (e.t1 - e.t0 || 1), 0, 1);
      if (e.k === "mv") u = doux(u);
      const a = self.map(e.p0);
      const b = self.map(lerp(e.p0, e.p1, u));
      tr.n.setAttribute("x1", a[0].toFixed(1));
      tr.n.setAttribute("y1", a[1].toFixed(1));
      tr.n.setAttribute("x2", b[0].toFixed(1));
      tr.n.setAttribute("y2", b[1].toFixed(1));
      tr.n.setAttribute("opacity", t < e.t1 ? 1 : e.k === "mv" ? 0.5 : 0.62);
    });

    this.options.forEach((o) => { montrer(o, o.e.ie === ie && t >= o.e.t0); });

    this.effets.forEach((f) => {
      const e = f.e;
      const u = (t - e.t0) / e.d;
      if (!montrer(f, u >= 0 && u < 1)) return;
      if (f.type === "impact") {
        const c = self.map(e.pt);
        f.n.setAttribute("cx", c[0]);
        f.n.setAttribute("cy", c[1]);
        f.n.setAttribute("r", (0.2 + 0.85 * u) * U * g);
        f.n.setAttribute("opacity", (1 - u).toFixed(2));
        return;
      }
      const pj = sc.posJoueur(e.id, t);
      const c = self.map(pj);
      if (f.type === "bloc") {
        // Les mains franchissent le filet : une barre parallèle au filet, juste de l'autre côté.
        const cote = pj[0] <= 0 ? 1 : -1;
        const a = self.map([cote * 0.3, pj[1] - 0.46 * g]);
        const b = self.map([cote * 0.3, pj[1] + 0.46 * g]);
        Array.prototype.forEach.call(f.n.childNodes, (n) => {
          n.setAttribute("x1", a[0]);
          n.setAttribute("y1", a[1]);
          n.setAttribute("x2", b[0]);
          n.setAttribute("y2", b[1]);
        });
        f.n.setAttribute("opacity", Math.min(1, 4 * Math.sin(Math.PI * u)).toFixed(2));
        return;
      }
      f.n.setAttribute("cx", c[0]);
      f.n.setAttribute("cy", c[1]);
      if (f.type === "flash") {
        f.n.setAttribute("r", (R_PION + 0.22 + 0.12 * Math.sin(u * Math.PI * 4)) * U * g);
        f.n.setAttribute("opacity", Math.min(1, 3 * Math.sin(Math.PI * u)).toFixed(2));
      } else {
        f.n.setAttribute("r", (R_PION + 0.08 + 0.5 * u) * U * g);
        f.n.setAttribute("opacity", (0.95 * (1 - u)).toFixed(2));
      }
    });

    Object.keys(this.nZones).forEach((id) => {
      let on = sc.zones[id].on;
      sc.evts.forEach((e) => { if (e.k === "zone" && e.id === id && e.t0 <= t) on = e.on; });
      montrer(self.nZones[id], on);
    });

    this.bulles.forEach((b) => {
      const e = b.e;
      const u = (t - e.t0) / e.d;
      if (!montrer(b, u >= 0 && u < 1)) return;
      const base = Array.isArray(e.ou) ? e.ou : sc.posJoueur(e.id || e.ou, t);
      const c = self.map(base);
      const marge = b.large / 2 + 0.12 * U;
      const x = borne(c[0], vb.x + marge, vb.x + vb.w - marge);
      if (b.pop) {
        b.n.setAttribute("x", x.toFixed(1));
        b.n.setAttribute("y", (c[1] - (0.75 + 0.9 * u) * U * g).toFixed(1));
        b.n.setAttribute("opacity", Math.min(1, 3.2 * (1 - u)).toFixed(2));
      } else {
        let y = c[1] - (R_PION + 0.62) * U * g;
        if (y - b.haut / 2 < vb.y + 0.1 * U) y = c[1] + (R_PION + 0.62) * U * g;
        b.n.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")");
        b.n.setAttribute("opacity", Math.min(1, 6 * u, 5 * (1 - u)).toFixed(2));
      }
    });
  };

  // ---------- Lecteur ----------
  // rappels : { surEtape(i), surTemps(t), surEtat(enLecture) }
  function Lecteur(rendu, scene, rappels) {
    this.rendu = rendu;
    this.scene = scene;
    this.rappels = rappels || {};
    this.t = 0;
    this.enLecture = false;
    this.vitesse = 1;
    this.boucle = true;
    this.pasAPas = false;
    this.etapeVue = -1;
    this.repos = 0;
    this._raf = null;
    this._avant = 0;
    this._boucle = this._boucle.bind(this);
    this.afficher();
  }

  Lecteur.prototype.afficher = function () {
    this.rendu.dessiner(this.t);
    const i = this.scene.indexEtape(this.t);
    if (i !== this.etapeVue) {
      this.etapeVue = i;
      if (this.rappels.surEtape) this.rappels.surEtape(i);
    }
    if (this.rappels.surTemps) this.rappels.surTemps(this.t);
  };

  Lecteur.prototype._boucle = function (maintenant) {
    if (!this.enLecture) return;
    const dt = Math.min(0.1, (maintenant - this._avant) / 1000) * this.vitesse * CADENCE;
    this._avant = maintenant;
    const sc = this.scene;
    if (this.repos > 0) {
      // Arrêt sur la dernière image avant de reprendre au début.
      this.repos -= dt / (this.vitesse * CADENCE);
      if (this.repos <= 0) {
        this.t = 0;
        this.afficher();
      }
    } else {
      const etape = sc.etapes[sc.indexEtape(this.t)];
      let t = this.t + dt;
      if (this.pasAPas && this.t < etape.t1 && t >= etape.t1 && etape.t1 < sc.duree) {
        this.t = etape.t1 - 0.001;
        this.afficher();
        this.t = etape.t1;
        this.pause();
        return;
      }
      if (t >= sc.duree) {
        this.t = sc.duree - 0.001;
        this.afficher();
        if (this.boucle && !this.pasAPas) this.repos = 1.4;
        else {
          this.fini = true;
          this.pause();
          return;
        }
      } else {
        this.t = t;
        this.afficher();
      }
    }
    this._raf = requestAnimationFrame(this._boucle);
  };

  Lecteur.prototype.lire = function () {
    if (this.enLecture) return;
    if (this.fini || this.t >= this.scene.duree - 0.002) this.t = 0;
    this.fini = false;
    this.repos = 0;
    this.enLecture = true;
    this._avant = performance.now();
    this._raf = requestAnimationFrame(this._boucle);
    if (this.rappels.surEtat) this.rappels.surEtat(true);
  };

  Lecteur.prototype.pause = function () {
    if (!this.enLecture) return;
    this.enLecture = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
    if (this.rappels.surEtat) this.rappels.surEtat(false);
  };

  Lecteur.prototype.basculer = function () {
    if (this.enLecture) this.pause();
    else this.lire();
  };

  // Va à une étape : à son début si l'animation tourne, sinon à la fin de ses actions (image complète).
  Lecteur.prototype.allerEtape = function (i) {
    const et = this.scene.etapes;
    i = borne(i, 0, et.length - 1);
    this.fini = false;
    this.repos = 0;
    this.t = this.enLecture ? et[i].t0 : Math.min(et[i].fin + 0.01, et[i].t1 - 0.01);
    this.afficher();
  };

  Lecteur.prototype.etapeSuivante = function () {
    const i = this.scene.indexEtape(this.t);
    if (i < this.scene.etapes.length - 1) this.allerEtape(i + 1);
    else if (!this.enLecture) this.allerEtape(i);
  };

  Lecteur.prototype.etapePrecedente = function () {
    const i = this.scene.indexEtape(this.t);
    const debut = this.scene.etapes[i].t0;
    this.allerEtape(this.enLecture && this.t - debut > 1.2 ? i : i - 1);
  };

  Lecteur.prototype.revenirAuDebut = function () {
    this.fini = false;
    this.repos = 0;
    this.t = 0;
    this.afficher();
  };

  Lecteur.prototype.detruire = function () {
    this.pause();
    this.rappels = {};
  };

  // ---------- Registre des séances ----------
  const seances = [];

  function creerScene(bloc) {
    const s = new Scene();
    bloc.scene(s);
    if (!s.etapes.length) throw new Error("Scène sans étape : " + bloc.titre);
    return s.compiler();
  }

  global.N3M = {
    seances: seances,
    seance: (def) => { seances.push(def); },
    creerScene: creerScene,
    Scene: Scene,
    Rendu: Rendu,
    Lecteur: Lecteur,
    a: actions,
    geo: { poste: poste, camp: camp, miroir: miroir, dist: dist, VUES: VUES, POSTES: POSTES }
  };
})(window);

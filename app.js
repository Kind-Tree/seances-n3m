/* Interface : choix de la séance et de l'exercice, lecteur, fiche et programme. */
(function () {
  "use strict";

  const seances = N3M.seances.slice().sort((a, b) => (a.id < b.id ? 1 : -1)); // la plus récente d'abord
  const $ = (id) => document.getElementById(id);
  const svg = $("terrain");
  const ICONE_LIRE = "M7 4.5v15l12.5-7.5z";
  const ICONE_PAUSE = "M6.5 5h4v14h-4zM13.5 5h4v14h-4z";
  const mouvementReduit = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  let seance = null;
  let bloc = null;
  let scene = null;
  let rendu = null;
  let lecteur = null;
  let segments = [];
  let boutonsEtapes = [];

  function creer(tag, attrs, enfants) {
    const n = document.createElement(tag);
    Object.keys(attrs || {}).forEach((k) => {
      if (k === "texte") n.textContent = attrs[k];
      else if (k === "classe") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (enfants || []).forEach((e) => n.appendChild(typeof e === "string" ? document.createTextNode(e) : e));
    return n;
  }
  const vider = (n) => { while (n.firstChild) n.removeChild(n.firstChild); };
  // Un demi-terrain se regarde toujours filet en haut ; un terrain entier se couche quand la place le permet.
  const estDemi = () => !!scene && scene.vue.x1 - scene.vue.x0 < 1.3 * (scene.vue.y1 - scene.vue.y0);
  const estPortrait = () => estDemi() || $("scene").clientWidth < 520;
  // Donne au SVG exactement les proportions de son cadre, dans la place disponible.
  function dimensionner(vb) {
    const large = !!(window.matchMedia && window.matchMedia("(min-width: 960px)").matches);
    const hMax = Math.max(300, Math.min(window.innerHeight * 0.78, window.innerHeight - (large ? 250 : 236)));
    const k = Math.min($("scene").clientWidth / vb.w, hMax / vb.h);
    svg.style.width = Math.floor(vb.w * k) + "px";
    svg.style.height = Math.floor(vb.h * k) + "px";
  }
  const estAnime = (b) => typeof b.scene === "function";

  // ----- Adresse de la page : #<séance>-<bloc> -----
  const ancre = () => "#" + seance.id + "-" + bloc.id;
  function lireAncre() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ""));
    for (const s of seances) {
      if (h.indexOf(s.id + "-") !== 0) continue;
      const b = s.blocs.find((x) => x.id === h.slice(s.id.length + 1));
      if (b) return { seance: s, bloc: b };
    }
    return null;
  }

  // ----- Séance -----
  function remplirSeances() {
    const sel = $("choixSeance");
    seances.forEach((s) => {
      sel.appendChild(creer("option", { value: s.id, texte: s.jour + " " + s.date + " · " + s.joueurs + " joueurs" }));
    });
  }

  function choisirSeance(s, b, lire) {
    seance = s;
    $("choixSeance").value = s.id;
    const axes = $("axes");
    vider(axes);
    if (s.axes && s.axes.length) {
      axes.appendChild(creer("b", { texte: "Axes à viser : " }));
      axes.appendChild(document.createTextNode(s.axes.join(" · ")));
    }
    if (s.note) axes.appendChild(creer("span", { texte: (s.axes && s.axes.length ? " — " : "") + s.note }));
    const prog = $("programme");
    vider(prog);
    s.blocs.forEach((x, i) => {
      const bouton = creer("button", { type: "button" }, [
        creer("span", { classe: "n", texte: String(i + 1) }),
        creer("span", { classe: "t", texte: (x.n ? x.n + " — " : "") + x.titre }),
        creer("span", { classe: "genre", texte: estAnime(x) ? "animation" : "fiche" })
      ]);
      bouton.addEventListener("click", () => {
        choisirBloc(x, true);
        $("exoNum").scrollIntoView({ block: "start", behavior: mouvementReduit ? "auto" : "smooth" });
      });
      prog.appendChild(creer("li", null, [bouton]));
    });
    choisirBloc(b || s.blocs.find(estAnime) || s.blocs[0], lire);
  }

  // ----- Exercice -----
  function choisirBloc(b, lire) {
    if (lecteur) lecteur.detruire();
    lecteur = null;
    scene = null;
    rendu = null;
    bloc = b;
    const i = seance.blocs.indexOf(b);
    $("exoNum").textContent = (b.n ? b.n + " · " : "") + (i + 1) + "/" + seance.blocs.length;
    $("exoTitre").textContent = b.titre;
    $("exoPrec").disabled = i === 0;
    $("exoSuiv").disabled = i === seance.blocs.length - 1;
    Array.prototype.forEach.call($("programme").querySelectorAll("button"), (n, k) => {
      if (k === i) n.setAttribute("aria-current", "true");
      else n.removeAttribute("aria-current");
    });

    let anime = estAnime(b);
    if (anime) {
      try {
        scene = N3M.creerScene(b);
      } catch (erreur) {
        console.error(erreur);
        anime = false;
      }
    }
    ["scene", "progression", "legende", "commandes"].forEach((id) => { $(id).hidden = !anime; });
    $("sansAnim").hidden = anime;
    construireFiche(b);
    if (anime) {
      rendu = new N3M.Rendu(svg, scene, { portrait: estPortrait(), surCadre: dimensionner });
      construireProgression();
      lecteur = new N3M.Lecteur(rendu, scene, { surEtape: majEtape, surTemps: majTemps, surEtat: majBouton });
      lecteur.vitesse = Number($("vitesse").value);
      lecteur.pasAPas = $("pasAPas").checked;
      largeurVue = $("scene").clientWidth;
      majBouton(false);
      if (lire && !mouvementReduit) lecteur.lire();
    }
    if (location.hash !== ancre()) location.hash = ancre();
  }

  function construireProgression() {
    const zone = $("progression");
    vider(zone);
    segments = scene.etapes.map((e, i) => {
      const barre = creer("i");
      const bouton = creer("button", { type: "button", "aria-label": "Aller à l'étape " + (i + 1) + " : " + e.titre }, [barre]);
      bouton.style.flex = (e.t1 - e.t0).toFixed(2) + " 1 0";
      bouton.addEventListener("click", () => lecteur.allerEtape(i));
      zone.appendChild(bouton);
      return barre;
    });
  }

  function construireFiche(b) {
    const fiche = $("fiche");
    vider(fiche);
    boutonsEtapes = [];
    const ligne = (classe, gras, texte, sep) => {
      const p = creer("p", { classe: classe });
      if (gras) {
        p.appendChild(creer("b", { texte: gras }));
        p.appendChild(document.createTextNode((sep || " · ") + texte));
      } else p.textContent = texte;
      return p;
    };
    if (b.effectif) fiche.appendChild(ligne("effectif", null, b.effectif));
    if (b.dispositif) fiche.appendChild(ligne("dispositif", "Dispositif", b.dispositif, " : "));
    (b.texte || []).forEach((t) => fiche.appendChild(ligne("", null, t)));
    if (scene) {
      const liste = creer("ol", { classe: "etapes" });
      let chapitre = "";
      scene.etapes.forEach((e, i) => {
        if (e.chapitre && e.chapitre !== chapitre) {
          chapitre = e.chapitre;
          liste.appendChild(creer("li", { classe: "chapitre", texte: chapitre }));
        }
        const corps = creer("span", null, [creer("b", { texte: e.titre })]);
        if (e.texte) corps.appendChild(document.createTextNode(" — " + e.texte));
        const bouton = creer("button", { type: "button" }, [creer("span", { classe: "n", texte: String(i + 1) }), corps]);
        bouton.addEventListener("click", () => lecteur.allerEtape(i));
        boutonsEtapes.push(bouton);
        liste.appendChild(creer("li", null, [bouton]));
      });
      fiche.appendChild(liste);
    }
    if (b.tableau) {
      const tete = creer("tr", null, b.tableau.tetes.map((t) => creer("th", { scope: "col", texte: t })));
      const corps = b.tableau.lignes.map((l) => creer("tr", null, l.map((c) => creer("td", { texte: c }))));
      fiche.appendChild(creer("div", { classe: "tableau" }, [creer("table", null, [creer("thead", null, [tete]), creer("tbody", null, corps)])]));
    }
    if (b.cle) fiche.appendChild(ligne("cle", null, "CONSIGNE CLÉ — " + b.cle));
    [].concat(b.enjeu || []).forEach((e) => {
      const o = typeof e === "string" ? { label: "Enjeu", texte: e } : e;
      fiche.appendChild(ligne("enjeu", o.label.toUpperCase(), o.texte));
    });
    (b.plus || []).forEach((l) => fiche.appendChild(ligne("plus", l[0], l[1])));
    if (b.compo) fiche.appendChild(ligne("compo", "Composition", b.compo, " : "));
    if (b.valider) {
      const p = ligne("valider", "À valider par le coach", b.valider, " : ");
      p.hidden = !$("modeCoach").checked;
      fiche.appendChild(p);
    }
  }

  // ----- Rappels du lecteur -----
  function majEtape(i) {
    const e = scene.etapes[i];
    const legende = $("legende");
    vider(legende);
    if (e.chapitre) legende.appendChild(creer("span", { classe: "chap", texte: e.chapitre }));
    legende.appendChild(creer("span", { classe: "num", texte: i + 1 + "/" + scene.etapes.length }));
    legende.appendChild(creer("b", { texte: e.titre }));
    if (e.texte) legende.appendChild(document.createTextNode(" — " + e.texte));
    boutonsEtapes.forEach((n, k) => {
      if (k === i) n.setAttribute("aria-current", "step");
      else n.removeAttribute("aria-current");
    });
  }

  function majTemps(t) {
    scene.etapes.forEach((e, i) => {
      const u = Math.max(0, Math.min(1, (t - e.t0) / (e.t1 - e.t0)));
      segments[i].style.width = (u * 100).toFixed(1) + "%";
    });
  }

  function majBouton(enLecture) {
    $("iconeLecture").setAttribute("d", enLecture ? ICONE_PAUSE : ICONE_LIRE);
    $("lecture").setAttribute("aria-label", enLecture ? "Mettre en pause" : "Lire l'animation");
  }

  // ----- Commandes -----
  const voisin = (pas) => {
    const cible = seance.blocs[seance.blocs.indexOf(bloc) + pas];
    if (cible) choisirBloc(cible, true);
  };
  $("exoPrec").addEventListener("click", () => voisin(-1));
  $("exoSuiv").addEventListener("click", () => voisin(1));
  $("lecture").addEventListener("click", () => lecteur && lecteur.basculer());
  $("etapePrec").addEventListener("click", () => lecteur && lecteur.etapePrecedente());
  $("etapeSuiv").addEventListener("click", () => lecteur && lecteur.etapeSuivante());
  $("vitesse").addEventListener("change", (ev) => { if (lecteur) lecteur.vitesse = Number(ev.target.value); });
  $("pasAPas").addEventListener("change", (ev) => { if (lecteur) lecteur.pasAPas = ev.target.checked; });
  $("choixSeance").addEventListener("change", (ev) => {
    choisirSeance(seances.find((s) => s.id === ev.target.value), null, true);
  });
  $("modeCoach").addEventListener("change", (ev) => {
    try { localStorage.setItem("n3m-coach", ev.target.checked ? "1" : "0"); } catch (erreur) { /* stockage indisponible */ }
    Array.prototype.forEach.call(document.querySelectorAll(".valider"), (n) => { n.hidden = !ev.target.checked; });
  });
  try { $("modeCoach").checked = localStorage.getItem("n3m-coach") === "1"; } catch (erreur) { /* stockage indisponible */ }

  document.addEventListener("keydown", (ev) => {
    if (!lecteur || /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(ev.target.tagName)) return;
    if (ev.key === " ") {
      ev.preventDefault();
      lecteur.basculer();
    } else if (ev.key === "ArrowRight") lecteur.etapeSuivante();
    else if (ev.key === "ArrowLeft") lecteur.etapePrecedente();
  });

  window.addEventListener("hashchange", () => {
    const cible = lireAncre();
    if (!cible || (cible.seance === seance && cible.bloc === bloc)) return;
    if (cible.seance === seance) choisirBloc(cible.bloc, true);
    else choisirSeance(cible.seance, cible.bloc, true);
  });

  // On ne réagit qu'aux changements de largeur : sur téléphone, la hauteur bouge sans cesse avec la barre d'adresse.
  let largeurVue = 0;
  const surLargeur = () => {
    const l = $("scene").clientWidth;
    if (!rendu || !l || l === largeurVue) return;
    largeurVue = l;
    rendu.ajuster(estPortrait());
  };
  if (window.ResizeObserver) new ResizeObserver(surLargeur).observe($("scene"));
  window.addEventListener("resize", surLargeur);

  // ----- Démarrage -----
  document.documentElement.lang = "fr";
  if (!seances.length) {
    $("exoTitre").textContent = "Aucune séance chargée";
    return;
  }
  remplirSeances();
  const depart = lireAncre();
  if (depart) choisirSeance(depart.seance, depart.bloc, false);
  else choisirSeance(seances[0], null, false);

  // Accès pour les tests automatiques.
  window.N3M_APP = {
    choisir: (idSeance, idBloc) => {
      const s = seances.find((x) => x.id === idSeance);
      choisirSeance(s, s.blocs.find((x) => x.id === idBloc), false);
    },
    lecteur: () => lecteur,
    scene: () => scene
  };
})();

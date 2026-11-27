/* ==========================================================================
   Bibliothèque : repères du terrain, placements d'une équipe et exercices
   repris d'une séance à l'autre (passe et suit, jeu de la manchette…).
   Les coordonnées sont écrites pour le camp A ; camp("B") les retourne.
   ========================================================================== */
(function () {
  "use strict";

  const { B, M, P, W, S, BL, D, PT, A, X, Z, FL } = N3M.a;
  const { camp } = N3M.geo;

  // Repères écrits pour le camp A.
  const REP = {
    passeur: [-0.9, 6.0],   // place du passeur au filet
    coeur: [-4.3, 4.5],     // cœur de terrain
    att4: [-0.9, 1.35],     // point de frappe en 4
    att2: [-0.9, 7.65],     // point de frappe en 2
    fixe: [-0.85, 4.95],    // point de frappe sur la fixe
    pipe: [-3.4, 4.6],      // point de frappe en pipe
    arr1: [-3.4, 7.3]       // point de frappe arrière en 1
  };

  // Placements d'un six, par rôle : r1 = R4 avant, r2 = R4 arrière, c = central, po = pointu, p = passeur, l = libéro.
  const PLACES = {
    base: { r1: [-1.1, 1.7], c: [-1.1, 4.5], po: [-1.1, 7.3], p: [-5.6, 7.4], r2: [-7.6, 4.5], l: [-5.6, 1.6] },
    recep: { r1: [-5.4, 1.9], l: [-6.4, 4.5], r2: [-5.4, 7.1], c: [-1.3, 3.6], po: [-1.7, 8.25], p: [-4.3, 8.4] },
    // prêts à attaquer : passeur au filet, attaquants à leur départ d'élan
    elan: { p: [-0.9, 6.0], r1: [-3.6, 1.0], c: [-2.6, 4.3], po: [-3.4, 8.2], r2: [-5.8, 4.6], l: [-6.0, 2.2] },
    // l'adversaire attaque de son poste 4 (sur notre droite) : bloc à 2, 3e joueur du filet sur la petite diagonale, un défenseur sur la ligne
    def4: { po: [-0.75, 7.85], c: [-0.75, 6.6], r1: [-3.2, 3.0], p: [-5.8, 8.2], r2: [-7.6, 5.4], l: [-5.6, 2.2] },
    // l'adversaire attaque de son poste 2 (sur notre gauche)
    def2: { r1: [-0.75, 1.15], c: [-0.75, 2.4], po: [-3.2, 6.0], l: [-5.8, 0.8], r2: [-7.6, 3.6], p: [-5.6, 6.8] },
    // l'adversaire attaque au centre
    defC: { c: [-0.75, 4.6], r1: [-0.9, 2.6], po: [-0.9, 6.6], p: [-5.6, 7.2], r2: [-7.4, 4.5], l: [-5.6, 1.8] },
    // soutien en arc de cercle sous notre attaquant en 4
    soutien4: { c: [-1.9, 2.9], p: [-1.1, 5.2], l: [-3.4, 1.9], r2: [-4.3, 4.3], po: [-3.2, 6.9] }
  };
  const ETIQUETTES = { r1: "R4", r2: "R4", c: "C", po: "Po", p: "P", l: "L" };
  const ATTAQUES = {
    "4": { qui: "r1", pt: REP.att4 },
    "2": { qui: "po", pt: REP.att2 },
    fixe: { qui: "c", pt: REP.fixe },
    pipe: { qui: "r2", pt: REP.pipe }
  };
  const BLOQUEURS = { "4": ["po", "c"], "2": ["r1", "c"], fixe: ["c"], pipe: ["c"] };

  /* Crée une équipe sur un camp.
     o.pre : préfixe des identifiants ; o.roles : rôles présents ; o.depart : nom d'un placement ou placements par rôle. */
  function equipe(s, c, eq, o) {
    o = o || {};
    const q = camp(c);
    const pre = o.pre || (c === "A" ? "a" : "b");
    const roles = o.roles || ["r1", "c", "po", "p", "r2", "l"];
    const depart = typeof o.depart === "string" ? PLACES[o.depart] : Object.assign({}, PLACES.base, o.depart);
    const T = { camp: c, eq: eq, roles: roles };
    T.id = (r) => pre + r;
    T.a = (r) => roles.indexOf(r) >= 0;
    T.pt = (x, y) => (Array.isArray(x) ? q(x[0], x[1]) : q(x, y));
    roles.forEach((r) => {
      const d = depart[r] || PLACES.base[r];
      s.j(pre + r, q(d[0], d[1]), (o.etiquettes && o.etiquettes[r]) || ETIQUETTES[r], eq, r === "l" ? { lib: true } : null);
    });
    // Déplacement de toute l'équipe vers un placement nommé (ou donné par rôle).
    T.vers = (nom, opts) => {
      const cible = typeof nom === "string" ? PLACES[nom] : nom;
      return P.apply(null, roles.filter((r) => cible[r]).map((r) => M(pre + r, q(cible[r][0], cible[r][1]), opts)));
    };
    // Passe du passeur vers un attaquant qui prend son élan, puis saut. en : "4", "2", "fixe", "pipe".
    T.passe = (b, en, opts) => {
      const att = ATTAQUES[en];
      const id = pre + att.qui;
      return [P(M(id, q(att.pt[0], att.pt[1]), { d: (opts && opts.elan) || 0.95 }), B(b, id, "passe", opts)), S(id)];
    };
    T.attaquant = (en) => pre + ATTAQUES[en].qui;
    // Bloc face à une attaque adverse partie du poste « en » d'en face.
    T.bloc = (en) => BL(BLOQUEURS[en].filter(T.a).map(T.id));
    return T;
  }

  /* ---------- Passe et suit par 3 ---------- */
  function passeEtSuit(o) {
    o = o || {};
    const voies = o.groupes === 4 ? [1.2, 3.4, 5.6, 7.8] : [1.6, 4.5, 7.4];
    const couleurs = ["a", "b", "c", "a"];
    return Object.assign({
      id: "passe-et-suit",
      n: "Échauffement",
      titre: "Passe et suit par 3",
      dispositif: "par groupes de 3 : deux joueurs d'un côté, un en face.",
      valider: "Animé de part et d'autre du filet (version la plus courante). À corriger si tu le fais sans filet, sur la largeur.",
      scene: function (s) {
        voies.forEach((y, i) => {
          s.j("a" + i, [-3.0, y], 1, couleurs[i]);
          s.j("c" + i, [-5.0, y], 3, couleurs[i]);
          s.j("b" + i, [3.0, y], 2, couleurs[i]);
          s.ballon("x" + i, "a" + i);
        });
        const tous = (f) => P.apply(null, voies.map((y, i) => f(y, i)));
        s.etape("Mise en place", "Par 3 : deux joueurs d'un côté du filet, un en face. Un ballon par groupe.", [W(0.6)]);
        s.etape("Je passe, je suis", "1 passe à 2, puis suit son ballon : il passe sous le filet et se place derrière 2.", [
          tous((y, i) => P(B("x" + i, "b" + i, "passe"), [M("a" + i, [2.2, y + 0.85], { d: 0.85 }), M("a" + i, [5.0, y], { d: 0.6 })], M("c" + i, [-3.0, y], { delai: 0.3 })))
        ]);
        s.etape("À son tour", "2 renvoie sur 3 et suit son ballon de l'autre côté.", [
          tous((y, i) => P(B("x" + i, "c" + i, "passe"), [M("b" + i, [-2.2, y - 0.85], { d: 0.85 }), M("b" + i, [-5.0, y], { d: 0.6 })], M("a" + i, [3.0, y], { delai: 0.3 })))
        ]);
        s.etape("Et ça tourne", "3 passe à 1 et suit. Personne ne reste sur place après sa passe : c'est ce qui active le cardio.", [
          tous((y, i) => P(B("x" + i, "a" + i, "passe"), [M("c" + i, [2.2, y + 0.85], { d: 0.85 }), M("c" + i, [5.0, y], { d: 0.6 })], M("b" + i, [-3.0, y], { delai: 0.3 })))
        ]);
      }
    }, o.bloc);
  }

  /* ---------- Passe et suit en carré : 6 par demi-terrain, 2 dans chaque coin au filet, 1 dans chaque coin du fond ---------- */
  function passeEtSuitCarre(o) {
    o = o || {};
    return Object.assign({
      id: "passe-et-suit-carre",
      n: "Échauffement",
      titre: "Passe et suit en carré",
      dispositif: "6 par terrain : 2 au filet dans chaque coin et 1 dans chaque coin du fond de terrain.",
      valider: "Sens retenu : le ballon longe le filet, descend au fond, longe la ligne de fond et remonte au filet ; chacun suit son ballon. Pour la diagonale, j'ai animé une passe qui traverse le carré, toujours suivie par son passeur. À corriger si le sens ou la diagonale se jouent autrement.",
      scene: function (s) {
        // Coins écrits pour le camp A, dans le sens du ballon ; la file de chaque coin s'éloigne du carré.
        const COINS = [
          { p: [-1.4, 1.4], dx: 0, dy: -1.2 },
          { p: [-1.4, 7.6], dx: 0, dy: 1.2 },
          { p: [-7.6, 7.6], dx: -1.2, dy: 0 },
          { p: [-7.6, 1.4], dx: -1.2, dy: 0 }
        ];
        const carres = ["A", "B"].map((c, k) => {
          const q = camp(c);
          const pre = c.toLowerCase();
          const place = (i, rang) => q(COINS[i].p[0] + COINS[i].dx * rang, COINS[i].p[1] + COINS[i].dy * rang);
          const files = [[1, 2], [3, 4], [5], [6]];
          files.forEach((f, i) => f.forEach((n, rang) => {
            f[rang] = pre + n;
            s.j(pre + n, place(i, rang), k * 6 + n, k ? "b" : "a");
          }));
          s.ballon("x" + pre, files[0][0]);
          return { pre: pre, place: place, files: files, coin: 0 };
        });
        // Une passe : le premier de la file joue vers le coin « vers », suit son ballon et se range au bout de la file d'arrivée.
        const passe = (T, vers, type) => {
          const de = T.coin;
          const passeur = T.files[de].shift();
          const mvs = [M(passeur, T.place(vers, T.files[vers].length))];
          T.files[de].forEach((id, rang) => mvs.push(M(id, T.place(de, rang), { d: 0.5, delai: 0.3 })));
          const vol = B("x" + T.pre, T.files[vers][0], type);
          T.files[vers].push(passeur);
          T.coin = vers;
          return P.apply(null, [vol].concat(mvs));
        };
        const tous = (vers, type) => P.apply(null, carres.map((T) => passe(T, vers, type)));

        s.etape("Mise en place", "6 par demi-terrain : 2 joueurs dans chaque coin au filet, 1 dans chaque coin du fond. Un ballon par carré.", [W(0.6)]);
        s.chapitre("Que manchette");
        s.etape("Je passe, je suis", "D'abord que manchette. Le ballon longe le filet ; je suis mon ballon et je me range dans le coin où je l'ai envoyé.", [tous(1, "manchette")]);
        s.etape("Vers le fond", "Le ballon descend vers le coin du fond. Personne ne reste sur place après sa passe.", [tous(2, "manchette")]);
        s.etape("Ligne de fond", "Passe le long de la ligne de fond, toujours en suivant son ballon.", [tous(3, "manchette")]);
        s.etape("Retour au filet", "Le ballon remonte au filet : le carré est bouclé, et ça repart.", [tous(0, "manchette")]);
        s.chapitre("Que dix doigts");
        s.etape("Palier : dix doigts", "Même carré, mais que dix doigts.", [tous(1, "passe"), tous(2, "passe")]);
        s.chapitre("En diagonale");
        s.etape("Palier : essai en diagonale", "Essai avec le ballon en diagonale : la passe traverse le carré, et on suit toujours son ballon.", [tous(0, "passe")]);
      }
    }, o.bloc);
  }

  /* ---------- Jeu de la manchette (2 contre 2 sur un demi-terrain en longueur) ----------
     variante : "simple", "hors3m", "ballonMain" (un ballon dans les mains), "deuxTouches", "tapeMain",
     "deuxTouchesTape" (deux touches, tape dans la main avant le second contact). */
  function jeuManchette(o) {
    o = o || {};
    const variante = o.variante || "simple";
    const textes = {
      simple: ["Une seule touche", "Chaque ballon repart directement en manchette de l'autre côté du filet."],
      hors3m: ["Hors 3 m", "Une seule touche en manchette, et le ballon doit tomber derrière la ligne des 3 m : la zone avant est interdite."],
      ballonMain: ["Un ballon dans les mains", "Chacun tient un ballon. Pour jouer : je lâche mon ballon, je joue ma manchette, puis je reprends mon ballon."],
      deuxTouches: ["Deux touches", "Deux touches par équipe : la première pour le partenaire, la deuxième de l'autre côté."],
      tapeMain: ["Travail d'équipe", "Une seule touche, mais celui qui va jouer doit taper la main de son partenaire avant le contact."],
      deuxTouchesTape: ["Deux touches, tape dans la main", "Deux touches par équipe. Après la première touche, celui qui va jouer la deuxième tape la main de son partenaire avant son contact."]
    };
    return Object.assign({
      id: "manchette",
      n: "Échauffement",
      titre: "Jeu de la manchette",
      dispositif: "2 contre 2, chaque binôme sur un demi-terrain en longueur.",
      scene: function (s) {
        s.trait(-9, 4.5, 9, 4.5);
        if (variante === "hors3m") {
          s.zone("avantA", { x0: -3, y0: 0, x1: 0, y1: 9 }, { label: "zone interdite" });
          s.zone("avantB", { x0: 0, y0: 0, x1: 3, y1: 9 }, { label: "zone interdite" });
        }
        // Deux petits terrains : dy = 0 (bas de l'écran en paysage) et dy = 4.5.
        const terrains = [0, 4.5];
        terrains.forEach((dy, k) => {
          const n = k * 4;
          s.j("a" + k, [-5.2, dy + 1.35], n + 1, "a");
          s.j("b" + k, [-5.6, dy + 3.2], n + 2, "a");
          s.j("c" + k, [5.2, dy + 1.3], n + 3, "b");
          s.j("d" + k, [5.6, dy + 3.15], n + 4, "b");
          s.ballon("x" + k, "a" + k);
          if (variante === "ballonMain") {
            ["b", "c", "d"].forEach((j) => s.ballon("m" + j + k, j + k));
          }
        });
        for (let i = 0; i < (o.attente || 0); i++) s.j("w" + i, [-1.3 - i * 1.5, 10.3], "", "c", { nom: i === 0 ? "attente" : "" });

        const deux = (f) => P.apply(null, terrains.map((dy, k) => f(dy, k)));
        // Échange en une touche : le ballon va vers le joueur j, qui s'ajuste.
        const vers = (k, j, pt, extra) => P(M(j + k, pt, { d: 0.5 }), B("x" + k, j + k, "manchette", extra));

        s.etape("Mise en place", "2 contre 2 sur chaque demi-terrain en longueur. On ne joue qu'en manchette.", [W(0.6)]);

        if (variante === "ballonMain") {
          // Le joueur lâche son ballon juste avant de jouer, puis le reprend.
          s.etape(textes.ballonMain[0], textes.ballonMain[1], [
            deux((dy, k) => [
              P(B("x" + k, "c" + k, "manchette"), [W(0.45), B("mc" + k, [6.1, dy + 0.7], "lancer", { d: 0.5 })]),
              P(B("x" + k, "b" + k, "manchette"), B("mc" + k, "c" + k, "main", { tenu: true, d: 0.45 }), [W(0.45), B("mb" + k, [-6.5, dy + 3.8], "lancer", { d: 0.5 })]),
              P(B("x" + k, "d" + k, "manchette"), B("mb" + k, "b" + k, "main", { tenu: true, d: 0.45 }), [W(0.45), B("md" + k, [6.5, dy + 3.8], "lancer", { d: 0.5 })]),
              P(B("x" + k, [-4.2, dy + 1.9], "manchette", { sol: true }), B("md" + k, "d" + k, "main", { tenu: true, d: 0.45 }))
            ])
          ]);
          s.etape("Si c'est trop dur", "On repasse au jeu de la manchette classique, ou en deux contacts.", [
            deux((dy, k) => [PT([-4.2, dy + 1.9], "Point"), X("x" + k)])
          ]);
          return;
        }

        if (variante === "deuxTouches") {
          s.etape(textes.deuxTouches[0], textes.deuxTouches[1], [
            deux((dy, k) => [
              vers(k, "c", [4.9, dy + 1.5]),
              vers(k, "d", [3.6, dy + 2.9]),
              vers(k, "b", [-5.0, dy + 3.0]),
              vers(k, "a", [-3.6, dy + 1.7]),
              vers(k, "d", [5.2, dy + 3.1])
            ])
          ]);
          s.etape("Le point", "Le ballon tombe au sol : point pour l'autre binôme.", [
            deux((dy, k) => [vers(k, "c", [3.4, dy + 1.6]), B("x" + k, [-4.4, dy + 2.3], "manchette", { sol: true }), PT([-4.4, dy + 2.3], "Point"), X("x" + k)])
          ]);
          return;
        }

        // Avant de jouer : aller taper la main du partenaire, puis revenir sous le ballon.
        const tape = (k, j, part, pt, milieu) => P(
          [M(j + k, milieu, { d: 0.5 }), D(part + k, "Tape !", { d: 0.9 }), M(j + k, pt, { d: 0.55 })],
          B("x" + k, j + k, "manchette", { d: 1.35, h: 1.1 })
        );

        if (variante === "deuxTouchesTape") {
          // 1re touche haute pour le partenaire, qui vient taper la main avant de jouer la 2e de l'autre côté.
          s.etape(textes.deuxTouchesTape[0], textes.deuxTouchesTape[1], [
            deux((dy, k) => [
              vers(k, "c", [4.9, dy + 1.5]),
              tape(k, "d", "c", [3.6, dy + 2.9], [5.0, dy + 2.4]),
              vers(k, "b", [-5.0, dy + 3.0]),
              tape(k, "a", "b", [-3.6, dy + 1.7], [-5.0, dy + 2.1])
            ])
          ]);
          s.etape("Le point", "Pas de tape dans la main avant le second contact, ou ballon au sol : point pour l'autre binôme.", [
            deux((dy, k) => [B("x" + k, [5.3, dy + 3.7], "manchette", { sol: true }), PT([5.3, dy + 3.7], "Point"), X("x" + k)])
          ]);
          return;
        }

        if (variante === "tapeMain") {
          s.etape(textes.tapeMain[0], textes.tapeMain[1], [
            deux((dy, k) => [
              tape(k, "c", "d", [4.9, dy + 1.6], [5.4, dy + 2.4]),
              tape(k, "b", "a", [-5.0, dy + 2.9], [-5.4, dy + 2.2]),
              tape(k, "d", "c", [5.1, dy + 3.0], [5.1, dy + 2.4])
            ])
          ]);
          s.etape("Le point", "Pas de tape dans la main, ou ballon au sol : point pour l'autre binôme.", [
            deux((dy, k) => [B("x" + k, [-4.3, dy + 1.4], "manchette", { sol: true }), PT([-4.3, dy + 1.4], "Point"), X("x" + k)])
          ]);
          return;
        }

        // Jeu simple, ou hors 3 m.
        const t = textes[variante];
        s.etape(t[0], t[1], [
          deux((dy, k) => [
            vers(k, "d", [5.3, dy + 2.9]),
            vers(k, "b", [-5.2, dy + 2.8]),
            vers(k, "c", [4.7, dy + 1.6]),
            vers(k, "a", [-4.8, dy + 1.6])
          ])
        ]);
        s.etape("Le point", variante === "hors3m" ? "Ballon au sol, ou ballon qui tombe dans la zone avant : point pour l'autre binôme." : "Le ballon tombe au sol : point pour l'autre binôme.", [
          deux((dy, k) => [B("x" + k, [5.6, dy + 2.2], "manchette", { sol: true }), PT([5.6, dy + 2.2], "Point"), X("x" + k)])
        ]);
      }
    }, o.bloc);
  }

  /* ---------- Le 3 contre 6 (« QI volley ») : un trio face à un six en place (30/10, 06/11). ---------- */
  function troisContreSix(s) {
    const six = equipe(s, "B", "b", { pre: "s", depart: { p: [-10.2, 6.8] } });
    s.j("p", [-0.9, 6.0], "P", "a");
    s.j("ail", [-3.8, 1.1], "R4", "a");
    s.j("r", [-6.2, 4.6], "R", "a");
    s.coach("co", [2.6, 10.3]);
    s.caddie(4.1, 10.35);
    s.ballon("x1", "sp").ballon("x2", null).ballon("x3", null);
    const pret = () => P(M("p", [-0.9, 6.0]), M("ail", [-3.8, 1.1]), M("r", [-6.2, 4.6]), six.vers("base"));

    s.etape("Mise en place", "Un trio (passeur, ailier, réceptionneur-relanceur) face à un six en place. Le trio a 3 ballons pour faire son point.", [W(0.6)]);

    s.chapitre("Ballon 1 · Réception");
    s.etape("Service", "Le six sert, le trio reçoit : il faut construire le side-out.", [
      B("x1", "r", "service"), P(B("x1", "p", "recep"), M("sp", six.pt(-5.6, 7.4)))
    ]);
    s.etape("Le six sait où ça va", "Passe pour l'ailier. En face, bloc et défense sont déjà en place : ils savent où ça va.", [
      P(M("ail", [-0.9, 1.35], { d: 1.1 }), B("x1", "ail", "passe"), six.vers("def4", { d: 0.9 }), D("sc", "En 4 !")),
      S("ail"), six.bloc("4")
    ]);
    s.etape("Faire son point quand même", "À l'attaquant de trouver la solution. Ici : bloc-out.", [
      B("x1", [0.3, 1.05], "attaque", { d: 0.22 }), B("x1", [3.4, -1.3], "bidouille", { sol: true }), PT([2.2, 0.6], "+1"), X("x1")
    ]);

    s.chapitre("Ballon 2 · Relance");
    s.etape("Ballon facile", "Ballon relancé sur le trio : un ballon facile, il faut en profiter.", [
      P(pret(), [A("x2", "co"), W(0.7), B("x2", "r", "relance")]), B("x2", "p", "recep")
    ]);
    s.etape("L'option inattendue", "Le six attend encore l'ailier. Le trio joue l'option à laquelle il ne s'attend pas.", [
      P(M("ail", [-1.6, 1.2], { d: 1.0 }), six.vers("def4", { d: 0.9 }), M("r", [-3.5, 4.6], { d: 1.05 }), B("x2", "r", "passe")),
      S("r"), B("x2", [8.1, 5.9], "attaque", { sol: true }), PT([7.0, 5.9], "+1"), X("x2")
    ]);

    s.chapitre("Ballon 3 · Défense");
    s.etape("Attaque à défendre", "Le trio reçoit une attaque : il faut d'abord défendre.", [
      P(pret(), [A("x3", "co"), W(0.8), S("co"), B("x3", "r", "attaque")]),
      P(M("p", [-3.3, 5.3], { d: 0.9 }), B("x3", "p", "defense", { h: 1.1 }))
    ]);
    s.etape("Contre-attaquer", "Défendre puis contre-attaquer depuis une situation difficile.", [
      P(M("ail", [-0.9, 1.35], { d: 1.1 }), B("x3", "ail", "passe"), six.vers("def4", { d: 0.9 })),
      S("ail"), six.bloc("4"), B("x3", "sl", "attaque")
    ]);
    s.etape("Si le ballon est défendu", "Le six a défendu : il renvoie une attaque enroulée sur le défenseur, pour recommencer.", [
      P(M("sr1", six.pt(-1.4, 3.3), { d: 1.0 }), B("x3", "sr1", "defense", { h: 1.1 }), M("ail", [-3.8, 1.1], { d: 1.0 }), M("p", [-0.9, 6.0], { d: 1.0 })),
      S("sr1"), B("x3", "r", "attaque", { d: 0.85 })
    ]);
    s.etape("Rejouer le point", "Le trio défend de nouveau et repart à l'attaque, jusqu'à ce que le point soit fait.", [
      B("x3", "p", "defense"),
      P(M("ail", [-0.9, 1.35], { d: 1.0 }), B("x3", "ail", "passe"), six.vers("def4", { d: 0.8 })),
      S("ail"), six.bloc("4"), B("x3", [7.4, 0.55], "attaque", { sol: true }), PT([6.4, 1.2], "+1"), X("x3")
    ]);
    s.chapitre("Le score");
    s.etape("Compter", "On compte les points de chaque trio, puis on change de trio : tout le monde y passe. Classement à la fin.", [six.vers("base"), W(0.4)]);
  }

  /* ---------- Circuit fermé défense / transition, sur un demi-terrain ----------
     variante "construction" : l'attaquant renvoie dans son terrain en bidouille ou du poing.
     mire : un plot à chaque bout de filet, à 1 m du filet, cible de la passe de transition. */
  function circuitTransition(o) {
    o = o || {};
    const construction = o.variante === "construction";
    return Object.assign({
      id: "circuit",
      n: "Exo",
      titre: "Circuit défense / transition",
      dispositif: "6 joueurs par terrain : 2 attaquants au filet, 1 défenseur, 1 joueur à la transition, 2 en attente.",
      scene: function (s) {
        const P2 = [-0.95, 7.8], P4 = [-0.95, 1.2], D5 = [-6.2, 2.0], D1 = [-6.2, 7.0];
        s.cadre("A");
        s.zone("coeur", { x: -4.3, y: 4.5, r: 1.35 }, { label: "cœur de terrain" });
        if (o.mire) { s.plot(-1.0, 0.4); s.plot(-1.0, 8.6); }
        s.j("f2", P2, 1, "a");
        s.j("f4", P4, 2, "a");
        s.j("d", D5, 3, "a");
        s.j("t", D1, 4, "a");
        s.j("w1", [-10.6, 3.6], 5, "c");
        s.j("w2", [-10.6, 5.4], 6, "c");
        s.ballon("x", "f2");
        s.etape("Mise en place", "2 attaquants au filet (postes 2 et 4), 1 défenseur en 5, 1 joueur en 1 pour la transition, 2 en attente.", [W(0.6)]);
        s.etape("Attaque du poste 2", "Attaque du poste 2 vers le poste 5.", [S("f2"), B("x", "d", "attaque")]);
        s.etape("Défense cœur de terrain", o.mire ? "Bas sur les appuis, ballon haut : la défense vise le cœur de terrain. Le poste 1 vient sous le ballon." : "Le poste 5 défend haut, au cœur du terrain. Le poste 1 vient sous le ballon.", [
          P(M("t", [-4.6, 5.0], { d: 1.0 }), B("x", "t", "defense", { h: 1.1 }))
        ]);
        s.etape("Passe de transition", o.mire ? "Passe de transition vers le bout de filet : on s'oriente et on vise avant la mire, à 1 m du filet. Le plot donne le repère." : "Passe de transition du poste 1 vers le poste 4.", [B("x", "f4", "transi")]);
        const tourne = P(
          [M("f2", [-9.9, 8.4], { d: 1.5 }), M("f2", [-10.6, 5.4], { d: 0.7 })],
          M("w1", D1, { d: 1.1 }), M("w2", [-10.6, 3.6], { d: 0.6, delai: 0.4 }), M("t", P2, { d: 1.2, delai: 0.6 })
        );
        if (construction) {
          s.etape("Renvoi dans son terrain", "Celui qui attaque prend sa course d'élan et envoie le ballon dans son terrain : en bidouille, ou tapé du poing vers le fond.", [
            tourne,
            P(FL("f4", [-8.2, 6.6], "du poing, au fond"), [S("f4"), P(M("w1", [-4.4, 6.3], { d: 0.7 }), B("x", "w1", "bidouille"))])
          ]);
          s.etape("Et ça construit encore", "Défense, passe, et ça repart : le ballon ne s'arrête pas.", [
            P(M("d", [-4.6, 3.9], { d: 0.9 }), B("x", "d", "defense", { h: 1.1 })), B("x", "t", "transi")
          ]);
        } else {
          s.etape("Attaque du poste 4, on tourne", "Attaque du poste 4. Rotation : attaque → attente → défense → transition → attaque.", [
            tourne, S("f4"), B("x", "w1", "attaque")
          ]);
          s.etape("Nouvelle boucle", "Défense cœur de terrain, passe de transition vers le poste 2, et ça repart sans temps mort.", [
            P(M("d", [-4.6, 3.9], { d: 1.0 }), B("x", "d", "defense", { h: 1.1 })), B("x", "t", "transi")
          ]);
        }
      }
    }, o.bloc);
  }

  /* ---------- Continuité sur attaque à 3 m : passeurs et libéros fixes ----------
     dixDoigts : départ en dix doigts poussés fort ; central : palier avec le central dans des zones. */
  function continuite3m(o) {
    o = o || {};
    return Object.assign({
      id: "continuite-3m",
      n: "Exo",
      titre: "Continuité sur attaque à 3 m",
      dispositif: "de chaque côté : un passeur et un libéro fixes, les attaquants frappent derrière la ligne des 3 m.",
      scene: function (s) {
        const q = camp("B");
        const cote = (pre, eq, f) => {
          s.j(pre + "p", f(-0.9, 6.0), "P", eq);
          s.j(pre + "l", f(-6.8, 4.5), "L", eq, { lib: true });
          s.j(pre + "1", f(-5.0, 1.8), "A", eq);
          s.j(pre + "2", f(-5.0, 7.4), "A", eq);
        };
        cote("a", "a", (x, y) => [x, y]);
        cote("b", "b", q);
        if (o.central) {
          s.j("ac", [-2.6, 4.3], "C", "a");
          s.zone("z1", { x0: 6.2, y0: 0.3, x1: 8.7, y1: 2.8 }, { label: "zone", on: false });
          s.zone("z2", { x0: 6.2, y0: 6.2, x1: 8.7, y1: 8.7 }, { label: "zone", on: false });
        }
        s.ballon("x", "al");
        const frappe = o.dixDoigts ? "poussee" : "attaque";
        s.etape("Mise en place", "Passeur et libéro fixes de chaque côté. Les attaquants restent derrière la ligne des 3 m.", [W(0.6)]);
        s.etape("Construire", "Relance sur le passeur, passe à 3 m.", [
          B("x", "ap", "relance"), P(M("a1", [-3.5, 2.4], { d: 0.9 }), B("x", "a1", "passe"))
        ]);
        s.etape(o.dixDoigts ? "Dix doigts poussés fort" : "Attaque à 3 m sur le libéro",
          o.dixDoigts ? "Départ en dix doigts poussés fort, sur le libéro d'en face, pour installer la continuité." : "Attaque derrière les 3 m, sur le libéro d'en face : on cherche la continuité.", [
            S("a1"), B("x", "bl", frappe)
          ]);
        s.etape("Défendre, reconstruire", "Défense sur le passeur, passe à 3 m, et le ballon revient.", [
          B("x", "bp", "defense", { h: 1.1 }),
          P(M("b1", q(-3.5, 2.4), { d: 0.9 }), B("x", "b1", "passe"), M("a1", [-5.0, 1.8], { d: 0.9 })),
          S("b1"), B("x", "al", frappe)
        ]);
        s.etape(o.dixDoigts ? "On lâche le bras" : "Tenir l'échange",
          o.dixDoigts ? "Dès que les échanges tiennent, on lâche le bras progressivement et on attaque pour de vrai." : "Passeurs et libéros ne bougent pas : on tient l'échange le plus longtemps possible.", [
            B("x", "ap", "defense", { h: 1.1 }),
            P(M("a2", [-3.5, 6.9], { d: 0.9 }), B("x", "a2", "passe"), M("b1", q(-5.0, 1.8), { d: 0.9 })),
            S("a2"), B("x", "bl", "attaque")
          ]);
        if (o.central) {
          s.etape("Palier : le central", "On rajoute le central, qui attaque dans des zones définies, en appuyant les ballons.", [
            Z("z1"), Z("z2"),
            B("x", "bp", "defense", { h: 1.1 }),
            P(M("b2", q(-3.5, 6.9), { d: 0.9 }), B("x", "b2", "passe"), M("a2", [-5.0, 7.4], { d: 0.9 })),
            S("b2"), B("x", "al", "attaque"), B("x", "ap", "defense", { h: 1.1 }),
            P(M("ac", REP.fixe, { d: 0.75 }), B("x", "ac", "passe", { d: 0.8 })),
            S("ac"), B("x", [7.4, 1.5], "attaque", { sol: true }), PT([7.4, 1.5], "Zone !")
          ]);
        }
      }
    }, o.bloc);
  }

  /* ---------- Gamme de passe avec bloc qui suit la passe (frites : repères dans le filet) ----------
     lanceur : "libero" = pas de coach, le libéro envoie lui-même ses relances au passeur ; annonce : bulle du central. */
  function gammePasseBloc(o) {
    o = o || {};
    const lib = o.lanceur === "libero";
    return Object.assign({
      id: "gamme-passe-bloc",
      n: "Exo",
      titre: "Gamme de passe avec bloc",
      dispositif: "d'un côté : 1 passeur et 1 libéro qui bossent, une cible à chaque bout de filet. En face, le bloc se déplace en continu selon la passe.",
      scene: function (s) {
        if (o.frites) { s.frite(2.9); s.frite(6.1); }
        s.j("p", REP.passeur, "P", "a");
        s.j("l", [-5.8, 4.5], "L", "a", { lib: true });
        s.j("t4", [-1.0, 1.2], 4, "a");
        s.j("t2", [-1.0, 7.8], 2, "a");
        if (lib) s.caddie(-7.3, 4.5);
        else {
          s.coach("co", [-10.3, 7.4]);
          s.caddie(-10.3, 8.9);
        }
        s.j("bpo", [0.8, 1.7], "Po", "b");
        s.j("bc", [0.8, 4.5], "C", "b");
        s.j("br", [0.8, 7.3], "R4", "b");
        s.ballon("x", lib ? "l" : "co").ballon("y", null);
        s.etape("Mise en place", "Un passeur et un libéro qui bossent, une cible à chaque bout de filet. En face, trois joueurs au bloc.", [W(0.6)]);
        if (lib) s.etape("Relance du libéro", "Le libéro envoie ses relances en continu sur le passeur.", [B("x", "p", "relance")]);
        else s.etape("Relance sur le libéro", "Relance sur le libéro, qui distribue au passeur.", [B("x", "l", "relance"), B("x", "p", "recep")]);
        s.etape("Passe en 4, le bloc suit", o.frites ? "Le bloc se déplace selon la passe. La frite dans le filet donne le repère pour s'arrêter et fermer." : o.annonce ? "Le central lit la passe et l'annonce, l'ailier vient fermer à côté de lui." : "En face, le bloc se déplace selon la passe et ferme.", [
          P(B("x", "t4", "passe", { tenu: true }), M("bc", [0.8, 2.5], { d: 0.8, delai: 0.25 }), M("bpo", [0.8, 1.25], { d: 0.4, delai: 0.3 }), o.annonce ? D("bc", "En 4 !") : null),
          BL(["bc", "bpo"])
        ]);
        if (lib) {
          s.chapitre("Palier · second ballon");
          s.etape("Deuxième ballon", "On ajoute un second ballon pour accélérer le rythme : il part sans temps mort, le bloc doit déjà être revenu.", [
            P(M("bc", [0.8, 4.5], { d: 0.7 }), M("bpo", [0.8, 1.7], { d: 0.4 }), [A("y", "l"), W(0.3), B("y", "p", "relance")])
          ]);
        } else {
          s.etape("Deuxième ballon", "Le ballon suivant part sans temps mort : le bloc doit déjà être revenu.", [
            P(M("bc", [0.8, 4.5], { d: 0.7 }), M("bpo", [0.8, 1.7], { d: 0.4 }), [A("y", "co"), B("y", "l", "relance")]),
            B("y", "p", "recep")
          ]);
        }
        s.etape("Passe en 2, le bloc repart", "Passe à l'autre aile : déplacement, arrêt, fermeture.", [
          P(B("y", "t2", "passe", { tenu: true }), M("bc", [0.8, 6.5], { d: 0.8, delai: 0.25 }), M("br", [0.8, 7.75], { d: 0.4, delai: 0.3 }), o.annonce ? D("bc", "En 2 !") : null),
          BL(["bc", "br"])
        ]);
        s.etape("Rotation", "On tourne au bloc comme à la passe.", [P(M("bc", [0.8, 4.5], { d: 0.7 }), M("br", [0.8, 7.3], { d: 0.4 })), W(0.4)]);
      }
    }, o.bloc);
  }

  /* ---------- Attaque / défense : passeur en 3, deux attaquants en bout de filet, 2 ou 3 défenseurs ---------- */
  function attaqueDefense(o) {
    o = o || {};
    const trois = o.defenseurs !== 2;
    return Object.assign({
      id: "attaque-defense",
      n: "Exo",
      titre: "Attaque / défense",
      dispositif: "un passeur en 3, deux attaquants en bout de filet, " + (trois ? "3" : "2") + " joueurs en défense.",
      scene: function (s) {
        s.cadre("A");
        s.zone("coeur", { x: -4.3, y: 4.5, r: 1.35 }, { label: "cœur de terrain" });
        s.j("p", [-1.0, 4.5], "P", "b");
        s.j("f4", [-0.95, 1.2], 4, "b");
        s.j("f2", [-0.95, 7.8], 2, "b");
        s.j("d5", trois ? [-6.2, 1.9] : [-6.4, 2.6], "D", "a");
        if (trois) s.j("d6", [-7.4, 4.5], "D", "a");
        s.j("d1", trois ? [-6.2, 7.1] : [-6.4, 6.4], "D", "a");
        s.ballon("x", "f4");
        const court = trois ? "d6" : "d5";
        s.etape("Mise en place", "Un passeur en 3, deux attaquants en bout de filet, " + (trois ? "3" : "2") + " défenseurs.", [W(0.6)]);
        s.etape("Attaque du bout de filet", "L'attaquant frappe sur les défenseurs, dans son propre terrain.", [S("f4"), B("x", "d1", "attaque")]);
        s.etape("Défense, relance sur le passeur", "Défense haute vers le cœur du terrain, jouable pour le passeur.", [B("x", "p", "defense", { h: 1.1 })]);
        s.etape("Passe à l'autre aile", "Le passeur distribue à l'autre bout de filet.", [B("x", "f2", "passe")]);
        s.etape("On monte l'intensité", "Les frappes sont de plus en plus fortes : la défense doit rester jouable.", [
          S("f2"), B("x", "d5", "attaque"), B("x", "p", "defense", { h: 1.1 }), B("x", "f4", "passe")
        ]);
        s.etape("Varier les angles", "L'attaquant varie : bidouille. Il faut rester bas et aller la chercher.", [
          S("f4"), P(M(court, [-3.4, 3.3], { d: 0.75 }), B("x", court, "bidouille")), B("x", "p", "defense", { h: 1.1, tenu: true })
        ]);
      }
    }, o.bloc);
  }

  /* ---------- 6 contre 6 à ballons imposés ----------
     o.phases : { chapitre, type, pour, en, fin, annonce, pop, etapes: [[titre, texte], [titre, texte]] }
     type : "service", "relance" (du coach), "direct" (ballon du coach chez l'adversaire, qui fait un retour direct),
            "attaque" (du coach, à défendre), "passeur" (le passeur prend le 1er contact),
            "deuxieme" (le ballon du coach arrive sur le 2e contact, loin du filet).
     pour : équipe qui joue le ballon ("A" orange par défaut, "B" blanche) ;
     fin : "point", "defendu" ou "bidouille" (bidouille derrière le bloc, prise par le défenseur de la ligne qui avance). */
  function ballons(s, o) {
    const T = equipe(s, "A", "a", { roles: o.rolesA });
    const six = equipe(s, "B", "b", { pre: "s", roles: o.rolesB });
    s.coach("co", [2.6, 10.3]);
    s.caddie(4.1, 10.35);
    o.phases.forEach((ph, i) => s.ballon("x" + i, null));
    s.etape("Mise en place", o.intro, [W(0.6)]);
    const DEF = { "4": "def4", "2": "def2", fixe: "defC" };
    const SOL = { "4": [7.6, 7.8], "2": [7.6, 1.2], fixe: [8.0, 6.2] };
    const fond = (E) => E.id(E.a("l") ? "l" : "r2");
    let prec = null;
    o.phases.forEach((ph, i) => {
      const b = "x" + i;
      const R = ph.pour === "B" ? six : T;
      const Df = ph.pour === "B" ? T : six;
      const base = (placeR) => P(R.vers(placeR, { d: 1.0 }), Df.vers("base", { d: 1.0 }));
      const jeu = prec ? [X(prec)] : [];
      if (ph.type === "service") {
        const sv = Df.id("p");
        jeu.push(base("recep"), M(sv, Df.pt(-10.2, 7.0), { d: 1.1 }), A(b, sv), W(0.4), B(b, fond(R), "service"),
          P(M(R.id("p"), R.pt(REP.passeur), { d: 0.8 }), B(b, R.id("p"), "recep"), M(sv, Df.pt(-5.6, 7.4), { d: 1.2 })));
      } else if (ph.type === "relance") {
        jeu.push(P(base("elan"), [A(b, "co"), W(0.7), B(b, R.id("r2"), "relance")]), B(b, R.id("p"), "recep"));
      } else if (ph.type === "direct") {
        jeu.push(P(base("elan"), [A(b, "co"), W(0.7), B(b, Df.id("r2"), "relance")]), B(b, R.id("r2"), "manchette"), B(b, R.id("p"), "recep"));
      } else if (ph.type === "attaque") {
        jeu.push(P(base("base"), [A(b, "co"), W(0.8), S("co"), B(b, fond(R), "attaque")]),
          P(M(R.id("p"), R.pt(REP.passeur), { d: 1.0 }), M(R.id("c"), R.pt(-2.6, 4.3), { d: 0.8 }), B(b, R.id("p"), "defense", { h: 1.1 })));
      } else if (ph.type === "deuxieme") {
        jeu.push(P(base("base"), [A(b, "co"), W(0.8)]),
          P(M(fond(R), R.pt(-3.2, 4.4), { d: 0.9 }), B(b, fond(R), "relance"), D(fond(R), "J'ai la 2e !")));
      } else {
        jeu.push(P(base("base"), [A(b, "co"), W(0.8), S("co"), B(b, R.id("p"), "attaque")]),
          P(M(fond(R), R.pt(-3.2, 4.4), { d: 0.9 }), B(b, fond(R), "defense", { h: 1.1 }), D(fond(R), "J'ai !")));
      }
      s.chapitre(ph.chapitre);
      s.etape(ph.etapes[0][0], ph.etapes[0][1], jeu);
      const sansPasseur = ph.type === "passeur" || ph.type === "deuxieme";
      const en = sansPasseur ? "4" : ph.en || "4";
      const att = sansPasseur
        ? [P(M(R.id("r1"), R.pt(REP.att4), { d: 1.0 }), B(b, R.id("r1"), "transi")), S(R.id("r1"))]
        : R.passe(b, en);
      const suite = [P(att, Df.vers(DEF[en], { d: 0.9 }), ph.annonce ? D(Df.id("c"), ph.annonce) : null), Df.bloc(en)];
      if (ph.fin === "defendu") suite.push(B(b, fond(Df), "attaque"), PT(fond(Df), ph.pop || "Défendu !"));
      else if (ph.fin === "bidouille") {
        // Bidouille derrière le bloc : le défenseur de la ligne avance pour la prendre.
        const ligne = en === "2" ? ["l", [-2.6, 1.7]] : ["p", [-2.6, 7.3]];
        suite.push(P(M(Df.id(ligne[0]), Df.pt(ligne[1]), { d: 0.7 }), B(b, Df.id(ligne[0]), "bidouille")), PT(Df.id(ligne[0]), ph.pop || "Défendu !"));
      } else {
        const pt = R.pt(SOL[en]);
        suite.push(B(b, pt, "attaque", { sol: true }), PT(pt, ph.pop || "+1"));
      }
      s.etape(ph.etapes[1][0], ph.etapes[1][1], suite);
      prec = b;
    });
    s.chapitre(o.fin[2] || "Le score");
    s.etape(o.fin[0], o.fin[1], [X(prec), P(T.vers("base"), six.vers("base")), W(0.4)]);
  }

  N3M.exos = { REP: REP, PLACES: PLACES, equipe: equipe, passeEtSuit: passeEtSuit, passeEtSuitCarre: passeEtSuitCarre, jeuManchette: jeuManchette, troisContreSix: troisContreSix,
    circuitTransition: circuitTransition, continuite3m: continuite3m, gammePasseBloc: gammePasseBloc, attaqueDefense: attaqueDefense, ballons: ballons
  };
})();

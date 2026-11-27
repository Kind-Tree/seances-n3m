/* Séance N3M du mercredi 16/09/2026 — 9 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, D, PT } = N3M.a;
  const EX = N3M.exos;
  const REP = EX.REP;

  N3M.seance({
    id: "2026-09-16",
    jour: "Mercredi",
    date: "16/09/2026",
    joueurs: 9,
    axes: ["Service / Réception", "Relation passe-attaque", "Défense"],
    blocs: [
      EX.passeEtSuit({ bloc: { texte: ["Dérouillage musculaire, puis passe et suit par 3."] } }),
      EX.jeuManchette({
        variante: "ballonMain",
        attente: 1,
        bloc: { dispositif: "2 par terrain, un ballon dans les mains.", texte: ["Obligation de lâcher son ballon, jouer le contact, puis reprendre son ballon."] }
      }),

      {
        id: "exo1",
        n: "Exo 1",
        titre: "Défense / construction par 3",
        dispositif: "9 joueurs d'un seul côté du terrain, par groupes de trois.",
        texte: ["Objectif : le ballon ne doit pas tomber."],
        valider: "Enchaînement difficile à lire sur la fiche. Lecture retenue : le défenseur puis le passeur traversent sous le filet, le 3e frappe sur l'un d'eux et traverse à son tour, puis le trio reconstruit et renvoie dans le terrain de départ. À corriger si l'ordre est différent.",
        scene: function (s) {
          const DEP = [[-5.6, 2.2], [-6.4, 4.5], [-5.6, 6.8]];
          DEP.forEach((p, i) => {
            s.j("j" + (i + 1), p, i + 1, "a");
            s.j("k" + (i + 1), [-10.6, 2.5 + 2 * i], i + 4, "b");
            s.j("m" + (i + 1), [-7.8 + 1.1 * i, -1.3], i + 7, "c");
          });
          s.coach("co", [1.0, 8.2]);
          s.ballon("x", "co");
          s.etape("Mise en place", "9 joueurs d'un seul côté, par groupes de trois. Le coach attaque depuis l'autre côté du filet.", [W(0.6)]);
          s.etape("Attaque du coach", "Attaque du coach vers l'un des trois joueurs.", [S("co"), B("x", "j1", "attaque")]);
          s.etape("Défendre, puis traverser", "Celui qui touche la balle défend, puis passe dans l'autre terrain. Les deux autres s'annoncent pour la passe.", [
            P(
              M("j2", [-3.6, 4.4], { d: 0.9 }), B("x", "j2", "defense", { h: 1.2 }), D("j2", "J'ai !"),
              [M("j1", [-1.2, 0.6], { d: 0.8, delai: 0.2 }), M("j1", [5.0, 2.4], { d: 1.0 })]
            )
          ]);
          s.etape("Passer, puis traverser", "Une fois la passe faite, le passeur passe de l'autre côté.", [
            P(
              M("j3", [-3.0, 6.9], { d: 0.8 }), B("x", "j3", "passe"),
              [M("j2", [-1.0, 8.7], { d: 0.8, delai: 0.3 }), M("j2", [1.3, 5.6], { d: 0.8 })],
              M("co", [1.8, 10.3], { d: 0.9 })
            )
          ]);
          s.etape("Dernier contact sur un coéquipier", "Le dernier contact est frappé sur l'un des deux coéquipiers, déjà de l'autre côté. Un autre trio prend la place.", [
            S("j3"), B("x", "j1", "attaque"),
            P(
              B("x", "j2", "defense", { h: 1.1 }),
              [M("j3", [-0.8, 8.7], { d: 0.6 }), M("j3", [3.4, 7.9], { d: 0.7 })],
              M("k1", DEP[0], { d: 1.2 }), M("k2", DEP[1], { d: 1.2 }), M("k3", DEP[2], { d: 1.2 })
            )
          ]);
          s.etape("Renvoyer dans le terrain initial", "Le groupe entier construit pour renvoyer le ballon dans le terrain initial, où l'autre trio est en place.", [
            P(M("j3", [0.9, 7.65], { d: 0.7 }), B("x", "j3", "passe")),
            S("j3"), B("x", "k2", "attaque"), B("x", "k1", "defense", { h: 1.1, tenu: true }), PT("k2", "Il ne tombe pas !")
          ]);
        }
      },

      {
        id: "ateliers",
        n: "Ateliers",
        titre: "Quatre ateliers",
        tableau: {
          tetes: ["Atelier", "Contenu"],
          lignes: [
            ["A — Service / réception", "Les centraux au service : ils doivent toucher la manchette des récep. Enchaînement en 4."],
            ["B — Relation passe / attaque", "Relance sur un R4 : attaque en 2. Relance sur le pointu : attaque en pipe."],
            ["C — Relance / passe au centre", "Relance sur R4 / libéro, enchaîner 4 attaques au centre : 2 courtes, 2 longues dans les angles."],
            ["D — Service / récep touche haute", "Un serveur désigné sert sur les R4. Réception obligatoire à dix doigts. Celui qui ne réceptionne pas doit attaquer."]
          ]
        },
        valider: "Pas d'animation : quatre ateliers courts décrits en une ligne chacun."
      },

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Jeu 6 contre 3",
        dispositif: "6 sur un terrain, 3 de l'autre.",
        plus: [["Variante — libéro dans le jeu", "mettre le libéro dans le jeu à 6 : la défense est sur lui. Le central passe de l'autre côté pour faire une self-attaque."]],
        valider: "Lecture retenue : l'entraîneur attaque sur le poste 5 / 6 du six, qui contre-attaque ; les 3 d'en face (postes 2, 4, 6) défendent cœur de terrain, construisent et finissent en bidouille ; le six relance proprement et joue en fixe. À corriger si la self-attaque vise les 3.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a");
          s.zone("coeur", { x: 4.3, y: 4.5, r: 1.35 }, { label: "cœur de terrain" });
          s.j("t2", [1.7, 1.7], 2, "b");
          s.j("t4", [1.7, 7.3], 4, "b");
          s.j("t6", [7.3, 4.5], 6, "b");
          s.coach("co", [1.0, 4.5]);
          s.ballon("x", "co");
          s.etape("Mise en place", "6 sur un terrain, 3 de l'autre aux postes 2, 4 et 6. L'entraîneur est au filet, côté des 3.", [W(0.6)]);
          s.etape("Self-attaque de l'entraîneur", "Self-attaque de l'entraîneur sur le poste 5 / 6.", [S("co"), B("x", "ar2", "attaque")]);
          s.etape("Le six contre-attaque", "Défense, construction, attaque vers les 3 d'en face.", [
            P(M("ap", REP.passeur, { d: 1.0 }), B("x", "ap", "defense", { h: 1.1 }), M("co", [2.6, 10.3], { d: 1.2 })),
            T.passe("x", "4"), B("x", "t6", "attaque")
          ]);
          s.etape("Défense cœur de terrain", "Les postes 2 / 4 / 6 défendent au cœur du terrain.", [
            P(M("t2", [3.8, 3.6], { d: 0.8 }), B("x", "t2", "defense", { h: 1.1 }), M("ar1", [-1.1, 1.7], { d: 0.9 }))
          ]);
          s.etape("Dernier contact en bidouille", "Construction en face, et dernier contact en bidouille.", [
            P(M("t4", [0.9, 7.3], { d: 0.7 }), B("x", "t4", "passe")),
            S("t4"), P(M("apo", [-2.4, 7.0], { d: 0.5 }), B("x", "apo", "bidouille"))
          ]);
          s.etape("Relance propre, jeu en fixe", "La bidouille force une relance propre : le six joue en fixe.", [
            B("x", "ap", "relance"), T.passe("x", "fixe", { elan: 0.7 }), B("x", [7.6, 1.6], "attaque", { sol: true }), PT([7.6, 1.6], "Fixe !")
          ]);
        }
      }
    ]
  });
})();

/* Séance N3M du vendredi 28/08/2026 — 5 joueurs (reprise). */
(function () {
  "use strict";
  const { B, M, P, W, S, Z } = N3M.a;
  const EX = N3M.exos;
  const REP = EX.REP;

  N3M.seance({
    id: "2026-08-28",
    jour: "Vendredi",
    date: "28/08/2026",
    joueurs: 5,
    note: "à prévoir : playlist Luc Léger, enceinte, plots de délimitation, ballons",
    blocs: [
      {
        id: "luc-leger",
        n: "Physique",
        titre: "Luc Léger",
        texte: ["Test d'endurance progressif sur playlist audio.", "Noter le palier atteint par chaque joueur."]
      },
      {
        id: "explosivite",
        n: "Physique",
        titre: "Explosivité",
        tableau: {
          tetes: ["Exercice", "Format", "Récupération"],
          lignes: [
            ["Sauts au maximum", "3 × 5", "60 s"],
            ["Sprints de 9 m au maximum", "3 × 3", "90 s"],
            ["Déplacements latéraux", "20 s", "20 s"]
          ]
        }
      },
      {
        id: "gainage",
        n: "Physique",
        titre: "Gainage",
        tableau: {
          tetes: ["Exercice", "Format"],
          lignes: [
            ["Planche avant", "30 s"],
            ["Planche latérale", "30 s par côté"],
            ["Fentes marchées vers le filet, ballon dans les mains, rotations droite et gauche", "Aller-retour"],
            ["Dead bug", "—"]
          ]
        }
      },

      {
        id: "square",
        n: "Volley · A",
        titre: "Square",
        dispositif: "2 joueurs de chaque côté du filet : un en défense, un dans la zone du passeur. Le 5e tourne.",
        texte: ["Délimiter la zone de défense là où doit se trouver le passeur.", "On lâche le bras progressivement : si on n'attaque pas, on pousse fort à dix doigts."],
        valider: "J'ai animé le square à 2 contre 2 de part et d'autre du filet, avec une zone délimitée devant chaque passeur.",
        scene: function (s) {
          s.zone("za", { x0: -2.6, y0: 4.4, x1: -0.3, y1: 6.8 }, { label: "zone passeur", ou: [-1.45, 7.3] });
          s.zone("zb", { x0: 0.3, y0: 2.2, x1: 2.6, y1: 4.6 }, { label: "zone passeur", ou: [1.45, 1.7] });
          s.j("a1", [-5.6, 4.5], 1, "a");
          s.j("a2", [-1.4, 5.6], 2, "a");
          s.j("b1", [5.6, 4.5], 3, "b");
          s.j("b2", [1.4, 3.4], 4, "b");
          s.j("w", [-10.4, 4.5], 5, "c");
          s.ballon("x", "a1");
          s.etape("Mise en place", "Deux joueurs de chaque côté. La zone de défense est délimitée là où doit se trouver le passeur.", [W(0.6)]);
          s.etape("Dix doigts poussés fort", "Pour commencer, si on n'attaque pas, on pousse fort à dix doigts.", [B("x", "b1", "poussee")]);
          s.etape("Défense dans la zone", "La défense doit arriver dans la zone du passeur.", [B("x", "b2", "defense", { h: 1.1 })]);
          s.etape("Passe, et ça repart", "Passe, puis le ballon repart de l'autre côté.", [
            P(M("b1", [3.5, 4.6], { d: 0.8 }), B("x", "b1", "passe")), S("b1"), B("x", "a1", "poussee")
          ]);
          s.etape("On lâche le bras", "On lâche le bras progressivement : dès que ça tient, on attaque pour de vrai.", [
            B("x", "a2", "defense", { h: 1.1 }),
            P(M("a1", [-3.5, 4.4], { d: 0.8 }), B("x", "a1", "passe"), M("b1", [5.6, 4.5], { d: 0.8 })),
            S("a1"), B("x", "b1", "attaque"), B("x", "b2", "defense", { h: 1.1, tenu: true })
          ]);
        }
      },

      EX.attaqueDefense({
        defenseurs: 2,
        bloc: {
          id: "attaque-defense",
          n: "Volley · B",
          titre: "Attaque / défense",
          dispositif: "2 au filet, 2 en défense, le passeur au milieu.",
          texte: ["Tout le monde défend, passeur et attaquant compris.", "Défense cœur de terrain, relance sur le passeur."]
        }
      }),

      {
        id: "service-reception",
        n: "Volley · C",
        titre: "Service / réception",
        dispositif: "4 situations. L'animation montre la situation 1, le service ciblé.",
        tableau: {
          tetes: ["Situation", "Contenu"],
          lignes: [
            ["1 — Service ciblé", "Le central ou le pointu sert, puis se place dans une zone du terrain. Passe en 4. L'attaquant vise cette zone pour tenter de faire défendre. 2e service : le serveur se place dans l'autre demi-terrain. Si défense, on joue sur passe de transition avec attaque enroulée sur libéro / R4 / passeur."],
            ["2 — Service + ballon de relance", "Toujours 1 service, alternativement central ou pointu de l'autre côté. Ballon de relance envoyé après le service pour ajouter un attaquant."],
            ["3 — Enchaînement contre bloc", "Enchaînement d'attaques contre un bloc, en 2 ou en 4, sur relance."],
            ["4 — Attaques libres", "Attaques libres en continu. Ballon de relance envoyé dès que le ballon d'attaque franchit le filet."]
          ]
        },
        valider: "Situation 1 animée à 5 : 1 réceptionneur, 1 R4, 1 passeur d'un côté, 2 serveurs en face. Les situations 2 à 4 sont dans le tableau.",
        scene: function (s) {
          s.zone("zs", { x: 6.4, y: 6.4, r: 1.4 }, { label: "zone du serveur", on: false });
          s.j("l", [-6.2, 5.6], "R", "a");
          s.j("r4", [-5.2, 1.8], "R4", "a");
          s.j("p", REP.passeur, "P", "a");
          s.j("s1", [10.2, 6.5], "S", "b");
          s.j("s2", [10.2, 2.5], "S", "b");
          s.ballon("x", "s1");
          s.etape("Mise en place", "Un serveur (central ou pointu) en face, l'autre attend son tour. Côté réception : un réceptionneur, un R4 et un passeur.", [W(0.6)]);
          s.etape("Service, puis le serveur se place", "Le serveur sert, puis se place dans une zone du terrain.", [
            B("x", "l", "service"), P(B("x", "p", "recep"), M("s1", [6.4, 6.4], { d: 1.3 }), Z("zs"))
          ]);
          s.etape("Passe en 4", "Passe en 4.", [P(M("r4", REP.att4, { d: 0.95 }), B("x", "r4", "passe"))]);
          s.etape("Viser la zone du serveur", "L'attaquant vise cette zone pour tenter de faire défendre.", [S("r4"), B("x", "s1", "attaque")]);
          s.etape("Si défense, on joue", "Si le ballon est défendu : passe de transition, puis attaque enroulée sur le réceptionneur, le R4 ou le passeur.", [
            P(M("s2", [3.6, 4.6], { d: 1.3 }), B("x", "s2", "defense", { h: 1.2 }), M("r4", [-5.2, 1.8], { d: 1.0 })),
            P(M("s1", [1.6, 6.9], { d: 1.0 }), B("x", "s1", "transi")),
            S("s1"), B("x", "l", "attaque", { d: 0.85 }), B("x", "p", "defense", { h: 1.1, tenu: true })
          ]);
          s.etape("Deuxième service", "Au service suivant, le serveur se place dans l'autre demi-terrain.", [W(0.6)]);
        }
      }
    ]
  });
})();

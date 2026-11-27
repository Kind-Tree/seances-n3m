/* Séance N3M du mercredi 04/11/2026 — 12 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, D, PT, A, X, F, FL } = N3M.a;
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-11-04",
    jour: "Mercredi",
    date: "04/11/2026",
    joueurs: 12,
    axes: ["Fondamentaux", "Fond de jeu : soutien / défense", "Service / réception", "Système de jeu"],
    blocs: [
      EX.passeEtSuit({ groupes: 4, bloc: { texte: ["Déverrouillage dynamique, pour activer un peu le cardio."] } }),
      EX.jeuManchette({ variante: "tapeMain", attente: 4, bloc: { texte: ["Jeu de la manchette version travail d'équipe."] } }),

      {
        id: "exo1",
        n: "Exo 1",
        titre: "Fondamentaux",
        dispositif: "2 terrains, 1 passeur par terrain. Celui qui a attaqué passe en défense. L'animation montre un terrain ; l'autre groupe fait la même chose en face.",
        plus: [
          ["Évolution", "passe en 2, même enchaînement."],
          ["Défi", "compter les enchaînements sans chute : record à battre par terrain, comme le circuit du 28/10."]
        ],
        valider: "Lecture retenue : c'est l'attaquant du banc qui vient relancer sur le passeur puis qui prend la place du défenseur ; le défenseur enchaîne à l'attaque en 4 puis rejoint la file avec son ballon. À corriger si la relance ou la rotation se font autrement.",
        scene: function (s) {
          const BANC = [-8.45, 7.85], DEF = [-7.5, 1.3], COEUR = [-4.75, 4.95], ELAN = [-3.6, 1.0];
          const FILE = [[-10.7, 6.2], [-10.7, 5.0], [-10.7, 3.8]];
          s.cadre({ x0: -11.8, x1: 3.6, y0: -1.5, y1: 10.5 });
          s.zone("coeur", { x: -4.3, y: 4.5, r: 1.35 }, { label: "cœur de terrain" });
          s.banc(-9.6, 7.85, { long: 1.5 });
          s.note(-9.6, 9.1, "banc", { taille: 0.36 });
          s.j("p", EX.REP.passeur, "P", "b");
          s.j("j1", BANC, 1, "a");
          s.j("j2", DEF, 2, "a");
          s.j("j3", FILE[0], 3, "a");
          s.j("j4", FILE[1], 4, "a");
          s.j("j5", FILE[2], 5, "a");
          s.ballon("b1", "j1").ballon("b2", "j3").ballon("b3", "j4").ballon("b4", "j5");
          s.etape("Mise en place", "Par terrain : 1 passeur, 1 attaquant en bout de ligne de fond, 1 défenseur à l'autre bout. Les autres en file, un ballon chacun.", [W(0.6)]);
          s.etape("Attaque du fond", "1 attaque pied au sol (ou debout sur un banc) depuis un bout de la ligne de fond, sur le défenseur de l'autre côté.", [
            S("j1"), B("b1", "j2", "attaque")
          ]);
          s.etape("Défense cœur de terrain", "2 défend haut, vers le cœur du terrain. 1 vient sous le ballon.", [
            P(M("j1", COEUR, { d: 1.25 }), B("b1", "j1", "defense"))
          ]);
          s.etape("Relance sur le passeur", "Relance propre sur le passeur. Le défenseur prend déjà son élan.", [
            P(B("b1", "p", "relance"), M("j2", ELAN, { d: 1.1 }))
          ]);
          s.etape("Passe en 4", "Passe en 4. Celui qui a attaqué passe en défense, le suivant monte sur le banc.", [
            P(
              M("j2", EX.REP.att4, { d: 1.1 }), B("b1", "j2", "passe"),
              M("j1", DEF, { d: 1.3 }), M("j3", BANC, { d: 1.0 }), M("j4", FILE[0], { d: 0.8 }), M("j5", FILE[1], { d: 0.8 })
            )
          ]);
          s.etape("Les ballons s'enchaînent", "Pas de cible : le défenseur enchaîne à l'attaque. Dès que la passe est faite, le ballon suivant part du fond.", [
            P(
              [S("j2"), B("b1", [2.6, 3.4], "attaque", { sol: true })],
              [W(0.35), S("j3"), B("b2", "j1", "attaque")]
            )
          ]);
          s.etape("Et ça tourne", "L'attaquant récupère son ballon et rejoint la file. Derrière, même enchaînement : défense cœur de terrain, relance sur le passeur.", [
            X("b1"),
            P(
              [M("j2", [-2.0, -0.6], { d: 0.7 }), M("j2", [-10.7, -0.6], { d: 1.7 }), M("j2", FILE[2], { d: 0.9 })],
              [P(M("j3", COEUR, { d: 1.25 }), B("b2", "j3", "defense")), P(B("b2", "p", "relance"), M("j1", [-4.4, 8.3], { d: 1.3 }))]
            )
          ]);
          s.etape("Évolution : passe en 2", "Même enchaînement avec une passe en 2.", [
            P(
              M("j1", EX.REP.att2, { d: 1.0 }), B("b2", "j1", "passe"),
              M("j3", DEF, { d: 1.3 }), M("j4", BANC, { d: 1.0 }), M("j5", FILE[0], { d: 0.8 }), M("j2", FILE[1], { d: 0.8 })
            ),
            S("j1"), B("b2", [2.6, 5.4], "attaque", { sol: true })
          ]);
        }
      },

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Fond de jeu, soutien / déf",
        dispositif: "exercice en parallèle du filet, par groupe de 6. L'animation montre un groupe ; l'autre fait la même chose en face.",
        cle: "Chercher la variation : forcer les défenseurs à se battre sur les ballons et à rester bas sur les appuis.",
        plus: [
          ["Variation", "interdire la même option deux fois de suite à l'attaquant : la défense ne peut plus anticiper."],
          ["Soutien", "en arc de cercle sous l'attaquant, comme les 28/10 et 30/10 : un ballon qui revient du bloc reste jouable."]
        ],
        valider: "Lecture retenue : 2 attaquants en bout de filet (postes 2 et 4) qui attaquent dans leur propre camp, 1 relais qui fait la passe et 3 défenseurs dont le libéro. À corriger si le groupe de 6 est réparti autrement.",
        scene: function (s) {
          const COEUR = [-4.3, 4.6];
          s.cadre("A");
          s.zone("coeur", { x: -4.3, y: 4.5, r: 1.35 }, { label: "cœur de terrain" });
          s.j("f2", [-0.95, 7.8], 2, "b");
          s.j("f4", [-0.95, 1.2], 4, "b");
          s.j("p", [-2.8, 5.5], "P", "a");
          s.j("l", [-6.2, 1.9], "L", "a", { lib: true });
          s.j("d6", [-7.5, 4.5], "D", "a");
          s.j("d1", [-6.2, 7.1], "D", "a");
          s.ballon("x", "f2");
          s.etape("Mise en place", "Par groupe de 6 : 2 attaquants en bout de filet (postes 2 et 4), 1 relais et 3 défenseurs, dont le libéro.", [W(0.6)]);
          s.etape("Self-attaque du poste 2", "Départ d'une self-attaque du poste 2 vers le libéro.", [
            S("f2"), B("x", "l", "attaque")
          ]);
          s.etape("Défense haute", "Défense haute au cœur de terrain. Le relais vient sous le ballon.", [
            P(M("p", COEUR, { d: 1.0 }), B("x", "p", "defense", { h: 1.1 }))
          ]);
          s.etape("Passe en bout de filet", "Passe vers le 4 ou vers le 2. Les défenseurs se replacent face à l'attaquant.", [
            P(
              B("x", "f4", "passe"), FL("p", "f2", "ou en 2"),
              M("l", [-5.4, 1.0], { d: 0.9, delai: 0.3 }), M("d6", [-6.8, 3.6], { d: 0.9, delai: 0.3 }), M("d1", [-4.6, 7.0], { d: 0.9, delai: 0.3 }),
              M("p", [-3.3, 3.6], { d: 0.9, delai: 0.4 })
            )
          ]);
          s.etape("Trois options", "L'attaquant choisit : bidouille dans son terrain, pousser sur la ligne ou attaque sur la petite diagonale. Ici : poussée sur la ligne.", [
            P(
              FL("f4", [-2.3, 2.2], "bidouille"), FL("f4", [-3.3, 6.0], "petite diag."),
              [S("f4"), B("x", "l", "poussee")]
            )
          ]);
          s.etape("Se battre sur le ballon", "Le libéro reste bas sur ses appuis et relève haut au cœur de terrain. Cette fois, passe en 2.", [
            P(M("p", COEUR, { d: 0.9 }), B("x", "p", "defense", { h: 1.1 })),
            P(
              B("x", "f2", "passe"), FL("p", "f4", "ou en 4"),
              M("d1", [-5.4, 8.0], { d: 0.9, delai: 0.3 }), M("d6", [-6.8, 5.4], { d: 0.9, delai: 0.3 }), M("l", [-4.2, 2.0], { d: 0.9, delai: 0.3 }),
              M("p", [-3.3, 5.6], { d: 0.9, delai: 0.4 })
            )
          ]);
          s.etape("Chercher la variation", "Jamais deux fois la même option : ici, attaque sur la petite diagonale. Les défenseurs ne peuvent plus anticiper.", [
            P(
              FL("f2", [-2.3, 6.8], "bidouille"), FL("f2", [-7.6, 8.1], "ligne"),
              [S("f2"), B("x", "l", "attaque")]
            )
          ]);
          s.etape("Et ça continue", "Défense haute au cœur de terrain, passe en bout de filet, et l'attaquant varie encore.", [
            P(M("p", COEUR, { d: 0.9 }), B("x", "p", "defense", { h: 1.1, tenu: true })), PT("l", "Relevé !")
          ]);
        }
      },

      {
        id: "exo3",
        n: "Exo 3",
        titre: "Service / récep",
        dispositif: "service-récep avec enchaînement : 6 joueurs côté réception, 6 serveurs en face.",
        plus: [
          ["Service", "zone annoncée avant chaque service et seuil de fautes fixé avant la série."],
          ["Réception", "compter les réceptions jouables par réceptionneur sur une feuille simple."]
        ],
        valider: "La fiche dit seulement « service-récep avec enchaînement ». J'ai mis un six en réception et les 6 autres au service ; la rotation entre les deux groupes est à préciser.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a", { depart: { p: [-0.9, 6.0], r1: [-5.4, 1.9], l: [-6.4, 4.5], r2: [-5.4, 7.1], c: [-1.3, 3.6], po: [-2.6, 8.3] } });
          [0.9, 2.3, 3.7, 5.1, 6.5, 7.9].forEach((y, i) => {
            s.j("s" + (i + 1), [10.2, y], "S", "b");
            s.ballon("x" + (i + 1), "s" + (i + 1));
          });
          s.etape("Mise en place", "Un six en réception : passeur, 3 réceptionneurs, central, pointu. En face, 6 serveurs avec un ballon chacun.", [W(0.6)]);
          s.chapitre("Ballon 1");
          s.etape("Zone annoncée", "Le serveur annonce sa zone avant de servir.", [
            D("s2", "Zone 5 !"), W(0.9), B("x2", "ar1", "service")
          ]);
          s.etape("Réception", "La réception monte sur le passeur.", [
            B("x2", "ap", "recep")
          ]);
          s.etape("Enchaînement", "Le passeur distribue et l'attaque part : on joue le ballon jusqu'au bout.", [
            T.passe("x2", "4"), B("x2", [6.2, 6.4], "attaque", { sol: true }), X("x2")
          ]);
          s.chapitre("Ballon 2");
          s.etape("Service suivant", "Dès que l'attaque est partie, le serveur suivant envoie.", [
            P(M("ar1", [-5.4, 1.9], { d: 0.9 }), [D("s4", "Zone 6 !"), W(0.7), B("x4", "al", "service")]), B("x4", "ap", "recep")
          ]);
          s.etape("Enchaînement", "Autre solution d'attaque : passe pour le pointu en 2.", [
            T.passe("x4", "2"), B("x4", [5.6, 2.4], "attaque", { sol: true }), X("x4")
          ]);
          s.etape("Compter", "On compte les réceptions jouables de chaque réceptionneur, et les fautes de service de la série.", [
            M("apo", [-2.6, 8.3], { d: 0.8 }), W(0.4)
          ]);
        }
      },

      {
        id: "exo4",
        n: "Exo 4",
        titre: "Système de jeu + gain d'expérience",
        dispositif: "6 contre 6, deux équipes fixes sur trois phases. Le coach au bord du terrain avec le caddie.",
        tableau: {
          tetes: ["Phase", "Format", "Ce qu'on cherche"],
          lignes: [
            ["1 · Enchaîner", "Séries de 6 ballons, jusqu'à ce que le caddie se vide : un ballon renvoyé dès que celui en cours tombe par terre.", "S'habituer à enchaîner les ballons"],
            ["2 · Set + relance", "Un set entier : l'équipe qui gagne le point a le droit à une relance.", "La relance doit arriver sur le même attaquant"],
            ["3 · Set libre", "Un set libre.", "Max intensité"]
          ]
        },
        cle: "Set libre : max intensité.",
        plus: [
          ["Phase 1", "compter les points de chaque série de 6, score cumulé jusqu'à ce que le caddie soit vide."],
          ["Phase 2", "si le point vient d'une faute adverse, désigner l'attaquant avant la relance."],
          ["Phase 3", "noter l'écart à 20 points et le score final, comme le 28/10 : c'est la fin de set qu'on veut voir tenir."]
        ],
        valider: "Phase 1 : j'ai fait renvoyer les ballons par le coach, en alternant les deux équipes. Phase 2 : la relance est envoyée par le coach sur l'équipe qui vient de marquer. Les attaques montrées sont des exemples.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a", { depart: "elan" });
          const six = EX.equipe(s, "B", "b", { pre: "s" });
          s.coach("co", [2.6, 10.3]);
          s.caddie(4.1, 10.35);
          s.ballon("x1", null).ballon("x2", null).ballon("x3", null).ballon("x4", null);
          s.etape("Mise en place", "Deux équipes fixes de 6. Le coach est au bord du terrain avec le caddie.", [W(0.6)]);

          s.chapitre("Phase 1 · Enchaîner");
          s.etape("Ballon du coach", "Séries de 6 ballons. Le coach met le premier ballon en jeu.", [
            A("x1", "co"), W(0.6), B("x1", "ar2", "relance"), B("x1", "ap", "recep")
          ]);
          s.etape("On joue le point", "L'équipe construit son attaque, en face bloc et défense se placent.", [
            P(T.passe("x1", "4"), six.vers("def4", { d: 0.9 })),
            six.bloc("4"), B("x1", [7.6, 7.8], "attaque", { sol: true }), PT([6.6, 7.4], "+1")
          ]);
          s.etape("Le ballon tombe : le suivant part", "Dès que le ballon en cours tombe par terre, le coach en renvoie un. Pas de temps mort.", [
            X("x1"),
            P(T.vers("base", { d: 0.9 }), six.vers("elan", { d: 0.9 }), [A("x2", "co"), W(0.7), B("x2", "sr2", "relance")]),
            B("x2", "sp", "recep")
          ]);
          s.etape("Enchaîner", "On s'habitue à enchaîner les ballons : 6 par série, jusqu'à ce que le caddie soit vide.", [
            P(six.passe("x2", "fixe", { elan: 0.8 }), T.vers("defC", { d: 0.8 })),
            T.bloc("fixe"), B("x2", [-8.0, 2.8], "attaque", { sol: true }), PT([-7.0, 3.2], "+1")
          ]);

          s.chapitre("Phase 2 · Set + relance");
          s.etape("Un set entier", "Un vrai set : service, réception, construction.", [
            X("x2"),
            P(T.vers("recep", { d: 1.0 }), six.vers("base", { d: 1.0 }), M("sp", [10.2, 2.0], { d: 1.2, delai: 1.0 })),
            A("x3", "sp"), W(0.4), B("x3", "al", "service"),
            P(M("ap", EX.REP.passeur, { d: 0.8 }), B("x3", "ap", "recep"), M("sp", six.pt(-5.6, 7.4), { d: 1.2 }))
          ]);
          s.etape("Point gagné", "L'équipe orange marque : elle a le droit à une relance.", [
            P(T.passe("x3", "4"), six.vers("def4", { d: 0.9 })),
            six.bloc("4"), B("x3", [7.6, 7.8], "attaque", { sol: true }), PT([6.6, 7.4], "+1"), F("ar1")
          ]);
          s.etape("La relance", "Le coach envoie la relance sur l'équipe qui vient de marquer.", [
            X("x3"),
            P(M("ar1", [-3.6, 1.0], { d: 0.9 }), M("ac", [-2.6, 4.3], { d: 0.8 }), six.vers("base", { d: 0.9 }), [A("x4", "co"), W(0.7), B("x4", "ar2", "relance")]),
            B("x4", "ap", "recep")
          ]);
          s.etape("Sur le même attaquant", "La relance doit arriver sur le même attaquant. En face, tout le monde le sait : à lui de trouver la solution.", [
            P(T.passe("x4", "4"), six.vers("def4", { d: 0.9 }), F("ar1"), D("sc", "Encore lui !")),
            six.bloc("4"), B("x4", "sl", "attaque")
          ]);

          s.chapitre("Phase 3 · Set libre");
          s.etape("Max intensité", "Un set libre, à intensité maximale.", [
            X("x4"), P(T.vers("base"), six.vers("base")), W(0.4)
          ]);
        }
      }
    ]
  });
})();

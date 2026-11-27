/* Séance N3M du vendredi 13/11/2026 — 12 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, BL, D, PT, A, X, F, FL } = N3M.a;
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-11-13",
    jour: "Vendredi",
    date: "13/11/2026",
    joueurs: 12,
    axes: ["Défense / cardio", "Manip de balle", "Attaque face au bloc", "Reconstruction sans passeur"],
    blocs: [
      {
        id: "echauffement",
        n: "Échauffement",
        titre: "Déverrouillage dynamique par 2",
        texte: ["Déverrouillage dynamique par 2, comme en match."]
      },
      EX.jeuManchette({ variante: "simple", attente: 4, bloc: { texte: ["Jeu de la manchette."] } }),

      {
        id: "exo1",
        n: "Exo 1",
        titre: "Défense / cardio",
        dispositif: "par groupe de 2, un joueur a trois ballons qu'il envoie sur son pote. L'animation montre un binôme ; les autres font la même chose à côté.",
        plus: [
          ["Rythme", "les 3 ballons s'enchaînent sans temps mort, puis on inverse les rôles : c'est le rythme qui fait le cardio."],
          ["Défi", "compter les séries de 3 ballons jouables d'affilée : record à battre par binôme."]
        ],
        valider: "Lecture retenue : le lanceur est près du filet et chaque ballon est renvoyé jouable sur lui. Ballon 2 : le lanceur frappe le ballon au sol et son partenaire le joue après le rebond, comme un soutien. À corriger si les ballons s'envoient autrement.",
        scene: function (s) {
          const NET = [-1.7, 4.5], DEF = [-6.4, 4.5];
          const POSE = [[-0.6, 4.5], [-0.7, 3.6], [-0.7, 5.4]];
          s.cadre("A");
          s.j("j1", NET, 1, "a", { sens: -1 });
          s.j("j2", DEF, 2, "b", { sens: -1 });
          s.ballon("x1", "j1").ballon("x2", POSE[1]).ballon("x3", POSE[2]);
          s.etape("Mise en place", "Par 2 : un joueur avec 3 ballons, son pote en face. Les 3 ballons s'enchaînent sans temps mort.", [W(0.6)]);
          s.etape("1 · Une attaque à défendre", "Premier ballon : une attaque. Défense haute, pour que le ballon reste jouable.", [
            S("j1"), B("x1", "j2", "attaque"), B("x1", "j1", "defense", { h: 1.1, tenu: true })
          ]);
          s.etape("2 · Un rebond à soutenir", "Deuxième ballon : il rebondit par terre. Il faut avancer et le soutenir avant qu'il retombe.", [
            A("x1", POSE[0]), A("x2", "j1"), W(0.3),
            B("x2", [-3.6, 3.5], "sol", { sol: true }),
            P(M("j2", [-5.0, 2.9], { d: 0.7 }), B("x2", "j2", "rebond", { h: 1.2 })),
            PT("j2", "Soutenu !"), B("x2", "j1", "defense", { h: 1.1, tenu: true })
          ]);
          s.etape("3 · Un ballon au fond", "Troisième ballon : envoyé au fond du terrain. Il faut courir le chercher et le ramener.", [
            A("x2", POSE[1]), A("x3", "j1"), W(0.3),
            P(M("j2", [-8.3, 7.3], { d: 1.25 }), B("x3", "j2", "poussee", { h: 1.1 })),
            B("x3", "j1", "defense", { h: 1.3, tenu: true }), PT("j2", "3 sur 3 !")
          ]);
          s.etape("On inverse", "Les 3 ballons joués, on inverse les rôles tout de suite. Défi : le plus de séries de 3 ballons jouables d'affilée.", [
            A("x3", POSE[2]),
            P([M("j1", [-4.2, 3.0], { d: 0.7 }), M("j1", DEF, { d: 0.7 })], M("j2", NET, { d: 1.6 })),
            A("x1", "j2"), W(0.4)
          ]);
        }
      },

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Régularité / manip de balle",
        dispositif: "circuit d'attaque-défense. Un joueur poste 6 et un joueur poste 3 sur chaque terrain, le reste derrière en attente.",
        cle: "Objectif continuité : on appuie ses attaques de plus en plus.",
        plus: [
          ["Défi", "compter les ballons enchaînés sans chute : record à battre à chaque palier d'impact, comme le 06/11."]
        ],
        valider: "Le joueur poste 3 fait la passe. J'ai animé l'attaque en 4, comme le 06/11, et mis le coach au filet d'en face pour la première attaque. Rotation : l'attaquant prend la passe de son côté, le passeur passe sous le filet et va en attente de l'autre côté.",
        scene: function (s) {
          s.zone("coeurA", { x: -4.3, y: 4.5, r: 1.3 }, { label: "cœur de terrain" });
          s.j("a1", [-6.6, 4.5], 1, "a");
          s.j("a2", [-1.0, 4.9], 2, "a");
          s.j("a3", [-10.0, 4.5], 3, "a");
          s.j("a4", [-11.1, 4.5], 4, "a");
          s.j("a5", [-10.0, 5.8], 5, "a");
          s.j("a6", [-11.1, 5.8], 6, "a");
          s.j("b1", [1.0, 4.1], 7, "b");
          s.j("b2", [6.6, 4.5], 8, "b");
          s.j("b3", [10.0, 4.5], 9, "b");
          s.j("b4", [11.1, 4.5], 10, "b");
          s.j("b5", [10.0, 5.8], 11, "b");
          s.j("b6", [11.1, 5.8], 12, "b");
          s.coach("co", [1.0, 7.7]);
          s.caddie(3.6, 10.35);
          s.ballon("x", "co");
          s.etape("Mise en place", "De chaque côté : un joueur en poste 6 et un passeur en poste 3. Les autres attendent derrière.", [W(0.6)]);
          s.etape("Attaque du coach", "Le coach attaque sur le joueur en poste 6.", [
            S("co"), B("x", "a1", "attaque")
          ]);
          s.etape("Défense haute", "Le poste 6 défend haut, sur son passeur.", [
            P(M("a2", [-2.4, 4.9], { d: 0.8 }), B("x", "a2", "defense", { h: 1.1 }), M("co", [2.0, 10.3], { d: 1.0 }))
          ]);
          s.etape("Passe du passeur", "Le défenseur enchaîne à l'attaque, grâce à la passe du passeur.", [
            P(M("a1", [-0.9, 1.35], { d: 1.2 }), B("x", "a1", "passe"))
          ]);
          s.etape("Attaque sur le poste 6 d'en face", "Il attaque sur le joueur en poste 6 d'en face.", [
            S("a1"), B("x", "b2", "attaque")
          ]);
          s.etape("On tourne", "Après avoir attaqué, le joueur prend la passe de son côté. Le passeur va en attente de l'autre côté. En face, ça défend déjà.", [
            P(
              M("a1", [-1.0, 4.9], { d: 1.2 }),
              [M("a2", [1.2, 8.55], { d: 1.3 }), M("a2", [9.3, 8.55], { d: 1.7 }), M("a2", [10.0, 7.1], { d: 0.7 })],
              M("a3", [-6.6, 4.5], { d: 1.2 }),
              M("a4", [-10.0, 4.5], { d: 0.8 }),
              M("b1", [2.4, 4.1], { d: 0.8 }),
              B("x", "b1", "defense", { h: 1.1 })
            )
          ]);
          s.etape("Même chose en face", "En face : passe, puis attaque sur le poste 6, où le joueur suivant est en place.", [
            P(M("b2", [0.9, 7.65], { d: 1.2 }), B("x", "b2", "passe")),
            S("b2"), B("x", "a3", "attaque")
          ]);
          s.etape("Et ça continue", "Même rotation en face, et le circuit ne s'arrête plus. Objectif continuité : on appuie ses attaques de plus en plus.", [
            P(
              M("b2", [1.0, 4.1], { d: 1.2 }),
              [M("b1", [-1.2, 0.45], { d: 1.3 }), M("b1", [-9.3, 0.45], { d: 1.7 }), M("b1", [-11.1, 4.5], { d: 0.9 })],
              M("b3", [6.6, 4.5], { d: 1.2 }),
              M("b4", [10.0, 4.5], { d: 0.8 }),
              M("a1", [-2.4, 4.9], { d: 0.8 }),
              B("x", "a1", "defense", { h: 1.1 })
            )
          ]);
        }
      },

      {
        id: "exo3",
        n: "Exo 3",
        titre: "Service / récep → enchaînement contre un bloc",
        dispositif: "côté réception, 6 joueurs : 1 passeur, 2 R4 + 1 libéro, 1 central, 1 pointu. En face, 6 joueurs : 3 au bloc (1 R4, 1 pointu, 1 central) et 3 au service (2 R4 + l'autre central).",
        texte: ["Les services s'enchaînent. Passe au moins une fois au centre tous les 3 ballons."],
        tableau: {
          tetes: ["Règle", "Passage au sol si…"],
          lignes: [
            ["Centre", "le central ne peut pas attaquer car pas de récep : passage au sol pour les receps."],
            ["Service", "2 services loupés d'affilée."],
            ["Intervalles", "un ballon tombe entre les intervalles."]
          ]
        },
        plus: [
          ["Bloc", "le central annonce la passe dès qu'il la lit, l'ailier ferme à côté de lui."]
        ],
        valider: "Les attaques montrées (petite diagonale, puis fixe) sont des exemples. Le 3e joueur du bloc se décale en défense quand il ne bloque pas.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a", { depart: { p: [-0.9, 6.0], r1: [-5.4, 1.9], l: [-6.4, 4.5], r2: [-5.4, 7.1], c: [-1.3, 3.6], po: [-2.6, 8.3] } });
          const K = EX.equipe(s, "B", "b", { pre: "k", roles: ["r1", "c", "po"] });
          s.j("s1", [10.2, 2.0], "R4", "b");
          s.j("s2", [10.2, 4.5], "R4", "b");
          s.j("s3", [10.2, 7.0], "C", "b");
          s.ballon("x1", "s1").ballon("x2", "s2").ballon("x3", "s3");
          s.etape("Mise en place", "6 côté réception : passeur, 2 R4 + libéro, central, pointu. En face : 3 joueurs au bloc et 3 serveurs.", [W(0.6)]);
          s.chapitre("Ballon 1");
          s.etape("Service, réception", "Premier service. La réception monte sur le passeur.", [
            B("x1", "ar1", "service"), B("x1", "ap", "recep")
          ]);
          s.etape("Enchaînement contre le bloc", "Passe en 4. En face, le central annonce la passe dès qu'il la lit, l'ailier ferme à côté de lui.", [
            P(T.passe("x1", "4"), K.vers("def4", { d: 0.9 }), D("kc", "En 4 !")),
            K.bloc("4"), B("x1", [3.2, 8.2], "attaque", { sol: true }), X("x1")
          ]);
          s.chapitre("Ballon 2");
          s.etape("Service suivant", "Les services s'enchaînent. Bonne réception : le central peut attaquer.", [
            P(M("ar1", [-5.4, 1.9], { d: 0.9 }), K.vers("base", { d: 0.9 }), B("x2", "al", "service", { delai: 0.5 })), B("x2", "ap", "recep")
          ]);
          s.etape("Passe au centre", "Au moins une passe au centre tous les 3 ballons. Le central d'en face monte au bloc.", [
            P(T.passe("x2", "fixe", { elan: 0.8 }), K.vers("defC", { d: 0.8 })),
            K.bloc("fixe"), B("x2", [6.5, 6.0], "attaque", { sol: true }), X("x2")
          ]);
          s.chapitre("Ballon 3");
          s.etape("Service dans l'intervalle", "Le service arrive entre deux réceptionneurs. Personne ne le prend : le ballon tombe.", [
            P(M("ac", [-1.3, 3.6], { d: 0.8 }), K.vers("base", { d: 0.8 }), B("x3", [-6.1, 5.85], "service", { sol: true, delai: 0.4 }), M("al", [-6.35, 5.0], { d: 0.45, delai: 1.0 }), M("ar2", [-5.5, 6.65], { d: 0.45, delai: 1.0 }))
          ]);
          s.etape("Passage au sol", "Pas de ballon entre les intervalles, sinon passage au sol.", [
            F("al"), F("ar2"), D("al", "Au sol !"), D("ar2", "Au sol !"), W(1.2)
          ]);
          s.chapitre("Les autres règles");
          s.etape("Centre et service", "Passage au sol aussi pour les receps si le central ne peut pas attaquer faute de récep, et après 2 services loupés d'affilée.", [
            X("x3"), P(M("al", [-6.4, 4.5]), M("ar2", [-5.4, 7.1])), W(0.4)
          ]);
        }
      },

      {
        id: "exo4",
        n: "Exo 4",
        titre: "6v6 : enchaînements contre reconstruction sans passeur",
        dispositif: "travail en 6v6 : un groupe travaille les enchaînements de ballons, l'autre doit reconstruire sur bloc-défense, sans passeur dans son équipe. 3 ballons : 1 bloqueur → 2 bloqueurs → passe du libéro.",
        tableau: {
          tetes: ["Ballon", "Mise en jeu", "Point travaillé"],
          lignes: [
            ["1 · 1 bloqueur", "Relance sur le libéro", "Le passeur joue où il veut, mais le central en face ne va pas au bloc pour laisser le 1v1 ; son équipe essaie de défendre et de reconstruire."],
            ["2 · 2 bloqueurs", "Petite défense du libéro", "Jouer à l'aile ; cette fois, le central en face suit la balle pour créer un 1v2."],
            ["3 · Passe du libéro", "Attaque sur le passeur", "Relais du libéro, qui fait la passe de transition : l'attaquant attaque depuis une balle derrière lui. Le central et l'ailier sont bien collés, donc l'attaquant doit choisir."]
          ]
        },
        plus: [
          ["Sans passeur", "annoncer avant chaque ballon qui prend la 2e touche si le libéro défend."],
          ["Ballon 3", "passe de transition haute, à 1 ou 2 m du filet, pour laisser le temps à l'attaquant de choisir."],
          ["Score", "tenir le score par série de 3 ballons (point gagné contre reconstruction réussie), puis faire tourner les joueurs autour du passeur."]
        ],
        valider: "Lecture retenue : les orange, avec le passeur, enchaînent les 3 ballons envoyés par le coach au bord du terrain ; les blancs jouent sans passeur, avec un R4 à sa place. Sans passeur, la 2e touche est prise par le libéro, ou par celui qui l'annonce quand le libéro défend. Les attaques montrées sont des exemples.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a", { depart: "elan" });
          const six = EX.equipe(s, "B", "b", { pre: "s", etiquettes: { p: "R4" } });
          const PL = EX.PLACES, REP = EX.REP;
          // Ballon 1 : tout le six se place face au poste 4, sauf le central qui ne va pas au bloc.
          const sansCentral = { po: PL.def4.po, r1: PL.def4.r1, p: PL.def4.p, r2: PL.def4.r2, l: PL.def4.l };
          s.coach("co", [2.6, 10.3]);
          s.caddie(4.1, 10.35);
          s.ballon("x1", null).ballon("x2", null).ballon("x3", null);
          s.etape("Mise en place", "Les orange, avec leur passeur, enchaînent 3 ballons. Les blancs jouent sans passeur : ils doivent défendre et reconstruire.", [W(0.6)]);

          s.chapitre("Ballon 1 · 1 bloqueur");
          s.etape("Relance sur le libéro", "Premier ballon : relance sur le libéro, qui sert son passeur.", [
            A("x1", "co"), W(0.6), B("x1", "al", "relance"), B("x1", "ap", "recep")
          ]);
          s.etape("Le central reste : 1 contre 1", "Le passeur joue où il veut. En face, le central ne va pas au bloc, pour laisser le 1 contre 1.", [
            P(T.passe("x1", "4"), FL("ap", "apo", "ou en 2"), six.vers(sansCentral, { d: 0.9 }), D("sc", "Je reste !")),
            BL(["spo"]), B("x1", "sl", "attaque")
          ]);
          s.etape("Défendre, reconstruire", "Les blancs défendent haut. Pas de passeur : le libéro a défendu, celui qui a annoncé la 2e touche sert son ailier.", [
            P(M("sr2", [4.3, 4.4], { d: 0.9 }), B("x1", "sr2", "defense", { h: 1.1 }), D("sr2", "J'ai la 2e !")),
            P(M("sr1", six.pt(REP.att4), { d: 1.0 }), B("x1", "sr1", "transi"), T.vers("def4", { d: 0.9 })),
            S("sr1"), T.bloc("4"), B("x1", [-4.6, 0.7], "attaque", { sol: true }), PT([-4.6, 0.7], "Reconstruit !")
          ]);

          s.chapitre("Ballon 2 · 2 bloqueurs");
          s.etape("Petite défense du libéro", "Deuxième ballon : une attaque sur le libéro, qui fait une petite défense sur son passeur.", [
            X("x1"),
            P(T.vers("base", { d: 1.0 }), six.vers("base", { d: 1.0 }), [A("x2", "co"), W(0.9), S("co"), B("x2", "al", "attaque")]),
            P(M("ap", REP.passeur, { d: 1.0 }), M("apo", [-3.4, 8.2], { d: 0.8 }), M("ac", [-2.6, 4.3], { d: 0.8 }), B("x2", "ap", "defense", { h: 1.1 }))
          ]);
          s.etape("Le central suit : 1 contre 2", "Jeu à l'aile. Cette fois, le central d'en face suit la balle : l'attaquant est en 1 contre 2.", [
            P(T.passe("x2", "2"), six.vers("def2", { d: 0.9 }), D("sc", "Je suis !")),
            six.bloc("2"), B("x2", [0.3, 7.25], "attaque", { d: 0.22 }), PT([0.9, 6.9], "Touché !"), B("x2", "sr2", "poussee")
          ]);
          s.etape("Défendre, reconstruire", "Ballon freiné par le bloc et défendu. Le libéro prend la 2e touche et sert l'autre aile.", [
            P(M("sl", [4.4, 6.2], { d: 0.9 }), B("x2", "sl", "defense", { h: 1.1 })),
            P(M("spo", six.pt(REP.att2), { d: 1.0 }), B("x2", "spo", "transi"), T.vers("def2", { d: 0.9 })),
            S("spo"), T.bloc("2"), B("x2", "apo", "attaque"), PT("apo", "Défendu !")
          ]);

          s.chapitre("Ballon 3 · Passe du libéro");
          s.etape("Attaque sur le passeur", "Troisième ballon : une attaque sur le passeur. Il défend, le libéro vient en relais.", [
            X("x2"),
            P(T.vers("base", { d: 1.0 }), six.vers("base", { d: 1.0 }), [A("x3", "co"), W(0.9), S("co"), B("x3", "ap", "attaque")]),
            P(M("al", [-4.4, 4.4], { d: 1.0 }), M("ar1", [-3.6, 1.0], { d: 0.8 }), M("ac", [-2.6, 4.3], { d: 0.8 }), B("x3", "al", "defense", { h: 1.1 }), D("al", "J'ai !"))
          ]);
          s.etape("Passe de transition du libéro", "Le libéro fait la passe de transition, haute, à 1 ou 2 m du filet : le ballon arrive de derrière l'attaquant.", [
            P(M("ar1", [-1.9, 1.5], { d: 1.1 }), B("x3", "ar1", "transi"), six.vers("def4", { d: 0.9 }))
          ]);
          s.etape("Bloc collé : choisir", "En face, le central et l'ailier sont bien collés. À l'attaquant de choisir. Ici : bidouille derrière le bloc.", [
            P(FL("ar1", [1.4, -0.6], "bloc-out"), FL("ar1", [6.3, 5.0], "diagonale"), [S("ar1"), six.bloc("4"), B("x3", [2.3, 2.7], "bidouille", { sol: true })]),
            PT([2.3, 2.7], "+1")
          ]);

          s.chapitre("Le score");
          s.etape("Compter, puis tourner", "Score par série de 3 ballons : point gagné contre reconstruction réussie. Puis on fait tourner les joueurs autour du passeur.", [
            X("x3"), P(T.vers("base"), six.vers("base")), W(0.4)
          ]);
        }
      }
    ]
  });
})();

/* Séance N3M du mercredi 28/10/2026 — 13 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, BL, D, PT, A, X, F, FL } = N3M.a;
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-10-28",
    jour: "Mercredi",
    date: "28/10/2026",
    joueurs: 13,
    axes: ["Intensité sur tout un match", "Manip de balle / passe", "Enchaînement aux ailes", "Bloc et soutien"],
    blocs: [
      {
        id: "debrief",
        n: "Échauffement",
        titre: "Déverrouillage + debrief de dimanche",
        texte: ["Déverrouillage et petit debrief de dimanche dernier."],
        plus: [["Debrief", "2 ou 3 points maximum, et un seul objectif pour ce soir : jouer à fond jusqu'au bout."]]
      },
      EX.jeuManchette({
        variante: "ballonMain",
        attente: 5,
        bloc: {
          titre: "Jeu de la manchette avec ballon parasite",
          texte: ["Aux joueurs de compter les points, avec compétition et intensité."],
          plus: [["Format", "matchs courts avec rotation des équipes, pour jouer plus de fins de match sous pression."]],
          valider: "« Ballon parasite » : j'ai repris la variante où chacun tient un ballon qu'il lâche pour jouer sa manchette. À corriger si le ballon parasite est autre chose."
        }
      }),

      {
        id: "exo1",
        n: "Exo 1",
        titre: "Circuit manip de balle / gamme de passe parallèle au filet",
        dispositif: "un passeur en 3, deux joueurs en bout de filet, le reste en poste 6, les uns derrière les autres.",
        plus: [
          ["Palier", "si ça marche bien, variation attaque / bidouille."],
          ["Défi", "compter les ballons enchaînés sans chute à 2 ballons : record à battre, comme le circuit du 21/10."],
          ["Défense", "sur l'attaque du bout de filet, le poste 6 défend haut et vers le centre pour relancer jouable au passeur."]
        ],
        valider: "Lecture retenue : le joueur en bout de filet renvoie le ballon au poste 6 puis rejoint la file, et le relanceur prend sa place à l'aile. L'animation montre 7 joueurs sur un demi-terrain.",
        scene: function (s) {
          const Q = [[-6.5, 4.5], [-7.8, 4.5], [-9.1, 4.5], [-10.4, 4.5]];
          const A4 = [-1.0, 1.3], A2 = [-1.0, 7.7];
          // Retour d'un ailier en bout de file, par l'extérieur.
          const file = (id, cote, k) => [M(id, [-9.8, cote === 4 ? 0.9 : 8.1], { d: 1.5 }), M(id, Q[k], { d: 0.8 })];
          s.cadre("A");
          s.j("p", [-1.0, 4.5], "P", "b");
          s.j("a", A4, 1, "a");
          s.j("b", A2, 2, "a");
          s.j("c", Q[0], 3, "a");
          s.j("d", Q[1], 4, "a");
          s.j("e", Q[2], 5, "a");
          s.j("f", Q[3], 6, "a");
          s.ballon("x", "c").ballon("y", null);
          s.etape("Mise en place", "Un passeur en 3, deux joueurs en bout de filet, le reste en poste 6, les uns derrière les autres.", [W(0.6)]);
          s.chapitre("1 · Un ballon");
          s.etape("Relance vers le passeur", "Relance du poste 6 vers le passeur. Le relanceur suit son ballon : il va vers son passeur.", [
            P(B("x", "p", "relance"), M("c", [-3.0, 4.0], { d: 1.2 }))
          ]);
          s.etape("Passe en 4 ou en 2", "Le passeur distribue en 4 ou en 2. Le relanceur décale à son aile.", [
            P(B("x", "a", "passe"), FL("p", "b", "ou en 2"), M("c", [-2.6, 2.4], { d: 0.9 }),
              M("d", Q[0], { d: 0.8 }), M("e", Q[1], { d: 0.8 }), M("f", Q[2], { d: 0.8 }))
          ]);
          s.etape("Retour au poste 6", "L'ailier renvoie au poste 6 et rejoint la file. Le relanceur a pris sa place.", [
            P(B("x", "d", "passe"), file("a", 4, 3), M("c", A4, { d: 0.8, delai: 0.6 }))
          ]);
          s.etape("Et ça tourne", "Même chose de l'autre côté : relance, passe en 2, on suit et on décale.", [
            P(B("x", "p", "relance"), M("d", [-3.0, 5.0], { d: 1.2 })),
            P(B("x", "b", "passe"), M("d", [-2.6, 6.6], { d: 0.9 }), M("e", Q[0], { d: 0.8 }), M("f", Q[1], { d: 0.8 }), M("a", Q[2], { d: 0.8 })),
            P(B("x", "e", "passe"), file("b", 2, 3), M("d", A2, { d: 0.8, delai: 0.6 }))
          ]);
          s.chapitre("2 · Deux ballons");
          s.etape("Second ballon", "Ajout d'un second ballon pour un mouvement permanent : personne ne s'arrête.", [
            A("y", "c"),
            P(B("x", "p", "relance"), B("y", "f", "passe"), M("e", [-3.0, 5.0], { d: 1.2 })),
            P(B("x", "d", "passe"), M("e", [-2.6, 6.6], { d: 0.9 }), [W(0.45), B("y", "p", "relance")], M("f", [-3.0, 4.0], { d: 1.2, delai: 0.45 })),
            P(B("x", "a", "passe", { tenu: true }), B("y", "c", "passe", { tenu: true }), M("f", [-2.6, 2.4], { d: 0.9 }))
          ]);
          s.chapitre("3 · Avec attaque");
          s.etape("Retour à un ballon", "Si bonne intensité : retour à un seul ballon. Chacun reprend sa place.", [
            X("y"),
            P(file("d", 2, 3), file("c", 4, 2), M("e", A2, { d: 0.8, delai: 0.7 }), M("f", A4, { d: 0.8, delai: 0.7 }),
              M("a", Q[0], { d: 0.9 }), M("b", Q[1], { d: 0.9 })),
            P(B("x", "p", "relance"), M("a", [-3.0, 4.0], { d: 1.2 }), M("b", Q[0], { d: 0.8 }), M("c", Q[1], { d: 0.8 }), M("d", Q[2], { d: 0.8 }))
          ]);
          s.etape("Attaque vers le poste 6", "Passe en bout de filet, puis attaque du bout de filet vers le poste 6.", [
            P(B("x", "f", "passe"), M("a", [-2.6, 2.4], { d: 0.9 })),
            S("f"), B("x", "b", "attaque")
          ]);
          s.etape("Défendre haut vers le centre", "Le poste 6 défend haut et vers le centre, pour relancer jouable au passeur. Puis il suit son ballon.", [
            P(B("x", "p", "defense", { h: 1.15 }), file("f", 4, 3), M("a", A4, { d: 0.8, delai: 0.6 }), M("b", [-3.0, 5.0], { d: 1.2, delai: 0.3 }))
          ]);
          s.etape("Palier : attaque ou bidouille", "Si ça marche bien, l'ailier varie : attaque ou bidouille. Le poste 6 doit lire.", [
            P(B("x", "e", "passe"), M("b", [-2.6, 6.6], { d: 0.9 }), M("c", Q[0], { d: 0.8 }), M("d", Q[1], { d: 0.8 })),
            S("e"),
            P(FL("e", Q[0], "attaque"), M("c", [-4.2, 5.4], { d: 0.8 }), B("x", "c", "bidouille", { tenu: true })), PT("c", "Lu !")
          ]);
        }
      },

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Enchaînement de ballons aux ailes",
        dispositif: "sur deux terrains : 1 serveur, 2 récep, 1 passeur avec un ballon dans la main, 1 central au bloc, 1 ailier au bloc, 1 pointu à l'attaque.",
        texte: [
          "Service sur tout le terrain, ou sur 2/3 du terrain.",
          "Service › récep › passe et attaque contre zéro bloc. Le passeur lance ensuite son ballon sur le libéro › relance › passe, et le même attaquant enchaîne contre le bloc formé."
        ],
        tableau: {
          tetes: ["Palier", "Ballon de récep", "Ballon de relance"],
          lignes: [
            ["Base", "Passe en 2, contre zéro bloc", "Le même attaquant enchaîne, contre bloc formé"],
            ["Plan B · 1", "Passe en 4, sur le joueur sans bloqueur", "Contre le bloc"],
            ["Plan B · 2", "Passe en 2, sur le joueur sans bloqueur", "Passe en 4, contre bloc à 2"]
          ]
        },
        enjeu: { label: "Règle", texte: "les ballons ne sont joués que si l'attaque est bloquée, puis soutenue." },
        plus: [
          ["Selon la réussite", "la base fonctionne, on continue ; plan B si l'enchaînement ne marche pas."],
          ["Fin d'exo", "le passeur est libre de son choix de passe : le bloc doit savoir s'il bloque en 2 ou en 4 sur la 2e balle."],
          ["Suggestion", "un groupe de l'exo 3 par terrain (6 et 7 joueurs), le coach au service sur le terrain à 6."],
          ["Bloc", "le central annonce la passe (« 2 ! » / « 4 ! ») dès qu'il la lit, l'ailier ferme à côté de lui."],
          ["Soutien", "en arc de cercle sous l'attaquant dès la passe : un ballon contré non soutenu fait perdre la série."]
        ],
        valider: "L'animation montre la base, sur un terrain. Les plans B du tableau ne sont pas animés : ils demandent un attaquant en 4, que le dispositif écrit ne nomme pas.",
        scene: function (s) {
          const REP = EX.REP;
          const ELAN = [-3.4, 8.2];
          s.j("p", REP.passeur, "P", "a");
          s.j("r", [-5.6, 2.6], "R", "a");
          s.j("l", [-5.8, 6.2], "L", "a", { lib: true });
          s.j("po", ELAN, "Po", "a");
          s.j("sv", [10.2, 6.5], "S", "b");
          s.j("bc", [0.9, 4.5], "C", "b");
          s.j("ba", [0.9, 7.4], "R4", "b");
          s.ballon("x1", "sv").ballon("x2", "p");
          s.etape("Mise en place", "1 serveur, 2 réceptionneurs, 1 passeur avec un ballon dans la main, 1 pointu à l'attaque. En face : 1 central et 1 ailier au bloc.", [W(0.6)]);
          s.chapitre("Ballon de récep");
          s.etape("Service, réception", "Service sur tout le terrain, ou sur les 2/3. La réception monte sur le passeur.", [
            B("x1", "r", "service"), B("x1", "p", "recep")
          ]);
          s.etape("Passe en 2, zéro bloc", "Passe en 2 : le pointu attaque contre zéro bloc.", [
            P(M("po", REP.att2, { d: 0.95 }), B("x1", "po", "passe")),
            S("po"), B("x1", [6.2, 3.6], "attaque", { sol: true })
          ]);
          s.chapitre("Ballon de relance");
          s.etape("Le passeur lance son ballon", "Tout de suite après, le passeur lance son ballon sur le libéro, qui relance.", [
            X("x1"),
            P(M("po", ELAN, { d: 0.9 }), B("x2", "l", "lancer")),
            B("x2", "p", "relance")
          ]);
          s.etape("Le même attaquant, bloc formé", "Le même attaquant enchaîne. Cette fois le bloc est formé : le central annonce, l'ailier ferme.", [
            P(
              M("po", REP.att2, { d: 0.95 }), B("x2", "po", "passe"), D("bc", "2 !"),
              M("bc", [0.75, 6.65], { d: 0.7, delai: 0.3 }), M("ba", [0.75, 7.9], { d: 0.5, delai: 0.4 }),
              M("l", [-2.6, 7.5], { d: 0.9, delai: 0.2 }), M("r", [-3.3, 5.4], { d: 1.0, delai: 0.2 })
            ),
            P(S("po"), BL(["bc", "ba"])), B("x2", [-0.2, 7.7], "attaque", { d: 0.2 })
          ]);
          s.etape("Bloquée, puis soutenue", "Le ballon n'est joué que si l'attaque est bloquée, puis soutenue : soutien en arc de cercle sous l'attaquant.", [
            B("x2", "l", "rebond", { d: 0.55 }), PT("l", "Soutenu !"), B("x2", "p", "defense", { h: 1.1, tenu: true })
          ]);
          s.chapitre("Suite");
          s.etape("Plans B et fin d'exo", "Si l'enchaînement ne marche pas : plans B du tableau. En fin d'exo le passeur est libre : le bloc doit lire 2 ou 4.", [
            P(M("po", ELAN), M("l", [-5.8, 6.2]), M("r", [-5.6, 2.6]), M("bc", [0.9, 4.5]), M("ba", [0.9, 7.4])),
            P(FL("p", [-0.9, 1.35], "en 4 ?"), FL("p", REP.att2, "en 2 ?")), W(1.0)
          ]);
        }
      },

      {
        id: "exo3",
        n: "Exo 3",
        titre: "Sets quasi libres de 25",
        dispositif: "6 contre 7 : au moins 2 sets quasi libres de 25, pour s'habituer à jouer à fond tout un match.",
        enjeu: { label: "Point double", texte: "l'équipe qui défend le side-out et gagne la contre-attaque marque 2 points." },
        cle: "Jouer à fond tout le set, du premier au dernier point.",
        plus: [
          ["Côté à 7", "un joueur sort à chaque rotation et rentre au service, pour que tout le monde joue les deux sets."],
          ["Fin de set", "noter l'écart à 20 points et le score final de chaque set : c'est la fin de set qu'on veut voir tenir."],
          ["Points doubles", "les compter par équipe : ils montrent qui défend le side-out jusqu'au bout."]
        ],
        compo: "groupe 1 : 6 joueurs. Groupe 2 : 7 joueurs.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a", { depart: { p: [-10.2, 7.0] } });
          const six = EX.equipe(s, "B", "b", { pre: "s", depart: "recep" });
          s.j("j7", [5.0, 10.3], 7, "b", { nom: "7e joueur" });
          s.ballon("x", "ap");
          s.etape("Mise en place", "6 contre 7, sets de 25. Côté à 7, un joueur sort à chaque rotation et rentre au service.", [W(0.6)]);
          s.chapitre("Le point double");
          s.etape("Service, side-out", "L'équipe blanche reçoit et construit son side-out.", [
            B("x", "sl", "service"),
            P(M("sp", six.pt(EX.REP.passeur), { d: 0.9 }), B("x", "sp", "recep"), M("ap", [-5.6, 7.4], { d: 1.1 }))
          ]);
          s.etape("Side-out défendu", "L'équipe orange défend le side-out : bloc en place, défense haute.", [
            P(six.passe("x", "4"), T.vers("def4", { d: 0.9 })),
            T.bloc("4"), B("x", "al", "attaque"),
            P(M("ap", EX.REP.passeur, { d: 1.1 }), M("ac", [-2.6, 4.3], { d: 0.8 }), B("x", "ap", "defense", { h: 1.15 }))
          ]);
          s.etape("Contre-attaque gagnée : 2 points", "Elle gagne la contre-attaque : point double.", [
            P(T.passe("x", "4"), six.vers("def4", { d: 0.9 })),
            six.bloc("4"), B("x", [7.6, 7.8], "attaque", { sol: true }), PT([6.6, 7.4], "+2")
          ]);
          s.chapitre("Le reste du set");
          s.etape("Jouer à fond jusqu'au bout", "Tous les autres points valent 1. On note l'écart à 20 et le score final : c'est la fin de set qu'on veut voir tenir.", [
            X("x"), P(T.vers("base"), six.vers("base")), W(0.4)
          ]);
        }
      }
    ]
  });
})();

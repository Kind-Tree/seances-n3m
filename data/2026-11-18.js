/* Séance N3M du mercredi 18/11/2026 — 12 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, D, PT, A, X, F, FL } = N3M.a;
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-11-18",
    jour: "Mercredi",
    date: "18/11/2026",
    joueurs: 12,
    axes: ["Bloc / gamme de passe", "Service / réception", "Side-out", "Opposition scorée"],
    blocs: [
      EX.passeEtSuitCarre({ bloc: { texte: ["Palier : d'abord que manchette, puis que dix doigts, puis essai avec ballon en diagonale."] } }),
      EX.jeuManchette({
        variante: "deuxTouchesTape",
        attente: 4,
        bloc: {
          titre: "Match manchette par 2",
          texte: ["Match manchette par 2, en 2 touches de balle : devoir taper la main de son coéquipier avant le second contact de balle."],
          valider: "Lecture retenue : celui qui va jouer la 2e touche vient taper la main de celui qui a fait la 1re, puis joue de l'autre côté. 8 joueurs sur deux petits terrains, 4 en attente."
        }
      }),

      EX.gammePasseBloc({
        lanceur: "libero",
        annonce: true,
        bloc: {
          id: "exo1",
          n: "Exo 1",
          titre: "Travail de bloc + gamme de passe",
          dispositif: "d'un côté, un libéro envoie des relances en continu au passeur, qui fait des gammes de passe en 4 et en 2. En face, le bloc essaie de suivre.",
          plus: [
            ["Palier", "ajout d'un second ballon pour accélérer le rythme."],
            ["Bloc", "le central lit la passe et l'annonce, l'ailier vient fermer à côté de lui, comme le 13/11 : on vise un bloc à 2 collé sur l'aile, mains au-dessus du filet."],
            ["Défi", "compter les blocs fermés à 2 sur une série de 10 passes : record à battre avant d'ajouter le second ballon."],
            ["Habitude", "garder ce créneau de bloc d'une dizaine de minutes à chaque séance."]
          ],
          valider: "J'ai repris la gamme de passe avec bloc du 18/09 et du 07/10, sans coach : le libéro relance lui-même, le caddie à côté de lui. En face, un central et deux ailiers ; les autres tournent. À corriger si le bloc est composé autrement."
        }
      }),

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Travail de service / réception",
        dispositif: "1 réceptionneur + 1 libéro par terrain, un passeur, le reste au service (3 de chaque côté).",
        texte: ["Enchaînement de services sur tout le terrain, au choix : 2 joueurs qui couvrent tout le terrain, ou 3 récep et seulement 2 serveurs."],
        cle: "Enchaîner les services, pas de double faute.",
        plus: [
          ["Palier", "passer à 2 récep + un central ou un pointu qui vient attaquer."],
          ["Zone", "zone annoncée avant chaque service : le serveur prend son risque sur la zone, pas sur la force."],
          ["Suivi", "feuille simple par réceptionneur : + / = / – sur 10 réceptions, à comparer d'une séance à l'autre."]
        ],
        valider: "Les deux cases de la fiche sont animées comme deux options : 2 joueurs qui couvrent tout le terrain, puis 3 récep et 2 serveurs (un serveur de chaque côté vient en réception). Les serveurs sont notés S. Au palier, c'est ce même joueur qui vient attaquer : j'ai montré une fixe du central, avec l'option du pointu en 2.",
        scene: function (s) {
          const q = N3M.geo.camp("B");
          const REP = EX.REP;
          s.j("ap", REP.passeur, "P", "a");
          s.j("ar", [-5.6, 2.6], "R4", "a");
          s.j("al", [-5.6, 6.4], "L", "a", { lib: true });
          s.j("bp", q(-0.9, 6.0), "P", "b");
          s.j("br", q(-5.6, 2.6), "R4", "b");
          s.j("bl", q(-5.6, 6.4), "L", "b", { lib: true });
          [1.5, 4.5, 7.5].forEach((y, i) => {
            const n = i + 1;
            s.j("sa" + n, [-10.4, y], "S", "a");
            s.j("sb" + n, q(-10.4, y), "S", "b");
            s.ballon("xa" + n, "sa" + n).ballon("xb" + n, "sb" + n);
          });
          s.etape("Mise en place", "De chaque côté : 1 réceptionneur et 1 libéro, 1 passeur au filet, 3 joueurs au service.", [W(0.6)]);

          s.chapitre("2 joueurs couvrent tout le terrain");
          s.etape("Service sur tout le terrain", "Un réceptionneur et un libéro couvrent tout le terrain à deux. La réception monte sur le passeur.", [
            B("xa1", "br", "service"), B("xa1", "bp", "recep", { tenu: true })
          ]);
          s.etape("Les services s'enchaînent", "Ça sert des deux côtés, sans temps mort. À deux, celui qui annonce prend le ballon.", [
            B("xb1", "al", "service"), B("xb1", "ap", "recep", { tenu: true }),
            X("xa1"),
            P(M("bl", [6.8, 4.3], { d: 0.8 }), D("bl", "J'ai !"), B("xa2", "bl", "service")),
            B("xa2", "bp", "recep", { tenu: true })
          ]);
          s.etape("Zone annoncée, pas de double faute", "Le serveur annonce sa zone : il prend son risque sur la zone, pas sur la force. On enchaîne les services, pas de double faute.", [
            D("sb2", "Zone 1 !"), W(0.6), X("xb1"),
            P(M("al", [-7.2, 7.0], { d: 0.8 }), B("xb2", "al", "service")),
            B("xb2", "ap", "recep", { tenu: true })
          ]);

          s.chapitre("3 récep, 2 serveurs");
          s.etape("3 réceptionneurs, 2 serveurs", "Autre option : un serveur de chaque côté vient en réception. 3 réceptionneurs, et seulement 2 serveurs.", [
            X("xa3"), X("xb3"), X("xa2"), X("xb2"),
            P(
              M("sa3", [-5.4, 7.1]), M("ar", [-5.4, 1.9]), M("al", [-6.4, 4.5]),
              M("sb3", q(-5.4, 7.1)), M("br", q(-5.4, 1.9)), M("bl", q(-6.4, 4.5))
            ),
            A("xa1", "sa1"), W(0.4), B("xa1", "sb3", "service"), B("xa1", "bp", "recep", { tenu: true })
          ]);

          s.chapitre("Palier");
          s.etape("Palier : 2 récep + un attaquant", "On repasse à 2 réceptionneurs. Le troisième, un central ou un pointu, vient attaquer.", [
            X("xa1"),
            P(
              M("sa3", [-2.6, 4.3]), M("ar", [-5.6, 2.6]), M("al", [-5.6, 6.4]),
              M("sb3", q(-2.6, 4.3)), M("br", q(-5.6, 2.6)), M("bl", q(-5.6, 6.4))
            ),
            W(0.3)
          ]);
          s.etape("Service, réception, attaque", "Le service arrive, la réception monte, et l'attaquant enchaîne. Ici, le central sur une fixe.", [
            A("xb1", "sb1"), W(0.4), B("xb1", "ar", "service"), B("xb1", "ap", "recep"),
            P(M("sa3", [-0.85, 4.3], { d: 0.75 }), B("xb1", "sa3", "passe", { d: 0.8 }), FL("ap", REP.att2, "ou le pointu, en 2")),
            S("sa3"), B("xb1", [7.9, 4.6], "attaque", { sol: true }), PT([7.9, 4.6], "Side-out !")
          ]);
        }
      },

      {
        id: "exo3a",
        n: "Exo 3a",
        titre: "Prépa opposition",
        dispositif: "quelques minutes de chauffe d'attaque classique en 4 et en 2.",
        valider: "Chauffe classique retenue : l'attaquant lance au passeur, attaque, récupère son ballon et change de file. Un groupe de 6 est animé ; l'autre fait la même chose de son côté du filet.",
        scene: function (s) {
          const REP = EX.REP;
          s.j("p", REP.passeur, "P", "a");
          s.j("a1", [-3.6, 1.0], 1, "a");
          s.j("a2", [-5.0, 1.0], 2, "a");
          s.j("a3", [-6.4, 1.0], 3, "a");
          s.j("b1", [-3.4, 8.2], 4, "a");
          s.j("b2", [-4.8, 8.2], 5, "a");
          s.ballon("x1", "a1").ballon("x2", "b1").ballon("x3", "a2");
          s.etape("Mise en place", "Chauffe d'attaque classique : un passeur, une file en 4 et une file en 2. Chaque groupe attaque de son côté du filet.", [W(0.6)]);
          s.etape("Attaque en 4", "L'attaquant lance au passeur, prend son élan et attaque en 4. Puis il récupère son ballon et change de file.", [
            B("x1", "p", "lancer"),
            P(M("a1", REP.att4, { d: 0.95 }), B("x1", "a1", "passe")),
            S("a1"), B("x1", [6.4, 6.6], "attaque", { sol: true }),
            P(M("a1", [-6.2, 8.2]), M("a2", [-3.6, 1.0], { delai: 0.3 }), M("a3", [-5.0, 1.0], { delai: 0.3 }))
          ]);
          s.etape("Attaque en 2", "Même chose de l'autre côté : lancer, passe, attaque en 2.", [
            X("x1"), B("x2", "p", "lancer"),
            P(M("b1", REP.att2, { d: 0.95 }), B("x2", "b1", "passe")),
            S("b1"), B("x2", [6.4, 2.4], "attaque", { sol: true }),
            P(M("b1", [-6.4, 1.0]), M("b2", [-3.4, 8.2], { delai: 0.3 }), M("a1", [-4.8, 8.2], { delai: 0.3 }))
          ]);
          s.etape("On monte l'intensité", "Quelques minutes, en appuyant de plus en plus, avant de passer à l'opposition.", [
            X("x2"), B("x3", "p", "lancer"),
            P(M("a2", REP.att4, { d: 0.95 }), B("x3", "a2", "passe")),
            S("a2"), B("x3", [7.2, 5.6], "attaque", { sol: true }), PT([7.2, 5.6], "Prêts !")
          ]);
        }
      },

      {
        id: "exo3b",
        n: "Exo 3b",
        titre: "Opposition avec bonification",
        dispositif: "opposition à 6 contre 6 : travailler des situations avec bonification.",
        tableau: {
          tetes: ["Situation", "Points"],
          lignes: [
            ["Side-out direct (après la première réception)", "+2"],
            ["Ace", "+2"],
            ["Ballon rendu", "–1"],
            ["Ballon pas touché en défense", "–1"]
          ]
        },
        plus: [
          ["Tableau", "un joueur hors du terrain tient le tableau des bonus par équipe : side-outs directs, aces, ballons rendus, ballons pas touchés."],
          ["Défense", "ballon pas touché en défense : il compte aussi derrière le bloc, pour obliger les défenseurs à se placer sur la ligne et la diagonale, et à aller au sol."],
          ["Six type", "mettre le six type ensemble le plus souvent possible, pour créer des automatismes."]
        ],
        valider: "Les quatre situations sont montrées l'une après l'autre, avec des exemples d'attaques. « Ballon rendu » : lu comme un ballon qui repasse le filet sans attaque. À 12 joueurs en 6 contre 6, personne n'est hors du terrain pour tenir le tableau : à organiser.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a", { depart: "recep" });
          const K = EX.equipe(s, "B", "b", { pre: "k" });
          const REP = EX.REP;
          const SERVICE = K.pt(-10.2, 7.0);
          s.ballon("x1", null).ballon("x2", null).ballon("x3", null);
          s.etape("Mise en place", "Opposition à 6 contre 6. Quatre situations rapportent ou coûtent des points en plus.", [W(0.6)]);

          s.chapitre("Side-out direct · +2");
          s.etape("Service, réception", "Les blancs servent, les orange reçoivent.", [
            M("kp", SERVICE, { d: 1.1 }), A("x1", "kp"), W(0.4), B("x1", "al", "service"),
            P(M("ap", REP.passeur, { d: 0.8 }), B("x1", "ap", "recep"))
          ]);
          s.etape("Side-out direct", "Le point est fait dès la première réception : side-out direct, +2.", [
            P(T.passe("x1", "4"), K.vers("def4", { d: 0.9 })),
            K.bloc("4"), B("x1", [7.6, 7.8], "attaque", { sol: true }), PT([7.6, 7.8], "+2")
          ]);

          s.chapitre("Ace · +2");
          s.etape("Ace", "Service gagnant : le ballon tombe sans être touché. Ace, +2.", [
            X("x1"),
            P(T.vers("recep", { d: 1.0 }), K.vers("base", { d: 1.0 })),
            M("kp", SERVICE, { d: 1.0 }), A("x2", "kp"), W(0.4),
            P(B("x2", [-6.1, 5.85], "service", { sol: true }), M("al", [-6.35, 5.0], { d: 0.45, delai: 0.9 }), M("ar2", [-5.5, 6.65], { d: 0.45, delai: 0.9 })),
            PT([-6.1, 5.85], "Ace : +2")
          ]);

          s.chapitre("Ballon rendu · –1");
          s.etape("Réception difficile", "Nouveau service. La réception reste loin du filet : pas d'attaque possible.", [
            X("x2"),
            P(M("al", [-6.4, 4.5], { d: 0.5 }), M("ar2", [-5.4, 7.1], { d: 0.5 })),
            A("x3", "kp"), W(0.4), B("x3", "ar1", "service"),
            P(M("ap", [-4.6, 5.5], { d: 0.9 }), B("x3", "ap", "recep"), M("kp", K.pt(-5.6, 7.4), { d: 1.2 }))
          ]);
          s.etape("Ballon rendu", "Le ballon repasse le filet sans attaque : ballon rendu, –1.", [
            B("x3", "ar2", "transi"),
            P(B("x3", "kr2", "manchette"), K.vers("elan", { d: 1.0 })),
            PT("ar2", "Rendu : –1")
          ]);

          s.chapitre("Ballon pas touché en défense · –1");
          s.etape("Les blancs contre-attaquent", "Ballon facile pour les blancs : ils construisent. Les orange se placent en bloc-défense.", [
            B("x3", "kp", "recep"),
            P(K.passe("x3", "4"), T.vers("def4", { d: 0.9 })),
            T.bloc("4")
          ]);
          s.etape("Ballon pas touché", "Le ballon tombe derrière le bloc sans être touché : –1. Les défenseurs se placent sur la ligne et la diagonale, et vont au sol.", [
            B("x3", [-2.4, 7.0], "bidouille", { sol: true }),
            F("ap"), F("ar1"), PT([-2.4, 7.0], "Pas touché : –1")
          ]);

          s.chapitre("Le tableau des bonus");
          s.etape("Tenir le tableau", "Un joueur tient le tableau des bonus par équipe : side-outs directs, aces, ballons rendus, ballons pas touchés.", [
            X("x3"), P(T.vers("base"), K.vers("base")), W(0.4)
          ]);
        }
      }
    ]
  });
})();

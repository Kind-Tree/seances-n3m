/* Séance N3M du vendredi 27/11/2026 — 12 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, D, PT, X, FL } = N3M.a;
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-11-27",
    jour: "Vendredi",
    date: "27/11/2026",
    joueurs: 12,
    axes: ["Défense / transition", "Relation passe-attaque", "Jeu au centre", "Bloc-défense en opposition"],
    blocs: [
      EX.passeEtSuit({
        groupes: 4,
        bloc: {
          titre: "Passe et suit par-dessus le filet",
          texte: ["Déverrouillage physique jusqu'aux premières touches de balle, puis passe et suit par-dessus le filet."],
          valider: null
        }
      }),
      EX.jeuManchette({
        variante: "deuxTouchesTape",
        attente: 4,
        bloc: {
          titre: "Match manchette par 2",
          texte: ["Match manchette par 2, en 2 touches de balle : devoir taper la main de son coéquipier avant le second contact de balle."],
          valider: "Lecture retenue, comme le 18/11 : celui qui va jouer la 2e touche vient taper la main de celui qui a fait la 1re, puis joue de l'autre côté. 8 joueurs sur deux petits terrains, 4 en attente."
        }
      }),

      EX.circuitTransition({
        mire: true,
        bloc: {
          id: "exo1",
          n: "Exo 1",
          titre: "Défense / passe de transi",
          dispositif: "circuit attaque › défense › passe de transi › attaque. 6 joueurs par demi-terrain : 2 attaquants au filet, 1 défenseur, 1 joueur à la transition, 2 en attente.",
          texte: ["Objectif : bosser nos attitudes en défense et sur les contacts compliqués."],
          cle: "Bas sur les appuis, ballon haut : cible cœur de terrain.",
          plus: [
            ["Palier", "les deux premières attaques peuvent être enroulées, mais on doit commencer à mettre du poids dans sa balle."],
            ["Défense", "être bas sur les appuis et chercher la hauteur."],
            ["Passe de transi", "rigueur, s'orienter vers le bout de filet, chercher avant la mire, à 1 mètre du filet."],
            ["Défi", "matérialiser la cible cœur de terrain et la mire de la passe de transi (plot à 1 m du filet) : on compte les ballons qui y arrivent sur une série de 10, record à battre."],
            ["Frappes lourdes", "y passer dès que le groupe tient 7 défenses sur 10 dans la cible."]
          ],
          valider: "J'ai repris le circuit défense / transition du 18/09 : 6 par demi-terrain, attaque du poste 2 sur le poste 5, défense cœur de terrain, passe de transition du poste 1 vers le poste 4. Les plots marquent la mire, à 1 m du filet. À corriger si le circuit tourne autrement."
        }
      }),

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Relation passe-attaque + enchaînement au centre",
        dispositif: "12 joueurs, deux côtés organisés différemment. Au choix : central sur le terrain, ou central en attente.",
        tableau: {
          tetes: ["Côté", "Joueurs", "Travail"],
          lignes: [
            ["Côté 1", "1 passeur, 1 central, 3 en défense", "Le central doit faire 4-5 attaques d'affilée et se trouver avec le passeur."],
            ["Côté 2", "3 défenseurs, 1 passeur, 2 bouts de filet hors du terrain", "Les bouts de filet envoient des attaques par-dessus le filet."]
          ]
        },
        texte: [
          "1 · Première attaque par-dessus le filet, forte, sur l'un des trois défenseurs : on remonte comme on peut, puis enchaînement à l'attaque en 2 ou en 4.",
          "2 · Après la passe, bidouille en face pour permettre un premier contact facile et l'enchaînement au centre.",
          "3 · L'autre bout de filet enchaîne à l'opposé, même schéma."
        ],
        plus: [
          ["Appel", "le central annonce son appel au passeur avant chaque ballon (fixe, fixe arrière, déca)."],
          ["Compter", "les attaques du central gagnées sur sa série de 4-5 : on change de central après chaque série."],
          ["Ballon remonté", "même exigence que dans l'exo 1 : haut et dans le cœur du terrain."]
        ],
        valider: "Lecture retenue, corrigée par le coach le 27/11 : les bouts de filet (pions blancs « BF ») sont hors du terrain, en face, et attaquent dans le terrain du central. Les orange remontent le ballon et attaquent en 4 ou en 2. Les blancs défendent, reconstruisent, et leur dernier contact est une bidouille pour les orange : premier contact facile, et le central attaque. J'ai fait jouer la bidouille par un défenseur blanc venu au filet ; à corriger si c'est un bout de filet qui la joue. Un central joue, l'autre attend.",
        scene: function (s) {
          s.zone("coeurA", { x: -4.3, y: 4.5, r: 1.3 }, { label: "cœur de terrain" });
          // Côté 1 (orange) : passeur, central, 3 défenseurs ; un central en attente.
          s.j("ap", [-0.9, 6.0], "P", "a");
          s.j("ac", [-2.6, 4.3], "C", "a");
          s.j("a5", [-6.2, 1.9], "D", "a");
          s.j("a6", [-7.4, 4.5], "D", "a");
          s.j("a1", [-6.2, 7.1], "D", "a");
          s.j("cw", [-4.0, 10.3], "C", "c", { nom: "attente" });
          // Côté 2 (blanc) : passeur, 3 défenseurs, et 2 bouts de filet hors du terrain, qui attaquent chez le central.
          s.j("bp", [0.9, 3.0], "P", "b");
          s.j("bd1", [6.2, 7.1], "D", "b");
          s.j("bd2", [7.4, 4.5], "D", "b");
          s.j("bd3", [6.2, 1.9], "D", "b");
          s.j("f1", [1.0, -0.9], "BF", "b");
          s.j("f2", [1.0, 9.9], "BF", "b");
          s.ballon("x1", "f1").ballon("x2", "f2");
          s.etape("Mise en place", "Côté orange : 1 passeur, 1 central, 3 défenseurs. En face : 3 défenseurs, 1 passeur, et 2 bouts de filet hors du terrain, qui attaquent par-dessus le filet dans le terrain du central.", [W(0.6)]);

          s.chapitre("Ballon 1");
          s.etape("Attaque forte par-dessus le filet", "Un bout de filet attaque fort, par-dessus le filet, sur l'un des trois défenseurs.", [
            S("f1"), B("x1", "a6", "attaque")
          ]);
          s.etape("On remonte comme on peut", "Le ballon est remonté haut, dans le cœur du terrain : même exigence que dans l'exo 1. Le passeur vient dessous.", [
            P(M("ap", [-3.9, 5.3], { d: 0.8 }), B("x1", "ap", "defense", { h: 1.1 }))
          ]);
          s.etape("Attaque en 4 ou en 2", "Le passeur sert un défenseur, qui enchaîne à l'attaque en 4 ou en 2, sur les blancs.", [
            P(M("a5", [-0.9, 1.35], { d: 1.2 }), B("x1", "a5", "transi"), FL("ap", [-0.9, 7.65], "ou en 2")),
            S("a5"), B("x1", "bd2", "attaque")
          ]);
          s.etape("Les blancs reconstruisent", "Les blancs défendent et reconstruisent. Leur dernier contact est une bidouille pour les orange : un premier contact facile.", [
            P(M("bp", [2.8, 3.6], { d: 0.8 }), B("x1", "bp", "defense", { h: 1.1 }), M("a5", [-6.2, 1.9], { d: 1.3 }), M("ap", [-0.9, 6.0], { d: 1.0 })),
            P(M("bd1", [1.2, 7.4], { d: 1.1 }), B("x1", "bd1", "transi")),
            P(M("a1", [-3.4, 6.7], { d: 0.7 }), B("x1", "a1", "bidouille"))
          ]);
          s.etape("Enchaînement au centre", "Le central annonce son appel au passeur avant chaque ballon : fixe, fixe arrière ou déca. Il doit se trouver avec son passeur.", [
            P(
              [D("ac", "Fixe !"), B("x1", "ap", "recep"),
                P(M("ac", [-0.85, 4.3], { d: 0.75 }), B("x1", "ac", "passe", { d: 0.8 })),
                S("ac"), B("x1", "bd3", "attaque"), PT("bd3", "Défendu !")],
              M("bp", [0.9, 3.0], { d: 1.0 }),
              M("bd1", [6.2, 7.1], { d: 1.2 })
            )
          ]);

          s.chapitre("Ballon 2 · à l'opposé");
          s.etape("L'autre bout de filet", "L'autre bout de filet enchaîne à l'opposé, même schéma : attaque forte, ballon remonté, attaque à l'aile sur les blancs.", [
            X("x1"),
            P(M("ac", [-2.6, 4.3], { d: 0.8 }), M("a1", [-6.2, 7.1], { d: 0.9 })),
            S("f2"), B("x2", "a1", "attaque"),
            P(M("ap", [-3.9, 4.0], { d: 0.8 }), B("x2", "ap", "defense", { h: 1.1 })),
            P(M("a1", [-0.9, 7.65], { d: 1.2 }), B("x2", "a1", "transi")),
            S("a1"), B("x2", "bd1", "attaque")
          ]);
          s.etape("Reconstruction, bidouille", "Même chose en face : défense, passe, et une bidouille en dernier contact pour les orange.", [
            P(M("bp", [2.8, 5.2], { d: 0.8 }), B("x2", "bp", "defense", { h: 1.1 }), M("a1", [-6.2, 7.1], { d: 1.3 }), M("ap", [-0.9, 6.0], { d: 1.0 })),
            P(M("bd3", [1.2, 1.6], { d: 1.1 }), B("x2", "bd3", "transi")),
            P(M("a5", [-3.4, 2.3], { d: 0.7 }), B("x2", "a5", "bidouille"))
          ]);
          s.etape("Nouvel appel du central", "Premier contact facile, et le central enchaîne sur un autre appel. Il fait 4-5 attaques d'affilée.", [
            P(
              [D("ac", "Déca !"), B("x2", "ap", "recep"),
                P(M("ac", [-0.9, 3.3], { d: 0.85 }), B("x2", "ac", "passe", { d: 0.9 })),
                S("ac"), B("x2", [5.0, 6.2], "attaque", { sol: true }), PT([5.0, 6.2], "Gagnée !")],
              M("bp", [0.9, 3.0], { d: 1.0 }),
              M("bd3", [6.2, 1.9], { d: 1.2 })
            )
          ]);

          s.chapitre("Fin de série");
          s.etape("On change de central", "On compte les attaques gagnées du central sur sa série, puis le central en attente prend sa place.", [
            X("x2"),
            P(M("a5", [-6.2, 1.9]), M("ac", [-5.8, 10.3], { d: 1.6 }), M("cw", [-2.6, 4.3], { d: 1.4 }))
          ]);
        }
      },

      {
        id: "exo3",
        n: "Exo 3",
        titre: "Opposition dirigée",
        dispositif: "6 contre 6, avec une équipe de match qui travaille sur des situations précises. Les points sont comptés.",
        tableau: {
          tetes: ["Ballon", "Mise en jeu", "Point travaillé"],
          lignes: [
            ["1 · Réception", "Service", "Chercher le side-out le plus logique"],
            ["2 · Retour direct", "Envoi d'un retour direct", "Mettre bloc / défense en place sur situation maximum en face"],
            ["3 · 2e contact", "2e contact de l'équipe bis", "Mettre bloc / défense en place sur situation mini"],
            ["4 · Attaque sur passeur", "Attaque sur le passeur de l'équipe 1", "Reconstruction + gestion de la faute"]
          ]
        },
        plus: [
          ["Situation maximum", "bloc à 2 sur l'option la plus probable, défenseurs sur la ligne et la diagonale."],
          ["Situation mini", "bloc lu, défense avancée sur la bidouille."],
          ["Score", "un joueur hors du terrain tient le score et note les side-outs réussis et les fautes directes de l'équipe 1, comme les bonus du 18/11."],
          ["Six type", "l'équipe de match : le six type, ensemble le plus souvent possible, pour créer des automatismes."]
        ],
        valider: "L'équipe de match est en orange, l'équipe bis en blanc ; le coach met en jeu les ballons 2, 3 et 4 depuis le bord du terrain. Ballon 2 : l'équipe de match renvoie un retour direct et l'équipe bis attaque avec toutes ses options. Ballon 3 : le ballon arrive sur le libéro de l'équipe bis, qui fait la 2e touche loin du filet. Les attaques montrées sont des exemples. À 12 joueurs en 6 contre 6, personne n'est hors du terrain pour tenir le score : à organiser.",
        scene: function (s) {
          EX.ballons(s, {
            intro: "6 contre 6. L'équipe de match, en orange, travaille 4 situations précises. Les points sont comptés.",
            phases: [
              { chapitre: "Ballon 1 · Réception", type: "service", pour: "A", pop: "Side-out !", etapes: [
                ["Service, réception", "L'équipe bis sert, l'équipe de match reçoit."],
                ["Le side-out le plus logique", "Bonne réception : on cherche le side-out le plus logique."]] },
              { chapitre: "Ballon 2 · Retour direct", type: "direct", pour: "B", en: "2", fin: "defendu", annonce: "En 2 !", etapes: [
                ["Retour direct", "L'équipe de match envoie un retour direct : en face, toutes les options sont ouvertes."],
                ["Situation maximum", "Bloc à 2 sur l'option la plus probable, défenseurs sur la ligne et la diagonale."]] },
              { chapitre: "Ballon 3 · 2e contact", type: "deuxieme", pour: "B", fin: "bidouille", pop: "Bidouille défendue !", etapes: [
                ["2e contact de l'équipe bis", "Le ballon arrive sur le 2e contact de l'équipe bis, loin du filet : peu d'options en face."],
                ["Situation mini", "Bloc lu, défense avancée sur la bidouille."]] },
              { chapitre: "Ballon 4 · Attaque sur passeur", type: "passeur", pour: "A", pop: "Reconstruit !", etapes: [
                ["Attaque sur le passeur", "Attaque sur le passeur de l'équipe de match : il défend, un autre joueur prend la passe."],
                ["Reconstruction", "Reconstruire sans le passeur, et gérer la faute : un ballon joué vaut mieux qu'un point donné."]] }
            ],
            fin: ["Tenir le score", "Un joueur hors du terrain tient le score : side-outs réussis et fautes directes de l'équipe de match.", "Le score"]
          });
        }
      }
    ]
  });
})();

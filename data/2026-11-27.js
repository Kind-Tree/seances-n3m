/* Séance N3M du vendredi 27/11/2026 — 12 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, D, PT, A, X, FL } = N3M.a;
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
        valider: "Lecture retenue, corrigée par le coach le 27/11 : les bouts de filet (pions blancs « BF ») sont hors du terrain, de l'autre côté du filet, et attaquent dans le terrain du central. Ballon 1 : attaque forte sur l'un des 3 défenseurs, ballon remonté dans le cœur du terrain, puis un défenseur enchaîne à l'attaque en 4 ou en 2. Ballon 2 : juste après, le bout de filet fait une bidouille par-dessus le filet ; premier contact facile, et le central attaque. En face, les 3 défenseurs et le passeur défendent. Un central joue, l'autre attend. À corriger si c'est un autre joueur qui attaque à l'aile, ou si la bidouille vient d'ailleurs.",
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
          s.ballon("x1", "f1").ballon("x2", "f2").ballon("y1", null).ballon("y2", null);
          s.etape("Mise en place", "Côté orange : 1 passeur, 1 central, 3 défenseurs. En face : 3 défenseurs, 1 passeur, et 2 bouts de filet hors du terrain, qui attaquent par-dessus le filet dans le terrain du central.", [W(0.6)]);

          s.chapitre("Ballon 1 · attaque forte");
          s.etape("Attaque forte par-dessus le filet", "Un bout de filet attaque fort, par-dessus le filet, sur l'un des trois défenseurs.", [
            S("f1"), B("x1", "a6", "attaque")
          ]);
          s.etape("On remonte comme on peut", "Le ballon est remonté haut, dans le cœur du terrain : même exigence que dans l'exo 1. Le passeur vient dessous.", [
            P(M("ap", [-3.9, 5.3], { d: 0.8 }), B("x1", "ap", "defense", { h: 1.1 }))
          ]);
          s.etape("Attaque en 4 ou en 2", "Le passeur sert un défenseur, qui enchaîne à l'attaque en 4 ou en 2. En face, ça défend.", [
            P(M("a5", [-0.9, 1.35], { d: 1.2 }), B("x1", "a5", "transi"), FL("ap", [-0.9, 7.65], "ou en 2")),
            S("a5"), B("x1", "bd2", "attaque"), PT("bd2", "Défendu !")
          ]);

          s.chapitre("Ballon 2 · bidouille");
          s.etape("Bidouille en face", "Juste après la passe, le bout de filet fait une bidouille par-dessus le filet : un premier contact facile.", [
            X("x1"), A("y1", "f1"), W(0.3),
            P(
              M("a6", [-3.6, 3.2], { d: 0.9 }), M("ap", [-0.9, 6.0], { d: 0.9 }), M("a5", [-6.2, 1.9], { d: 1.2 }),
              [W(0.2), B("y1", "a6", "bidouille")]
            )
          ]);
          s.etape("Enchaînement au centre", "Le central annonce son appel au passeur avant chaque ballon : fixe, fixe arrière ou déca. Il doit se trouver avec son passeur.", [
            D("ac", "Fixe !"), B("y1", "ap", "recep"),
            P(M("ac", [-0.85, 4.3], { d: 0.75 }), B("y1", "ac", "passe", { d: 0.8 })),
            S("ac"), B("y1", "bd3", "attaque"), PT("bd3", "Défendu !")
          ]);

          s.chapitre("À l'opposé");
          s.etape("L'autre bout de filet", "L'autre bout de filet enchaîne à l'opposé, même schéma : attaque forte, ballon remonté, attaque à l'aile.", [
            X("y1"),
            P(M("ac", [-2.6, 4.3], { d: 0.8 }), M("a6", [-7.4, 4.5], { d: 1.0 })),
            S("f2"), B("x2", "a1", "attaque"),
            P(M("ap", [-3.9, 4.0], { d: 0.8 }), B("x2", "ap", "defense", { h: 1.1 })),
            P(M("a1", [-0.9, 7.65], { d: 1.2 }), B("x2", "a1", "transi")),
            S("a1"), B("x2", "bd1", "attaque"), PT("bd1", "Défendu !")
          ]);
          s.etape("Bidouille, puis le central", "Bidouille en face, premier contact facile, et le central enchaîne sur un autre appel. Il fait 4-5 attaques d'affilée.", [
            X("x2"), A("y2", "f2"), W(0.3),
            P(
              M("a6", [-3.6, 5.8], { d: 0.9 }), M("ap", [-0.9, 6.0], { d: 0.9 }), M("a1", [-6.2, 7.1], { d: 1.2 }),
              [W(0.2), B("y2", "a6", "bidouille")]
            ),
            D("ac", "Déca !"), B("y2", "ap", "recep"),
            P(M("ac", [-0.9, 3.3], { d: 0.85 }), B("y2", "ac", "passe", { d: 0.9 })),
            S("ac"), B("y2", [4.8, 6.0], "attaque", { sol: true }), PT([4.8, 6.0], "Gagnée !")
          ]);

          s.chapitre("Fin de série");
          s.etape("On change de central", "On compte les attaques gagnées du central sur sa série, puis le central en attente prend sa place.", [
            X("y2"),
            P(M("a6", [-7.4, 4.5]), M("ac", [-5.8, 10.3], { d: 1.6 }), M("cw", [-2.6, 4.3], { d: 1.4 }))
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

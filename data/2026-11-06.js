/* Séance N3M du vendredi 06/11/2026 — 9 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, D, PT, A, X, F, FL } = N3M.a;
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-11-06",
    jour: "Vendredi",
    date: "06/11/2026",
    joueurs: 9,
    axes: ["Défense cœur de terrain", "Manip de balle", "Service / réception", "Jeu au centre"],
    blocs: [
      EX.passeEtSuit({ bloc: { texte: ["Déverrouillage dynamique, pour activer un peu le cardio."] } }),
      EX.jeuManchette({ variante: "simple", attente: 1, bloc: { texte: ["Jeu de la manchette simple."] } }),

      {
        id: "exo1",
        n: "Exo 1",
        titre: "Fondamentaux",
        dispositif: "2 groupes, chacun sur son côté du terrain, par groupe de 2. L'animation montre un camp ; l'autre groupe fait la même chose en face.",
        cle: "Relever la balle au cœur de terrain.",
        valider: "Lecture retenue : l'attaque part d'un coin de la ligne de fond vers le partenaire à l'autre coin du même camp, et c'est le frappeur qui fait la passe de transition. Le 3e défenseur est le joueur suivant du groupe.",
        scene: function (s) {
          s.cadre("A");
          s.zone("coeur", { x: -4.3, y: 4.5, r: 1.35 }, { label: "cœur de terrain" });
          s.banc(-9.6, 7.85, { long: 1.5 });
          s.note(-10.75, 7.85, "banc", { taille: 0.36 });
          s.j("j1", [-8.45, 7.85], 1, "a");
          s.j("j2", [-7.5, 1.3], 2, "a");
          s.j("j3", [-6.2, 4.4], 3, "a");
          s.j("f4", [-0.95, 1.2], 4, "b");
          s.j("f2", [-0.95, 7.8], 5, "b");
          s.ballon("b", "j1");
          s.etape("Mise en place", "Dans chaque camp : 2 joueurs en bout de filet (4 et 5) et le reste en fond de terrain.", [W(0.6)]);
          s.etape("Attaque du fond", "1 attaque pied au sol (ou debout sur un banc) depuis un bout de la ligne de fond, sur son pote à l'autre bout.", [
            S("j1"), B("b", "j2", "attaque")
          ]);
          s.etape("Défense cœur de terrain", "2 défend haut, vers le cœur du terrain. 1 vient sous le ballon.", [
            P(M("j1", [-4.75, 4.95], { d: 1.25 }), B("b", "j1", "defense"))
          ]);
          s.etape("Passe de transition", "1 fait la passe de transition en face de lui, vers un bout de filet : en 4 ou en 2.", [
            P(B("b", "f4", "transi"), FL("j1", "f2", "ou en 2"), M("j1", [-6.9, 7.4], { delai: 0.45 }))
          ]);
          s.etape("Renvoi du bout de filet", "Le joueur en bout de filet renvoie dans son camp, sans prévenir : bidouille, poussée forte ou fond de terrain.", [
            P(M("j2", [-3.9, 2.5], { d: 0.8 }), B("b", "j2", "bidouille"), FL("f4", [-5.0, 6.0], "poussée"), FL("f4", [-8.3, 2.6], "fond"))
          ]);
          s.etape("Relever cœur de terrain", "Les 3 défenseurs se battent pour relever ce ballon au cœur du terrain.", [
            P(M("j3", [-4.8, 4.75], { d: 0.8 }), B("b", "j3", "defense", { tenu: true })), PT("j3", "Relevé !")
          ]);
          s.etape("Groupe suivant", "Ballon relevé au cœur du terrain : passage au groupe suivant.", [W(0.5)]);
        }
      },

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Régularité / manip de balle",
        dispositif: "circuit d'attaque-défense. 2 par terrain : un défenseur qui enchaîne à l'attaque et un passeur. Au début, tout le monde tourne.",
        plus: [
          ["Impact", "on augmente l'impact au fur et à mesure."],
          ["Passeur", "tout le monde tourne au début ; à voir : passeur fixe au bout d'un moment."],
          ["Attaque", "en 4 ; à voir : enchaîner en 2 aussi."]
        ],
        valider: "Rotation animée : l'attaquant devient passeur de son camp, le passeur passe sous le filet et rejoint la défense d'en face. J'ai mis les joueurs en attente derrière le poste 6. Si vous jouez sur 2 terrains à 2 par camp, le passeur doit aller défendre tout de suite l'attaque de son partenaire.",
        scene: function (s) {
          s.zone("coeurA", { x: -4.3, y: 4.5, r: 1.3 }, { label: "cœur de terrain" });
          s.j("a1", [-6.6, 4.5], 1, "a");
          s.j("a2", [-1.0, 5.9], 2, "a");
          s.j("a3", [-10.0, 4.5], 3, "a");
          s.j("a4", [-11.1, 4.5], 4, "a");
          s.j("b1", [0.95, 7.65], 5, "b");
          s.j("b2", [6.6, 4.5], 6, "b");
          s.j("b3", [10.0, 4.5], 7, "b");
          s.j("b4", [11.1, 4.5], 8, "b");
          s.j("b5", [10.0, 5.8], 9, "b");
          s.ballon("x", "b1");
          s.etape("Mise en place", "2 joueurs actifs par camp : un défenseur en poste 6 et un passeur. Les autres attendent derrière.", [W(0.6)]);
          s.etape("Attaque d'en face", "On reçoit une attaque d'en face, partie du poste 4.", [
            S("b1"), B("x", "a1", "attaque")
          ]);
          s.etape("Défense haute", "Défense haute au cœur de terrain. Le passeur vient sous le ballon.", [
            P(M("a2", [-3.7, 4.95], { d: 1.1 }), B("x", "a2", "defense", { h: 1.1 }), M("b1", [0.95, 3.1], { d: 1.0 }))
          ]);
          s.etape("Passe en 4", "Passe en 4 : le défenseur enchaîne à l'attaque.", [
            P(M("a1", [-0.9, 1.35], { d: 1.2 }), B("x", "a1", "passe"))
          ]);
          s.etape("Attaque vers le poste 6", "Attaque en 4 vers le poste 6 en face.", [
            S("a1"), B("x", "b2", "attaque")
          ]);
          s.etape("On tourne", "L'attaquant va à la passe, le passeur va en face. Pendant ce temps, l'autre camp défend haut.", [
            P(
              M("a1", [-1.0, 5.9], { d: 1.2 }),
              [M("a2", [1.2, 8.55], { d: 1.3 }), M("a2", [9.3, 8.55], { d: 1.7 }), M("a2", [11.1, 5.8], { d: 0.8 })],
              M("a3", [-6.6, 4.5], { d: 1.2 }),
              M("a4", [-10.0, 4.5], { d: 0.8 }),
              M("b1", [3.7, 4.05], { d: 1.1 }),
              B("x", "b1", "defense", { h: 1.1 })
            )
          ]);
          s.etape("Même chose en face", "En face : passe en 4 puis attaque vers le poste 6, où le défenseur suivant est en place.", [
            P(M("b2", [0.9, 7.65], { d: 1.2 }), B("x", "b2", "passe")),
            S("b2"), B("x", "a3", "attaque")
          ]);
          s.etape("Et ça continue", "Même rotation en face, et le circuit ne s'arrête plus. On augmente l'impact au fur et à mesure.", [
            P(
              M("b2", [0.95, 3.1], { d: 1.2 }),
              [M("b1", [-1.2, 0.45], { d: 1.3 }), M("b1", [-9.3, 0.45], { d: 1.7 }), M("b1", [-11.1, 4.5], { d: 0.9 })],
              M("b3", [6.6, 4.5], { d: 1.2 }),
              M("b4", [10.0, 4.5], { d: 0.8 }),
              M("a1", [-3.7, 4.95], { d: 1.1 }),
              B("x", "a1", "defense", { h: 1.1 })
            )
          ]);
        }
      },

      {
        id: "exo3",
        n: "Exo 3",
        titre: "Service / récep → enchaînement",
        dispositif: "côté réception, 6 joueurs : 1 passeur, 3 réceptionneurs, 1 central, 1 pointu. Côté service, 3 joueurs : 2 R4 et l'autre central.",
        texte: ["Les services s'enchaînent. Passe au moins une fois au centre tous les 3 ballons."],
        tableau: {
          tetes: ["Règle", "Passage au sol si…"],
          lignes: [
            ["Centre", "le central ne peut pas attaquer car pas de récep : passage au sol pour les receps."],
            ["Service", "2 services loupés d'affilée."],
            ["Intervalles", "un ballon tombe entre les intervalles : passage au sol pour les deux joueurs qui l'ont laissé tomber."]
          ]
        },
        scene: function (s) {
          const T = EX.equipe(s, "A", "a", { depart: { p: [-0.9, 6.0], r1: [-5.4, 1.9], l: [-6.4, 4.5], r2: [-5.4, 7.1], c: [-1.3, 3.6], po: [-2.6, 8.3] } });
          s.j("s1", [10.2, 2.0], "R4", "b");
          s.j("s2", [10.2, 4.5], "R4", "b");
          s.j("s3", [10.2, 7.0], "C", "b");
          s.ballon("x1", "s1").ballon("x2", "s2").ballon("x3", "s3");
          s.etape("Mise en place", "6 côté réception : passeur, 3 réceptionneurs, central, pointu. 3 serveurs en face : les 2 R4 et l'autre central.", [W(0.6)]);
          s.chapitre("Ballon 1");
          s.etape("Service, réception", "Premier service. La réception monte sur le passeur.", [
            B("x1", "ar1", "service"), B("x1", "ap", "recep")
          ]);
          s.etape("Enchaînement", "Le passeur distribue, l'attaque part. Les services s'enchaînent.", [
            T.passe("x1", "4"), B("x1", [6.2, 6.4], "attaque", { sol: true }), X("x1")
          ]);
          s.chapitre("Ballon 2");
          s.etape("Service suivant", "Le serveur suivant envoie tout de suite. Bonne réception : le central peut attaquer.", [
            P(M("ar1", [-5.4, 1.9], { d: 0.9 }), B("x2", "al", "service", { delai: 0.5 })), B("x2", "ap", "recep")
          ]);
          s.etape("Passe au centre", "Au moins une passe au centre tous les 3 ballons.", [
            T.passe("x2", "fixe", { elan: 0.8 }), B("x2", [5.2, 2.6], "attaque", { sol: true }), X("x2")
          ]);
          s.chapitre("Ballon 3");
          s.etape("Service dans l'intervalle", "Le service arrive entre deux réceptionneurs. Personne ne le prend : le ballon tombe.", [
            P(M("ac", [-1.3, 3.6], { d: 0.8 }), B("x3", [-6.1, 5.85], "service", { sol: true, delai: 0.4 }), M("al", [-6.35, 5.0], { d: 0.45, delai: 1.0 }), M("ar2", [-5.5, 6.65], { d: 0.45, delai: 1.0 }))
          ]);
          s.etape("Passage au sol", "Un ballon tombe entre les intervalles : passage au sol pour les deux joueurs qui l'ont laissé tomber.", [
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
        titre: "Travail en 3v6",
        dispositif: "comme la semaine dernière : 3 joueurs (un passeur, un ailier et un réceptionneur-relanceur) face à 6 joueurs en place.",
        tableau: {
          tetes: ["Ballon", "Mise en jeu", "Point travaillé"],
          lignes: [
            ["1 · Réception", "Service", "Construire le side-out"],
            ["2 · Relance", "Ballon relancé", "Profiter du ballon facile"],
            ["3 · Défense", "Attaque à défendre", "Défendre puis contre-attaquer"]
          ]
        },
        enjeu: "faire son point : compter les points et faire un classement.",
        valider: "Qui envoie la relance et l'attaque à défendre : j'ai mis le coach, au bord du terrain. Les solutions montrées (bloc-out, pipe, ligne) sont des exemples.",
        scene: function (s) { EX.troisContreSix(s); }
      }
    ]
  });
})();

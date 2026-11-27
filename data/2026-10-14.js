/* Séance N3M du mercredi 14/10/2026 — 11 joueurs (+1 PRM ?). */
(function () {
  "use strict";
  const { B, M, P, W, S, BL, PT, A, X, FL } = N3M.a;
  const EX = N3M.exos;
  const REP = EX.REP;

  N3M.seance({
    id: "2026-10-14",
    jour: "Mercredi",
    date: "14/10/2026",
    joueurs: 11,
    note: "+1 PRM ?",
    axes: ["Cohésion du groupe", "Défense / manip de balle", "Attaque face au bloc", "Jeu au centre"],
    blocs: [
      {
        id: "causerie",
        n: "Avant la séance",
        titre: "Causerie après match",
        texte: ["Deux questions à poser au groupe : venir plus tôt ? Changer le cri de guerre ?"],
        plus: [["Décision", "faire trancher le groupe sur place (heure d'arrivée, nouveau cri), pour que ça s'applique dès le prochain match."]]
      },
      EX.jeuManchette({
        variante: "ballonMain",
        attente: 3,
        bloc: {
          titre: "Déverrouillage / jeu de la manchette",
          texte: ["Déverrouillage ensemble : chacun dit un truc sur le match.", "Puis jeu de la manchette : avec ballon parasite, ou en 2 touches de balle."],
          valider: "« Ballon parasite » : j'ai repris la variante où chacun tient un ballon qu'il lâche pour jouer sa manchette."
        }
      }),

      EX.attaqueDefense({
        bloc: {
          id: "exo1",
          n: "Exo 1",
          titre: "Circuit manip de balle / défense",
          dispositif: "un passeur en 3, deux attaquants en bout de filet qui attaquent sur les 3 joueurs en défense.",
          texte: ["Augmenter l'intensité des frappes, varier les angles (bidouilles)."],
          enjeu: "l'équipe qui fait tomber le ballon reste en gainage jusqu'à ce que l'autre groupe finisse.",
          plus: [
            ["Paliers", "frappes contrôlées, puis fortes, puis bidouilles mélangées pour obliger à rester bas."],
            ["Défi", "compter les ballons remontés d'affilée, record à battre par groupe."]
          ]
        }
      }),

      {
        id: "atelier-a",
        n: "Atelier A",
        titre: "Pointus · 4 joueurs",
        dispositif: "2 pointus, 1 passeur, 1 libéro. En parallèle de l'atelier B.",
        texte: ["Changer les pointus de temps en temps.", "Limiter les fautes sur le nombre de ballons en restant agressif : viser les zones, alterner attaque en 1 et en 2."],
        plus: [
          ["Passeur", "travail de gamme de passe."],
          ["Palier", "le passeur prend le 1er contact, le libéro le 2e."],
          ["Zones", "matérialisées (plots) et seuil de fautes annoncé avant la série, comme au service."]
        ],
        valider: "La relance de l'autre pointu part ici après la première attaque ; la fiche dit « juste après la 1re passe ». Les zones en face sont des exemples.",
        scene: function (s) {
          const ELAN = [-3.4, 8.2];
          s.zone("z1", { x0: 6.0, y0: 0.4, x1: 8.6, y1: 3.0 }, { label: "zone" });
          s.zone("z2", { x0: 6.0, y0: 6.0, x1: 8.6, y1: 8.6 }, { label: "zone" });
          s.j("p", REP.passeur, "P", "a");
          s.j("l", [-6.0, 3.4], "L", "a", { lib: true });
          s.j("po1", [-0.95, 7.75], "Po", "a");
          s.j("po2", [-8.4, 7.6], "Po", "b");
          s.ballon("x1", "po1").ballon("x2", "po2");
          s.etape("Mise en place", "2 pointus, 1 passeur, 1 libéro. Des zones à viser en face.", [W(0.6)]);
          s.etape("Attaque dans son terrain", "Le pointu n°1 attaque dans son propre terrain, sur le libéro.", [S("po1"), B("x1", "l", "attaque")]);
          s.etape("Il enchaîne derrière", "Le libéro défend sur le passeur, le pointu prend son élan.", [
            P(B("x1", "p", "defense", { h: 1.1 }), M("po1", ELAN, { d: 0.9 }))
          ]);
          s.etape("Première attaque", "Attaque dans une zone, en restant agressif.", [
            P(M("po1", REP.att2, { d: 0.95 }), B("x1", "po1", "passe")), S("po1"), B("x1", [7.2, 1.8], "attaque", { sol: true })
          ]);
          s.etape("Relance de l'autre pointu", "Juste après la 1re passe, l'autre pointu envoie une relance sur le libéro.", [
            X("x1"), P(M("po1", ELAN, { d: 0.9 }), B("x2", "l", "relance")), B("x2", "p", "recep")
          ]);
          s.etape("Deuxième attaque", "Le pointu n°1 enchaîne deux attaques.", [
            P(M("po1", REP.att2, { d: 0.95 }), B("x2", "po1", "passe")), S("po1"), B("x2", [7.2, 7.4], "attaque", { sol: true }), PT([7.2, 7.4], "2 sur 2")
          ]);
        }
      },

      {
        id: "atelier-b",
        n: "Atelier B",
        titre: "Récep / centre / R4 · 7 joueurs",
        dispositif: "d'un côté : 3 récep, 1 passeur, 1 central. En face : 1 central, 1 R4. Plus simple : 2 récep seulement.",
        texte: [
          "Central : chercher des angles face au bloc, communiquer avec le passeur (fixe, fixe arrière, déca, autre).",
          "R4 : chercher le duel (main extérieure, intervalle, fort sur la ligne, haut des mains), être prêt au soutien.",
          "Petit ballon du coach. Qui attaque ? Le même, l'autre, ou option libre.",
          "Faire tourner tout le monde et corriger."
        ],
        plus: [["Reconstruction", "d'abord libre, puis imposer l'autre option."]],
        valider: "J'ai fait servir le R4 d'en face et attaquer le R4 côté réception sur le petit ballon du coach. À corriger si c'est le central qui sert.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a", { roles: ["r1", "l", "r2", "p", "c"], depart: { p: [-0.9, 6.0], r1: [-5.4, 1.9], l: [-6.4, 4.5], r2: [-5.4, 7.1], c: [-1.3, 3.6] } });
          s.j("bc", [0.9, 4.5], "C", "b");
          s.j("b4", [10.2, 6.4], "R4", "b");
          s.coach("co", [-2.6, 10.3]);
          s.caddie(-4.1, 10.35);
          s.ballon("x1", "b4").ballon("x2", null);
          s.etape("Mise en place", "3 réceptionneurs, 1 passeur, 1 central. En face : 1 central et 1 R4.", [W(0.6)]);
          s.etape("Service qui met en difficulté", "Service agressif. Le serveur vient ensuite au filet.", [
            B("x1", "ar2", "service"), P(B("x1", "ap", "recep"), M("b4", [0.9, 1.6], { d: 1.7 }))
          ]);
          s.etape("Choix de passe : centre ou 4", "Ici au centre : le central cherche des angles face au bloc.", [
            P(T.passe("x1", "fixe", { elan: 0.8 }), FL("ap", REP.att4, "ou en 4"), M("bc", [0.75, 4.7], { d: 0.5, delai: 0.4 })),
            BL(["bc"]), B("x1", [7.6, 1.6], "attaque", { sol: true })
          ]);
          s.chapitre("Petit ballon du coach");
          s.etape("Qui attaque ?", "Le coach envoie un petit ballon : le même attaquant, l'autre, ou option libre.", [
            X("x1"),
            P(M("ac", [-2.6, 4.3], { d: 0.8 }), [A("x2", "co"), W(0.6), B("x2", "al", "relance")]),
            B("x2", "ap", "recep")
          ]);
          s.etape("L'autre option : le R4", "Le R4 cherche le duel : main extérieure, intervalle, fort sur la ligne, haut des mains.", [
            P(T.passe("x2", "4"), M("bc", [0.75, 2.45], { d: 0.8, delai: 0.3 }), M("b4", [0.75, 1.2], { d: 0.4, delai: 0.3 })),
            BL(["bc", "b4"]), B("x2", [0.3, 0.95], "attaque", { d: 0.22 }), B("x2", [3.2, -1.2], "bidouille", { sol: true }), PT([2.4, 0.4], "Main ext.")
          ]);
        }
      },

      {
        id: "forme-jouee",
        n: "Forme jouée",
        titre: "Un six qui bosse",
        dispositif: "un six qui bosse, le groupe en face le fait travailler sur 3 ballons. À 11 : 6 contre 5. Avec le joueur de PRM : 6 contre 6.",
        tableau: {
          tetes: ["Ballon", "Mise en jeu", "Point travaillé"],
          lignes: [
            ["1 · Réception", "Côté à 6", "Réception et side-out"],
            ["2 · Relance", "Côté à 5", "Lecture de balle, bloc, défense"],
            ["3 · 2e contact", "Côté à 5", "Gérer les ballons compliqués d'en face"]
          ]
        },
        cle: "Ne pas prendre de point quand l'adversaire est en difficulté.",
        plus: [
          ["Le six qui bosse", "le 6 de départ, ensemble le plus souvent possible, pour créer des automatismes."],
          ["Objectif", "compter les points pris sur un 2e contact adverse : objectif zéro."],
          ["Rotation", "changer le côté à 5 au score plutôt qu'au temps, comme le 07/10."]
        ],
        valider: "Animé à 6 contre 5 (pas de libéro côté à 5). Relance et ballon compliqué envoyés par le coach.",
        scene: function (s) {
          EX.ballons(s, {
            rolesB: ["r1", "c", "po", "p", "r2"],
            intro: "Le six qui bosse (en orange) face au côté à 5, qui le fait travailler sur 3 ballons.",
            phases: [
              { chapitre: "Ballon 1 · Réception", type: "service", pour: "A", etapes: [
                ["Réception du six", "Le côté à 5 sert, le six reçoit."],
                ["Side-out", "Réception et side-out."]] },
              { chapitre: "Ballon 2 · Relance", type: "relance", pour: "B", fin: "defendu", etapes: [
                ["Relance côté à 5", "Ballon facile en face : le six doit lire."],
                ["Lecture, bloc, défense", "Lecture de balle, bloc et défense ensemble."]] },
              { chapitre: "Ballon 3 · 2e contact", type: "passeur", pour: "B", fin: "defendu", pop: "Pas de point !", etapes: [
                ["Ballon compliqué en face", "En face, le passeur prend le 1er contact : le 2e contact est joué par un autre."],
                ["Ne pas prendre de point", "L'adversaire est en difficulté : on ne prend pas de point sur ce ballon."]] }
            ],
            fin: ["Compter", "On compte les points pris sur un 2e contact adverse : objectif zéro."]
          });
        }
      }
    ]
  });
})();

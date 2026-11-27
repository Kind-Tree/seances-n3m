/* Séance N3M du mercredi 21/10/2026 — 13 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, X, A, FL } = N3M.a;
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-10-21",
    jour: "Mercredi",
    date: "21/10/2026",
    joueurs: 13,
    axes: ["Défense / transition", "Réception / side-out", "Bloc-défense", "Contre-attaque"],
    blocs: [
      {
        id: "plan-de-jeu",
        n: "Échauffement",
        titre: "Déverrouillage + plan de jeu pour dimanche",
        texte: ["Déverrouillage et plan de jeu pour dimanche."],
        plus: [["Plan de jeu", "le limiter à 2 ou 3 consignes que tout le monde peut répéter, à reprendre dans la forme jouée de fin de séance."]]
      },
      EX.jeuManchette({ variante: "simple", attente: 5, bloc: { texte: ["Jeu de la manchette classique."] } }),

      {
        id: "exo1",
        n: "Exo 1",
        titre: "Rebond / passe de transition",
        dispositif: "un joueur poste 6, face au filet. Un joueur derrière lui fait rebondir un ballon sur le sol, assez fort pour qu'il passe au-dessus du joueur n°1.",
        plus: [
          ["Évolution", "on garde un joueur au filet (en 2 ou en 4), qui reçoit la passe de transition en ré-attaquant sur le joueur."],
          ["Variation", "attaque ou bidouille."],
          ["Rebonds", "de plus en plus forts et profonds, pour obliger le joueur n°1 à reculer avant sa passe."],
          ["Défi", "compter les passes de transition réussies d'affilée, record à battre."]
        ],
        scene: function (s) {
          s.cadre("A");
          s.j("j1", [-6.2, 4.5], 1, "a");
          s.j("j2", [-8.6, 4.5], 2, "a");
          s.j("j3", [-10.6, 4.5], 3, "c");
          s.ballon("x", "j2");
          const rebond = [B("x", [-7.4, 4.5], "sol"), P(M("j1", [-4.6, 4.6], { d: 0.9 }), B("x", "j1", "rebond", { h: 1.3 }))];
          s.etape("Mise en place", "Un joueur en poste 6, face au filet. Un joueur derrière lui, avec un ballon.", [W(0.6)]);
          s.etape("Rebond par-dessus", "Le joueur de derrière fait rebondir le ballon au sol, assez fort pour qu'il passe au-dessus du n°1.", rebond);
          s.etape("Passe de transition", "Le n°1 fait une passe de transition vers l'un des bouts de filet, puis va récupérer son ballon.", [
            P(B("x", [-0.9, 1.3], "transi", { sol: true }), FL("j1", [-0.9, 7.7], "ou en 2")), M("j1", [-1.7, 2.0], { d: 1.1 })
          ]);
          s.chapitre("Évolution");
          s.etape("Un joueur au filet", "On garde un joueur au filet, en 4 ou en 2. Nouveau rebond, nouvelle passe de transition vers lui.", [
            X("x"), P(M("j1", [-6.2, 4.5], { d: 1.3 }), M("j3", [-0.95, 1.2], { d: 1.9 })), A("x", "j2")
          ].concat(rebond, [B("x", "j3", "transi")]));
          s.etape("Ré-attaque sur le joueur", "Le joueur au filet ré-attaque sur le n°1, qui défend. Variation : attaque ou bidouille.", [
            P(FL("j3", [-3.0, 3.2], "bidouille"), [S("j3"), B("x", "j1", "attaque")]), B("x", "j3", "defense", { tenu: true })
          ]);
        }
      },

      EX.circuitTransition({
        bloc: {
          id: "exo2",
          n: "Exo 2",
          titre: "Circuit défense / transition",
          dispositif: "circuit : défense › passe de transition › attaque dans son terrain › défense, etc.",
          plus: [
            ["Défi", "circuit continu avec un record de ballons sans chute à battre, comme à l'exo précédent."],
            ["Qualité", "garder la même qualité de passe de transition qu'à l'exo 1 : vers le bout de filet, ballon jouable."]
          ],
          valider: "La fiche ne donne que l'enchaînement. J'ai repris le circuit fermé à 6 du 18/09 : attaque du poste 2, défense en 5, transition du poste 1 vers le 4."
        }
      }),

      {
        id: "exo3",
        n: "Exo 3",
        titre: "Service-réception / gamme de passe",
        dispositif: "service-réception de chaque côté du terrain, avec 2 en réception et 1 en attente. Serveur : central ou pointu.",
        texte: [
          "Gamme de passe avec enchaînement en 4.",
          "Mettre un R4 au service pour avoir un central à l'attaque.",
          "Décaler les réceptionneurs pour avoir un pointu qui enchaîne."
        ],
        cle: "Tout le monde doit faire du service et de l'attaque.",
        plus: [["Service", "zone de service annoncée avant chaque ballon et seuil de fautes à ne pas dépasser."]],
        valider: "J'ai fait attaquer en 4 le réceptionneur qui vient de recevoir, des deux côtés en même temps. Les deux variantes (central, pointu) sont montrées par des flèches.",
        scene: function (s) {
          const q = N3M.geo.camp("B");
          const cote = (pre, eq, f, nom) => {
            s.j(pre + "p", f(-0.9, 6.0), "P", eq);
            s.j(pre + "r1", f(-5.6, 2.4), "R", eq);
            s.j(pre + "r2", f(-5.8, 6.2), "R", eq);
            s.j(pre + "w", f(-7.0, -1.2), "", "c", { nom: nom });
            s.j(pre + "s", f(-10.3, 7.4), "S", eq);
          };
          cote("a", "a", (x, y) => [x, y], "attente");
          cote("b", "b", q, "");
          s.ballon("xa", "as").ballon("xb", "bs");
          s.etape("Mise en place", "De chaque côté : un serveur (central ou pointu), 2 réceptionneurs, 1 en attente et un passeur.", [W(0.6)]);
          s.etape("Service des deux côtés", "On sert des deux côtés du terrain.", [
            P(B("xa", "br1", "service"), [W(0.5), B("xb", "ar1", "service")])
          ]);
          s.etape("Réception, gamme de passe", "La réception monte sur le passeur.", [
            P(B("xa", "bp", "recep"), B("xb", "ap", "recep"))
          ]);
          s.etape("Enchaînement en 4", "Le réceptionneur enchaîne à l'attaque en 4.", [
            P(
              [P(M("ar1", [-0.9, 1.35], { d: 1.0 }), B("xb", "ar1", "passe")), S("ar1"), B("xb", [8.2, 4.8], "attaque", { sol: true })],
              [P(M("br1", q(-0.9, 1.35), { d: 1.0 }), B("xa", "br1", "passe")), S("br1"), B("xa", [-8.2, 4.2], "attaque", { sol: true })]
            )
          ]);
          s.etape("Faire attaquer tout le monde", "R4 au service : un central attaque à sa place. Réceptionneurs décalés : c'est le pointu qui enchaîne.", [
            X("xa"), X("xb"),
            P(M("ar1", [-5.6, 2.4]), M("br1", q(-5.6, 2.4))),
            P(FL("ap", [-0.85, 4.95], "central"), FL("ap", [-0.9, 7.65], "pointu")), W(1.2)
          ]);
        }
      },

      {
        id: "forme-jouee",
        n: "Forme jouée",
        titre: "Six qui bosse / six qui fait bosser",
        dispositif: "un six de match qui bosse (1), un six qui le fait bosser (2). Phase jouée multi-ballons, en comptant les points.",
        tableau: {
          tetes: ["Ballon", "Mise en jeu", "Consigne pour le six (1)"],
          lignes: [
            ["1 · Réception", "Réception du six (1)", "Faire le side-out, sinon on ne gagne pas de point."],
            ["2 · Relance", "Relance côté (2)", "Appliquer la consigne de bloc-défense pour contre-attaquer au mieux sur situation max en face."],
            ["3 · Attaque", "Attaque sur libéro / passeur côté (2)", "Appliquer la consigne de bloc-défense pour contre-attaquer au mieux sur situation mini en face."],
            ["4 · Relance", "Relance côté (1)", "Mettre le point sur situation maxi."]
          ]
        },
        cle: "Peu de changement de joueur.",
        plus: [
          ["À 13", "le 13e joueur peut compter les points et relancer les ballons."],
          ["Score", "annoncer avant la série la consigne de bloc-défense de dimanche et tenir le score par type de ballon, pour voir où le six (1) perd des points."]
        ],
        valider: "Le six (1) est en orange. J'ai fait envoyer les relances et l'attaque par le coach au bord du terrain (ou le 13e joueur). Les attaques montrées sont des exemples.",
        scene: function (s) {
          EX.ballons(s, {
            intro: "Le six de match qui bosse (1, en orange) face au six qui le fait bosser (2). On compte les points.",
            phases: [
              { chapitre: "Ballon 1 · Réception", type: "service", pour: "A", etapes: [
                ["Réception du six (1)", "Le six (2) sert, le six (1) reçoit."],
                ["Faire le side-out", "Il faut faire le side-out, sinon on ne gagne pas de point."]] },
              { chapitre: "Ballon 2 · Relance côté (2)", type: "relance", pour: "B", fin: "defendu", etapes: [
                ["Relance côté (2)", "Ballon facile pour le six (2) : situation max en face."],
                ["Bloc-défense", "Le six (1) applique la consigne de bloc-défense pour contre-attaquer au mieux."]] },
              { chapitre: "Ballon 3 · Attaque côté (2)", type: "passeur", pour: "B", fin: "defendu", etapes: [
                ["Attaque sur le passeur", "Attaque sur le libéro ou le passeur du six (2) : situation mini en face."],
                ["Bloc-défense, encore", "Même consigne de bloc-défense, sur un ballon moins bien construit en face."]] },
              { chapitre: "Ballon 4 · Relance côté (1)", type: "relance", pour: "A", en: "2", etapes: [
                ["Relance côté (1)", "Ballon facile pour le six (1)."],
                ["Mettre le point", "Situation maxi : il faut mettre le point."]] }
            ],
            fin: ["Compter", "On tient le score par type de ballon, pour voir où le six (1) perd des points. Peu de changement de joueur."]
          });
        }
      }
    ]
  });
})();

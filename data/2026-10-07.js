/* Séance N3M du mercredi 07/10/2026 — 12 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, BL, D, PT, A, X, O } = N3M.a;
  const EX = N3M.exos;
  const REP = EX.REP;

  N3M.seance({
    id: "2026-10-07",
    jour: "Mercredi",
    date: "07/10/2026",
    joueurs: 12,
    axes: ["Intensité", "Respect des consignes", "Système bloc-défense"],
    blocs: [
      {
        id: "debrief",
        n: "Avant la séance",
        titre: "Debrief du match",
        texte: ["Souligner le manque d'intensité à l'entraînement et le non-respect des consignes en match."],
        plus: [
          ["Format", "court et factuel : 2 ou 3 situations du match, et dire où on retravaille ce soir les consignes non tenues."],
          ["Intensité", "annoncer qu'elle sera comptée, pas seulement exigée : 2/3 pour marquer en forme jouée n°2."]
        ]
      },
      EX.jeuManchette({
        variante: "ballonMain",
        attente: 4,
        bloc: {
          titre: "Déverrouillage / jeu de la manchette",
          texte: ["Déverrouillage musculaire, puis jeu de la manchette avec un ballon parasite."],
          valider: "« Ballon parasite » : j'ai repris la variante où chacun tient un ballon qu'il lâche pour jouer sa manchette."
        }
      }),

      {
        id: "atelier-a",
        n: "Atelier A",
        titre: "Défense par trois · 9 joueurs",
        dispositif: "3 groupes de 3. 1 joueur au milieu de deux joueurs, qui ont chacun un ballon en main. En parallèle de l'atelier des centraux.",
        plus: [
          ["Séries", "courtes puis rotation ; compter les doubles réussis (défense + ballon remonté), record par groupe."],
          ["Soutien", "le ballon de soutien, c'est l'attaquant contré : on ne le laisse jamais tomber, c'est le pas de plus du 12/09."]
        ],
        valider: "Lecture retenue : le joueur du milieu tourne le dos à celui qui va attaquer ; celui-ci tape dans son ballon (signal), le milieu se retourne et défend, puis se retourne encore pour le ballon court de l'autre. À corriger si c'est l'autre joueur qui attaque en premier.",
        scene: function (s) {
          const ys = [1.6, 4.5, 7.4];
          s.cadre("A");
          ys.forEach((y, i) => {
            s.j("a" + i, [-8.4, y], 1, "a");
            s.j("m" + i, [-5.2, y], 2, "b", { face: 0 });
            s.j("b" + i, [-2.0, y], 3, "a", { sens: -1 });
            s.ballon("xa" + i, "a" + i).ballon("xb" + i, "b" + i);
          });
          const tous = (f) => P.apply(null, ys.map((y, i) => f(y, i)));
          s.etape("Mise en place", "Par 3 : un joueur au milieu de deux joueurs, qui ont chacun un ballon en main.", [W(0.6)]);
          s.etape("Dos à l'un des deux", "Le joueur du milieu se met dos à l'un des deux.", [W(0.8)]);
          s.etape("Tape, puis attaque", "Celui-ci tape dans son ballon, puis attaque sur le joueur du milieu, qui se retourne.", [
            tous((y, i) => [D("a" + i, "Tap !", { d: 0.9 }), W(0.6), O("m" + i, 180), W(0.3), S("a" + i), B("xa" + i, "m" + i, "attaque")])
          ]);
          s.etape("Défense", "Le joueur du milieu défend.", [
            tous((y, i) => B("xa" + i, "a" + i, "defense", { tenu: true }))
          ]);
          s.etape("Il se retourne", "Il se retourne aussitôt pour remonter le ballon envoyé en bidouille ou en soutien.", [
            tous((y, i) => [O("m" + i, 0), P(M("m" + i, [-4.2, y], { d: 0.5 }), B("xb" + i, "m" + i, "bidouille")), B("xb" + i, "b" + i, "defense", { tenu: true }), PT("m" + i, "Double !")])
          ]);
          s.etape("Rotation", "Séries courtes, puis on tourne. On compte les doubles réussis : défense + ballon remonté.", [
            tous((y, i) => M("m" + i, [-5.2, y])), W(0.4)
          ]);
        }
      },

      {
        id: "atelier-b",
        n: "Atelier B",
        titre: "Centraux · 3 joueurs",
        dispositif: "1 passeur + 2 centraux. Un central envoie le ballon à son homologue, qui enchaîne sa relance + attaque dans une zone.",
        plus: [
          ["Palier", "rajouter un bloc du central pour jouer le 1 contre 1. Très coûteux physiquement."],
          ["Zones", "matérialisées et comptées : le jeu au centre reste la clé pour le passeur."],
          ["Au bloc", "arrêt, fermeture, franchissement. Séries courtes, le 1 contre 1 va les cramer."]
        ],
        scene: function (s) {
          const DEP = [-4.6, 4.3], ELAN = [-2.6, 4.3];
          s.zone("z", { x0: 5.8, y0: 0.4, x1: 8.6, y1: 3.2 }, { label: "zone" });
          s.j("p", [-0.9, 6.7], "P", "a");
          s.j("c1", DEP, "C", "a");
          s.j("c2", [4.2, 5.6], "C", "b");
          s.ballon("x", "c2");
          const jeu = (bloc) => [
            B("x", "c1", "lancer"),
            P(B("x", "p", "relance"), M("c1", ELAN, { d: 0.8 }), bloc ? M("c2", [0.75, 4.8], { d: 1.1 }) : null),
            P(M("c1", REP.fixe, { d: 0.7 }), B("x", "c1", "passe", { d: 0.8 }))
          ];
          s.etape("Mise en place", "1 passeur et 2 centraux, un de chaque côté du filet. Une zone à viser.", [W(0.6)]);
          s.etape("Relance, puis attaque", "Un central envoie le ballon à son homologue, qui relance sur le passeur et prend son élan.", jeu(false));
          s.etape("Attaque dans la zone", "Attaque au centre, dans la zone matérialisée. On compte.", [
            S("c1"), B("x", [7.2, 1.8], "attaque", { sol: true }), PT([7.2, 1.8], "Zone !")
          ]);
          s.chapitre("Palier");
          s.etape("Le 1 contre 1", "On rajoute un bloc du central d'en face : relance, attaque, et duel au filet.", [
            X("x"), M("c1", DEP, { d: 0.8 }), A("x", "c2")
          ].concat(jeu(true), [P(S("c1"), BL(["c2"])), B("x", [6.8, 7.6], "attaque", { sol: true })]));
          s.etape("Séries courtes", "Très coûteux physiquement : séries courtes, et on tourne.", [
            X("x"), P(M("c1", DEP), M("c2", [4.2, 5.6])), W(0.4)
          ]);
        }
      },

      EX.gammePasseBloc({
        frites: true,
        bloc: {
          id: "exo2",
          n: "Exo 2",
          titre: "Relance / gamme de passe / suivi du bloc — 2 ballons",
          dispositif: "reprise de l'exercice à 2 ballons, mais en ajoutant l'intensité qu'on n'avait pas.",
          texte: ["Proposition : mettre les frites du local entre les mailles du filet pour déterminer la zone."],
          plus: [
            ["Intensité", "la définir avant de lancer : 2e ballon sans temps mort, bloc en place avant la frappe."],
            ["Frite", "elle donne au bloc un repère pour s'arrêter et fermer."]
          ],
          valider: "J'ai repris la gamme de passe avec bloc du 18/09, avec deux ballons envoyés par le coach et une cible à chaque aile. À corriger si l'exercice à 2 ballons est un autre."
        }
      }),

      {
        id: "forme-1",
        n: "Forme jouée n°1",
        titre: "Empêcher le side-out",
        dispositif: "6 en défense qui doivent empêcher le groupe d'en face de faire side-out : sur réception, sur relance, sur défense. Rotation : changer les joueurs.",
        cle: "Appliquer le système. Le joueur au service en attente voit le jeu de derrière.",
        plus: [
          ["Système du 23/09", "bloc à 2, 3e joueur au filet sur la diagonale courte, serveur sur la ligne ; poste 6 avancé."],
          ["Attente", "le joueur en attente annonce ce qu'il a vu ; changer les 6 au score plutôt qu'au temps."]
        ],
        valider: "Le six qui défend est en orange. Relance et attaque à défendre envoyées par le coach.",
        scene: function (s) {
          EX.ballons(s, {
            intro: "Le six en orange doit empêcher le groupe d'en face de faire side-out.",
            phases: [
              { chapitre: "Sur réception", type: "service", pour: "B", fin: "defendu", etapes: [
                ["Service", "Le six sert, le groupe d'en face reçoit."],
                ["Empêcher le side-out", "Bloc à 2, 3e joueur du filet sur la diagonale courte, un défenseur sur la ligne."]] },
              { chapitre: "Sur relance", type: "relance", pour: "B", en: "2", fin: "defendu", etapes: [
                ["Relance en face", "Ballon facile pour le groupe d'en face."],
                ["Appliquer le système", "Même système de l'autre côté : chacun à sa place avant la frappe."]] },
              { chapitre: "Sur défense", type: "attaque", pour: "B", fin: "defendu", etapes: [
                ["Défense en face", "Le groupe d'en face doit d'abord défendre une attaque."],
                ["Encore le système", "Ballon moins bien construit en face : le système doit tenir quand même."]] }
            ],
            fin: ["Rotation", "On change les joueurs au score plutôt qu'au temps. Le joueur en attente annonce ce qu'il a vu de derrière.", "Rotation"]
          });
        }
      },

      {
        id: "forme-2",
        n: "Forme jouée n°2",
        titre: "Opposition classique",
        dispositif: "Un joueur d'un autre poste joue R4. Un terrain avec deux centraux, à éviter au service pour garder une cohérence.",
        texte: ["Déroulé : service / réception, puis relance du côté qui a servi, puis relance de l'autre côté."],
        enjeu: "pour gagner un point, il faut 2/3 ; 3/3 = 2 points.",
        plus: [
          ["Service", "un service troué offre un ballon à l'adversaire : le 3/3 devient impossible."],
          ["Consigne", "une consigne de match par set ; une séquence gagnée sans la respecter ne compte pas."]
        ],
        scene: function (s) {
          EX.ballons(s, {
            intro: "Opposition 6 contre 6 par séquences de 3 ballons. On compte les ballons gagnés.",
            phases: [
              { chapitre: "Ballon 1 · Service", type: "service", pour: "B", pop: "1/3", etapes: [
                ["Service / réception", "L'équipe orange sert, l'équipe blanche reçoit."],
                ["On joue le point", "Le point se joue jusqu'au bout."]] },
              { chapitre: "Ballon 2 · Relance", type: "relance", pour: "A", pop: "1/3", etapes: [
                ["Relance du côté qui a servi", "Relance pour l'équipe qui a servi."],
                ["On joue le point", "Chaque ballon compte dans la séquence."]] },
              { chapitre: "Ballon 3 · Relance", type: "relance", pour: "B", en: "2", pop: "2/3", etapes: [
                ["Relance de l'autre côté", "Dernier ballon : relance pour l'autre équipe."],
                ["2/3 pour marquer", "Il faut gagner 2 ballons sur 3 pour marquer le point. 3/3 = 2 points."]] }
            ],
            fin: ["Séquence suivante", "L'équipe blanche a fait 2/3 : 1 point. On repart sur une nouvelle séquence."]
          });
        }
      }
    ]
  });
})();

/* Séance N3M du mercredi 23/09/2026 — 9 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, BL, D, PT, A, X } = N3M.a;
  const EX = N3M.exos;
  const REP = EX.REP;

  N3M.seance({
    id: "2026-09-23",
    jour: "Mercredi",
    date: "23/09/2026",
    joueurs: 9,
    axes: ["Service / Réception", "Qualité de bloc", "Placement en défense"],
    blocs: [
      { id: "echauffement", n: "Échauffement", titre: "Échauffement ballon par 2", texte: ["Échauffement ballon par 2."] },
      EX.jeuManchette({
        variante: "deuxTouches",
        attente: 1,
        bloc: {
          id: "deux-contre-deux",
          n: "Jeu",
          titre: "2 contre 2 — 2 touches de balle",
          dispositif: "2 contre 2, deux touches de balle maximum par équipe.",
          plus: [["Consigne", "avec deux touches, le 1er contact doit être attaquable : le partenaire frappe en appel, pas de renvoi en manchette ni de ballon poussé."]],
          valider: "Animé sur deux demi-terrains en longueur, avec les trajectoires du jeu de la manchette. À corriger si le 2 contre 2 se joue sur un terrain entier."
        }
      }),

      {
        id: "trois-contre-trois",
        n: "Jeu",
        titre: "3 contre 3 — changement de terrain",
        dispositif: "3 équipes de 3.",
        plus: [
          ["Rythme", "garder celui de la séquence décousue du 18/09 : l'équipe qui entre reçoit aussitôt une relance de l'entraîneur, sans temps mort entre deux points."],
          ["Progression", "après le 2 contre 2, passer à 3 touches obligatoires, pour que le 2e contact redevienne une vraie passe."]
        ],
        valider: "« Changement de terrain » : j'ai fait sortir l'équipe qui perd le point et entrer la troisième à sa place. À corriger si c'est l'équipe gagnante qui change de côté.",
        scene: function (s) {
          const q = N3M.geo.camp("B");
          const PLACES = [[-1.2, 5.6], [-5.8, 2.6], [-5.8, 6.4]];
          const ATT = [10.6, 2.8, 4.5, 6.2];
          PLACES.forEach((p, i) => {
            s.j("a" + (i + 1), p, i + 1, "a");
            s.j("b" + (i + 1), q(p[0], p[1]), i + 4, "b");
            s.j("c" + (i + 1), [ATT[0], ATT[i + 1]], i + 7, "c");
          });
          s.coach("co", [2.6, 10.3]);
          s.caddie(4.1, 10.35);
          s.ballon("x", "co").ballon("y", null);
          s.etape("Mise en place", "3 équipes de 3 : deux jouent, la troisième attend derrière.", [W(0.6)]);
          s.etape("On joue le point", "3 contre 3. Ici l'équipe orange construit et marque.", [
            B("x", "a2", "relance"), B("x", "a1", "recep"),
            P(M("a3", [-1.0, 7.5], { d: 0.9 }), B("x", "a3", "passe")),
            S("a3"), B("x", [7.6, 4.5], "attaque", { sol: true }), PT([7.6, 4.5], "+1")
          ]);
          s.etape("Changement de terrain", "L'équipe qui perd sort, la troisième entre aussitôt.", [
            X("x"),
            P.apply(null, PLACES.map((p, i) => M("b" + (i + 1), [ATT[0], ATT[i + 1]], { d: 1.4, delai: 0.3 }))
              .concat(PLACES.map((p, i) => M("c" + (i + 1), q(p[0], p[1]), { d: 1.3 })))
              .concat([M("a3", PLACES[2], { d: 1.0 })]))
          ]);
          s.etape("Relance immédiate", "L'équipe qui entre reçoit aussitôt une relance de l'entraîneur : pas de temps mort entre deux points.", [
            A("y", "co"), B("y", "c2", "relance"), B("y", "c1", "recep"),
            P(M("c3", q(-1.0, 7.5), { d: 0.9 }), B("y", "c3", "passe")),
            S("c3"), B("y", "a2", "attaque"), B("y", "a1", "defense", { h: 1.1, tenu: true })
          ]);
        }
      },

      {
        id: "exo1",
        n: "Exo 1",
        titre: "Gamme service / réception à 2 réceptionneurs",
        dispositif: "deux réceptionneurs, d'abord en zones 5-6, puis en zones 1-6. Le joueur en plus est un passeur : il enchaîne des gammes de passe sur la réception, même sans attaque en face.",
        texte: [
          "Régularité au service : chercher une zone.",
          "Intervalles à définir entre les deux réceptionneurs.",
          "Penser à la récep avant l'enchaînement."
        ],
        plus: [
          ["Service", "zone annoncée avant chaque service et seuil de fautes par série (par ex. 1 faute max sur 5)."],
          ["Intervalles", "fixer une règle simple avant de lancer (par ex. priorité au libéro sur le ballon entre deux) et rendre l'annonce vocale obligatoire. Axe de progrès du libéro sur la communication."],
          ["Temps 2", "le serveur vise l'intervalle 1-6 pour tester la règle."],
          ["Cibles", "sans attaquant, donner au passeur une cible en 4 et en 2 (plot, cerceau ou serveur qui attrape le ballon) pour juger la qualité de passe."],
          ["Note", "le passeur annonce la note de chaque réception (0·1·2·3) : il est le mieux placé pour juger, et le réceptionneur a un retour immédiat."]
        ],
        scene: function (s) {
          s.plot(-0.9, 1.35);
          s.plot(-0.9, 7.65);
          s.j("ra", [-6.0, 2.0], "R", "a");
          s.j("rb", [-6.8, 4.8], "R", "a");
          s.j("p", REP.passeur, "P", "a");
          [2.5, 4.5, 6.5].forEach((y, i) => {
            s.j("s" + (i + 1), [10.2, y], "S", "b");
            s.ballon("x" + (i + 1), "s" + (i + 1));
          });
          s.etape("Mise en place", "2 réceptionneurs, un passeur, les autres au service. Une cible en 4 et une en 2 pour juger la passe.", [W(0.6)]);
          s.chapitre("Temps 1 · Zones 5-6");
          s.etape("Chercher une zone", "Zone annoncée avant chaque service.", [D("s1", "Zone 5 !"), W(0.9), B("x1", "ra", "service")]);
          s.etape("Réception, gamme de passe", "Penser à la récep avant l'enchaînement. Le passeur note la réception et joue sa passe vers la cible.", [
            B("x1", "p", "recep"), D("p", "3 !"), B("x1", [-0.9, 1.6], "passe", { sol: true })
          ]);
          s.chapitre("Temps 2 · Zones 1-6");
          s.etape("On décale", "Les deux réceptionneurs passent en zones 1-6.", [
            X("x1"), P(M("ra", [-6.8, 4.2], { d: 0.9 }), M("rb", [-6.0, 7.0], { d: 0.9 }))
          ]);
          s.etape("Service dans l'intervalle", "Le serveur vise l'intervalle 1-6 pour tester la règle : annonce obligatoire.", [
            P(B("x2", "ra", "service"), [W(0.5), D("ra", "J'ai !"), M("ra", [-6.5, 5.3], { d: 0.5 })]),
            B("x2", "p", "recep"), B("x2", [-0.9, 7.4], "passe", { sol: true })
          ]);
        }
      },

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Situation 5 contre 4 — défense, puis bloc",
        dispositif: "côté à 5 : 2 libéros, 1 R4, 1 passeur, 1 pointu. Côté à 4 : 3 au filet, 1 central au service.",
        texte: ["Une fois bien chaud en phase 1, on passe à la phase 2."],
        cle: "Côté à 4 : ne pas chercher la lecture de la passe. On sait où ça va, on cherche la qualité du bloc. Placement en défense sur la ligne.",
        plus: [
          ["Phase 1", "défendre depuis les zones qu'on occupera derrière le bloc en phase 2 (ligne, diagonale)."],
          ["Phase 2", "annoncer la passe (4 ou 2) avant chaque service. Exigence totale sur l'arrêt, la fermeture sur la diagonale et le franchissement des mains (point de travail individuel)."],
          ["Système", "bloc à 2, le 3e joueur au filet décroche sur la diagonale courte, et le serveur rentre sur la ligne : en poste 1 si passe en 4, en poste 5 si passe en 2."],
          ["Compter", "côté à 4, 2 pts par bloc gagnant, 1 par touche utile ; côté à 5, 1 par attaque gagnante."],
          ["Retour direct", "côté à 4 sans passeur : désigner qui prend la 2e main."],
          ["Mi-exercice", "inverser R4 et pointu entre les deux côtés, pour que tous les attaquants passent aussi au bloc."]
        ],
        valider: "Phase 2 : j'ai animé une attaque contrée qui revient côté à 5 ; le passeur défend, un libéro fait le relais et le pointu renvoie direct. À corriger si la défense du passeur vient d'ailleurs.",
        scene: function (s) {
          const N = [[0.9, 1.6], [0.9, 4.5], [0.9, 7.4]];
          const SERV = [10.2, 6.5], R4 = [-3.6, 1.2];
          s.j("l1", [-6.2, 2.2], "L", "a", { lib: true });
          s.j("l2", [-6.2, 6.6], "L", "a", { lib: true });
          s.j("r4", R4, "R4", "a");
          s.j("p", REP.passeur, "P", "a");
          s.j("po", [-3.4, 8.2], "Po", "a");
          N.forEach((p, i) => s.j("n" + (i + 1), p, i + 1, "b"));
          s.j("bc", SERV, "C", "b");
          s.ballon("x1", "bc").ballon("x2", null);
          s.etape("Mise en place", "Côté à 5 : 2 libéros, 1 R4, 1 passeur, 1 pointu. Côté à 4 : 3 au filet et le central au service.", [W(0.6)]);
          s.chapitre("Phase 1 · Attaque à 3 m, sans bloc");
          s.etape("Service du central", "Service du central, côté à 4. Réception sur le passeur.", [
            B("x1", "l1", "service"), P(B("x1", "p", "recep"), M("bc", [7.4, 5.4], { d: 1.2 }))
          ]);
          s.etape("Attaque à 3 m, le côté à 4 défend", "Pas de bloc en face : les joueurs du filet décrochent et le côté à 4 doit défendre.", [
            P(M("r4", [-3.4, 2.0], { d: 0.7 }), B("x1", "r4", "passe"),
              M("n1", [3.6, 1.6], { d: 0.8 }), M("n2", [5.2, 3.6], { d: 0.8 }), M("n3", [3.6, 7.2], { d: 0.8 })),
            S("r4"), B("x1", "n3", "attaque"), B("x1", "n2", "defense", { h: 1.1, tenu: true }), PT("n3", "Défendu !")
          ]);
          s.chapitre("Phase 2 · Attaque au filet avec bloc");
          s.etape("Passe annoncée", "La passe (4 ou 2) est annoncée avant chaque service. Service, réception.", [
            X("x1"),
            P(M("r4", R4, { d: 0.8 }), M("n1", N[0], { d: 0.8 }), M("n2", N[1], { d: 0.8 }), M("n3", N[2], { d: 0.8 }), M("bc", SERV, { d: 1.0 })),
            A("x2", "bc"), D("n2", "En 4 !"), W(0.8), B("x2", "l2", "service"), B("x2", "p", "recep")
          ]);
          s.etape("Bloc à 2, serveur sur la ligne", "Bloc à 2, le 3e joueur du filet décroche sur la diagonale courte, le serveur rentre sur la ligne.", [
            P(M("r4", REP.att4, { d: 0.95 }), B("x2", "r4", "passe"),
              M("n1", [0.75, 1.15], { d: 0.4, delai: 0.3 }), M("n2", [0.75, 2.4], { d: 0.8, delai: 0.2 }), M("n3", [3.2, 6.0], { d: 0.9 }), M("bc", [6.2, 1.3], { d: 1.4 })),
            P(S("r4"), BL(["n1", "n2"])), B("x2", [-0.3, 1.7], "attaque", { d: 0.2 }),
            P(M("p", [-2.2, 3.4], { d: 0.6 }), B("x2", "p", "rebond", { d: 0.65 }))
          ]);
          s.etape("Défense du passeur, relais du libéro", "Le passeur a défendu : un libéro fait le relais de passe, et le ballon repart direct en face.", [
            P(M("l1", [-4.0, 3.2], { d: 0.8 }), B("x2", "l1", "defense", { h: 1.1 })),
            P(M("po", [-2.6, 7.0], { d: 0.8 }), B("x2", "po", "passe")),
            B("x2", "bc", "relance")
          ]);
          s.etape("Le côté à 4 construit", "Retour direct vers le côté à 4, qui doit construire quelque chose.", [
            P(M("n2", [1.0, 3.4], { d: 0.7 }), B("x2", "n2", "recep")),
            P(M("n3", [0.9, 7.65], { d: 0.9 }), B("x2", "n3", "passe")),
            S("n3"), B("x2", [-7.8, 4.4], "attaque", { sol: true })
          ]);
        }
      }
    ]
  });
})();

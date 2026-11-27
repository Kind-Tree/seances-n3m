/* Séance N3M du mercredi 30/09/2026 — 12 joueurs. Deux versions de la fiche : la séance et sa variante « bis ». */
(function () {
  "use strict";
  const { B, M, P, W, S, D, PT, A, X } = N3M.a;
  const EX = N3M.exos;

  const manchette = EX.jeuManchette({
    variante: "simple",
    attente: 4,
    bloc: { titre: "Déverrouillage / jeu de la manchette", texte: ["Déverrouillage musculaire, puis jeu de la manchette."] }
  });

  const gamme = {
    id: "exo1",
    n: "Exo 1",
    titre: "Gamme service / réception — avec target",
    dispositif: "3 serveurs d'un côté ; en face, 3 réceptionneurs et une target à la place du passeur.",
    plus: [
      ["Service", "zone annoncée et seuil de fautes par série (1 faute max sur 5), comme le 23/09."],
      ["Target", "elle annonce la note de chaque réception (0·1·2·3) : retour immédiat pour le réceptionneur."],
      ["Temps 2", "décider qui fait la passe de transi (passeur, libéro ou réceptionneur libre), question ouverte du 18/09."]
    ],
    valider: "Au temps 2, j'ai fait jouer la passe de transition par le réceptionneur libre, vers le poste 4.",
    scene: function (s) {
      s.plot(-0.9, 1.35);
      s.j("r1", [-5.4, 1.9], "R", "a");
      s.j("l", [-6.4, 4.5], "L", "a", { lib: true });
      s.j("r2", [-5.4, 7.1], "R", "a");
      s.j("t", EX.REP.passeur, "T", "b");
      [2.0, 4.5, 7.0].forEach((y, i) => {
        s.j("s" + (i + 1), [10.2, y], "S", "b");
        s.ballon("x" + (i + 1), "s" + (i + 1));
      });
      s.etape("Mise en place", "3 serveurs, 3 réceptionneurs, et une target à la place du passeur.", [W(0.6)]);
      s.chapitre("Temps 1");
      s.etape("Service", "Zone annoncée, puis service.", [D("s1", "Zone 5 !"), W(0.9), B("x1", "r1", "service")]);
      s.etape("Réception sur la target", "Réception sur la target, qui annonce la note. Et on enchaîne.", [
        B("x1", "t", "recep", { tenu: true }), D("t", "3 !")
      ]);
      s.chapitre("Temps 2");
      s.etape("Service, réception", "Même départ : service, réception sur la target.", [
        X("x1"), B("x2", "l", "service"), B("x2", "t", "recep")
      ]);
      s.etape("Balle bidouillée", "La target renvoie une balle bidouillée.", [
        P(M("r2", [-3.6, 5.6], { d: 0.8 }), B("x2", "r2", "bidouille"))
      ]);
      s.etape("Passe de transition", "On la remonte en passe de transition, vers le bout de filet.", [
        B("x2", [-0.9, 1.6], "transi", { sol: true }), PT([-0.9, 1.6], "Transi")
      ]);
    }
  };

  const continuite = EX.continuite3m({
    central: true,
    bloc: {
      id: "exo2",
      n: "Exo 2",
      titre: "Continuité sur attaque à 3 m",
      dispositif: "continuité sur attaque à 3 m, passeurs et libéro fixes.",
      plus: [
        ["Palier", "rajouter le central, qui attaque dans des zones définies, en appuyant les ballons."],
        ["Départ", "en dix doigts poussés fort (format du 11/09), puis on lâche le bras dès que les échanges tiennent."],
        ["Zones", "celles du central sont matérialisées (plots) et comptées : le jeu au centre, clé pour le passeur, est absent depuis le 16/09."],
        ["À regarder", "le geste de bras d'un attaquant (attaque « plaquée » au tournoi) et faire passer la doublure envisagée."]
      ]
    }
  });

  const circuit = EX.circuitTransition({
    variante: "construction",
    bloc: {
      id: "exo3",
      n: "Exo 3",
      titre: "Circuit fermé — construction en continu",
      dispositif: "circuit fermé, le ballon ne s'arrête pas. L'attaque part du filet, n'importe où sur le terrain.",
      plus: [
        ["Défi", "compter les constructions d'affilée et fixer un record à battre."],
        ["Bidouilles", "exiger le pas de plus : la « mentalité de chien » réclamée au tournoi."],
        ["À 12", "deux circuits de 6 en parallèle, avec une rotation fixée après chaque attaque."]
      ],
      valider: "J'ai repris les rôles et la rotation du circuit fermé à 6 du 18/09. La fiche laisse l'attaque partir « n'importe où ».",
    }
  });

  const blocDefense = {
    id: "exo4",
    n: "Exo 4",
    titre: "Bloc-défense sur passe connue — les ailes",
    dispositif: "un six au bloc et en défense, qui sait où va le ballon. En face, une équipe qui attaque en 4 puis en 2.",
    texte: [
      "Travailler le bloc et la défense en sachant où va le ballon : technique de bloc et respect des consignes de défense, plutôt que la lecture du jeu.",
      "Oublier un peu le bloc au centre : on se concentre sur les ailes.",
      "Alterner 4 et 2, pour que l'attaque se force aussi à chercher des solutions."
    ],
    plus: [
      ["Système du 23/09", "bloc à 2, 3e joueur au filet sur la diagonale courte, un défenseur sur la ligne."],
      ["Poste 6", "avancé quand le passeur est à l'avant, dès l'exercice."],
      ["Au bloc", "les ailes mettent R4 et pointus au bloc : exiger arrêt, fermeture, franchissement."],
      ["Séries", "alterner par séries (3 en 4, puis 3 en 2) : l'attaquant cherche la main extérieure, la ligne ou le bloc-out."],
      ["Avant", "10 min de gammes de bloc juste avant si possible."]
    ],
    valider: "Le six qui défend est en blanc, l'attaque en orange, mise en jeu par une relance du coach.",
    scene: function (s) {
      EX.ballons(s, {
        intro: "L'équipe blanche travaille son bloc et sa défense en sachant où va le ballon. L'équipe orange attaque.",
        phases: [
          { chapitre: "Passe en 4", type: "relance", pour: "A", en: "4", annonce: "En 4 !", fin: "defendu", etapes: [
            ["Passe annoncée : en 4", "La passe est connue à l'avance. Relance, et le six se prépare."],
            ["Bloc à 2, défense en place", "Bloc à 2, 3e joueur du filet sur la diagonale courte, un défenseur sur la ligne."]] },
          { chapitre: "Passe en 2", type: "relance", pour: "A", en: "2", annonce: "En 2 !", pop: "Bloc-out", etapes: [
            ["Passe annoncée : en 2", "On alterne : cette fois la passe part en 2."],
            ["L'attaque cherche des solutions", "Même système de l'autre côté. L'attaquant cherche la main extérieure, la ligne ou le bloc-out."]] }
        ],
        fin: ["Par séries", "On alterne par séries : 3 en 4, puis 3 en 2.", "Séries"]
      });
    }
  };

  const jeu = {
    id: "exo5",
    n: "Exo 5",
    titre: "Jeu avec conditions — 6 ballons",
    dispositif: "6 contre 6. 6 ballons, 3 de chaque côté.",
    tableau: {
      tetes: ["Ballon", "Mise en jeu", "Point travaillé"],
      lignes: [
        ["Service", "Appliquer une consigne au service", "Gestion de l'intervalle"],
        ["Relance", "Chercher une zone un peu chiante", "Communication du libéro"],
        ["Défense", "Viser le cœur du terrain", "Se battre sur le ballon"]
      ]
    },
    plus: [
      ["Score", "on compte les points, avec un bonus quand une défense est convertie en contre-attaque gagnante."],
      ["Service", "seuil de fautes par set, mesuré ici en opposition ; annonce vocale du libéro (son axe de progrès)."],
      ["Stats", "feuille simple (réception 0·1·2·3, service) tenue par un blessé ou le staff : test avant le tournoi."]
    ],
    valider: "Animé pour un camp (les 3 ballons de l'équipe orange) ; relance et attaque envoyées par le coach.",
    scene: function (s) {
      EX.ballons(s, {
        intro: "6 contre 6. Chaque camp joue 3 ballons : un service, une relance, une défense.",
        phases: [
          { chapitre: "Ballon 1 · Service", type: "service", pour: "A", etapes: [
            ["Consigne au service", "Le serveur applique une consigne. En réception : gestion de l'intervalle."],
            ["On joue le point", "Réception, construction, attaque."]] },
          { chapitre: "Ballon 2 · Relance", type: "relance", pour: "A", en: "2", etapes: [
            ["Relance dans une zone chiante", "La relance cherche une zone un peu chiante : le libéro doit communiquer."],
            ["On joue le point", "Annonce du libéro, puis construction."]] },
          { chapitre: "Ballon 3 · Défense", type: "attaque", pour: "A", pop: "+1 bonus", etapes: [
            ["Attaque au cœur du terrain", "L'attaque vise le cœur du terrain : il faut se battre sur le ballon."],
            ["Contre-attaque", "Défense convertie en contre-attaque gagnante : point bonus."]] }
        ],
        fin: ["Idem de l'autre côté", "Mêmes 3 ballons pour l'autre camp, soit 6 ballons. On compte les points."]
      });
    }
  };

  const atelierA = {
    id: "atelier-a",
    n: "Atelier A",
    titre: "Défense des libéros",
    dispositif: "attaques répétées en 4, dispositif fixe : un seul attaquant sur les 2 libéros à la suite (une série sur un libéro, une série sur l'autre). En parallèle de l'atelier B.",
    valider: "J'ai ajouté un passeur pour alimenter l'attaquant, et placé le libéro dans la diagonale.",
    scene: function (s) {
      const POSTE = [-5.6, 2.6], ELAN = [3.4, 8.0], FRAPPE = [0.9, 7.65];
      s.zone("coeur", { x: -4.3, y: 4.5, r: 1.35 }, { label: "cœur de terrain" });
      s.j("bp", [0.9, 3.0], "P", "b");
      s.j("ba", ELAN, "A", "b");
      s.j("l1", POSTE, "L", "a", { lib: true });
      s.j("l2", [-10.4, 2.6], "L", "a", { lib: true });
      s.ballon("x", "bp").ballon("y", null);
      const serie = (b) => [
        P(M("ba", FRAPPE, { d: 0.95 }), B(b, "ba", "passe")), S("ba"), B(b, "l1", "attaque"),
        B(b, [-4.3, 4.6], "defense", { h: 1.1, sol: true })
      ];
      s.etape("Mise en place", "Un seul attaquant en 4, alimenté par un passeur. En face, un libéro en défense, l'autre attend.", [W(0.6)]);
      s.etape("Attaque en 4 sur le libéro", "Attaque répétée en 4, sur le libéro. Défense vers le cœur du terrain.", serie("x"));
      s.etape("Une série complète", "Le dispositif ne bouge pas : les attaques s'enchaînent sur le même libéro.", [
        X("x"), M("ba", ELAN, { d: 0.8 }), A("y", "bp")
      ].concat(serie("y")));
      s.etape("Au tour de l'autre libéro", "Une série sur un libéro, une série sur l'autre.", [
        X("y"),
        P(M("ba", ELAN, { d: 0.8 }), [M("l1", [-9.6, 0.7], { d: 1.1 }), M("l1", [-10.4, 4.6], { d: 0.9 })], M("l2", POSTE, { d: 1.2 })), W(0.4)
      ]);
    }
  };

  const atelierB = {
    id: "atelier-b",
    n: "Atelier B",
    titre: "Jeu à 8 · 8 joueurs",
    dispositif: "les 8 joueurs restants, pendant l'atelier des libéros.",
    tableau: {
      tetes: ["Ballon", "Ce qui se passe"],
      lignes: [
        ["1", "Service / réception avec enchaînement libre (1 bloc au centre, pas plus)."],
        ["2", "Self-attaque en 1 du pointu ou du passeur, puis reconstruction et point derrière."],
        ["3", "Saut de bloc à l'aile d'un joueur désigné (un faux saut), puis on lui envoie un ballon : il doit faire la passe en 1, et le 5 essaie de défendre et de reconstruire."]
      ]
    },
    valider: "Pas d'animation pour cet atelier : la répartition des 8 joueurs n'est pas écrite."
  };

  const axes = ["Service / Réception", "Défense / Construction", "Bloc-défense sur les ailes"];

  N3M.seance({
    id: "2026-09-30",
    jour: "Mercredi",
    date: "30/09/2026",
    joueurs: 12,
    axes: axes,
    blocs: [manchette, gamme, continuite, circuit, blocDefense, jeu]
  });

  N3M.seance({
    id: "2026-09-30-bis",
    jour: "Mercredi",
    date: "30/09/2026 (bis)",
    joueurs: 12,
    axes: axes,
    note: "variante avec deux ateliers en parallèle",
    blocs: [manchette, gamme, continuite, atelierA, atelierB, circuit, blocDefense, jeu]
  });
})();

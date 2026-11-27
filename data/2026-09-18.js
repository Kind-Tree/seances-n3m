/* Séance N3M du vendredi 18/09/2026 — 12 joueurs. */
(function () {
  "use strict";
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-09-18",
    jour: "Vendredi",
    date: "18/09/2026",
    joueurs: 12,
    axes: ["Défense / Transition", "Attaque au filet", "Jeu en opposition"],
    blocs: [
      { id: "echauffement", n: "Échauffement", titre: "Déverrouillage / échauffement", texte: ["Déverrouillage musculaire.", "Échauffement ballon par 2."] },

      EX.circuitTransition({
        bloc: {
          id: "exo1",
          n: "Exo 1",
          titre: "Circuit fermé à 6 — défense / transition",
          dispositif: "6 joueurs par terrain, 2 terrains en parallèle.",
          texte: ["Objectif : enchaîner attaque, défense cœur de terrain et passe de transition sans temps mort."],
          tableau: {
            tetes: ["Rôle", "Nombre", "Mission"],
            lignes: [
              ["Attaque au filet", "2", "Attaque puis reçoit la passe de transition"],
              ["Défense", "1", "Défense cœur de terrain"],
              ["Transition", "1", "Passe de transition vers le poste 4"],
              ["Attente", "2", "Prêts à entrer en défense"]
            ]
          },
          plus: [["Rotation des rôles", "attaque → attente → défense → transition → attaque."]],
          valider: "Pour la deuxième boucle, j'ai placé le nouveau défenseur en poste 1 et fait partir la transition vers le poste 2 : le circuit tourne en miroir."
        }
      }),

      EX.continuite3m({
        bloc: {
          id: "choix-a",
          n: "Au choix · A",
          titre: "Attaque 3 m puis au fil",
          dispositif: "continuité sur de l'attaque à 3 m, puis au filet. Passeur et libéro fixes.",
          texte: ["Constat de mercredi : attaquer sur les coéquipiers au filet a été compliqué."],
          valider: "L'animation montre la continuité à 3 m ; le passage au filet garde le même dispositif."
        }
      }),

      EX.gammePasseBloc({
        bloc: {
          id: "choix-b",
          n: "Au choix · B",
          titre: "Gamme de passe avec bloc",
          dispositif: "d'un côté : 1 passeur et 1 libéro qui bossent, le 2e passeur en bout de filet. En face, le bloc se déplace en continu selon la passe.",
          texte: ["Relance sur le libéro, qui distribue au passeur.", "Rotation des joueurs au bloc comme à la passe."],
          plus: [["Variante", "même travail sur des transitions du libéro ?"]],
          valider: "J'ai fait envoyer les relances par le coach et mis une cible à chaque bout de filet (dont le 2e passeur)."
        }
      }),

      {
        id: "opposition-1",
        n: "Opposition · séquence 1",
        titre: "Jeu décousu / cardio",
        dispositif: "6 contre 6. Départ sur service, 18 ballons dans le caddie.",
        texte: ["Objectif : enchaîner beaucoup de phases de jeu décousues, avec du cardio."],
        valider: "Les attaques montrées sont des exemples ; l'entraîneur relance dans l'un ou l'autre terrain.",
        scene: function (s) {
          EX.ballons(s, {
            intro: "6 contre 6, 18 ballons dans le caddie. L'entraîneur est au bord du terrain.",
            phases: [
              { chapitre: "Départ sur service", type: "service", pour: "B", etapes: [
                ["Service", "Départ sur service."],
                ["Point perdu", "Dès que le point est perdu, le ballon part derrière."]] },
              { chapitre: "Relance immédiate", type: "relance", pour: "A", en: "2", etapes: [
                ["Relance de l'entraîneur", "L'entraîneur envoie aussitôt une relance dans l'un des deux terrains."],
                ["Jeu décousu", "On joue le point, sans se replacer tranquillement."]] },
              { chapitre: "Et encore", type: "relance", pour: "B", en: "fixe", etapes: [
                ["Dans l'autre terrain", "Nouvelle relance, de l'autre côté cette fois."],
                ["Du cardio", "On enchaîne beaucoup de phases de jeu décousues, jusqu'à vider le caddie."]] }
            ],
            fin: ["18 ballons", "La séquence dure jusqu'à ce que les 18 ballons du caddie soient joués.", "Fin de séquence"]
          });
        }
      },

      {
        id: "opposition-2",
        n: "Opposition · séquence 2",
        titre: "6 ballons, 3 par camp",
        dispositif: "6 contre 6, sur tout le reste de la séance.",
        tableau: {
          tetes: ["Ballon", "Situation"],
          lignes: [
            ["Service", "Mise en jeu classique"],
            ["Manchette", "Ballon de l'entraîneur à l'équipe, qui fait un retour direct"],
            ["Second contact", "Qui prend : passeur ou libéro ?"]
          ]
        },
        texte: ["Idem de l'autre côté, soit 6 ballons par séquence.", "On compte les points : c'est un match."],
        plus: [["À valider", "changement des 6 entre les sets ?"]],
        valider: "Second contact : j'ai fait prendre le 1er ballon par le passeur, et le libéro joue la passe.",
        scene: function (s) {
          EX.ballons(s, {
            intro: "6 contre 6. Chaque camp joue 3 ballons : service, manchette, second contact.",
            phases: [
              { chapitre: "Ballon 1 · Service", type: "service", pour: "A", etapes: [
                ["Mise en jeu classique", "Service, réception."],
                ["On joue le point", "C'est un match : on compte les points."]] },
              { chapitre: "Ballon 2 · Manchette", type: "direct", pour: "B", fin: "defendu", etapes: [
                ["Retour direct", "Ballon de l'entraîneur à l'équipe, qui fait un retour direct en manchette."],
                ["Ballon facile en face", "L'adversaire construit sur ce ballon facile : il faut défendre."]] },
              { chapitre: "Ballon 3 · Second contact", type: "passeur", pour: "A", etapes: [
                ["Le passeur prend le 1er contact", "Qui prend le second contact : passeur ou libéro ? Ici le libéro annonce."],
                ["On joue le point", "Passe du libéro, attaque."]] }
            ],
            fin: ["Idem de l'autre côté", "Mêmes 3 ballons pour l'autre camp, soit 6 ballons par séquence."]
          });
        }
      },

      {
        id: "bilan",
        n: "Bilan",
        titre: "Bilan de la séance",
        tableau: {
          tetes: ["Points positifs", "Points de vigilance"],
          lignes: [
            ["Beaucoup de ballons touchés et d'enchaînements.", "Peu de service / réception vraiment travaillé."],
            ["De la défense / transition.", "Pas de spécifique poste ni de situation ciblée."],
            ["Du jeu en situation réelle.", ""]
          ]
        }
      }
    ]
  });
})();

/* Répertoire par thème : un ou deux thèmes par exercice, clé « <séance>-<exercice> ».
   Un exercice absent de cette liste apparaît dans « À classer » ; une liste vide ([]) le laisse hors du répertoire. */
(function () {
  "use strict";

  N3M.themes = {
    liste: [
      ["echauffement", "Échauffement et petits jeux"],
      ["physique", "Physique"],
      ["service", "Service / réception"],
      ["passe", "Passe et manip de balle"],
      ["attaque", "Attaque"],
      ["bloc", "Bloc"],
      ["defense", "Défense et transition"],
      ["systeme", "Système de jeu et side-out"],
      ["opposition", "Opposition et formes jouées"]
    ],
    exos: {
      "2026-08-28-luc-leger": ["physique"],
      "2026-08-28-explosivite": ["physique"],
      "2026-08-28-gainage": ["physique"],
      "2026-08-28-square": ["defense", "attaque"],
      "2026-08-28-attaque-defense": ["attaque", "defense"],
      "2026-08-28-service-reception": ["service"],

      "2026-09-11-passe-et-suit": ["echauffement"],
      "2026-09-11-manchette": ["echauffement"],
      "2026-09-11-exo1": ["defense", "attaque"],
      "2026-09-11-exo2": ["attaque", "defense"],
      "2026-09-11-exo3": ["service"],

      "2026-09-16-passe-et-suit": ["echauffement"],
      "2026-09-16-manchette": ["echauffement"],
      "2026-09-16-exo1": ["defense"],
      "2026-09-16-ateliers": ["service", "attaque"],
      "2026-09-16-exo2": ["opposition"],

      "2026-09-18-echauffement": ["echauffement"],
      "2026-09-18-exo1": ["defense"],
      "2026-09-18-choix-a": ["attaque"],
      "2026-09-18-choix-b": ["passe", "bloc"],
      "2026-09-18-opposition-1": ["opposition"],
      "2026-09-18-opposition-2": ["opposition"],
      "2026-09-18-bilan": [],

      "2026-09-23-echauffement": ["echauffement"],
      "2026-09-23-deux-contre-deux": ["echauffement"],
      "2026-09-23-trois-contre-trois": ["echauffement"],
      "2026-09-23-exo1": ["service"],
      "2026-09-23-exo2": ["defense", "bloc"],

      "2026-09-30-manchette": ["echauffement"],
      "2026-09-30-exo1": ["service"],
      "2026-09-30-exo2": ["attaque", "defense"],
      "2026-09-30-exo3": ["defense"],
      "2026-09-30-exo4": ["bloc", "systeme"],
      "2026-09-30-exo5": ["opposition"],

      "2026-09-30-bis-manchette": ["echauffement"],
      "2026-09-30-bis-exo1": ["service"],
      "2026-09-30-bis-exo2": ["attaque", "defense"],
      "2026-09-30-bis-atelier-a": ["defense"],
      "2026-09-30-bis-atelier-b": ["opposition"],
      "2026-09-30-bis-exo3": ["defense"],
      "2026-09-30-bis-exo4": ["bloc", "systeme"],
      "2026-09-30-bis-exo5": ["opposition"],

      "2026-10-07-debrief": [],
      "2026-10-07-manchette": ["echauffement"],
      "2026-10-07-atelier-a": ["defense"],
      "2026-10-07-atelier-b": ["attaque", "bloc"],
      "2026-10-07-exo2": ["passe", "bloc"],
      "2026-10-07-forme-1": ["systeme"],
      "2026-10-07-forme-2": ["opposition"],

      "2026-10-14-causerie": [],
      "2026-10-14-manchette": ["echauffement"],
      "2026-10-14-exo1": ["passe", "defense"],
      "2026-10-14-atelier-a": ["attaque"],
      "2026-10-14-atelier-b": ["service", "attaque"],
      "2026-10-14-forme-jouee": ["systeme"],

      "2026-10-21-plan-de-jeu": ["echauffement"],
      "2026-10-21-manchette": ["echauffement"],
      "2026-10-21-exo1": ["defense", "passe"],
      "2026-10-21-exo2": ["defense"],
      "2026-10-21-exo3": ["service", "passe"],
      "2026-10-21-forme-jouee": ["systeme"],

      "2026-10-28-debrief": ["echauffement"],
      "2026-10-28-manchette": ["echauffement"],
      "2026-10-28-exo1": ["passe"],
      "2026-10-28-exo2": ["attaque", "service"],
      "2026-10-28-exo3": ["opposition"],

      "2026-10-30-passe-et-suit": ["echauffement"],
      "2026-10-30-gagne-terrain": ["echauffement"],
      "2026-10-30-exo1": ["defense"],
      "2026-10-30-exo2": ["bloc"],
      "2026-10-30-exo3": ["defense", "attaque"],
      "2026-10-30-exo4": ["systeme"],

      "2026-11-04-passe-et-suit": ["echauffement"],
      "2026-11-04-manchette": ["echauffement"],
      "2026-11-04-exo1": ["attaque", "defense"],
      "2026-11-04-exo2": ["defense"],
      "2026-11-04-exo3": ["service"],
      "2026-11-04-exo4": ["systeme", "opposition"],

      "2026-11-06-passe-et-suit": ["echauffement"],
      "2026-11-06-manchette": ["echauffement"],
      "2026-11-06-exo1": ["attaque", "defense"],
      "2026-11-06-exo2": ["passe", "defense"],
      "2026-11-06-exo3": ["service", "attaque"],
      "2026-11-06-exo4": ["systeme"],

      "2026-11-13-echauffement": ["echauffement"],
      "2026-11-13-manchette": ["echauffement"],
      "2026-11-13-exo1": ["defense"],
      "2026-11-13-exo2": ["passe", "defense"],
      "2026-11-13-exo3": ["service", "attaque"],
      "2026-11-13-exo4": ["systeme"],

      "2026-11-18-passe-et-suit-carre": ["echauffement"],
      "2026-11-18-manchette": ["echauffement"],
      "2026-11-18-exo1": ["bloc", "passe"],
      "2026-11-18-exo2": ["service"],
      "2026-11-18-exo3a": ["attaque"],
      "2026-11-18-exo3b": ["opposition"],

      "2026-11-27-passe-et-suit": ["echauffement"],
      "2026-11-27-manchette": ["echauffement"],
      "2026-11-27-exo1": ["defense"],
      "2026-11-27-exo2": ["attaque", "defense"],
      "2026-11-27-exo3": ["opposition", "systeme"]
    }
  };
})();

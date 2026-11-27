/* Séance N3M du vendredi 11/09/2026 — 11 joueurs, 1 central. */
(function () {
  "use strict";
  const { B, M, P, W, S, X } = N3M.a;
  const EX = N3M.exos;
  const REP = EX.REP;

  N3M.seance({
    id: "2026-09-11",
    jour: "Vendredi",
    date: "11/09/2026",
    joueurs: 11,
    note: "1 central · à prévoir : 2 chariots de ballons, plots de zones service / réception, chasubles, chronomètre",
    axes: ["Défense", "Réception", "Bloc", "Relation passe-attaque"],
    blocs: [
      EX.passeEtSuit({ bloc: { titre: "Mise en route — passe et suit par 3", texte: ["Déverrouillage musculaire, puis échauffement par 3, en mode passe et suit."] } }),
      EX.jeuManchette({ variante: "hors3m", attente: 3, bloc: { titre: "Jeu de la manchette hors 3 m" } }),

      EX.circuitTransition({
        bloc: {
          id: "exo1",
          n: "Exo 1",
          titre: "Circuit défense / passe transi / attaque",
          dispositif: "circuit monté de chaque côté du filet. Après avoir fait l'attaque, on passe de l'autre côté.",
          valider: "L'animation montre le circuit d'un côté du filet, avec la rotation du circuit fermé du 18/09. Sur la fiche, l'attaquant passe de l'autre côté après son attaque : ce changement de côté n'est pas animé."
        }
      }),

      EX.continuite3m({
        dixDoigts: true,
        bloc: {
          id: "exo2",
          n: "Exo 2",
          titre: "Continuité attaque 3 m",
          dispositif: "de chaque côté : un passeur et un libéro, les attaquants derrière la ligne des 3 m.",
          texte: ["Départ en dix doigts poussés fort, pour installer la continuité. On lâche le bras progressivement : dès que les échanges tiennent, on attaque pour de vrai."]
        }
      }),

      {
        id: "exo3",
        n: "Exo 3",
        titre: "Gamme service / réception — 4 paliers",
        dispositif: "base : 3 réceptionneurs + 1 en attente. Pas d'attaque pour commencer : après la réception, on envoie une attaque pied au sol vers le serveur. Enchaînement de services.",
        tableau: {
          tetes: ["Palier", "Ajout"],
          lignes: [
            ["1", "Un attaquant qui attaque sur la réception. Relance envoyée derrière : il doit enchaîner 2 attaques de suite."],
            ["2", "Un bloc, en indiquant à l'avance si la passe part en 2 ou en 4 : formation, annonce du bloc et du renfort diag / ligne. Le bloc sait où ça va, donc prévoir le soutien."],
            ["3", "Après le travail sur relance : sur deuxième balle, attaque sur le passeur ou le libéro — attaques hors système."]
          ]
        },
        plus: [
          ["Points travaillés", "défense +++, réception +++, bloc ++, relation passe-attaque ++."],
          ["Points négligés", "attaque avec le central (éventuellement des gammes à la fin si le temps le permet), relance, pipe."]
        ],
        valider: "Base et palier 1 animés ; les paliers 2 et 3 sont dans le tableau. J'ai fait frapper l'attaque pied au sol par le joueur qui reçoit la réception au filet, et envoyer la relance par le joueur en attente.",
        scene: function (s) {
          const ELAN = [-3.6, 1.0];
          s.j("r1", [-5.4, 2.6], "R", "a");
          s.j("l", [-6.4, 4.8], "L", "a", { lib: true });
          s.j("r2", [-5.4, 7.1], "R", "a");
          s.j("p", REP.passeur, "P", "a");
          s.j("at", ELAN, "A", "a");
          s.j("w", [-7.0, -1.2], "", "c", { nom: "attente" });
          s.j("s1", [10.2, 2.5], "S", "b");
          s.j("s2", [10.2, 6.5], "S", "b");
          s.ballon("x1", "s1").ballon("x2", "s2").ballon("x3", "w");
          s.etape("Mise en place", "3 réceptionneurs et 1 en attente. En face, les serveurs.", [W(0.6)]);
          s.chapitre("Base");
          s.etape("Service, réception", "Pas d'attaque pour commencer : on soigne la réception.", [
            B("x1", "r2", "service"), B("x1", "p", "recep")
          ]);
          s.etape("Attaque pied au sol vers le serveur", "Après la réception, on envoie une attaque pied au sol vers le serveur, qui défend.", [
            B("x1", "s1", "attaque", { tenu: true })
          ]);
          s.etape("Enchaînement de services", "Le serveur suivant envoie tout de suite.", [
            B("x2", "l", "service"), B("x2", "p", "recep"), B("x2", "s2", "attaque", { tenu: true })
          ]);
          s.chapitre("Palier 1");
          s.etape("Un attaquant sur la réception", "On ajoute un attaquant, qui attaque sur la réception.", [
            B("x1", "r1", "service"), B("x1", "p", "recep"),
            P(M("at", REP.att4, { d: 0.95 }), B("x1", "at", "passe")), S("at"), B("x1", [6.4, 5.4], "attaque", { sol: true })
          ]);
          s.etape("Relance derrière : 2 attaques de suite", "Une relance est envoyée juste derrière : il doit enchaîner 2 attaques de suite.", [
            X("x1"),
            P(M("at", ELAN, { d: 0.8 }), B("x3", "l", "relance")), B("x3", "p", "recep"),
            P(M("at", REP.att4, { d: 0.95 }), B("x3", "at", "passe")), S("at"), B("x3", [6.8, 7.2], "attaque", { sol: true })
          ]);
        }
      }
    ]
  });
})();

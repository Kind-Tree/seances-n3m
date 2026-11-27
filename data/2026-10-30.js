/* Séance N3M du vendredi 30/10/2026 — 9 joueurs. */
(function () {
  "use strict";
  const { B, M, P, W, S, BL, D, PT, A, X, F, FL } = N3M.a;
  const EX = N3M.exos;

  N3M.seance({
    id: "2026-10-30",
    jour: "Vendredi",
    date: "30/10/2026",
    joueurs: 9,
    axes: ["Défense / contre-attaque", "Bloc", "Construction en transition", "QI volley"],
    blocs: [
      EX.passeEtSuit({
        bloc: {
          titre: "Déverrouillage par groupes de 3",
          texte: ["Déverrouillage dynamique par groupes de 3."],
          valider: "La fiche dit seulement « par groupes de 3 » : j'ai repris le passe et suit, de part et d'autre du filet."
        }
      }),
      EX.jeuManchette({
        variante: "deuxTouches",
        attente: 1,
        bloc: {
          id: "gagne-terrain",
          titre: "2v2 gagne-terrain",
          dispositif: "2 contre 2 en 2 touches de balle, en gagne-terrain, chaque binôme sur un demi-terrain en longueur.",
          texte: ["D'abord uniquement en manchette, puis évolution progressive avec saut et attaque."],
          plus: [["À 9", "le 9e remplace le binôme perdant ; tous les terrains changent d'étape en même temps."]]
        }
      }),

      {
        id: "exo1",
        n: "Exo 1",
        titre: "Course, communication et construction",
        dispositif: "les 9 joueurs sont du même côté, en dehors du terrain. Le coach envoie un ballon sur le terrain opposé.",
        plus: [
          ["Coach", "envoyer la relance à plusieurs endroits, pour que la routine ne s'installe pas."],
          ["Rythme", "3 trios qui s'enchaînent sans temps mort ; compter les attaques construites jusqu'au bout, record à battre par trio."],
          ["Annonces", "obligatoires : celui qui prend le 1er ballon (« J'ai ! ») et celui qui fait la passe, comme sur une défense en match."]
        ],
        valider: "J'ai placé les trios le long de la ligne de côté et fait repartir l'attaque vers le camp de départ. À corriger si les joueurs partent du fond ou si l'attaque va ailleurs.",
        scene: function (s) {
          const xs = [-1.3, -2.4, -3.5, -4.9, -6.0, -7.1, -8.5, -9.6, -10.7];
          const eq = ["a", "a", "a", "b", "b", "b", "c", "c", "c"];
          xs.forEach((x, i) => s.j("j" + (i + 1), [x, -1.3], i + 1, eq[i]));
          s.coach("co", [-2.6, 10.3]);
          s.caddie(-4.1, 10.35);
          s.ballon("x1", "co").ballon("x2", null);
          s.etape("Mise en place", "Les 9 joueurs du même côté, en dehors du terrain, par trios. Le coach a le caddie.", [W(0.6)]);
          s.chapitre("Trio 1");
          s.etape("Le coach envoie, on court", "Le coach envoie un ballon sur le terrain opposé. Le trio court : il a droit à un rebond.", [
            P(
              M("j1", [6.6, 5.9], { d: 1.7 }), M("j2", [0.9, 3.0], { d: 1.5 }), M("j3", [3.6, 8.0], { d: 1.6 }),
              [B("x1", [5.6, 5.2], "relance", { sol: true }), D("j1", "J'ai !"), B("x1", "j1", "rebond")]
            )
          ]);
          s.etape("Construire l'attaque", "On annonce qui prend le premier ballon et qui fait la passe, puis on construit jusqu'à l'attaque.", [
            P(B("x1", "j2", "recep"), D("j2", "Passe !")),
            P(M("j3", [0.9, 7.65], { d: 1.0 }), B("x1", "j3", "passe")),
            S("j3"), B("x1", [-6.4, 2.2], "attaque", { sol: true }), PT("j3", "1 !")
          ]);
          s.chapitre("Trio 2");
          s.etape("Autre endroit", "Le trio suivant part sans temps mort. Le coach change d'endroit pour que la routine ne s'installe pas.", [
            X("x1"), A("x2", "co"),
            P(
              M("j1", [-4.9, -1.3], { d: 1.9 }), M("j2", [-6.0, -1.3], { d: 1.9 }), M("j3", [-7.1, -1.3], { d: 1.9 }),
              M("j4", [4.3, 1.2], { d: 1.7, delai: 0.4 }), M("j5", [0.9, 3.0], { d: 1.7, delai: 0.4 }), M("j6", [3.6, 8.0], { d: 1.8, delai: 0.4 }),
              [W(0.4), B("x2", [2.6, 2.2], "relance", { sol: true }), D("j4", "J'ai !"), B("x2", "j4", "rebond")]
            )
          ]);
          s.etape("Jusqu'au bout", "Même travail : annonces, passe, attaque. On compte les attaques construites jusqu'au bout.", [
            P(B("x2", "j5", "recep"), D("j5", "Passe !")),
            P(M("j6", [0.9, 7.65], { d: 1.0 }), B("x2", "j6", "passe")),
            S("j6"), B("x2", [-5.4, 6.4], "attaque", { sol: true }), PT("j6", "1 !")
          ]);
        }
      },

      {
        id: "exo2",
        n: "Exo 2",
        titre: "Bloc",
        dispositif: "2 joueurs sur un banc, 7 joueurs en face au bloc. Les joueurs sur le banc ont 2 ballons chacun, qu'ils tiennent au-dessus du filet.",
        plus: [
          ["Déplacement", "deux colonnes face aux deux bancs, avec un déplacement avant chaque contact (pas chassé, puis pas croisé)."],
          ["Filet", "mains au-dessus du filet, pas de contact filet : filet touché = on recommence."],
          ["Banc", "changer les joueurs du banc toutes les 2 à 3 min."]
        ],
        valider: "Deux colonnes face aux deux bancs, avec un déplacement latéral avant le bloc : c'est la piste d'amélioration de la fiche. À corriger si les 7 passent en une seule file.",
        scene: function (s) {
          const XS = [-2.2, -3.5, -4.8, -6.1];
          // y : colonne ; yb : face au banc ; hors : couloir de retour ; ext / int : ballon côté ligne / côté centre.
          const cols = [
            { y: 1.0, yb: 2.5, hors: -0.6, ext: 2.15, int: 2.85, ids: ["c1", "c2", "c3", "c4"] },
            { y: 8.0, yb: 6.5, hors: 9.6, ext: 6.85, int: 6.15, ids: ["d1", "d2", "d3"] }
          ];
          s.cadre("A");
          let num = 1;
          cols.forEach((c, k) => {
            s.banc(1.0, c.yb, { long: 1.9 });
            s.j("h" + k, [1.0, c.yb], "B", "b");
            s.ballon("be" + k, [0.15, c.ext]).ballon("bi" + k, [0.15, c.int]);
            c.ids.forEach((id, i) => s.j(id, [XS[i], c.y], num++, "a"));
          });
          const devant = (r) => cols.map((c) => c.ids[r % c.ids.length]);
          const aller = (r) => P.apply(null, cols.map((c) => M(c.ids[r % c.ids.length], [-0.85, c.yb], { d: 0.9 })));
          // Le bloqueur repart en bout de colonne, les autres avancent d'un cran.
          const retour = (r) => P.apply(null, cols.map((c) => {
            const n = c.ids.length;
            const id = c.ids[r % n];
            const suite = [];
            for (let i = 1; i < n; i++) suite.push(M(c.ids[(r + i) % n], [XS[i - 1], c.y], { d: 0.7, delai: 0.5 }));
            return P.apply(null, [[M(id, [-1.5, c.hors], { d: 0.6 }), M(id, [XS[n - 1], c.hors], { d: 1.1 }), M(id, [XS[n - 1], c.y], { d: 0.5 })]].concat(suite));
          }));
          const texte = (cle, mot) => P.apply(null, cols.map((c) => PT([0.15, c[cle]], mot)));

          s.etape("Mise en place", "2 joueurs sur un banc, 2 ballons chacun tenus au-dessus du filet. En face, 7 bloqueurs sur deux colonnes.", [W(0.6)]);
          s.etape("1 · Appuyer sur les deux ballons", "Déplacement, saut, et on appuie d'abord sur les deux ballons, une main sur chacun.", [
            aller(0), BL(devant(0)), P(texte("ext", "appui"), texte("int", "appui"))
          ]);
          s.etape("2 · Main extérieure, ballon intérieur", "Le suivant vient chercher un ballon : la main extérieure sur le ballon intérieur.", [
            retour(0), aller(1), BL(devant(1)), texte("int", "main ext.")
          ]);
          s.etape("3 · Main intérieure, ballon extérieur", "Puis la main intérieure sur le ballon extérieur.", [
            retour(1), aller(2), BL(devant(2)), texte("ext", "main int.")
          ]);
          s.etape("On tourne", "Mains au-dessus du filet, sans le toucher. On change les joueurs du banc toutes les 2 à 3 minutes.", [
            retour(2), W(0.4)
          ]);
        }
      },

      {
        id: "exo3",
        n: "Exo 3",
        titre: "Défense + contre-attaque",
        dispositif: "2 joueurs sur un banc, 6 joueurs en défense et contre-attaque.",
        texte: ["Alternance attaque / bidouille / block-out pour la défense, puis reconstruction."],
        plus: [
          ["Palier", "ajouter un second ballon juste après la reconstruction, pour simuler un bloc par exemple."],
          ["À 9", "le 9e alimente les joueurs du banc en ballons et remplace un défenseur à chaque série."],
          ["Soutien", "sur le second ballon, soutien en arc de cercle sous l'attaquant, comme le 28/10."]
        ],
        valider: "J'ai mis un banc en 4 et un banc en 2 en face, et le second ballon du palier lâché par le joueur du banc devant l'attaquant. À corriger si les deux bancs sont côte à côte.",
        scene: function (s) {
          const T = EX.equipe(s, "A", "a");
          s.banc(1.0, 7.6, { long: 1.9 });
          s.banc(1.0, 1.4, { long: 1.9 });
          s.j("h4", [1.0, 7.6], "B", "b");
          s.j("h2", [1.0, 1.4], "B", "b");
          s.j("j9", [3.0, 10.3], 9, "c");
          s.caddie(4.4, 10.35);
          s.ballon("x1", "h4").ballon("x2", "h2").ballon("x3", null).ballon("x4", null);
          const contre = (b, vers) => [T.passe(b, "4"), B(b, vers, "attaque", { sol: true }), X(b)];

          s.etape("Mise en place", "2 joueurs sur un banc au filet, un six en défense en face. Le 9e alimente les bancs en ballons.", [W(0.6)]);
          s.chapitre("Ballon 1 · Attaque");
          s.etape("Attaque à défendre", "Le banc attaque, bloc et défense en place.", [
            T.vers("def4", { d: 0.9 }), P(T.bloc("4"), S("h4")), B("x1", "al", "attaque")
          ]);
          s.etape("Reconstruction", "Défense haute, le passeur vient sous le ballon, et on contre-attaque.", [
            P(M("ap", EX.REP.passeur, { d: 1.1 }), M("ac", [-2.6, 4.3], { d: 0.8 }), B("x1", "ap", "defense", { h: 1.1 })),
            contre("x1", [6.8, 4.6])
          ]);
          s.chapitre("Ballon 2 · Bidouille");
          s.etape("Bidouille derrière le bloc", "L'autre banc joue court. Il faut lire et plonger dessus.", [
            T.vers("def2", { d: 1.0 }), P(T.bloc("2"), S("h2")),
            P(M("al", [-2.6, 2.3], { d: 0.75 }), B("x2", "al", "bidouille"))
          ]);
          s.etape("Reconstruction", "Même sur un ballon court, on reconstruit : passe en 2 pour le pointu.", [
            P(M("ap", EX.REP.passeur, { d: 0.9 }), B("x2", "ap", "defense", { h: 1.1 })),
            T.passe("x2", "2"), B("x2", [6.6, 4.2], "attaque", { sol: true }), X("x2")
          ]);
          s.chapitre("Ballon 3 · Block-out");
          s.etape("Block-out", "Le ballon touche le bloc et part loin : le défenseur du fond court le chercher.", [
            A("x3", "h4"), T.vers("def4", { d: 1.0 }), P(T.bloc("4"), S("h4")),
            B("x3", [-0.45, 7.7], "attaque", { d: 0.22 }),
            P(M("ar2", [-9.4, 7.2], { d: 1.0 }), B("x3", "ar2", "rebond"))
          ]);
          s.etape("Reconstruction", "Ballon haut vers le centre du terrain, et on contre-attaque quand même.", [
            P(M("ap", EX.REP.passeur, { d: 1.1 }), M("ac", [-2.6, 4.3], { d: 0.8 }), B("x3", "ap", "defense", { h: 1.25 })),
            P(T.passe("x3", "4"), T.vers({ c: [-1.9, 2.9], l: [-3.4, 1.9], r2: [-4.3, 4.3], po: [-3.2, 6.9] }, { d: 1.0 })),
            B("x3", [6.8, 4.6], "attaque", { sol: true }), X("x3")
          ]);
          s.chapitre("Palier");
          s.etape("Second ballon", "Juste après la reconstruction, le banc lâche un second ballon, comme un contre. Le soutien en arc de cercle le garde jouable.", [
            A("x4", "h2"), B("x4", "ac", "lancer"), P(F("ac"), B("x4", "ap", "defense", { h: 1.1, tenu: true })), PT("ac", "Soutenu !")
          ]);
        }
      },

      {
        id: "exo4",
        n: "Exo 4",
        titre: "QI volley",
        dispositif: "presque la même configuration : 3 joueurs (un passeur, un ailier et un réceptionneur-relanceur) face à 6 joueurs.",
        texte: ["L'attaque a trois ballons. Elle doit essayer de mettre son point face à une équipe en place qui sait où ça va.", "Si le ballon est défendu : attaque enroulée sur le défenseur pour recommencer."],
        tableau: {
          tetes: ["Ballon", "Mise en jeu", "Point travaillé"],
          lignes: [
            ["1 · Réception", "Service", "Construire le side-out malgré une défense qui attend l'attaque"],
            ["2 · Relance", "Ballon relancé", "Profiter d'un ballon facile pour jouer l'option à laquelle le six ne s'attend pas"],
            ["3 · Défense", "Attaque à défendre", "Défendre puis contre-attaquer depuis une situation difficile"]
          ]
        },
        cle: "Mettre son point face à une équipe en place qui sait où ça va.",
        enjeu: "comptage des points, tout le monde y passe, intensité ++.",
        plus: [
          ["Rotation", "3 trios qui tournent après leurs 3 ballons ; score par trio sur plusieurs tours, classement affiché à la fin."],
          ["Annonce", "le six en face annonce à voix haute où il attend l'attaque : l'attaquant doit lire et choisir l'autre option (bidouille, block-out, ligne ou diagonale)."]
        ],
        valider: "Qui envoie la relance et l'attaque à défendre : j'ai mis le coach, au bord du terrain. Les solutions montrées (bloc-out, pipe, ligne) sont des exemples.",
        scene: function (s) { EX.troisContreSix(s); }
      }
    ]
  });
})();

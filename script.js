/* =========================================================
   FCF91 U14F — QUESTIONNAIRE RESSENTI
   script.js
   ========================================================= */


/* =========================================================
   PARAMÈTRES
   ========================================================= */

/*
 * Adresse de ton Google Apps Script.
 * On conserve pour l'instant la même adresse que celle
 * utilisée pour les U15F.
 */

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxJB9h5SNdiQyBCc3WJ2xuU5RZt5ZI0Okk6EaExCfz6Hv-Hn84krk6dbLgbiFcHQ7quHA/exec";


/* =========================================================
   LISTE DES JOUEUSES U14F
   ========================================================= */

const joueusesU14F = [
  "Akalak",
  "Ayana",
  "Camille",
  "Chloé H",
  "Chloé P",
  "Eden",
  "Elsa",
  "Emma",
  "Emna",
  "Emy",
  "Gabrielle",
  "Inès",
  "Lisa",
  "Lorena",
  "Lou",
  "Malak",
  "Manuella",
  "Maryam",
  "Mayssa",
  "Nahla",
  "Naomi",
  "Nathalya",
  "Sofia"
];


/* =========================================================
   MESSAGES DE REMERCIEMENT
   ========================================================= */

const messagesMerci = [
  "Chaque séance est une occasion d’apprendre, de progresser et de grandir.",

  "Continue à avancer avec envie, exigence et confiance.",

  "Ton investissement d’aujourd’hui construit la joueuse que tu seras demain.",

  "Les progrès se construisent séance après séance. Continue !",

  "Reste exigeante avec toi-même et continue à donner le meilleur.",

  "Comprendre, essayer, recommencer et progresser : c’est comme ça que l’on avance.",

  "Ton ressenti compte. Apprendre à connaître ton corps fait aussi partie de ta progression.",

  "Continue à travailler avec sérieux, plaisir et ambition.",

  "Chaque entraînement compte. Fais de chaque séance une étape vers tes objectifs.",

  "Sois fière du travail accompli et ambitieuse pour la suite."
];


/* =========================================================
   RÉCUPÉRATION DES ÉLÉMENTS HTML
   ========================================================= */

const form = document.getElementById("ressentiForm");

const prenomSelect = document.getElementById("prenom");

const rpeInput = document.getElementById("rpe");

const rpeValue = document.getElementById("rpeValue");

const rpeRuler = document.getElementById("rpeRuler");

const formMessage = document.getElementById("formMessage");

const successCard = document.getElementById("successCard");

const successPlayerName =
  document.getElementById("successPlayerName");

const successMessage =
  document.getElementById("successMessage");

const header =
  document.querySelector(".ressenti-header");


/* =========================================================
   LISTE DÉROULANTE DES JOUEUSES
   ========================================================= */

function chargerJoueuses() {

  if (!prenomSelect) {
    return;
  }

  joueusesU14F.forEach((prenom) => {

    const option = document.createElement("option");

    option.value = prenom;
    option.textContent = prenom;

    prenomSelect.appendChild(option);

  });

}


/* =========================================================
   GESTION DU RPE
   ========================================================= */

function mettreAJourRPE() {

  if (!rpeInput || !rpeValue) {
    return;
  }

  const valeur = Number(rpeInput.value);

  const minimum = Number(rpeInput.min);
  const maximum = Number(rpeInput.max);

  /*
   * Affichage de la valeur.
   */

  rpeValue.textContent = valeur;


  /*
   * Calcul de la progression entre 0 et 100 %.
   */

  const progression =
    ((valeur - minimum) / (maximum - minimum)) * 100;


  /*
   * Mise à jour de la barre rouge.
   */

  if (rpeRuler) {

    rpeRuler.style.setProperty(
      "--rpe-position",
      `${progression}%`
    );

  }

}


/* Mise à jour lorsque la joueuse déplace le curseur */

if (rpeInput) {

  rpeInput.addEventListener(
    "input",
    mettreAJourRPE
  );

}


/* =========================================================
   MESSAGE ALÉATOIRE
   ========================================================= */

function choisirMessageMerci() {

  const index =
    Math.floor(
      Math.random() * messagesMerci.length
    );

  return messagesMerci[index];

}


/* =========================================================
   AFFICHAGE D'UN MESSAGE SOUS LE FORMULAIRE
   ========================================================= */

function afficherMessage(
  texte,
  type = ""
) {

  if (!formMessage) {
    return;
  }

  formMessage.textContent = texte;

  formMessage.className = "form-message";

  if (type) {
    formMessage.classList.add(type);
  }

}


/* =========================================================
   AFFICHAGE DE LA CARTE DE REMERCIEMENT
   ========================================================= */

function afficherCarteMerci(prenom) {

  if (
    !successCard ||
    !successPlayerName ||
    !successMessage
  ) {
    return;
  }


  /*
   * Prénom de la joueuse.
   */

  successPlayerName.textContent = prenom;


  /*
   * Message aléatoire.
   */

  successMessage.textContent =
    choisirMessageMerci();


  /*
   * Masquer le formulaire et l'en-tête.
   */

  if (form) {
    form.classList.add("is-hidden");
  }

  if (header) {
    header.classList.add("is-hidden");
  }


  /*
   * Afficher la carte.
   */

  successCard.hidden = false;


  /*
   * Retour en haut de la page.
   */

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   ENVOI DU FORMULAIRE
   ========================================================= */

if (form) {

  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      /* -----------------------------------------------
         Vérification du formulaire
         ----------------------------------------------- */

      if (!form.checkValidity()) {

        form.reportValidity();

        return;

      }


      /* -----------------------------------------------
         Bouton ENVOYER
         ----------------------------------------------- */

      const submitButton =
        form.querySelector(".submit-button");

      const texteBoutonInitial =
        submitButton
          ? submitButton.textContent
          : "ENVOYER";


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
          "ENVOI EN COURS...";

      }


      afficherMessage(
        "Envoi de ton ressenti...",
        "loading"
      );


      /* -----------------------------------------------
         Récupération des réponses
         ----------------------------------------------- */

      const formData =
        new FormData(form);


      /*
       * Très important :
       * nous ajoutons la catégorie U14F.
       *
       * Le Google Apps Script pourra ainsi reconnaître
       * que cette réponse appartient aux U14F.
       */

      formData.append(
        "categorie",
        "U14F"
      );


      /*
       * On mémorise le prénom avant l'envoi.
       */

      const prenom =
        formData.get("prenom");


      /* -----------------------------------------------
         Envoi vers Google Sheets
         ----------------------------------------------- */

      try {

        const response =
          await fetch(
            SCRIPT_URL,
            {
              method: "POST",
              body: formData
            }
          );


        if (!response.ok) {

          throw new Error(
            "Erreur lors de l'envoi."
          );

        }


        /*
         * Envoi réussi.
         */

        afficherMessage(
          "Ressenti enregistré.",
          "success"
        );


        /*
         * Affichage de la carte de remerciement.
         */

        afficherCarteMerci(prenom);


      } catch (error) {

        console.error(
          "Erreur d'envoi :",
          error
        );


        afficherMessage(
          "Une erreur est survenue. Vérifie ta connexion et réessaie.",
          "error"
        );


        /*
         * Réactivation du bouton.
         */

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            texteBoutonInitial;

        }

      }

    }
  );

}


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /*
     * Chargement des joueuses.
     */

    chargerJoueuses();


    /*
     * Position initiale du RPE = 5.
     */

    mettreAJourRPE();

  }
);

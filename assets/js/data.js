/* ==========================================================
   CONCEPT — file dati centralizzato della landing (DEMO)
   Modifica qui testi, contatti, orari e FAQ: la pagina li legge da qui.
   Fonte dei dati: https://www.conceptcasale.it (verificato 17/10/2026).
   Tutto ciò che è marcato "da confermare" va validato con il cliente.
   ========================================================== */
window.CONCEPT_DATA = {
  // "prelancio" = lista d'attesa  |  "aperto" = prenotazione check-up
  status: "prelancio",

  // Mostra la fascia "DEMO" in cima. Mettere false solo con autorizzazione del cliente.
  demo: true,

  contacts: {
    phone: "+39 351 428 3935",
    phoneHref: "+393514283935",
    email: "info@conceptcasale.it",
    address: "Piazza Castello 3, Casale Monferrato (AL)",
    landmark: "Fianco Teatro Municipale",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Piazza+Castello+3+Casale+Monferrato",
    whatsapp: null // es. "393514283935" SOLO dopo verifica che sia un numero WhatsApp gradito
  },

  // 0 = domenica … 6 = sabato. Orari pubblicati sul sito (da ricontrollare).
  hours: {
    0: null,
    1: [["07:00", "21:00"]],
    2: [["07:00", "21:00"]],
    3: [["07:00", "21:00"]],
    4: [["07:00", "21:00"]],
    5: [["07:00", "21:00"]],
    6: [["08:00", "14:00"]]
  },
  hoursNote: "Possibilità di prendere appuntamento anche al di fuori degli orari di apertura.",

  copy: {
    prelancio: {
      badge: "Lista d'attesa aperta · Casale Monferrato",
      heroSub: "Entra nella lista d'attesa di Concept e ricevi un check-up iniziale con analisi BIA gratuiti. Poi sceglierai tu se allenarti con noi.",
      formKicker: "Lista d'attesa",
      formTitle: "Prenota il tuo check-up gratuito",
      submit: "Entra in lista e prenota",
      fineExtra: "Disponibilità limitate per l'offerta di pre-lancio.",
      successTitle: "Sei in lista.",
      successText: "Il nostro staff ti contatterà per fissare l'appuntamento del check-up.",
      hoursLabel: "Orari previsti (da confermare)",
      offerNote: "Offerta di pre-lancio riservata a chi si iscrive ora."
    },
    aperto: {
      badge: "Aperti a Casale Monferrato",
      heroSub: "Prenota nello studio di Piazza Castello il check-up iniziale con analisi BIA, gratuiti. Poi sceglierai tu se allenarti con noi.",
      formKicker: "Check-up gratuito",
      formTitle: "Prenota il tuo check-up gratuito",
      submit: "Prenota il check-up gratuito",
      fineExtra: "",
      successTitle: "Richiesta ricevuta.",
      successText: "Il nostro staff ti contatterà per fissare l'appuntamento del check-up.",
      hoursLabel: "Orari di apertura",
      offerNote: "Check-up e analisi BIA per chi si iscrive."
    }
  },

  // Opzioni del form: obiettivi dal sito originale (facoltativi).
  goals: [
    "Tonificazione",
    "Dimagrimento e body recomp",
    "Eliminare i dolori cronici",
    "Benessere psicofisico",
    "Far parte di una community"
  ],
  times: [
    { label: "Mattina", sub: "8:00 – 12:00" },
    { label: "Pomeriggio", sub: "12:00 – 17:00" },
    { label: "Sera", sub: "17:00 – 20:00" },
    { label: "Qualsiasi orario", sub: "" }
  ],

  // Risposte riformulate in modo prudente (niente promesse sanitarie). Da approvare.
  faqs: [
    {
      q: "Dove vi trovate?",
      a: "Nel cuore di Casale Monferrato, in Piazza Castello 3, all'inizio di via Saffi, di fianco al Teatro Municipale."
    },
    {
      q: "Com'è l'ambiente interno?",
      a: "Intimo, curato ed elegante: uno spazio ristrutturato pensato per allenarsi con concentrazione, senza sale caotiche né musica assordante e progettato per non essere affollato."
    },
    {
      q: "Che tipo di attrezzatura avete?",
      a: "Poche attrezzature, scelte con cura e tecnologicamente avanzate (incluso il modulo EMS), per permettere ai professionisti di seguirti passo dopo passo."
    },
    {
      q: "Costa più di una palestra tradizionale?",
      a: "Sì: Concept è un servizio premium. Non paghi un ingresso libero agli attrezzi, ma analisi di precisione, tecnologia e l'attenzione di professionisti dedicati. Il check-up iniziale è gratuito, così puoi valutare di persona."
    },
    {
      q: "Perché partite dall'analisi?",
      a: "Perché non tiriamo a indovinare. Costruire un percorso senza conoscere composizione corporea, idratazione e squilibri posturali significa procedere alla cieca: noi lavoriamo sui dati reali del tuo corpo."
    },
    {
      q: "E se dall'analisi emerge che non posso allenarmi in un certo modo?",
      a: "Saremo i primi a dirtelo. Se individuiamo un limite te lo comunichiamo apertamente e ti consigliamo la strada migliore da seguire."
    },
    {
      q: "L'elettrostimolazione (EMS) è dolorosa?",
      a: "L'EMS nasce in ambito clinico e riabilitativo e non usa carichi pesanti. Si sente un intenso lavoro muscolare, con il normale indolenzimento dei giorni successivi. L'idoneità si valuta prima, in studio."
    },
    {
      q: "Serve la carta di credito per iscriversi?",
      a: "No. Lasciare i tuoi dati non costa nulla e non ti vincola: serve a darti priorità. Quando ci conosceremo di persona, deciderai liberamente."
    }
  ],

  // Tracciamento: tutto spento finché non esiste consenso e un ID reale.
  tracking: {
    metaPixelId: null, // es. "123456789012345"
    endpoint: null // es. URL di un backend/Make/Zapier che riceve il lead (JSON POST)
  }
};

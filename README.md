# Concept — Landing check-up (DEMO)

Landing page per traffico da Meta Ads (Instagram/Facebook) con un solo obiettivo: **iscrizioni al check-up gratuito**. Strategia e copy degli annunci: `../05b_Concept_LANDING_ADV_SOCIAL.md`.

## Come aprirla
Apri `index.html` nel browser. Per provarla da telefono o condividerla: `python -m http.server 8000` in questa cartella e apri `http://<ip-del-pc>:8000`. Il font Sora arriva da Google Fonts (serve connessione, altrimenti usa il font di sistema).

## Struttura
```
index.html              markup e template del form
assets/css/style.css    stile (nero + lime #E7F643, font Sora, come il sito reale)
assets/js/data.js       TUTTI i testi, contatti, orari, FAQ, tracking  ← modifica qui
assets/js/app.js        animazioni, form a 3 passi, validazione, hook di tracciamento
assets/img/             logo e foto prese dal sito di Concept (solo per la demo)
```

## Cosa cambia con un parametro
In `data.js`: `status: "prelancio"` (lista d'attesa, default: il post Instagram parla di lista d'attesa) oppure `"aperto"` (prenotazione check-up + badge «Aperto ora»). `demo: false` toglie la fascia DEMO.

## Cosa fa per convertire
- Titolo e offerta coerenti con l'annuncio, form già visibile (affiancato su desktop, subito sotto il titolo su mobile).
- Form a 3 passi: le prime due domande sono un tocco e facoltative, il contatto viene chiesto per ultimo. Campi obbligatori: nome, telefono, consenso privacy. Email facoltativa.
- CTA fissa quando nessun form è in vista; un secondo form in fondo.
- Pagina di conferma animata con i prossimi passi.
- Animazioni: titolo per parole, grana pellicola, parallax, marquee, linea dei passi, grafici Wellness Tower, anello EMS, accordion FAQ. Tutto disattivato con `prefers-reduced-motion`.

## Cosa NON fa ancora (da completare prima di usarla davvero)
1. **Nessun invio reale:** i dati restano nel browser. Per attivarlo, metti l'URL di un endpoint (Make, Zapier, backend) in `tracking.endpoint`.
2. **Pixel Meta spento:** serve un ID reale (`tracking.metaPixelId`), il codice base del Pixel e un banner cookie che imposti `consent.marketing = true` in `app.js` solo dopo consenso. Gli eventi (`ViewContent`, `InitiateCheckout`, `Lead`, `Contact`) sono già predisposti, e leggono le UTM dall'URL.
3. **Privacy policy:** il link è un segnaposto. Servono informativa e dati societari del cliente.
4. **Foto e logo:** sono quelli pubblici del sito di Concept, usati per la demo. Sostituire con file autorizzati.
5. **WhatsApp:** non incluso. Aggiungilo (`contacts.whatsapp`) solo dopo aver verificato che il numero sia abilitato.

## Differenze rispetto al sito attuale (da far approvare)
- Checkbox privacy **non preselezionata**, newsletter **separata** e facoltativa (nel form attuale sono entrambe già spuntate).
- Testi più prudenti: tolti «protocollo clinico infallibile», «stato infiammatorio», «sicurissimo», «garanzia assoluta mai affollato». Le FAQ sono state riformulate (vedi `data.js`).
- Un solo messaggio sullo stato (pre-lancio *o* aperto) invece di quello contraddittorio del sito.
- Le opzioni obiettivo includono «Dimagrimento» e «dolori cronici» come nel sito. Nelle **ads** non vanno usate come claim (policy Meta sulla salute).
- Orari e telefono come pubblicati dal sito: da ricontrollare.

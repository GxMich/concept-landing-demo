/* ==========================================================
   CONCEPT — comportamento landing (vanilla JS, nessuna dipendenza)
   Legge tutto da window.CONCEPT_DATA (assets/js/data.js)
   ========================================================== */
(() => {
  "use strict";

  const D = window.CONCEPT_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));

  const ctx = { ...D, c: D.copy[D.status] };

  /* ---------- consenso e tracciamento (spenti di default) ---------- */
  const consent = { marketing: false }; // collegare al banner cookie reale
  function track(event, data = {}) {
    if (!consent.marketing || !D.tracking.metaPixelId || typeof window.fbq !== "function") {
      console.debug("[demo] evento non inviato (nessun consenso/ID):", event, data);
      return;
    }
    window.fbq("track", event, data);
  }
  const utm = Object.fromEntries(
    [...new URLSearchParams(location.search)].filter(([k]) => /^(utm_|fbclid)/.test(k))
  );

  /* ---------- data-bind / link ---------- */
  function bind(root = document) {
    $$("[data-bind]", root).forEach((el) => {
      const v = get(ctx, el.dataset.bind);
      if (v != null) el.textContent = v;
    });
    $$('[data-link="tel"]', root).forEach((a) => (a.href = `tel:${D.contacts.phoneHref}`));
    $$('[data-link="mail"]', root).forEach((a) => (a.href = `mailto:${D.contacts.email}`));
    $$('[data-link="map"]', root).forEach((a) => (a.href = D.contacts.mapsUrl));
    $$('[data-link="tel"]', root).forEach((a) => a.addEventListener("click", () => track("Contact", { method: "phone" })));
  }
  bind();
  $$("[data-demo]").forEach((el) => (el.hidden = !D.demo));

  /* ---------- titolo diviso per parole ---------- */
  $$("[data-split]").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) return frag.appendChild(document.createTextNode(" "));
            const w = document.createElement("span");
            w.className = "w";
            const s = document.createElement("span");
            s.style.setProperty("--i", i++);
            s.textContent = tok;
            w.appendChild(s);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    $$(".w", el).forEach((w) => w.setAttribute("aria-hidden", "true"));
  });

  /* ---------- reveal allo scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }),
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
  );
  $$(".hero .reveal").forEach((el, i) => el.style.setProperty("--rd", `${500 + i * 110}ms`));
  $$(".reveal, [data-split], .tcard, .ems-viz").forEach((el) => io.observe(el));
  // stagger interno ai gruppi
  $$(".steps, .tower-grid, .gifts").forEach((g) =>
    $$(".reveal", g).forEach((el, i) => el.style.setProperty("--rd", `${i * 120}ms`))
  );
  // animazioni "vive" (barre, onde…) partono quando la card è visibile
  const vizIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle("is-in", e.isIntersecting)),
    { threshold: 0.3 }
  );
  $$(".tcard, .ems-viz").forEach((el) => vizIO.observe(el));

  /* ---------- parallax hero + linea step ---------- */
  const heroImg = $(".hero-media img");
  const steps = $("[data-steps]");
  const stepsLine = steps && $(".steps-line", steps);
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (heroImg && !reduce && y < innerHeight * 1.3) heroImg.parentElement.style.setProperty("--py", (y * 0.18).toFixed(1));
      if (heroImg && !reduce) heroImg.style.setProperty("--py", (y * 0.18).toFixed(1));
      if (stepsLine) {
        const r = steps.getBoundingClientRect();
        stepsLine.style.setProperty("--p", clamp((innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.3)).toFixed(3));
      }
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- bottoni magnetici (solo mouse) ---------- */
  if (finePointer && !reduce) {
    $$(".btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        b.style.transform = `translate(${x}px, ${y}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
  }

  /* ---------- CTA: scroll al form e focus ---------- */
  function goToForm(target) {
    const host = $(target);
    if (!host) return;
    host.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    setTimeout(() => {
      const f = $("fieldset:not([hidden]) .chip input, fieldset:not([hidden]) input", host);
      f && f.focus({ preventScroll: true });
    }, reduce ? 0 : 650);
  }
  $$("[data-cta]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      track("ViewContent", { content_name: "cta_click" });
      goToForm(a.getAttribute("href"));
    })
  );

  /* ---------- FAQ ---------- */
  const faqHost = $("[data-faq]");
  if (faqHost) {
    faqHost.innerHTML = D.faqs
      .map((f, i) => `
        <div class="acc-item reveal">
          <button class="acc-q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
            <span></span><i aria-hidden="true"></i>
          </button>
          <div class="acc-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p></p></div></div>
        </div>`)
      .join("");
    $$(".acc-item", faqHost).forEach((it, i) => {
      $(".acc-q span", it).textContent = D.faqs[i].q;
      $(".acc-a p", it).textContent = D.faqs[i].a;
      io.observe(it);
      $(".acc-q", it).addEventListener("click", (e) => {
        const btn = e.currentTarget;
        const open = btn.getAttribute("aria-expanded") === "true";
        $$(".acc-q", faqHost).forEach((b) => b.setAttribute("aria-expanded", "false"));
        btn.setAttribute("aria-expanded", String(!open));
      });
    });
    $(".acc-q", faqHost).setAttribute("aria-expanded", "true");
  }

  /* ---------- orari + badge "aperto ora" ---------- */
  const DAYS = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const fmt = (h) => h.replace(":00", "").replace(/^0/, "");
  function romeNow() {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date()).reduce((a, p) => ((a[p.type] = p.value), a), {});
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    return { day, min: (+parts.hour % 24) * 60 + +parts.minute };
  }
  const toMin = (s) => +s.slice(0, 2) * 60 + +s.slice(3);
  const hoursEl = $("[data-hours]");
  if (hoursEl) {
    const now = romeNow();
    const order = [1, 2, 3, 4, 5, 6, 0];
    hoursEl.innerHTML = order.map((d) => {
      const h = D.hours[d];
      const txt = h ? h.map(([a, b]) => `${fmt(a)}:00–${fmt(b)}:00`.replace(/(\d+):00–/, "$1:00–")).join(", ") : "Chiuso";
      return `<div class="${d === now.day ? "today" : ""}"><dt>${DAYS[d]}</dt><dd>${txt}</dd></div>`;
    }).join("");
    // in pre-lancio non mostriamo "aperto/chiuso": l'apertura non è confermata
    const badge = $("[data-open]");
    if (badge && D.status === "aperto") {
      const slots = D.hours[now.day] || [];
      const cur = slots.find(([a, b]) => now.min >= toMin(a) && now.min < toMin(b));
      badge.hidden = false;
      badge.classList.toggle("on", !!cur);
      badge.textContent = cur ? `Aperto ora · chiude alle ${fmt(cur[1])}:00` : "Chiuso ora · prenota un appuntamento";
    }
  }

  /* ---------- CTA fissa: visibile solo quando nessun form è in vista ---------- */
  const sticky = $("[data-sticky]");
  const visible = new Set();
  const formIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    sticky.classList.toggle("show", visible.size === 0 && scrollY > 200);
  }, { threshold: 0.25 });
  addEventListener("scroll", () => { if (scrollY < 200) sticky.classList.remove("show"); }, { passive: true });

  /* ============================================================
     FORM A 3 PASSI
     ============================================================ */
  const tpl = $("#tpl-form");
  let uid = 0;

  function mountForm(host) {
    const id = `f${++uid}`;
    host.innerHTML = tpl.innerHTML.replaceAll("{uid}", id);
    bind(host);
    formIO.observe(host);

    const form = $("form.lead", host);
    const steps = $$(".fs", form);
    const prog = $(".prog", form);
    const bar = $(".prog i", form);
    const cur = $("[data-cur]", form);
    const backBtn = $("[data-back]", form);
    const shell = $(".form-shell", host);
    let step = 1;
    let started = false;

    // chip dinamici
    $('[data-chips="goals"]', form).innerHTML = D.goals
      .map((g) => `<label class="chip"><input type="radio" name="goal" value="${g}"><span>${g}</span></label>`).join("");
    $('[data-chips="times"]', form).innerHTML = D.times
      .map((t) => `<label class="chip"><input type="radio" name="time" value="${t.label}"><span>${t.label}${t.sub ? `<small>${t.sub}</small>` : ""}</span></label>`).join("");

    function go(n, back = false) {
      step = n;
      steps.forEach((fs) => {
        const on = +fs.dataset.step === n;
        fs.hidden = !on;
        fs.classList.toggle("back-in", on && back);
        if (on) { fs.style.animation = "none"; void fs.offsetWidth; fs.style.animation = ""; }
      });
      bar.style.width = `${(n / 3) * 100}%`;
      prog.setAttribute("aria-valuenow", n);
      cur.textContent = n;
      backBtn.hidden = n === 1;
      if (started) {
        const t = $("fieldset:not([hidden]) input", form);
        t && t.focus({ preventScroll: true });
      }
    }
    const markStarted = () => {
      if (started) return;
      started = true;
      track("InitiateCheckout", { content_name: "checkup_form" });
    };

    form.addEventListener("click", (e) => {
      const next = e.target.closest("[data-next], [data-skip]");
      if (next) { markStarted(); go(step + 1); }
      if (e.target.closest("[data-back]")) go(step - 1, true);
      // avanzamento automatico solo con tocco/mouse (non da tastiera)
      // (un click su <label> genera anche un click sull'<input>: ascoltiamo solo quest'ultimo)
      if (e.target.matches(".chip input") && e.detail > 0 && step < 3) {
        markStarted();
        const from = step;
        setTimeout(() => step === from && go(from + 1), reduce ? 0 : 280);
      }
    });
    form.addEventListener("input", markStarted, { once: true });

    // validazione
    const fields = {
      name: { el: $('[name="name"]', form), msg: "Inserisci il tuo nome.", ok: (v) => v.trim().length >= 2 },
      phone: { el: $('[name="phone"]', form), msg: "Inserisci un numero valido (es. +39 351 123 4567).", ok: (v) => /^(\+|00)?\d{8,14}$/.test(v.replace(/[\s.\-()]/g, "")) },
      email: { el: $('[name="email"]', form), msg: "Controlla l'indirizzo email.", ok: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) },
      privacy: { el: $('[name="privacy"]', form), msg: "Per essere ricontattato serve il consenso al trattamento dei dati.", ok: (_, el) => el.checked }
    };
    const err = (k) => $(`#err-${k}-${id}`, form);
    function check(k) {
      const f = fields[k];
      const good = f.ok(f.el.value || "", f.el);
      f.el.setAttribute("aria-invalid", String(!good));
      err(k).textContent = good ? "" : f.msg;
      return good;
    }
    Object.keys(fields).forEach((k) => {
      fields[k].el.addEventListener("blur", () => fields[k].el.value !== "" && check(k));
      fields[k].el.addEventListener("input", () => fields[k].el.getAttribute("aria-invalid") === "true" && check(k));
      fields[k].el.addEventListener("change", () => k === "privacy" && check(k));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map((k) => [k, check(k)]);
      const bad = results.find(([, ok]) => !ok);
      if (bad) { fields[bad[0]].el.focus(); return; }

      form.classList.add("is-loading");
      const fd = new FormData(form);
      const payload = {
        goal: fd.get("goal") || null,
        time: fd.get("time") || null,
        name: fd.get("name").trim(),
        phone: fd.get("phone").trim(),
        email: (fd.get("email") || "").trim() || null,
        newsletter: !!fd.get("newsletter"),
        privacyAccepted: true,
        status: D.status,
        page: location.pathname,
        utm,
        ts: new Date().toISOString()
      };
      try {
        await submitLead(payload);
        track("Lead", { content_name: "checkup_gratuito" });
        showSuccess();
      } catch (ex) {
        form.classList.remove("is-loading");
        err("phone").textContent = "Invio non riuscito. Riprova o chiamaci al " + D.contacts.phone + ".";
      }
    });

    function showSuccess() {
      form.hidden = true;
      $(".form-head", shell).hidden = true;
      const ok = $(".success", shell);
      ok.hidden = false;
      $("[data-demo-note]", ok).hidden = !D.demo || !!D.tracking.endpoint;
      ok.focus({ preventScroll: true });
      host.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      if (!reduce) burst(ok);
    }
  }

  async function submitLead(payload) {
    if (D.tracking.endpoint) {
      const r = await fetch(D.tracking.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return;
    }
    // DEMO: nessun dato lascia il browser
    console.info("[demo] lead simulato:", payload);
    await new Promise((res) => setTimeout(res, 900));
  }

  function burst(parent) {
    for (let i = 0; i < 22; i++) {
      const c = document.createElement("i");
      c.className = "confetti";
      const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 120;
      c.style.setProperty("--x", `${Math.cos(a) * d}px`);
      c.style.setProperty("--y", `${Math.sin(a) * d - 40}px`);
      c.style.setProperty("--r", `${Math.random() * 540 - 270}deg`);
      c.style.animationDelay = `${Math.random() * 120}ms`;
      parent.parentElement.appendChild(c);
      setTimeout(() => c.remove(), 1400);
    }
  }

  $$("[data-form-host]").forEach(mountForm);

  track("ViewContent", { content_name: "landing_checkup_concept" });
})();

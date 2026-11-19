(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const D = window.DATA;

  /* ---------- Theme manager (saves choice in localStorage) ---------- */
  class Theme {
    constructor(btn) {
      this.btn = btn;
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (e) {}
      this.set(saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
      btn.addEventListener('click', () => this.set(this.current === 'dark' ? 'light' : 'dark'));
    }
    set(t) {
      this.current = t;
      document.documentElement.dataset.theme = t;
      this.btn.textContent = t === 'dark' ? 'Light mode' : 'Dark mode';
      try { localStorage.setItem('theme', t); } catch (e) {}
      document.dispatchEvent(new CustomEvent('themechange', { detail: t }));
    }
  }

  /* ---------- Text scramble on the name ---------- */
  class Scramble {
    constructor(el) { this.el = el; this.chars = 'abcdefghijklmnopqrstuvwxyz#%&*+'; }
    run(final) {
      if (reduce) { this.el.textContent = final; return; }
      let frame = 0;
      const total = 28;
      const tick = () => {
        const done = Math.floor((frame / total) * final.length);
        this.el.textContent = final.split('').map((c, i) =>
          c === ' ' ? ' ' : i < done ? c : this.chars[Math.floor(Math.random() * this.chars.length)]).join('');
        if (frame++ < total) requestAnimationFrame(tick); else this.el.textContent = final;
      };
      tick();
    }
  }

  /* ---------- Typing effect ---------- */
  function typer(el, words) {
    if (reduce) { el.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    (function step() {
      const word = words[w];
      c += del ? -1 : 1;
      el.textContent = word.slice(0, c);
      let t = del ? 35 : 80;
      if (!del && c === word.length) { del = true; t = 1500; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; t = 400; }
      setTimeout(step, t);
    })();
  }

  /* ---------- Aurora canvas: soft moving blobs that follow the mouse a little ---------- */
  class Aurora {
    constructor(cv) {
      this.cv = cv; this.cx = cv.getContext('2d'); this.mouse = { x: .5, y: .5 }; this.sm = { x: .5, y: .5 };
      this.blobs = [[.2, .25, 0], [.8, .3, 1], [.5, .85, 2], [.15, .8, 3]].map(([x, y, i]) => ({ x, y, i, p: Math.random() * 6 }));
      addEventListener('resize', () => this.size()); this.size();
      addEventListener('pointermove', e => { this.mouse.x = e.clientX / innerWidth; this.mouse.y = e.clientY / innerHeight; });
      document.addEventListener('themechange', () => this.draw(0));
      reduce ? this.draw(0) : requestAnimationFrame(t => this.loop(t));
    }
    size() { this.cv.width = innerWidth; this.cv.height = innerHeight; }
    colors() {
      const s = getComputedStyle(document.documentElement);
      return ['--a', '--b', '--c', '--a'].map(v => s.getPropertyValue(v).trim());
    }
    draw(t) {
      const { cx, cv } = this, cols = this.colors(), light = document.documentElement.dataset.theme === 'light';
      this.sm.x = lerp(this.sm.x, this.mouse.x, .04); this.sm.y = lerp(this.sm.y, this.mouse.y, .04);
      cx.clearRect(0, 0, cv.width, cv.height);
      this.blobs.forEach(b => {
        const x = (b.x + Math.sin(t / 4000 + b.p) * .08 + (this.sm.x - .5) * .12 * (b.i + 1)) * cv.width;
        const y = (b.y + Math.cos(t / 5000 + b.p) * .08 + (this.sm.y - .5) * .12 * (b.i + 1)) * cv.height;
        const r = Math.max(cv.width, cv.height) * .38;
        const g = cx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, cols[b.i] + (light ? '55' : '66')); g.addColorStop(1, cols[b.i] + '00');
        cx.fillStyle = g; cx.fillRect(0, 0, cv.width, cv.height);
      });
    }
    loop(t) { this.draw(t); requestAnimationFrame(t2 => this.loop(t2)); }
  }

  /* ---------- Cursor glow, magnetic buttons, card tilt ---------- */
  function pointerEffects() {
    if (reduce || matchMedia('(pointer: coarse)').matches) { $('#glow').style.display = 'none'; return; }
    const glow = $('#glow'); let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
    (function move() { x = lerp(x, tx, .12); y = lerp(y, ty, .12); glow.style.left = x + 'px'; glow.style.top = y + 'px'; requestAnimationFrame(move); })();

    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }
  /* tilt works for cards React adds later, so it listens on the whole document */
  function tilt() {
    if (reduce) return;
    document.addEventListener('pointermove', e => {
      const card = e.target.closest && e.target.closest('.card');
      $$('.card').forEach(c => { if (c !== card) c.style.transform = ''; });
      if (!card) return;
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-4px)`;
    });
  }

  /* ---------- Scroll: progress bar, reveal, active menu link, counters ---------- */
  function scrollFX() {
    const bar = $('#progress');
    const top = $('#toTop'), ring = $('#toTopPg');
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    addEventListener('scroll', () => {
      const h = document.documentElement, p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.width = p * 100 + '%'; ring.style.strokeDashoffset = 119.4 * (1 - p); top.classList.toggle('show', h.scrollTop > 500);
    }, { passive: true });

    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.sec>h2, .about, #radar-root, #skills-root, #term, #projects-root, #certs-root, #contact-root').forEach(el => { el.classList.add('reveal'); io.observe(el); });

    const links = $$('#menu a');
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('.sec').forEach(s => spy.observe(s));
  }

  function counters() {
    const box = $('#stats');
    box.innerHTML = D.stats.map(s => `<div class="stat"><b data-n="${s[0]}" data-s="${s[2]}">0${s[2]}</b>${s[1]}</div>`).join('');
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.disconnect();
      $$('b', box).forEach(b => {
        const n = +b.dataset.n, t0 = performance.now();
        (function up(t) { const p = Math.min((t - t0) / 1200, 1); b.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + b.dataset.s; if (p < 1) requestAnimationFrame(up); })(t0);
      });
    }), { threshold: .4 });
    io.observe(box);
  }

  /* ---------- Profile photo: tilts with the mouse, shows initials if the photo is missing ---------- */
  function photo() {
    const img = $('#photoImg'), fb = $('#photoFb'), box = $('#photo');
    fb.textContent = D.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    [1, 2, 3, 4].forEach(n => { const b = $('#badge' + n); b.textContent = (D.badges || [])[n - 1] || ''; b.hidden = !b.textContent; });
    $('#bigname').textContent = D.bigText || 'PORTFOLIO';
    if (D.photo) {
      img.onload = () => {
        img.hidden = false; fb.hidden = true;
        try {   /* transparent corners = a cut-out photo: show it over the big text */
          const c = document.createElement('canvas'); c.width = c.height = 8; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 8, 8);
          if (x.getImageData(0, 0, 1, 1).data[3] < 10 && x.getImageData(7, 0, 1, 1).data[3] < 10) box.classList.add('cut');
        } catch (e) {}
      };
      img.onerror = () => { img.hidden = true; }; img.src = D.photo;
    }
    if (reduce) return;
    box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      box.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`; });
    box.addEventListener('pointerleave', () => { box.style.transform = ''; });
  }

  /* ---------- Boot intro (shown once per visit, never blocks the page) ---------- */
  function boot(done) {
    let seen = false; try { seen = sessionStorage.getItem('boot'); } catch (e) {}
    if (reduce || seen) return done();
    const el = document.createElement('div'); el.id = 'boot'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="bootbox"><div id="bl"></div><div class="bbar"><i id="bp"></i></div></div>';
    document.body.appendChild(el);
    const lines = ['> booting portfolio.exe', '> loading neural weights ... ok', '> compiling skills ... ok', '> starting interface ...'];
    const bl = $('#bl'), bp = $('#bp'); let i = 0, ended = false;
    const finish = () => { if (ended) return; ended = true; el.classList.add('out'); try { sessionStorage.setItem('boot', '1'); } catch (e) {} setTimeout(() => el.remove(), 700); done(); };
    (function next() {
      if (i < lines.length) { const d = document.createElement('div'); d.textContent = lines[i++]; bl.appendChild(d); bp.style.width = (i / lines.length * 100) + '%'; setTimeout(next, 380); }
      else setTimeout(finish, 350);
    })();
    setTimeout(finish, 4000);
  }

  /* ---------- Journey timeline: the line fills as you scroll ---------- */
  function timeline() {
    const tl = $('#tl'); if (!tl || !D.timeline) return;
    tl.innerHTML = '<div class="fill"></div>' + D.timeline.map(x => `<div class="it"><div class="y">${x.y}</div><h3>${x.t}</h3><p>${x.d}</p></div>`).join('');
    const fill = $('.fill', tl), items = $$('.it', tl); let busy = false;
    const update = () => {
      busy = false; const r = tl.getBoundingClientRect(), vh = innerHeight;
      fill.style.height = Math.max(0, Math.min(r.height, vh * .6 - r.top)) + 'px';
      items.forEach(it => it.classList.toggle('on', it.getBoundingClientRect().top < vh * .62));
    };
    addEventListener('scroll', () => { if (!busy) { busy = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update); update();
  }

  /* ---------- Start everything ---------- */
  document.title = D.name + ' | Portfolio';
  $('#bio').textContent = D.bio;
  $('#facts').innerHTML = (D.facts || []).map(f => `<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('');
  const chip = $('#chip'); chip.textContent = D.status || ''; chip.hidden = !D.status;
  new Theme($('#themeBtn'));
  new Aurora($('#aurora'));
  boot(() => { new Scramble($('#name')).run(D.name); typer($('#typed'), D.roles); });
  if (D.resume) { const cv = $('#cvBtn'); cv.href = D.resume; cv.hidden = false; }
  timeline();
  $('#track').innerHTML = D.skills.map(s => s.n).concat(D.skills.map(s => s.n)).map(n => `<span>${n}</span>`).join('');
  $('#svc').innerHTML = (D.services || []).map((x, i) => `<article class="card"><div class="num">0${i + 1}</div><h3>${x.t}</h3><p>${x.d}</p></article>`).join('');
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  $('#social').innerHTML = [['in', 'LinkedIn', D.linkedin], ['Gh', 'GitHub', D.github], ['Kg', 'Kaggle', D.kaggle]].filter(x => x[2])
    .map(x => `<a href="${x[2]}" target="_blank" rel="noopener" aria-label="${x[1]}">${x[0]}</a>`).join('');
  if (D.testimonials && D.testimonials.length) {
    $('#voicesGrid').innerHTML = D.testimonials.map(t => `<figure class="card"><blockquote class="quote"></blockquote><figcaption class="who"></figcaption></figure>`).join('');
    $$('#voicesGrid figure').forEach((f, i) => { $('.quote', f).textContent = '"' + D.testimonials[i].q + '"'; $('.who', f).textContent = D.testimonials[i].n + (D.testimonials[i].r ? ', ' + D.testimonials[i].r : ''); });
    $('#voices').hidden = false;
  }
  photo(); pointerEffects(); tilt(); scrollFX(); counters();
})();

(() => {
  'use strict';
  const h = React.createElement;
  const { useState, useEffect, useMemo, useRef } = React;
  const D = window.DATA;
  const mount = (id, C) => ReactDOM.createRoot(document.getElementById(id)).render(h(C));

  /* small reusable filter buttons */
  const Pills = ({ items, value, onPick }) =>
    h('div', { className: 'tools' }, items.map(x =>
      h('button', { key: x, className: 'pill', 'aria-pressed': x === value, onClick: () => onPick(x) }, x)));

  /* ---------- Radar chart: average level of each skill group ---------- */
  function Radar() {
    const groups = useMemo(() => { const rated = D.skills.filter(s => s.l != null); return [...new Set(rated.map(s => s.g))].map(g => {
      const l = rated.filter(s => s.g === g); return { g, v: Math.round(l.reduce((a, s) => a + s.l, 0) / l.length) };
    }); }, []);
    const [on, setOn] = useState(false), ref = useRef(null);
    useEffect(() => {
      if (!ref.current) return;
      const io = new IntersectionObserver(es => es[0].isIntersecting && setOn(true), { threshold: .3 });
      io.observe(ref.current); return () => io.disconnect();
    }, []);
    if (groups.length < 3) return null;
    const C = 150, R = 100, n = groups.length, ang = i => -Math.PI / 2 + i * 2 * Math.PI / n;
    const pt = (i, r) => [C + Math.cos(ang(i)) * r, C + Math.sin(ang(i)) * r];
    const poly = f => groups.map((x, i) => pt(i, R * f(x)).map(v => v.toFixed(1)).join(',')).join(' ');
    return h('div', { className: 'radar', ref },
      h('svg', { viewBox: '0 0 300 300', role: 'img', 'aria-label': 'Skill strength by group' },
        [.25, .5, .75, 1].map(k => h('polygon', { key: k, points: poly(() => k), fill: 'none', stroke: 'var(--line)' })),
        groups.map((x, i) => h('line', { key: x.g, x1: C, y1: C, x2: pt(i, R)[0], y2: pt(i, R)[1], stroke: 'var(--line)' })),
        h('g', { style: { transformOrigin: C + 'px ' + C + 'px', transform: on ? 'scale(1)' : 'scale(0)', transition: 'transform 1.1s cubic-bezier(.2,.8,.2,1)' } },
          h('polygon', { points: poly(x => x.v / 100), fill: 'var(--a)', fillOpacity: .35, stroke: 'var(--b)', strokeWidth: 2.5 }),
          groups.map((x, i) => h('circle', { key: x.g, cx: pt(i, R * x.v / 100)[0], cy: pt(i, R * x.v / 100)[1], r: 5, fill: 'var(--c)' }, h('title', null, x.g + ': ' + x.v + '%')))),
        groups.map((x, i) => h('text', { key: x.g, x: pt(i, R + 24)[0], y: pt(i, R + 24)[1] + 4, textAnchor: 'middle', fontSize: 12, fill: 'var(--muted)' }, x.g))),
      h('div', { className: 'legend' }, groups.map(x => h('div', { key: x.g, className: 'skill' },
        h('div', { className: 'top' }, h('span', null, x.g), h('span', null, x.v + '%')),
        h('div', { className: 'meter' }, h('i', { style: { width: on ? x.v + '%' : '0%' } }))))));
  }

  /* ---------- Skills: group filter + search + animated meters ---------- */
  function Skills() {
    const groups = useMemo(() => ['All', ...new Set(D.skills.map(s => s.g))], []);
    const [g, setG] = useState('All');
    const [q, setQ] = useState('');
    const [on, setOn] = useState(false);
    useEffect(() => { setOn(false); const t = setTimeout(() => setOn(true), 120); return () => clearTimeout(t); }, [g, q]);
    const list = D.skills.filter(s => (g === 'All' || s.g === g) && s.n.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (b.l || 0) - (a.l || 0));
    return h('div', null,
      h('div', { className: 'tools' },
        groups.map(x => h('button', { key: x, className: 'pill', 'aria-pressed': x === g, onClick: () => setG(x) }, x)),
        h('input', { className: 'search', placeholder: 'Search a skill', 'aria-label': 'Search skills', value: q, onChange: e => setQ(e.target.value) })),
      h('div', { className: 'grid' },
        list.length ? list.map(s => h('div', { key: s.n, className: 'skill' },
          h('div', { className: 'top' }, h('span', null, s.n), s.l != null && h('span', null, s.l + '%')),
          s.l != null ? h('div', { className: 'meter' }, h('i', { style: { width: on ? s.l + '%' : '0%' } })) : h('small', { className: 'sg' }, s.g)))
          : h('p', { className: 'empty' }, 'No skill found. Try another word.')));
  }

  /* ---------- Live GitHub repositories (falls back silently if offline) ---------- */
  function useRepos(user) {
    const [repos, setRepos] = useState(null);
    useEffect(() => {
      let alive = true;
      fetch('https://api.github.com/users/' + user + '/repos?sort=updated&per_page=30')
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(j => alive && setRepos(j.filter(x => !x.fork).slice(0, 6)))
        .catch(() => alive && setRepos([]));
      return () => { alive = false; };
    }, [user]);
    return repos;
  }

  /* ---------- Projects: tag filter + expandable cards + live GitHub list ---------- */
  function Projects() {
    const repos = useRepos((D.github || '').split('/').filter(Boolean).pop());
    const tags = useMemo(() => ['All', ...new Set(D.projects.flatMap(p => p.tags))], []);
    const [tag, setTag] = useState('All');
    const [openI, setOpenI] = useState(null);
    const list = D.projects.filter(p => tag === 'All' || p.tags.includes(tag));
    return h('div', null,
      h(Pills, { items: tags, value: tag, onPick: t => { setTag(t); setOpenI(null); } }),
      h('div', { className: 'grid' }, list.map(p => h('article', { key: p.t, className: 'card' },
        h('div', { className: 'thumb t' + (D.projects.indexOf(p) % 3), style: p.img ? { backgroundImage: 'url(' + p.img + ')' } : undefined, 'aria-hidden': 'true' },
          p.img ? null : p.t.split(' ').slice(0, 2).map(w => w[0]).join('')),
        h('h3', null, p.t),
        h('p', null, p.d),
        openI === p.t && h('p', null, p.more),
        h('div', { className: 'tags' }, p.tags.map(t => h('span', { key: t }, t))),
        h('div', { className: 'more' },
          h('button', { onClick: () => setOpenI(openI === p.t ? null : p.t), 'aria-expanded': openI === p.t }, openI === p.t ? 'Show less' : 'Read more'),
          h('a', { href: p.url, target: '_blank', rel: 'noopener' }, 'Open project'))))),
      repos && repos.length > 0 && h('div', null,
        h('h3', { style: { margin: '36px 0 16px' } }, 'Live from GitHub'),
        h('div', { className: 'grid' }, repos.map(p => h('article', { key: p.id, className: 'card' },
          h('h3', null, p.name),
          h('p', null, p.description || 'No description yet.'),
          h('div', { className: 'tags' }, p.language && h('span', null, p.language), h('span', null, '★ ' + p.stargazers_count)),
          h('div', { className: 'more' }, h('a', { href: p.html_url, target: '_blank', rel: 'noopener' }, 'View repository')))))));
  }

  /* ---------- Certificates: grid + detail window (Esc closes) ---------- */
  function Certs() {
    const [open, setOpen] = useState(null);
    const closeRef = useRef(null);
    useEffect(() => {
      if (!open) return;
      const k = e => e.key === 'Escape' && setOpen(null);
      addEventListener('keydown', k);
      closeRef.current && closeRef.current.focus();
      return () => removeEventListener('keydown', k);
    }, [open]);
    return h('div', null,
      h('div', { className: 'grid' }, D.certs.map((c, i) => h('button', { key: i, className: 'cert', onClick: () => setOpen(c) },
        c.img && h('img', { className: 'cthumb', src: c.img, alt: '', loading: 'lazy' }), h('strong', null, c.t), h('small', null, [c.by, c.date].filter(Boolean).join(', '))))),
      open && h('div', { className: 'modal', onClick: () => setOpen(null) },
        h('div', { className: 'box', role: 'dialog', 'aria-modal': 'true', 'aria-label': open.t, onClick: e => e.stopPropagation() },
          h('h3', null, open.t), h('small', null, [open.by, open.date].filter(Boolean).join(', ')),
          open.img && h('img', { src: open.img, alt: 'Certificate: ' + open.t }),
          h('p', null, open.note),
          h('div', { className: 'row' },
            open.link && h('a', { className: 'btn primary', href: open.link, target: '_blank', rel: 'noopener' }, 'Verify certificate'),
            h('button', { ref: closeRef, className: 'btn', onClick: () => setOpen(null) }, 'Close')))));
  }

  /* ---------- Contact: form sends the message straight to your inbox (Web3Forms) ---------- */
  function Contact() {
    const [f, setF] = useState({ name: '', email: '', msg: '' });
    const [err, setErr] = useState({});
    const [st, setSt] = useState({ s: 'idle', m: '' });
    const trap = useRef(null);
    const set = k => e => setF({ ...f, [k]: e.target.value });
    const submit = async e => {
      e.preventDefault();
      const er = {};
      if (f.name.trim().length < 2) er.name = 'Please write your name.';
      if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Please write a valid email.';
      if (f.msg.trim().length < 10) er.msg = 'Message needs at least 10 characters.';
      setErr(er);
      if (Object.keys(er).length) return;
      if (!D.formKey) {   /* no access key yet: open the visitor's email app instead */
        location.href = 'mailto:' + D.email + '?subject=' + encodeURIComponent('Portfolio message from ' + f.name) +
          '&body=' + encodeURIComponent(f.msg + '\n\nFrom: ' + f.name + ' (' + f.email + ')');
        return;
      }
      setSt({ s: 'sending', m: '' });
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: D.formKey, subject: 'Portfolio message from ' + f.name, from_name: 'Portfolio website',
            name: f.name, email: f.email, message: f.msg, botcheck: !!(trap.current && trap.current.checked) })
        });
        const j = await res.json();
        if (!j.success) throw new Error(j.message || 'failed');
        setSt({ s: 'ok', m: 'Thank you! Your message has been sent. I will reply soon.' });
        setF({ name: '', email: '', msg: '' });
      } catch (x) {
        setSt({ s: 'err', m: 'Sorry, the message could not be sent. Please try LinkedIn or email me directly.' });
      }
    };
    const field = (k, label, tag) => h('label', null, label,
      h(tag, { value: f[k], onChange: set(k), rows: tag === 'textarea' ? 5 : undefined, type: k === 'email' ? 'email' : undefined, 'aria-invalid': !!err[k] }),
      err[k] && h('span', { className: 'err', role: 'alert' }, err[k]));
    return h('div', null,
      h('form', { className: 'form', onSubmit: submit, noValidate: true },
        h('input', { ref: trap, type: 'checkbox', tabIndex: -1, autoComplete: 'off', style: { display: 'none' } }),
        field('name', 'Your name', 'input'), field('email', 'Your email', 'input'), field('msg', 'Message', 'textarea'),
        h('button', { className: 'btn primary', type: 'submit', disabled: st.s === 'sending', style: { justifySelf: 'start' } }, st.s === 'sending' ? 'Sending...' : 'Send message'),
        st.m && h('p', { className: 'status ' + st.s, role: 'status' }, st.m)),
      h('div', { className: 'links' },
        [['Email', D.email && 'mailto:' + D.email], ['LinkedIn', D.linkedin], ['GitHub', D.github], ['Kaggle', D.kaggle]].filter(x => x[1]).map(x =>
          h('a', { key: x[0], className: 'btn', href: x[1], target: '_blank', rel: 'noopener' }, x[0]))));
  }

  /* ---------- Command palette: Ctrl+K (or Cmd+K) ---------- */
  function Palette() {
    const [on, setOn] = useState(false), [q, setQ] = useState(''), [i, setI] = useState(0), inp = useRef(null);
    const go = id => document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    const items = useMemo(() => [
      ...[['About', 'about'], ['Skills', 'skills'], ['Projects', 'projects'], ['Certificates', 'certs'], ['Contact', 'contact']]
        .map(([t, id]) => ({ t: 'Go to ' + t, run: () => go(id) })),
      { t: 'Switch light or dark theme', run: () => document.getElementById('themeBtn').click() },
      { t: 'Open the terminal', run: () => { go('term'); setTimeout(() => { const i = document.querySelector('#term input'); i && i.focus(); }, 700); } },
      { t: 'Open GitHub', run: () => open(D.github, '_blank', 'noopener') },
      ...(D.linkedin ? [{ t: 'Open LinkedIn', run: () => open(D.linkedin, '_blank', 'noopener') }] : []),
      { t: 'Open Kaggle', run: () => open(D.kaggle, '_blank', 'noopener') },
      { t: 'Send an email', run: () => { location.href = 'mailto:' + D.email; } }
    ], []);
    const list = items.filter(x => x.t.toLowerCase().includes(q.toLowerCase()));
    useEffect(() => {
      const k = e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOn(o => !o); } else if (e.key === 'Escape') setOn(false); };
      const btn = document.getElementById('palBtn'), b = () => setOn(true);
      addEventListener('keydown', k); btn && btn.addEventListener('click', b);
      return () => { removeEventListener('keydown', k); btn && btn.removeEventListener('click', b); };
    }, []);
    useEffect(() => { if (on) { setQ(''); setI(0); setTimeout(() => inp.current && inp.current.focus(), 0); } }, [on]);
    const run = x => { setOn(false); x && x.run(); };
    if (!on) return null;
    return h('div', { className: 'modal', onClick: () => setOn(false) },
      h('div', { className: 'box pal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Quick search', onClick: e => e.stopPropagation() },
        h('input', { ref: inp, value: q, placeholder: 'Type a command', 'aria-label': 'Search commands',
          onChange: e => { setQ(e.target.value); setI(0); },
          onKeyDown: e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setI(Math.min(i + 1, list.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setI(Math.max(i - 1, 0)); }
            if (e.key === 'Enter') run(list[i]);
          } }),
        h('ul', null, list.map((x, n) => h('li', { key: x.t, className: n === i ? 'sel' : '', onMouseEnter: () => setI(n), onClick: () => run(x) }, x.t)))));
  }

  mount('radar-root', Radar);
  mount('skills-root', Skills);
  mount('projects-root', Projects);
  mount('certs-root', Certs);
  mount('contact-root', Contact);
  mount('pal-root', Palette);
})();

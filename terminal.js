(() => {
  'use strict';
  const D = window.DATA, root = document.getElementById('term');
  if (!root) return;
  const $ = id => document.getElementById(id);
  const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };

  /* A small working terminal: visitors type commands and get answers from DATA */
  class Terminal {
    constructor(box) {
      this.box = box; this.hist = []; this.hi = 0;
      this.out = mk('div', 'out'); const line = mk('label', 'line'); this.input = mk('input');
      this.input.setAttribute('autocomplete', 'off'); this.input.setAttribute('spellcheck', 'false'); this.input.setAttribute('aria-label', 'Terminal command');
      line.appendChild(mk('span', 'p', 'guest@portfolio:~$')); line.appendChild(this.input);
      box.appendChild(this.out); box.appendChild(line);
      const go = id => { const el = $(id); el && el.scrollIntoView({ behavior: 'smooth' }); };
      this.cmds = Object.create(null);
      Object.assign(this.cmds, {
        help: () => ['about', 'whoami', 'skills', 'projects', 'certs', 'contact', 'theme', 'github', 'clear'].forEach(c => this.print('  ' + c)),
        about: () => this.print(D.bio),
        whoami: () => this.print(D.name + '  |  ' + D.roles.join('  |  ')),
        skills: () => [...new Set(D.skills.map(s => s.g))].forEach(g => this.print(g + ': ' + D.skills.filter(s => s.g === g).map(s => s.n + (s.l != null ? ' ' + s.l + '%' : '')).join(', '))),
        projects: () => D.projects.forEach((p, i) => { this.print((i + 1) + '. ' + p.t + ' - ' + p.d); this.link('   open project', p.url); }),
        certs: () => D.certs.forEach(c => this.print('- ' + c.t + (c.by || c.date ? ' (' + [c.by, c.date].filter(Boolean).join(', ') + ')' : ''))),
        contact: () => { this.print('Email: ' + D.email); if (D.linkedin) this.link('LinkedIn', D.linkedin); this.link('GitHub', D.github); this.link('Kaggle', D.kaggle); },
        github: () => { this.print('Opening GitHub...'); open(D.github, '_blank', 'noopener'); },
        theme: () => { $('themeBtn').click(); this.print('Theme switched.'); },
        clear: () => { this.out.textContent = ''; },
        sudo: a => a.join(' ').toLowerCase() === 'hire sehrish'
          ? (this.print('Permission granted. Opening your email app...'), setTimeout(() => { location.href = 'mailto:' + D.email; }, 700))
          : this.print('Permission denied. Nice try.', 'err')
      });
      box.addEventListener('click', () => this.input.focus());
      this.input.addEventListener('keydown', e => this.key(e));
      this.print('Welcome! This terminal is real. Type "help" to start.', 'muted');
    }
    print(text, cls) { this.out.appendChild(mk('div', cls, text)); this.box.scrollTop = this.box.scrollHeight; }
    link(label, url) { const d = mk('div'), a = mk('a', '', label + ': ' + url); a.href = url; a.target = '_blank'; a.rel = 'noopener'; d.appendChild(a); this.out.appendChild(d); }
    key(e) {
      if (e.key === 'Enter') { const v = this.input.value; this.input.value = ''; this.run(v); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.hi = Math.max(0, this.hi - 1); this.input.value = this.hist[this.hi] || ''; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); this.hi = Math.min(this.hist.length, this.hi + 1); this.input.value = this.hist[this.hi] || ''; }
      else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(this.cmds).filter(c => c.startsWith(this.input.value.toLowerCase())); if (m.length === 1) this.input.value = m[0]; }
    }
    run(raw) {
      const t = raw.trim(); this.print('guest@portfolio:~$ ' + raw, 'cmd'); if (!t) return;
      this.hist.push(t); this.hi = this.hist.length;
      const [c, ...a] = t.split(/\s+/), f = this.cmds[c.toLowerCase()];
      f ? f(a) : this.print('command not found: ' + c + '. Type "help".', 'err');
    }
  }
  new Terminal(root);
})();

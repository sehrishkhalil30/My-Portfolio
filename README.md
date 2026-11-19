# Sehrish Khalil | Digital Portfolio

A fast, accessible and installable portfolio website built with **HTML, CSS, vanilla JavaScript (ES6 classes)** and **React** (loaded from a CDN, no build step). It is deployed on Vercel.

## Features

| Area | What it does |
| --- | --- |
| Design | Dark aurora theme with a light mode switch (saved in localStorage), glass cards, responsive layout |
| Intro | Boot-up loading sequence, scramble text on the name, typing effect for roles |
| Interaction | Cursor glow, magnetic buttons, 3D card tilt, scroll progress bar, back-to-top ring, tech marquee |
| Vanilla JS | `Theme`, `Scramble` and `Aurora` classes, `IntersectionObserver` for reveal and scroll spy, animated counters, scroll-drawn timeline |
| Terminal | A working command line (`help`, `skills`, `projects`, `contact`, `theme`, `sudo hire sehrish`) with history and Tab completion |
| React | Skills (group filter + search, optional level bars and radar chart), projects (filter + live GitHub repositories), certificates with images and verify links (accessible dialog), command palette (Ctrl+K), contact form with validation |
| Contact | Messages are delivered to my inbox through the Web3Forms API; spam trap included |
| PWA | Web app manifest + service worker: installable and works offline |
| SEO | Meta tags, Open Graph, JSON-LD `Person` data, `robots.txt` |
| Accessibility | Semantic landmarks, skip link, keyboard navigation, visible focus, ARIA labels, `prefers-reduced-motion` support |
| Security | HTTP security headers in `vercel.json` |

## Project structure

```
index.html            page structure
style.css             design system (CSS variables for both themes)
data.js               ALL content: bio, skills, projects, certificates, links
main.js               vanilla JavaScript: theme, effects, scroll features
terminal.js           interactive terminal (class Terminal)
react-app.js          React components (no JSX, no build step)
sw.js                 service worker
manifest.webmanifest  PWA manifest
vercel.json           headers and clean URLs
certs/                certificate images
```

## Update the content

Everything a visitor reads comes from `data.js` (bio, education, skills, projects, certificates, timeline, links). To add a skill, a project or a certificate, add one line to the matching list. No other file needs to change.

Certificate images go in `certs/` and are linked with `img:`; the CV is `Sehrish_Khalil_CV.pdf`; the profile photo is `photo.png`.

## Contact form setup

1. Create a free access key at https://web3forms.com using your email.
2. Put it in `data.js` as `formKey`.

## Deploy

Push the folder to GitHub, import the repository in Vercel and press Deploy. No build command is needed.

## Design decisions

- **No build step:** React is used for the stateful parts only; the rest stays plain JavaScript, so the site loads quickly.
- **One data file:** content is separated from code, so the site can be updated without touching the logic.
- **Network-first service worker:** edits show up immediately, and the cache is only a fallback.

## Author

Sehrish Khalil, BS Computer Science. [LinkedIn](https://www.linkedin.com/in/sehrish-khalil-63a3463a2) | [GitHub](https://github.com/sehrishkhalil30) | [Kaggle](https://kaggle.com/sehrishkhalil)

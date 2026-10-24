// --- Theme Toggle ---
const themeToggle = document.querySelector('.theme-toggle');

const applyTheme = theme => {
    if (theme === 'light') {
        document.documentElement.dataset.theme = 'light';
    } else {
        delete document.documentElement.dataset.theme;
    }
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Dunkles Design aktivieren' : 'Helles Design aktivieren');
};

applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
        localStorage.setItem('theme', next);
    } catch (e) {}
});

// --- Pixel Art ---
// Ersatzbild pro Kategorie, wenn ein Eintrag kein eigenes Bild hat (ein Zeichen pro Pixel, "." = leer)
const ART = {
    mods: {
        colors: { T: '#b07b46', t: '#7a5230', P: '#9c6b3c', D: '#6b4420', w: '#c69a5b', s: '#cfd8dc' },
        rows: [
            'TTTTTTTTTTTT',
            'TtTTtTTtTTtT',
            'TTTTTTTTTTTT',
            'DDDDDDDDDDDD',
            'PssPPPPPPwwP',
            'PssPPPPPPwwP',
            'PPwPPPPPPPsP',
            'PPwPPPPPPPsP',
            'PPPPPPPPPPPP',
            'PDDDDDDDDDDP',
            'PDPPPPPPPPDP',
            'DDDDDDDDDDDD'
        ]
    },
    texturepacks: {
        colors: { g: '#5fa83a', G: '#7cc24e', h: '#3f7a24', d: '#8b5a2b', e: '#6b4420', s: '#a0a0a0' },
        rows: [
            'gGgggGgggGgg',
            'ggghgggGgggh',
            'gGggggggGggg',
            'hdgGhdgdggdh',
            'ddhddgddhgdd',
            'dddddedddddd',
            'deddddddedsd',
            'ddddsddddddd',
            'dddddddedddd',
            'dedddddddded',
            'ddddeddsdddd',
            'dddddddddddd'
        ]
    },
    skins: {
        colors: { h: '#3b2a1a', H: '#2f1f0f', k: '#c39274', K: '#b4836b', w: '#ffffff', p: '#523d89', n: '#94603e', m: '#6a4030' },
        rows: [
            'hHhhhhHh',
            'hhhhhhhh',
            'hkkkkkKh',
            'kkkKkkkk',
            'kwpkkpwk',
            'kkKnnkkk',
            'kkmkkmkk',
            'kkmmmmkk'
        ]
    }
};

const SVG_NS = 'http://www.w3.org/2000/svg';

// Pixel ueberlappen leicht, damit beim Drehen/Skalieren keine Linien dazwischen entstehen
const pixelArt = category => {
    const art = ART[category];
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${art.rows[0].length} ${art.rows.length}`);
    svg.setAttribute('aria-hidden', 'true');
    art.rows.forEach((row, y) => {
        [...row].forEach((ch, x) => {
            if (!art.colors[ch]) return;
            const rect = document.createElementNS(SVG_NS, 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', 1.06);
            rect.setAttribute('height', 1.06);
            rect.setAttribute('fill', art.colors[ch]);
            svg.appendChild(rect);
        });
    });
    return svg;
};

// --- Downloads ---
const CATEGORIES = {
    all: { title: 'Alle Downloads' },
    mods: { title: 'Mods', badge: 'Mod', badgeClass: 'badge-mod' },
    texturepacks: { title: 'Texturepacks', badge: 'Texturepack', badgeClass: 'badge-pack' },
    skins: { title: 'Skins', badge: 'Skin', badgeClass: 'badge-skin' }
};

const DOWNLOAD_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>';

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const sectionTitle = document.getElementById('section-title');
const search = document.getElementById('search');
const navLinks = document.querySelectorAll('.nav-link[data-filter]');
const editionButtons = document.querySelectorAll('.filter-btn[data-edition]');

const items = [...(window.ITEMS || [])].sort((a, b) => b.updated.localeCompare(a.updated));
const state = { category: 'all', edition: 'all', query: '' };

const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
};

const formatDate = iso => new Date(`${iso}T00:00:00`).toLocaleDateString('de-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

const createCard = item => {
    const category = CATEGORIES[item.category];
    const card = el('article', 'download-card');
    card.appendChild(el('span', `card-badge ${category.badgeClass}`, category.badge));

    const art = el('div', 'card-art');
    if (item.image) {
        const img = el('img');
        img.src = item.image;
        img.alt = '';
        img.loading = 'lazy';
        art.appendChild(img);
    } else {
        art.appendChild(pixelArt(item.category));
    }
    card.appendChild(art);

    const content = el('div', 'card-content');
    content.appendChild(el('h3', '', item.name));

    const details = el('div', 'card-details');
    details.appendChild(el('p', 'card-desc', item.description));
    const tags = el('div', 'card-tags');
    [item.edition, `MC ${item.version}`, item.loader].filter(Boolean).forEach(tag => {
        tags.appendChild(el('span', 'tag', tag));
    });
    details.appendChild(tags);
    content.appendChild(details);

    const footer = el('div', 'card-footer');
    footer.appendChild(el('span', 'card-date', formatDate(item.updated)));
    if (item.example) {
        footer.appendChild(el('span', 'download-btn soon', 'Bald verfügbar'));
    } else {
        const link = el('a', 'download-btn');
        link.href = item.file;
        link.setAttribute('download', '');
        link.innerHTML = `${DOWNLOAD_ICON}<span>Download</span>`;
        footer.appendChild(link);
    }
    content.appendChild(footer);
    card.appendChild(content);
    return card;
};

const matches = item => {
    if (state.category !== 'all' && item.category !== state.category) return false;
    if (state.edition !== 'all' && item.edition !== state.edition) return false;
    if (!state.query) return true;
    const text = [item.name, item.description, item.version, item.edition, item.loader].join(' ').toLowerCase();
    return text.includes(state.query);
};

const render = () => {
    const visible = items.filter(matches);
    grid.replaceChildren(...visible.map(createCard));
    empty.hidden = visible.length > 0;
    sectionTitle.textContent = CATEGORIES[state.category].title;
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.filter === state.category));
};

document.querySelectorAll('[data-count]').forEach(node => {
    const category = node.dataset.count;
    node.textContent = category === 'all'
        ? items.length
        : items.filter(item => item.category === category).length;
});

// --- Filter ---
const applyHash = () => {
    const hash = location.hash.slice(1);
    if (!CATEGORIES[hash] && hash !== '') return;
    state.category = hash || 'all';
    render();
};

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const category = link.dataset.filter;
        history.replaceState(null, '', category === 'all' ? location.pathname : `#${category}`);
        state.category = category;
        render();
        document.getElementById('downloads').scrollIntoView();
    });
});

editionButtons.forEach(button => {
    button.addEventListener('click', () => {
        state.edition = button.dataset.edition;
        editionButtons.forEach(btn => btn.classList.toggle('active', btn === button));
        render();
    });
});

search.addEventListener('input', () => {
    state.query = search.value.trim().toLowerCase();
    render();
});

window.addEventListener('hashchange', applyHash);
render();
applyHash();

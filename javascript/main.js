// --- Service Worker (PWA) ---
const siteRoot = new URL('..', document.currentScript.src);

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(new URL('sw.js', siteRoot), { scope: siteRoot.pathname }).catch(() => {});
    });
}

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
// Ersatzbild pro Kategorie, wenn ein Eintrag kein eigenes Bild hat: Bilddatei oder Pixel-Raster (ein Zeichen pro Pixel, "." = leer)
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
    texturepacks: { image: 'images/grass-block.png' },
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
    if (art.image) {
        const img = el('img', 'pixel-image');
        img.src = art.image;
        img.alt = '';
        return img;
    }
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

const ARROW_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

const hasDetails = item => Boolean(item.details || item.features || item.credits || item.guide);

const createArt = item => {
    if (!item.image) return pixelArt(item.category);
    const img = el('img', 'art-image');
    img.src = item.image;
    img.alt = '';
    img.loading = 'lazy';
    return img;
};

const createTags = item => {
    const tags = el('div', 'card-tags');
    [item.edition, `MC ${item.version}`, item.loader].filter(Boolean).forEach(tag => {
        tags.appendChild(el('span', 'tag', tag));
    });
    return tags;
};

const createDownload = item => {
    if (item.example) return el('span', 'download-btn soon', 'Bald verfügbar');
    const link = el('a', 'download-btn');
    link.href = item.file;
    link.setAttribute('download', '');
    link.innerHTML = `${DOWNLOAD_ICON}<span>Download</span>`;
    link.addEventListener('click', event => {
        if (navigator.onLine) return;
        event.preventDefault();
        showToast('Downloads gehen nur mit Internet');
    });
    return link;
};

const createCard = item => {
    const category = CATEGORIES[item.category];
    const card = el('article', 'download-card');
    card.appendChild(el('span', `card-badge ${category.badgeClass}`, category.badge));

    const art = el('div', 'card-art');
    art.appendChild(createArt(item));
    card.appendChild(art);

    const content = el('div', 'card-content');
    const title = el('h3');
    if (hasDetails(item)) {
        const open = el('button', 'card-title-btn', item.name);
        open.type = 'button';
        open.addEventListener('click', () => openDetail(item));
        title.appendChild(open);
    } else {
        title.textContent = item.name;
    }
    content.appendChild(title);

    const details = el('div', 'card-details');
    details.appendChild(el('p', 'card-desc', item.description));
    details.appendChild(createTags(item));
    content.appendChild(details);

    if (hasDetails(item)) {
        const more = el('button', 'arrow-link');
        more.type = 'button';
        more.innerHTML = `<span>Mehr lesen</span>${ARROW_ICON}`;
        more.addEventListener('click', () => openDetail(item));
        content.appendChild(more);
    }

    const footer = el('div', 'card-footer');
    footer.appendChild(el('span', 'card-date', formatDate(item.updated)));
    footer.appendChild(createDownload(item));
    content.appendChild(footer);
    card.appendChild(content);
    return card;
};

// --- Rename Guide ---
const COPY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';

const toast = el('div', 'toast');
toast.setAttribute('role', 'status');
let toastTimer;

// Im offenen Dialog muss der Hinweis im Dialog liegen, sonst ist er verdeckt
const showToast = text => {
    (dialog.open ? dialog : document.body).appendChild(toast);
    toast.textContent = text;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 1600);
};

const copyText = async (text, message) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast(message);
    } catch (e) {
        showToast(`Kopieren nicht möglich: ${text}`);
    }
};

const createGuide = guide => {
    const section = el('section', 'guide');
    section.appendChild(el('h3', '', guide.title));

    const steps = el('ol', 'guide-steps');
    guide.steps.forEach(text => steps.appendChild(el('li', '', text)));
    section.appendChild(steps);
    const hint = el('p', 'guide-hint', guide.hint);
    if (guide.giveHint) hint.appendChild(el('span', 'guide-give-hint', ` ${guide.giveHint}`));
    section.appendChild(hint);

    const filter = el('label', 'search guide-search');
    filter.innerHTML = '<span class="visually-hidden">Item suchen</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
    const input = el('input');
    input.type = 'search';
    input.placeholder = 'Item oder Name suchen …';
    input.autocomplete = 'off';
    filter.appendChild(input);
    section.appendChild(filter);

    const list = el('div', 'guide-groups');
    const groups = guide.groups.map(group => {
        const row = el('div', 'guide-group');
        const base = el('div', 'guide-base');
        base.appendChild(el('strong', '', group.item));
        base.appendChild(el('span', '', group.itemEn));
        row.appendChild(base);

        const names = el('div', 'guide-names');
        group.names.forEach(([name, icon]) => {
            const chip = el('div', 'guide-chip');
            const nameBtn = el('button', 'guide-name');
            nameBtn.type = 'button';
            nameBtn.title = 'Namen kopieren';
            const img = el('img');
            img.src = `${guide.iconPath}${icon}.png`;
            img.alt = '';
            img.loading = 'lazy';
            nameBtn.appendChild(img);
            nameBtn.appendChild(el('span', '', name));
            nameBtn.addEventListener('click', () => copyText(name, `„${name}“ kopiert`));
            chip.appendChild(nameBtn);

            const giveBtn = el('button', 'guide-give');
            giveBtn.type = 'button';
            giveBtn.title = 'Befehl kopieren';
            giveBtn.innerHTML = `${COPY_ICON}<span>/give</span>`;
            giveBtn.addEventListener('click', () => {
                copyText(`/give @s ${group.id}[custom_name="${name}"]`, 'Befehl kopiert');
            });
            chip.appendChild(giveBtn);
            names.appendChild(chip);
        });
        row.appendChild(names);
        list.appendChild(row);
        return { row, text: [group.item, group.itemEn, ...group.names.map(([name]) => name)].join(' ').toLowerCase() };
    });
    section.appendChild(list);

    const none = el('p', 'empty', 'Kein Item gefunden.');
    none.hidden = true;
    section.appendChild(none);

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        let shown = 0;
        groups.forEach(({ row, text }) => {
            row.hidden = query !== '' && !text.includes(query);
            if (!row.hidden) shown++;
        });
        none.hidden = shown > 0;
    });

    return section;
};

// --- Detail Dialog ---
const dialog = document.getElementById('detail');
const dialogBody = document.getElementById('detail-body');

const openDetail = item => {
    const category = CATEGORIES[item.category];
    const head = el('div', 'detail-head');
    const art = el('div', 'detail-art');
    art.appendChild(createArt(item));
    head.appendChild(art);

    const intro = el('div', 'detail-intro');
    intro.appendChild(el('span', `detail-badge ${category.badgeClass}`, category.badge));
    const heading = el('h2', '', item.name);
    heading.id = 'detail-title';
    intro.appendChild(heading);
    intro.appendChild(el('p', 'detail-lead', item.description));
    intro.appendChild(createTags(item));
    head.appendChild(intro);

    const body = [head];

    (item.details || []).forEach(text => body.push(el('p', 'detail-text', text)));

    if (item.features) {
        body.push(el('h3', '', 'Was drin ist'));
        const list = el('ul', 'detail-list');
        item.features.forEach(text => list.appendChild(el('li', '', text)));
        body.push(list);
    }

    if (item.guide) body.push(createGuide(item.guide));

    if (item.credits) {
        body.push(el('h3', '', 'Enthält Inhalte von'));
        const list = el('ul', 'detail-list detail-credits');
        item.credits.forEach(text => list.appendChild(el('li', '', text)));
        body.push(list);
    }

    const footer = el('div', 'detail-footer');
    footer.appendChild(createDownload(item));
    const meta = [formatDate(item.updated), item.size].filter(Boolean).join(' · ');
    footer.appendChild(el('span', 'card-date', meta));
    body.push(footer);

    dialogBody.replaceChildren(...body);
    dialog.showModal();
    dialog.scrollTop = 0;
};

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());

// Klick auf den abgedunkelten Hintergrund schliesst den Dialog
dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
});

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

/* =================================================================
   SERA INK · interactions
   ================================================================= */
(function () {
    'use strict';

    /* ---------- GALLERY DATA (add/remove entries to match your photos) ----------
       Each piece can carry several tags, so it shows up under multiple filters.   */
    const TAGS = {
        blackwork: 'Blackwork', fineline: 'Fine Line', realism: 'Realism', color: 'Color',
        japanese: 'Japanese', geometric: 'Geometric', ornamental: 'Ornamental',
        blackgrey: 'Black & Grey', floral: 'Floral'
    };

    const WORKS = [
        { title: 'Portrait Sleeve',     shape: 'tall', file: 'seraink/work-face.png',      tags: ['realism', 'blackgrey'] },
        { title: 'Botanical Spine',     shape: '',     file: 'seraink/line.png',           tags: ['fineline', 'floral'] },
        { title: 'Raven Geometric',     shape: '',     file: 'seraink/work-raven.png',     tags: ['blackwork', 'geometric'] },
        { title: 'Warrior Watercolor',  shape: 'tall', file: 'seraink/work-warrior.png',   tags: ['color', 'realism'] },
        { title: 'Koi Sleeve',          shape: '',     file: 'seraink/koi.png',            tags: ['japanese', 'blackgrey', 'realism'] },
        { title: 'Japanese Back Piece', shape: 'tall', file: 'seraink/work-backpiece.png', tags: ['japanese', 'color'] },
        { title: 'Spine Blossom',       shape: '',     file: 'seraink/work-spine.png',     tags: ['fineline', 'floral'] },
        { title: 'Ornamental Forearm',  shape: '',     file: 'seraink/orn.png',            tags: ['fineline', 'ornamental'] },
        { title: 'Geometric Calf',      shape: '',     file: 'seraink/calf.png',           tags: ['blackwork', 'geometric'] }
    ];

    const gallery = document.getElementById('gallery');

    function makeTile(w) {
        const tile = document.createElement('figure');
        tile.className = `tile ${w.shape}`.trim();
        tile.dataset.cat = w.tags.join(' ');
        tile.dataset.full = w.file;
        tile.innerHTML = `
            <img src="${w.file}" alt="${w.title}" loading="lazy">
            <figcaption class="tile__meta">
                <strong>${w.title}</strong>
            </figcaption>`;
        return tile;
    }

    WORKS.forEach(w => gallery.appendChild(makeTile(w)));

    /* ---------- LOAD MORE (appends more pieces for a deeper portfolio) ---------- */
    const loadMore = document.getElementById('loadMore');
    let loads = 0;
    if (loadMore) {
        loadMore.addEventListener('click', () => {
            loads++;
            const active = document.querySelector('.filter.is-active');
            const f = active ? active.dataset.filter : 'all';
            WORKS.forEach(w => {
                const tile = makeTile(w);
                tile.classList.add('tile--new');
                if (f !== 'all' && !tile.dataset.cat.split(' ').includes(f)) tile.classList.add('is-hidden');
                gallery.appendChild(tile);
                requestAnimationFrame(() => tile.classList.remove('tile--new'));
            });
            if (loads >= 2) {
                loadMore.textContent = 'Follow @sera.ink for more';
                loadMore.disabled = true;
            }
        });
    }

    /* ---------- FILTERS ---------- */
    const filters = document.querySelectorAll('.filter');
    const tiles = () => Array.from(document.querySelectorAll('.tile'));
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('is-active'));
            btn.classList.add('is-active');
            const f = btn.dataset.filter;
            tiles().forEach(t => {
                const show = f === 'all' || t.dataset.cat.split(' ').includes(f);
                t.classList.toggle('is-hidden', !show);
            });
        });
    });

    /* ---------- LIGHTBOX ---------- */
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    let current = 0;
    const visible = () => tiles().filter(t => !t.classList.contains('is-hidden'));

    function openLB(tile) {
        const list = visible();
        current = list.indexOf(tile);
        showLB();
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }
    function showLB() {
        const list = visible();
        const tile = list[current];
        if (!tile) return;
        lbImg.src = tile.dataset.full;
        lbImg.alt = tile.querySelector('img').alt;
    }
    function step(dir) {
        const list = visible();
        current = (current + dir + list.length) % list.length;
        showLB();
    }
    function closeLB() {
        lb.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    gallery.addEventListener('click', e => {
        const tile = e.target.closest('.tile');
        if (tile) openLB(tile);
    });
    document.getElementById('lbClose').addEventListener('click', closeLB);
    document.getElementById('lbNext').addEventListener('click', () => step(1));
    document.getElementById('lbPrev').addEventListener('click', () => step(-1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', e => {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
    });

    /* ---------- HERO VIDEO: ensure seamless autoplay loop ---------- */
    const heroVid = document.querySelector('.hero__video');
    if (heroVid) {
        heroVid.loop = true;
        const kick = () => heroVid.play().catch(() => {});
        heroVid.addEventListener('canplay', kick, { once: true });
        heroVid.addEventListener('ended', () => { heroVid.currentTime = 0; kick(); });
    }

    /* ---------- NAV: scroll state + mobile menu ---------- */
    const nav = document.getElementById('nav');
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 40);
    });
    burger.addEventListener('click', () => {
        burger.classList.toggle('is-open');
        navLinks.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        burger.classList.remove('is-open');
        navLinks.classList.remove('is-open');
    }));

    /* ---------- REVEAL ON SCROLL ---------- */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('is-in');
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    /* ---------- HERO COUNTERS ---------- */
    const counters = document.querySelectorAll('[data-count]');
    const cio = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            const target = +el.dataset.count;
            const dur = 1600;
            const start = performance.now();
            (function tick(now) {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                let val = Math.floor(eased * target);
                el.textContent = target >= 1000 ? val.toLocaleString() + '+' : val + (p === 1 ? '+' : '');
                if (p < 1) requestAnimationFrame(tick);
            })(start);
            cio.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));

    /* ---------- TESTIMONIAL SLIDER ---------- */
    const QUOTES = [
        { t: 'Ren turned a vague idea into the best piece on my body. The studio is spotless and the vibe is unreal.', a: 'Sam R., full sleeve' },
        { t: 'Nadia\'s color realism is on another planet. Two years later it still looks like the day I got it.', a: 'Priya N., shoulder portrait' },
        { t: 'I was nervous about a cover-up. Kenji made the old tattoo disappear into something gorgeous.', a: 'Marcus L., forearm cover-up' },
        { t: 'Cleanest shop I\'ve been to, hands down. Professional, kind, and ridiculously talented.', a: 'Bea K., fine line set' }
    ];
    const qText = document.getElementById('quoteText');
    const qAuthor = document.getElementById('quoteAuthor');
    const qDots = document.getElementById('quoteDots');
    let qi = 0, qTimer;
    QUOTES.forEach((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Quote ' + (i + 1));
        if (i === 0) b.classList.add('is-active');
        b.addEventListener('click', () => { setQuote(i); resetTimer(); });
        qDots.appendChild(b);
    });
    function setQuote(i) {
        qi = i;
        qText.style.opacity = 0;
        qAuthor.style.opacity = 0;
        setTimeout(() => {
            qText.textContent = QUOTES[i].t;
            qAuthor.textContent = QUOTES[i].a;
            qText.style.opacity = 1;
            qAuthor.style.opacity = 1;
        }, 250);
        qDots.querySelectorAll('button').forEach((d, di) => d.classList.toggle('is-active', di === i));
    }
    function resetTimer() {
        clearInterval(qTimer);
        qTimer = setInterval(() => setQuote((qi + 1) % QUOTES.length), 5500);
    }
    resetTimer();

    /* ---------- BOOKING FORM ---------- */
    const form = document.getElementById('bookForm');
    const note = document.getElementById('formNote');
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) {
            note.style.color = 'var(--accent)';
            note.textContent = 'Please fill in all fields so we can quote you accurately.';
            form.reportValidity();
            return;
        }
        const name = document.getElementById('name').value.split(' ')[0];
        note.style.color = 'var(--accent-2)';
        note.textContent = `Thanks ${name}! Request received, we'll be in touch within 24 hours. (Demo form)`;
        form.reset();
    });
})();

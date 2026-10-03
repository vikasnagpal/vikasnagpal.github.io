/**
 * The Journey Within: Interaction Layer
 *
 * Modules:
 * 1. Quiet reveals & photographic fade-in (content arrives, it is never thrown at you)
 * 2. Hero parallax (RAF-throttled, passive scroll)
 * 3. Expedition field journal
 *    - Desktop: a physical book. Pages turn around the spine (click, drag or arrow keys),
 *      the page block thickens on the side you have read, a ribbon marks the place.
 *    - Mobile: the same journal as a swipeable run of pages (native scroll-snap).
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const root = document.documentElement;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const prefersReducedMotion = () => reducedMotionQuery.matches;
    const isMobile = () => mobileQuery.matches;
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    root.classList.add('js');

    // =======================================================================
    //  1. Quiet Reveals & Photographic Fade-in
    // =======================================================================
    const REVEAL_GROUPS = [
        { selector: '.text-container > *' },
        { selector: '.gallery-card', variant: 'reveal--pin' },
        { selector: '.journey-heading-container > *' },
        { selector: '.journey-progress-indicator, .journey-map-cover' },
        { selector: '.fb-header-left, .fb-header-right' },
        { selector: '.team-section-title, .team-card-content' },
        { selector: '.team-cohort-header > *' },
        { selector: '.cohort-card' },
        { selector: '.inclusions-header > *' },
        { selector: '.inclusion-card', perRow: 4 },
        { selector: '.inclusions-footer-banner, .pricing-tier-divider, .reservation-heading, .reservation-subheading' },
        { selector: '.pricing-card' },
        { selector: '.footer-grid > *' }
    ];

    if ('IntersectionObserver' in window && !prefersReducedMotion()) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        REVEAL_GROUPS.forEach(({ selector, variant, perRow }) => {
            const items = Array.from(document.querySelectorAll(selector));
            items.forEach((el) => {
                // Stagger siblings gently; never more than ~0.4s behind the first
                const siblings = items.filter((other) => other.parentElement === el.parentElement);
                let order = siblings.indexOf(el);
                if (perRow) order %= perRow;
                el.style.setProperty('--reveal-delay', `${Math.min(order, 4) * 90}ms`);
                el.classList.add('reveal');
                if (variant) el.classList.add(variant);
                revealObserver.observe(el);
            });
        });
    }

    // Photography arrives slowly rather than popping in
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        if (img.complete && img.naturalWidth) return;
        img.classList.add('img-fade');
        const done = () => img.classList.add('is-loaded');
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
    });

    // =======================================================================
    //  2. Hero Parallax
    // =======================================================================
    const bgLayer = document.getElementById('bg-layer');
    const monkImg = document.querySelector('.monk-img');

    const getParallaxFactors = () => (window.innerWidth <= 768)
        ? { hero: 0.15, monk: -0.03 }
        : { hero: 0.3, monk: -0.08 };

    let factors = getParallaxFactors();
    let isScrollTicking = false;

    function renderParallax() {
        isScrollTicking = false;
        if (!bgLayer) return;

        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        if (scrollPosition <= 0) {
            bgLayer.style.opacity = '';
            bgLayer.style.transform = '';
            if (monkImg) monkImg.style.transform = '';
            return;
        }

        if (scrollPosition > windowHeight * 1.6) {
            bgLayer.style.opacity = '0';
            return;
        }

        const fadeStart = windowHeight * 0.1;
        const fadeEnd = windowHeight * 0.6;
        const opacity = clamp(1 - ((scrollPosition - fadeStart) / (fadeEnd - fadeStart)), 0, 1);
        bgLayer.style.opacity = opacity;

        if (prefersReducedMotion()) return;

        bgLayer.style.transform = `translateX(-50%) translateY(-${scrollPosition * factors.hero}px)`;
        if (monkImg) monkImg.style.transform = `translateY(${scrollPosition * factors.monk}px)`;
    }

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(renderParallax);
            isScrollTicking = true;
        }
    }, { passive: true });

    if (window.scrollY > 0) renderParallax();

    // =======================================================================
    //  3. Expedition Field Journal
    // =======================================================================
    const flipbook = document.getElementById('flipbook');
    if (!flipbook) return;

    // --- Single Source of Truth for Expedition Itinerary ---
    const ITINERARY_DATA = [
        {
            day: 1,
            title: "POKHARA",
            fullLocation: "Pokhara",
            altitude: 822,
            thumb: "./Assets/flipbook/day1_pokhara_lake.webp",
            coord: { x: 46, y: 58 }
        },
        {
            day: 2,
            title: "BRIEFING",
            fullLocation: "Pokhara Briefing",
            altitude: 822,
            thumb: "./Assets/flipbook/day2_expedition_briefing.webp",
            coord: { x: 138, y: 58 }
        },
        {
            day: 3,
            title: "MARPHA",
            fullLocation: "Marpha Village",
            altitude: 2670,
            thumb: "./Assets/flipbook/day3_marpha_village.webp",
            coord: { x: 230, y: 40 }
        },
        {
            day: 4,
            title: "MUKTINATH",
            fullLocation: "Muktinath",
            altitude: 3760,
            thumb: "./Assets/flipbook/muktinath_temple.webp",
            coord: { x: 323, y: 20 }
        },
        {
            day: 5,
            title: "UPPER MUSTANG",
            fullLocation: "Syangboche",
            altitude: 3800,
            thumb: "./Assets/flipbook/day5_mustang_canyon.jpg",
            coord: { x: 415, y: 19 }
        },
        {
            day: 6,
            title: "LO MANTHANG",
            fullLocation: "Lo Manthang",
            altitude: 3840,
            thumb: "./Assets/flipbook/lomanthang_walled.webp",
            coord: { x: 507, y: 18 }
        },
        {
            day: 7,
            title: "WALLED CITY",
            fullLocation: "Lo Manthang Stay",
            altitude: 3840,
            thumb: "./Assets/flipbook/tiji_festival.webp",
            coord: { x: 600, y: 18 }
        },
        {
            day: 8,
            title: "CHHOSER CAVES",
            fullLocation: "Chhoser Sky Caves",
            altitude: 3840,
            thumb: "./Assets/flipbook/day8_jhong_caves.jpg",
            coord: { x: 692, y: 18 }
        },
        {
            day: 9,
            title: "LURI GOMPA",
            fullLocation: "Chhusang",
            altitude: 2980,
            thumb: "./Assets/flipbook/day9_luri_gompa.jpg",
            coord: { x: 784, y: 34 }
        },
        {
            day: 10,
            title: "KAGBENI",
            fullLocation: "Kagbeni",
            altitude: 2800,
            thumb: "./Assets/flipbook/day10_kagbeni_village.jpg",
            coord: { x: 876, y: 38 }
        },
        {
            day: 11,
            title: "LETE PINES",
            fullLocation: "Lete",
            altitude: 2480,
            thumb: "./Assets/flipbook/day11_lete_valley.jpg",
            coord: { x: 969, y: 43 }
        },
        {
            day: 12,
            title: "TATOPANI",
            fullLocation: "Tatopani",
            altitude: 1190,
            thumb: "./Assets/flipbook/day12_tatopani_hotspring.jpg",
            coord: { x: 1061, y: 58 }
        },
        {
            day: 13,
            title: "DEPARTURE",
            fullLocation: "Pokhara / Kathmandu",
            altitude: 822,
            thumb: "./Assets/flipbook/day1_pokhara_lake.webp",
            coord: { x: 1154, y: 58 }
        }
    ];

    const spreads = Array.from(flipbook.querySelectorAll('.fb-spread'));
    const nodes = Array.from(flipbook.querySelectorAll('.fb-route-node'));
    const prevBtn = document.getElementById('fb-prev');
    const nextBtn = document.getElementById('fb-next');
    const viewport = document.getElementById('fb-viewport');
    const stage = document.getElementById('fb-stage');
    const folioCurr = document.getElementById('fb-folio-curr');
    const folioDest = document.getElementById('fb-folio-dest');
    const elevMarker = document.getElementById('fb-elev-indicator');
    const elevGuide = document.getElementById('fb-elev-guide');
    const soundToggle = document.getElementById('fb-sound-toggle');
    const tooltip = document.getElementById('fb-node-tooltip');
    const tooltipImg = document.getElementById('fb-tooltip-img');
    const tooltipDay = document.getElementById('fb-tooltip-day');
    const tooltipLoc = document.getElementById('fb-tooltip-loc');
    const tooltipAlt = document.getElementById('fb-tooltip-alt');
    const elevationWrap = document.querySelector('.fb-elevation-wrap');
    const elevationSvg = document.querySelector('.fb-elevation-svg');

    const SVG_W = 1200;
    const SVG_H = 68;
    const totalDays = spreads.length;
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

    // Default to Day 4 (index 3: Muktinath)
    let currentIndex = 3;
    let turning = null;      // the leaf currently in motion
    let queuedIndex = null;  // where the reader asked to go while a page was still turning
    let isSoundEnabled = false;

    // --- Book furniture: page block (read / unread) and a ribbon marker ---
    const furniture = document.createElement('div');
    furniture.className = 'fb-book-furniture';
    furniture.setAttribute('aria-hidden', 'true');
    furniture.innerHTML = '<span class="fb-block fb-block--left"></span><span class="fb-block fb-block--right"></span>';
    stage.prepend(furniture);

    const ribbon = document.createElement('span');
    ribbon.className = 'fb-ribbon';
    ribbon.setAttribute('aria-hidden', 'true');
    stage.append(ribbon);

    // --- Web Audio: soft paper turn (synthesised on demand, off by default) ---
    let audioCtx = null;
    function playPageTurnSound() {
        if (!isSoundEnabled) return;
        try {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) audioCtx = new AudioContextClass();
            }
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const duration = 0.42;
            const bufferSize = Math.floor(audioCtx.sampleRate * duration);
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const channel = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                // A lift (swell) followed by the page settling (short tail)
                const t = i / bufferSize;
                const envelope = t < 0.55 ? Math.sin((t / 0.55) * Math.PI * 0.5) : Math.exp(-(t - 0.55) * 9);
                channel[i] = (Math.random() * 2 - 1) * envelope;
            }

            const source = audioCtx.createBufferSource();
            source.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1400, now);
            filter.frequency.exponentialRampToValueAtTime(420, now + duration);
            filter.Q.value = 0.9;

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.06, now + 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            source.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            source.start(now);
        } catch (e) {
            // Audio policy gracefully handled
        }
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            isSoundEnabled = !isSoundEnabled;
            soundToggle.classList.toggle('is-active', isSoundEnabled);
            soundToggle.classList.toggle('is-muted', !isSoundEnabled);
            soundToggle.setAttribute('aria-pressed', String(isSoundEnabled));
            if (isSoundEnabled) playPageTurnSound();
        });
    }

    // --- Which spread is on the table ---
    // Photos on closed pages are lazy; the pages either side of the open one are fetched
    // ahead so a turn or swipe never lands on an empty frame
    let journalIsNear = !('IntersectionObserver' in window);
    function warmNeighbours(index) {
        if (!journalIsNear) return;
        [index - 1, index + 1].forEach((idx) => {
            const spread = spreads[idx];
            if (!spread) return;
            spread.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
        });
    }

    function showSpread(index) {
        warmNeighbours(index);
        const mobile = isMobile();
        spreads.forEach((spread, idx) => {
            const active = idx === index;
            spread.classList.toggle('is-active', active);
            // On desktop only one spread exists for the reader; on mobile all pages are in the run
            if (!mobile && !active) {
                spread.setAttribute('inert', '');
                spread.setAttribute('aria-hidden', 'true');
            } else {
                spread.removeAttribute('inert');
                spread.removeAttribute('aria-hidden');
            }
        });
    }

    // --- Everything that reflects the current day ---
    function updateChrome() {
        const data = ITINERARY_DATA[currentIndex] || ITINERARY_DATA[0];

        if (folioCurr) folioCurr.textContent = `DAY ${pad(data.day)}`;
        if (folioDest) folioDest.textContent = data.title;

        nodes.forEach((node, idx) => {
            const active = idx === currentIndex;
            node.classList.toggle('active', active);
            if (active) node.setAttribute('aria-current', 'step');
            else node.removeAttribute('aria-current');
        });

        positionElevationMarker();

        // Keep the active waypoint in view when the route is scrollable (mobile)
        const activeNode = nodes[currentIndex];
        if (elevationWrap && activeNode && elevationWrap.scrollWidth > elevationWrap.clientWidth + 2) {
            const left = activeNode.offsetLeft - (elevationWrap.clientWidth - activeNode.offsetWidth) / 2;
            elevationWrap.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        }

        // Page block: pages already read sit on the left, the rest on the right
        stage.style.setProperty('--pages-read', currentIndex);
        stage.style.setProperty('--pages-left', totalDays - 1 - currentIndex);

        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === totalDays - 1;
    }

    function svgPoint(coord) {
        const width = elevationSvg ? elevationSvg.clientWidth : 0;
        const height = elevationSvg ? elevationSvg.clientHeight : 0;
        return { x: (coord.x / SVG_W) * width, y: (coord.y / SVG_H) * height };
    }

    function positionElevationMarker() {
        const data = ITINERARY_DATA[currentIndex];
        if (!elevMarker || !data || !data.coord) return;
        const { x, y } = svgPoint(data.coord);
        elevMarker.style.transform = `translate(${x}px, ${y}px)`;
    }

    // =======================================================================
    //  Desktop: the page leaf
    //  A leaf has a front face (lies on the right) and a back face (lies on the left).
    //  theta: 0 = lying on the right, 1 = lying on the left.
    // =======================================================================
    const cubicBezier = (x1, y1, x2, y2) => {
        const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
        const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
        const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
        const sampleY = (t) => ((ay * t + by) * t + cy) * t;
        const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
        return (x) => {
            let t = x;
            for (let i = 0; i < 6; i++) {
                const d = sampleX(t) - x;
                const s = slopeX(t);
                if (Math.abs(d) < 1e-4 || Math.abs(s) < 1e-6) break;
                t -= d / s;
            }
            return sampleY(clamp(t, 0, 1));
        };
    };

    // Paper has a little inertia: a slow lift, an even carry, a soft landing
    const easePage = cubicBezier(0.55, 0.02, 0.28, 1);
    const easeSettle = cubicBezier(0.22, 1, 0.36, 1);

    // A cloned page keeps its spread's layout rhythm (type A–E) by carrying the type class
    function pageClone(spread, side) {
        const page = spread.querySelector(side === 'left' ? '.fb-page--left' : '.fb-page--right');
        const clone = page.cloneNode(true);
        const holder = document.createElement('div');
        holder.className = 'fb-page-holder';
        spread.classList.forEach((cls) => {
            if (cls.startsWith('fb-spread--type-')) holder.classList.add(cls);
        });
        clone.classList.add('fb-page--clone');
        holder.append(clone);
        return holder;
    }

    function buildLeaf(from, to) {
        const dir = to > from ? 1 : -1;
        const layer = document.createElement('div');
        layer.className = 'fb-turn-layer';
        layer.setAttribute('aria-hidden', 'true');

        // The half of the old spread that stays visible until the leaf lands on it
        const cover = document.createElement('div');
        cover.className = `fb-leaf-cover fb-leaf-cover--${dir > 0 ? 'left' : 'right'}`;
        cover.append(pageClone(spreads[from], dir > 0 ? 'left' : 'right'));

        const castLeft = document.createElement('div');
        castLeft.className = 'fb-leaf-cast fb-leaf-cast--left';
        const castRight = document.createElement('div');
        castRight.className = 'fb-leaf-cast fb-leaf-cast--right';

        const leaf = document.createElement('div');
        leaf.className = 'fb-leaf';

        const front = document.createElement('div');
        front.className = 'fb-leaf-face fb-leaf-face--front';
        front.append(pageClone(dir > 0 ? spreads[from] : spreads[to], 'right'));
        const frontShade = document.createElement('span');
        frontShade.className = 'fb-leaf-shade';
        front.append(frontShade);

        const back = document.createElement('div');
        back.className = 'fb-leaf-face fb-leaf-face--back';
        back.append(pageClone(dir > 0 ? spreads[to] : spreads[from], 'left'));
        const backShade = document.createElement('span');
        backShade.className = 'fb-leaf-shade';
        back.append(backShade);

        leaf.append(front, back);
        layer.append(cover, castLeft, castRight, leaf);
        stage.append(layer);

        const state = { layer, leaf, frontShade, backShade, castLeft, castRight, dir, from, to, raf: 0, theta: dir > 0 ? 0 : 1 };
        renderLeaf(state);
        return state;
    }

    function renderLeaf(state) {
        const t = clamp(state.theta, 0, 1);
        const lift = Math.sin(t * Math.PI); // 0 flat, 1 upright
        state.leaf.style.transform = `rotateY(${-180 * t}deg) translateZ(${lift * 1.5}px)`;
        // Faces darken as they turn away from the light
        state.frontShade.style.opacity = (Math.min(t, 0.5) * 2 * 0.22).toFixed(3);
        state.backShade.style.opacity = (Math.min(1 - t, 0.5) * 2 * 0.22).toFixed(3);
        // The leaf casts a soft shadow onto whichever page it is travelling over
        const castRight = t <= 0.5 ? lift : (1 - t) * 2;
        const castLeft = t >= 0.5 ? lift : t * 2;
        state.castRight.style.opacity = (castRight * 0.55).toFixed(3);
        state.castLeft.style.opacity = (castLeft * 0.55).toFixed(3);
        state.castRight.style.setProperty('--cast-reach', `${Math.round((1 - t) * 100)}%`);
        state.castLeft.style.setProperty('--cast-reach', `${Math.round(t * 100)}%`);
    }

    function animateLeaf(state, targetTheta, duration, ease, onDone) {
        const startTheta = state.theta;
        const startTime = performance.now();
        cancelAnimationFrame(state.raf);
        const step = (now) => {
            const k = clamp((now - startTime) / duration, 0, 1);
            state.theta = startTheta + (targetTheta - startTheta) * ease(k);
            renderLeaf(state);
            if (k < 1) state.raf = requestAnimationFrame(step);
            else if (onDone) onDone();
        };
        state.raf = requestAnimationFrame(step);
    }

    function swayRibbon() {
        ribbon.classList.remove('is-swaying');
        void ribbon.offsetWidth; // restart the animation
        ribbon.classList.add('is-swaying');
    }

    function releaseLeaf(state) {
        cancelAnimationFrame(state.raf);
        state.layer.remove();
        if (turning === state) turning = null;
        flipbook.classList.remove('is-turning');
        if (queuedIndex !== null) {
            const next = queuedIndex;
            queuedIndex = null;
            if (next !== currentIndex) turnTo(next, { hurried: true });
        }
    }

    function commitTurn(state, fromTheta) {
        currentIndex = state.to;
        updateChrome();
        playPageTurnSound();
        swayRibbon();
        const target = state.dir > 0 ? 1 : 0;
        const remaining = Math.abs(target - fromTheta);
        return { target, remaining };
    }

    // Where the reader is heading (accounts for a turn still in motion)
    const targetIndex = () => (queuedIndex !== null ? queuedIndex : currentIndex);

    function turnTo(index, { hurried = false } = {}) {
        index = clamp(index, 0, totalDays - 1);

        if (isMobile()) {
            scrollToSpread(index);
            return;
        }

        if (turning) {
            queuedIndex = index;
            return;
        }
        if (index === currentIndex) return;

        if (prefersReducedMotion()) {
            currentIndex = index;
            showSpread(currentIndex);
            updateChrome();
            return;
        }

        const state = buildLeaf(currentIndex, index);
        turning = state;
        flipbook.classList.add('is-turning');
        showSpread(index);
        commitTurn(state, state.theta);

        // One deliberate turn, whether the reader moves one day or jumps across the trip
        const jump = Math.abs(state.to - state.from);
        const duration = hurried ? 620 : (jump > 1 ? 1050 : 920);
        animateLeaf(state, state.dir > 0 ? 1 : 0, duration, easePage, () => releaseLeaf(state));
    }

    // --- First sight: the page corner lifts once, just enough to show there is more ---
    function peek() {
        if (turning || isMobile() || prefersReducedMotion() || currentIndex >= totalDays - 1) return;
        const state = buildLeaf(currentIndex, currentIndex + 1);
        turning = state;
        showSpread(currentIndex + 1);
        animateLeaf(state, 0.09, 700, easeSettle, () => {
            setTimeout(() => {
                animateLeaf(state, 0, 760, easePage, () => {
                    showSpread(currentIndex);
                    releaseLeaf(state);
                });
            }, 160);
        });
    }

    if ('IntersectionObserver' in window) {
        const nearObserver = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            nearObserver.disconnect();
            journalIsNear = true;
            warmNeighbours(currentIndex);
        }, { rootMargin: '900px 0px' });
        nearObserver.observe(viewport);

        const peekObserver = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            peekObserver.disconnect();
            setTimeout(peek, 650);
        }, { threshold: 0.55 });
        peekObserver.observe(viewport);
    }

    // --- Pointer: click a page to turn it, or take hold of it and drag ---
    let drag = null;
    let suppressClick = false;

    viewport.addEventListener('pointerdown', (e) => {
        if (isMobile() || turning || e.button !== 0 || e.pointerType === 'touch') return;
        if (e.target.closest('a, button')) return;
        const page = e.target.closest('.fb-spread.is-active .fb-page');
        if (!page) return;
        const dir = page.classList.contains('fb-page--right') ? 1 : -1;
        const to = currentIndex + dir;
        if (to < 0 || to >= totalDays) return;
        drag = { dir, to, x0: e.clientX, lastX: e.clientX, lastT: performance.now(), velocity: 0, state: null, pointerId: e.pointerId };
    });

    window.addEventListener('pointermove', (e) => {
        if (!drag || e.pointerId !== drag.pointerId) return;
        const dx = e.clientX - drag.x0;
        drag.moved = drag.moved || Math.abs(dx) > 8;

        if (!drag.state) {
            // Only a deliberate pull (towards the spine) becomes a drag
            if (Math.abs(dx) < 8 || Math.sign(dx) !== -drag.dir) return;
            drag.state = buildLeaf(currentIndex, drag.to);
            turning = drag.state;
            showSpread(drag.to);
            flipbook.classList.add('is-dragging', 'is-turning');
        }

        const now = performance.now();
        drag.velocity = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
        drag.lastX = e.clientX;
        drag.lastT = now;

        const bookWidth = stage.clientWidth || 960;
        const pull = clamp((-dx * drag.dir) / (bookWidth * 0.82), 0, 1);
        // A touch of resistance at the start, like lifting a real page
        const progress = Math.pow(pull, 1.18);
        drag.state.theta = drag.dir > 0 ? progress : 1 - progress;
        renderLeaf(drag.state);
    });

    const endDrag = (e) => {
        if (!drag || (e && e.pointerId !== drag.pointerId)) return;
        const { state, dir, velocity, moved } = drag;
        drag = null;
        if (!state) {
            // A plain click turns the page (handled below); a stray drag the wrong way does nothing
            if (moved) suppressClick = true;
            return;
        }
        suppressClick = true;
        flipbook.classList.remove('is-dragging');

        const progress = dir > 0 ? state.theta : 1 - state.theta;
        const flicked = (-velocity * dir) > 0.45;
        if (progress > 0.32 || flicked) {
            const { target, remaining } = commitTurn(state, state.theta);
            animateLeaf(state, target, 260 + remaining * 520, easeSettle, () => releaseLeaf(state));
        } else {
            // Let go too early: the page falls back into place
            animateLeaf(state, dir > 0 ? 0 : 1, 240 + progress * 420, easeSettle, () => {
                showSpread(currentIndex);
                releaseLeaf(state);
            });
        }
    };
    window.addEventListener('pointerup', endDrag);
    // Photographs must not start a native image drag mid-turn
    viewport.addEventListener('dragstart', (e) => e.preventDefault());
    window.addEventListener('pointercancel', endDrag);

    spreads.forEach((spread) => {
        spread.addEventListener('click', (e) => {
            if (suppressClick) {
                suppressClick = false;
                return;
            }
            if (isMobile() || !spread.classList.contains('is-active')) return;
            if (e.target.closest('button, a')) return;
            if (e.target.closest('.fb-page--left')) turnTo(targetIndex() - 1);
            else if (e.target.closest('.fb-page--right')) turnTo(targetIndex() + 1);
        });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => turnTo(targetIndex() - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => turnTo(targetIndex() + 1));

    // --- Keyboard: arrows turn pages whenever focus is inside the journal ---
    flipbook.addEventListener('keydown', (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        const keyMap = { ArrowRight: targetIndex() + 1, ArrowLeft: targetIndex() - 1, Home: 0, End: totalDays - 1 };
        if (!(e.key in keyMap)) return;
        // Leave the route timeline's own horizontal scrolling alone on mobile
        if (isMobile() && e.target.closest('.fb-elevation-wrap')) return;
        e.preventDefault();
        turnTo(keyMap[e.key]);
    });

    // =======================================================================
    //  Mobile: a swipeable run of journal pages (native scroll-snap)
    // =======================================================================
    function scrollToSpread(index, behavior = 'smooth') {
        const spread = spreads[index];
        if (!spread) return;
        const left = spread.offsetLeft - (stage.clientWidth - spread.offsetWidth) / 2;
        stage.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : behavior });
    }

    let stageScrollTicking = false;
    stage.addEventListener('scroll', () => {
        if (!isMobile() || stageScrollTicking) return;
        stageScrollTicking = true;
        requestAnimationFrame(() => {
            stageScrollTicking = false;
            const center = stage.scrollLeft + stage.clientWidth / 2;
            let nearest = currentIndex;
            let best = Infinity;
            spreads.forEach((spread, idx) => {
                const distance = Math.abs(spread.offsetLeft + spread.offsetWidth / 2 - center);
                if (distance < best) {
                    best = distance;
                    nearest = idx;
                }
            });
            if (nearest !== currentIndex) {
                currentIndex = nearest;
                showSpread(currentIndex);
                updateChrome();
            }
        });
    }, { passive: true });

    // =======================================================================
    //  Route timeline: waypoints, hover preview, altitude guide
    // =======================================================================
    nodes.forEach((node, idx) => {
        node.addEventListener('click', () => turnTo(idx));

        node.addEventListener('mouseenter', () => {
            if (isMobile() || !elevationWrap) return;
            const dayData = ITINERARY_DATA[idx];
            if (!dayData) return;

            const wrapRect = elevationWrap.getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();
            const centerX = (nodeRect.left + nodeRect.width / 2) - wrapRect.left;

            if (tooltip) {
                if (tooltipImg) tooltipImg.src = dayData.thumb;
                if (tooltipDay) tooltipDay.textContent = `DAY ${pad(dayData.day)}`;
                if (tooltipLoc) tooltipLoc.textContent = dayData.fullLocation;
                if (tooltipAlt) tooltipAlt.textContent = `${dayData.altitude.toLocaleString()} m`;
                // Float the preview just above the day's point on the profile
                const pointY = dayData.coord ? svgPoint(dayData.coord).y : 0;
                tooltip.style.left = `${centerX}px`;
                tooltip.style.top = `${pointY - 12}px`;
                tooltip.classList.add('is-visible');
            }

            // A hairline drops from the elevation curve to the waypoint
            if (elevGuide && dayData.coord) {
                const { y } = svgPoint(dayData.coord);
                const marker = node.querySelector('.fb-node-marker');
                const markerRect = marker ? marker.getBoundingClientRect() : nodeRect;
                const bottom = (markerRect.top + markerRect.height / 2) - wrapRect.top;
                elevGuide.style.transform = `translate(${centerX}px, ${y}px)`;
                elevGuide.style.height = `${Math.max(0, bottom - y)}px`;
                elevGuide.classList.add('is-visible');
            }
        });

        node.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.classList.remove('is-visible');
            if (elevGuide) elevGuide.classList.remove('is-visible');
        });
    });

    // =======================================================================
    //  Layout changes
    // =======================================================================
    function applyMode() {
        queuedIndex = null;
        if (turning) releaseLeaf(turning);
        drag = null;
        flipbook.classList.remove('is-dragging', 'is-turning');
        showSpread(currentIndex);
        updateChrome();
        if (isMobile()) requestAnimationFrame(() => scrollToSpread(currentIndex, 'auto'));
        else stage.scrollLeft = 0;
    }

    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', applyMode);
    else if (mobileQuery.addListener) mobileQuery.addListener(applyMode);

    let resizeFrame = null;
    window.addEventListener('resize', () => {
        if (resizeFrame) cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
            factors = getParallaxFactors();
            positionElevationMarker();
        });
    }, { passive: true });

    // Initial render
    applyMode();
});

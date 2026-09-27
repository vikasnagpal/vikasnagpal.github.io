/**
 * Journey Beyond - Expedition Interaction Controller
 * 
 * Modules:
 * 1. Parallax & Hero Motion Engine (RAF-throttled, passive scroll, viewport-capped)
 * 2. 3D Flipbook & Responsive Itinerary Controller (Coverflow desktop, snap-cards mobile)
 * 3. Modal Overview Controller (Keyboard traps, ARIA sync, scroll locking)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Respect user reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =======================================================================
    //  1. Parallax & Scroll Motion Engine
    // =======================================================================
    const bgLayer = document.getElementById('bg-layer');
    const monkImg = document.querySelector('.monk-img');

    // Viewport-aware parallax factors
    const getParallaxFactors = () => {
        const w = window.innerWidth;
        if (w <= 768) {
            return { hero: 0.15, monk: -0.04, monkScale: 0 };
        }
        return { hero: 0.3, monk: -0.09, monkScale: 0.00015 };
    };

    let factors = getParallaxFactors();
    let isScrollTicking = false;
    let latestScrollY = window.scrollY;

    function renderParallax() {
        isScrollTicking = false;
        if (!bgLayer) return;

        const scrollPosition = latestScrollY;
        const windowHeight = window.innerHeight;

        // At top of page, let pure CSS dictate rendering with zero inline overhead
        if (scrollPosition <= 0) {
            bgLayer.style.opacity = '';
            bgLayer.style.transform = '';
            if (monkImg) monkImg.style.transform = '';
            return;
        }

        // Skip calculations when hero is completely past viewport
        if (scrollPosition > windowHeight * 1.6) {
            bgLayer.style.opacity = '0';
            return;
        }

        const fadeStart = windowHeight * 0.1;
        const fadeEnd = windowHeight * 0.6;

        let opacity = 1;
        if (scrollPosition > fadeStart) {
            opacity = 1 - ((scrollPosition - fadeStart) / (fadeEnd - fadeStart));
        }
        opacity = Math.max(0, Math.min(1, opacity));
        bgLayer.style.opacity = opacity;

        if (prefersReducedMotion) return;

        const translateY = scrollPosition * factors.hero;
        bgLayer.style.transform = `translateX(-50%) translateY(-${translateY}px)`;

        if (monkImg) {
            const monkTranslateY = scrollPosition * factors.monk;
            if (factors.monkScale > 0) {
                const monkScale = 1 + (scrollPosition * factors.monkScale);
                monkImg.style.transform = `translateY(${monkTranslateY}px) scale(${monkScale})`;
            } else {
                monkImg.style.transform = `translateY(${monkTranslateY}px)`;
            }
        }
    }

    window.addEventListener('scroll', () => {
        latestScrollY = window.scrollY;
        if (!isScrollTicking) {
            window.requestAnimationFrame(renderParallax);
            isScrollTicking = true;
        }
    }, { passive: true });

    // Initial check only if page was reloaded mid-scroll
    if (window.scrollY > 0) {
        renderParallax();
    }


            // =======================================================================
    //  2. Expedition Field Journal Controller (Tactile Book & Single Source)
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
            overnight: "Pokhara (822 m)",
            hook: "Lakeside calm before the high plateau.",
            summary: "Lakeside arrival, gear inspection, and orientation for the high plateau beyond the Annapurnas.",
            thumb: "./Assets/flipbook/day1_pokhara_lake.jpg",
            coord: { x: 46, y: 58 }
        },
        {
            day: 2,
            title: "BRIEFING",
            fullLocation: "Pokhara Briefing",
            altitude: 822,
            overnight: "Pokhara (822 m)",
            hook: "Monastic lineage and inner alignment.",
            summary: "Morning lineage introduction with HE Palga Rinpoche. Expedition briefing and packing sacred texts.",
            thumb: "./Assets/flipbook/day2_expedition_briefing.jpg",
            coord: { x: 138, y: 58 }
        },
        {
            day: 3,
            title: "MARPHA",
            fullLocation: "Marpha Village",
            altitude: 2670,
            overnight: "Marpha (2,670 m)",
            hook: "Apple orchards and stone-paved alleys.",
            summary: "Ascending into the Kali Gandaki canyon. Whitewashed Thakali houses and canal-lined alleys.",
            thumb: "./Assets/flipbook/day3_marpha_village.jpg",
            coord: { x: 230, y: 40 }
        },
        {
            day: 4,
            title: "MUKTINATH",
            fullLocation: "Muktinath",
            altitude: 3760,
            overnight: "Muktinath (3,760 m)",
            hook: "Fire and water in the same place.",
            summary: "Arriving at the sacred threshold where natural flame burns across stone spring waters beneath Thorong La.",
            thumb: "./Assets/flipbook/muktinath_temple.jpg",
            coord: { x: 323, y: 20 }
        },
        {
            day: 5,
            title: "UPPER MUSTANG",
            fullLocation: "Syangboche",
            altitude: 3800,
            overnight: "Syangboche (3,800 m)",
            hook: "Crossing into the rain-shadow desert.",
            summary: "Permit checkpoint at Kagbeni passed. Deep ochre cliffs, wind-sculpted towers, and silent passes.",
            thumb: "./Assets/flipbook/day5_mustang_canyon.jpg",
            coord: { x: 415, y: 19 }
        },
        {
            day: 6,
            title: "LO MANTHANG",
            fullLocation: "Lo Manthang",
            altitude: 3840,
            overnight: "Lo Manthang (3,840 m)",
            hook: "The walled city at the edge of the world.",
            summary: "Riding across the desert horizon into the ancient fortified capital of the Kingdom of Lo.",
            thumb: "./Assets/flipbook/lomanthang_walled.jpg",
            coord: { x: 507, y: 18 }
        },
        {
            day: 7,
            title: "WALLED CITY",
            fullLocation: "Lo Manthang Stay",
            altitude: 3840,
            overnight: "Lo Manthang (3,840 m)",
            hook: "Monasteries, frescoes and ancient alleys.",
            summary: "Full day inside the four-gated city. Private teaching with HE Palga Rinpoche in the royal monastery.",
            thumb: "./Assets/flipbook/tiji_festival.jpg",
            coord: { x: 600, y: 18 }
        },
        {
            day: 8,
            title: "CHHOSER CAVES",
            fullLocation: "Chhoser Sky Caves",
            altitude: 3840, // Canonical max elevation aligned across site
            overnight: "Lo Manthang (3,840 m)",
            hook: "Five stories carved into stone cliffs.",
            summary: "Exploring the mysterious Jhong cave complex, hollowed out thousands of years ago by ancient troglodytes.",
            thumb: "./Assets/flipbook/day8_jhong_caves.jpg",
            coord: { x: 692, y: 18 }
        },
        {
            day: 9,
            title: "LURI GOMPA",
            fullLocation: "Chhusang",
            altitude: 2980,
            overnight: "Chhusang (2,980 m)",
            hook: "Cliff-perched red stupa and sacred hermitage.",
            summary: "Visiting the cave temple of Luri Gompa, housing exquisite 13th-century Kagyu Tantric mandalas.",
            thumb: "./Assets/flipbook/day9_luri_gompa.jpg",
            coord: { x: 784, y: 34 }
        },
        {
            day: 10,
            title: "KAGBENI",
            fullLocation: "Kagbeni",
            altitude: 2800,
            overnight: "Kagbeni (2,800 m)",
            hook: "Ancient gateway of red clay and mud brick.",
            summary: "Medieval mud-brick town at the confluence of rivers. Old fortress and sacred prayer wheels.",
            thumb: "./Assets/flipbook/day10_kagbeni_village.jpg",
            coord: { x: 876, y: 38 }
        },
        {
            day: 11,
            title: "LETE PINES",
            fullLocation: "Lete",
            altitude: 2480,
            overnight: "Lete (2,480 m)",
            hook: "Descent into pine forests under Dhaulagiri.",
            summary: "Dropping down the gorge into fragrant pine needles and roaring river cascades.",
            thumb: "./Assets/flipbook/day11_lete_valley.jpg",
            coord: { x: 969, y: 43 }
        },
        {
            day: 12,
            title: "TATOPANI",
            fullLocation: "Tatopani",
            altitude: 1190,
            overnight: "Tatopani / Pokhara",
            hook: "Natural mineral springs and Thakali feast.",
            summary: "Resting muscles in natural hot springs surrounded by subtropical terraces. Traditional Thakali feast.",
            thumb: "./Assets/flipbook/day12_tatopani_hotspring.jpg",
            coord: { x: 1061, y: 58 }
        },
        {
            day: 13,
            title: "DEPARTURE",
            fullLocation: "Pokhara / Kathmandu",
            altitude: 822,
            overnight: "Return Home",
            hook: "Closing reflection and journey home.",
            summary: "Morning reflection by Phewa Lake. Flight back to Kathmandu with renewed inner clarity.",
            thumb: "./Assets/flipbook/day1_pokhara_lake.jpg",
            coord: { x: 1154, y: 58 }
        }
    ];

    const spreads = Array.from(flipbook.querySelectorAll('.fb-spread'));
    const nodes = Array.from(flipbook.querySelectorAll('.fb-route-node'));
    const prevBtn = document.getElementById('fb-prev');
    const nextBtn = document.getElementById('fb-next');
    const playBtn = document.getElementById('fb-play');
    const viewport = document.getElementById('fb-viewport');
    const stage = document.getElementById('fb-stage');
    const folioCurr = document.getElementById('fb-folio-curr');
    const folioDest = document.getElementById('fb-folio-dest');
    const elevIndicator = document.getElementById('fb-elev-indicator');
    const soundToggle = document.getElementById('fb-sound-toggle');
    const soundLabel = document.querySelector('.fb-sound-lbl');

    const tooltip = document.getElementById('fb-node-tooltip');
    const tooltipImg = document.getElementById('fb-tooltip-img');
    const tooltipDay = document.getElementById('fb-tooltip-day');
    const tooltipLoc = document.getElementById('fb-tooltip-loc');
    const tooltipAlt = document.getElementById('fb-tooltip-alt');
    const elevationWrap = document.querySelector('.fb-elevation-wrap');

    const totalDays = spreads.length;
    // Default to Day 4 (index 3: Muktinath)
    let currentIndex = 3;
    let autoTimer = null;
    let isPlaying = false;
    let isSoundEnabled = false;

    // --- Web Audio Tactile Paper Turn Sound (Synthesized on Demand) ---
    let audioCtx = null;
    function playPageTurnSound() {
        if (!isSoundEnabled) return;
        try {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) audioCtx = new AudioContextClass();
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (!audioCtx) return;

            // Generate soft noise burst shaped like real tactile paper flutter
            const duration = 0.22;
            const bufferSize = Math.floor(audioCtx.sampleRate * duration);
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const channel = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                channel[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.30));
            }

            const noiseSource = audioCtx.createBufferSource();
            noiseSource.buffer = buffer;

            // Warm bandpass filter around 750Hz
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(750, audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(340, audioCtx.currentTime + duration);
            filter.Q.value = 1.8;

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            noiseSource.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            noiseSource.start();
        } catch (e) {
            // Audio policy gracefully handled
        }
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            isSoundEnabled = !isSoundEnabled;
            soundToggle.classList.toggle('is-active', isSoundEnabled);
            soundToggle.classList.toggle('is-muted', !isSoundEnabled);
            if (soundLabel) {
                soundLabel.textContent = isSoundEnabled ? 'SOUND · ON' : 'SOUND · OFF';
            }
            if (isSoundEnabled) playPageTurnSound();
        });
    }

    // --- Update Journal View & 3D Tactile Stack Coordination ---
    function updateJournalView(direction = 0) {
        const isDesktop = window.innerWidth > 768;

        if (isDesktop) {
            // Desktop: Full 3D Stack Coordination (2–3 visible layers on each side)
            spreads.forEach((spread, idx) => {
                spread.classList.remove('is-active', 'is-stacked-left', 'is-stacked-right');

                if (idx === currentIndex) {
                    // Active Spread: crisp, centered, full opacity
                    spread.classList.add('is-active');
                    spread.style.transform = 'translateX(0px) translateZ(0px) rotateY(0deg) scale(1)';
                    spread.style.opacity = '1';
                    spread.style.zIndex = '35';
                    spread.style.pointerEvents = 'auto';
                    spread.style.filter = 'none';
                    spread.style.setProperty('--stack-x', '0px');
                    spread.style.setProperty('--stack-z', '0px');
                    spread.style.setProperty('--stack-s', '1');
                } else if (idx < currentIndex) {
                    // Preceding spreads: stacked on the LEFT (2–3 visible paper layers)
                    const diff = currentIndex - idx;
                    if (diff <= 3) {
                        spread.classList.add('is-stacked-left');
                        const tx = -18 - (diff - 1) * 14;
                        const tz = -24 * diff;
                        const sc = 1 - (diff * 0.012);
                        const op = 1 - (diff - 1) * 0.22;
                        const zi = 30 - diff;

                        spread.style.transform = `translateX(${tx}px) translateZ(${tz}px) scale(${sc})`;
                        spread.style.opacity = `${op}`;
                        spread.style.zIndex = `${zi}`;
                        spread.style.pointerEvents = 'auto';
                        spread.style.filter = `brightness(${1 - diff * 0.03})`;
                        spread.style.setProperty('--stack-x', `${tx}px`);
                        spread.style.setProperty('--stack-z', `${tz}px`);
                        spread.style.setProperty('--stack-s', `${sc}`);
                    } else {
                        spread.style.opacity = '0';
                        spread.style.pointerEvents = 'none';
                        spread.style.zIndex = '1';
                        spread.style.transform = 'translateX(-60px) translateZ(-100px) scale(0.95)';
                    }
                } else {
                    // Upcoming spreads: stacked on the RIGHT (2–3 visible paper layers)
                    const diff = idx - currentIndex;
                    if (diff <= 3) {
                        spread.classList.add('is-stacked-right');
                        const tx = 18 + (diff - 1) * 14;
                        const tz = -24 * diff;
                        const sc = 1 - (diff * 0.012);
                        const op = 1 - (diff - 1) * 0.22;
                        const zi = 30 - diff;

                        spread.style.transform = `translateX(${tx}px) translateZ(${tz}px) scale(${sc})`;
                        spread.style.opacity = `${op}`;
                        spread.style.zIndex = `${zi}`;
                        spread.style.pointerEvents = 'auto';
                        spread.style.filter = `brightness(${1 - diff * 0.03})`;
                        spread.style.setProperty('--stack-x', `${tx}px`);
                        spread.style.setProperty('--stack-z', `${tz}px`);
                        spread.style.setProperty('--stack-s', `${sc}`);
                    } else {
                        spread.style.opacity = '0';
                        spread.style.pointerEvents = 'none';
                        spread.style.zIndex = '1';
                        spread.style.transform = 'translateX(60px) translateZ(-100px) scale(0.95)';
                    }
                }
            });
        } else {
            // Mobile: Editorial Single-Page Flow
            spreads.forEach((spread, idx) => {
                spread.classList.remove('is-stacked-left', 'is-stacked-right');
                spread.style.transform = '';
                spread.style.filter = '';
                spread.style.zIndex = '';
                if (idx === currentIndex) {
                    spread.classList.add('is-active');
                    spread.style.display = 'block';
                    spread.style.opacity = '1';
                    spread.style.pointerEvents = 'auto';
                } else {
                    spread.classList.remove('is-active');
                    spread.style.display = 'none';
                    spread.style.opacity = '0';
                    spread.style.pointerEvents = 'none';
                }
            });
        }

        // Play paper flutter sound on manual page turns
        if (direction !== 0) {
            playPageTurnSound();
        }

        // Update Folio & Destination
        const currentData = ITINERARY_DATA[currentIndex] || ITINERARY_DATA[0];
        if (folioCurr) {
            const dNum = currentData.day;
            folioCurr.textContent = `DAY ${dNum < 10 ? '0' + dNum : dNum}`;
        }
        if (folioDest) {
            folioDest.textContent = currentData.title;
        }

        // Update Route Timeline Nodes
        nodes.forEach((node, idx) => {
            const isActive = idx === currentIndex;
            node.classList.toggle('active', isActive);
            if (isActive && !isDesktop) {
                node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });

        // Update Mountain Elevation Dot Position
        if (elevIndicator && currentData.coord) {
            elevIndicator.setAttribute('cx', currentData.coord.x);
            elevIndicator.setAttribute('cy', currentData.coord.y);
        }

        // Update Nav Controls Disabled State
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === totalDays - 1;
    }

    // Go to Specific Day
    function goToDay(index, direction = 0) {
        if (index < 0 || index >= totalDays || index === currentIndex) return;
        currentIndex = index;
        updateJournalView(direction);
    }

    // --- Interactive Page & Stack Clicks ---
    spreads.forEach((spread, index) => {
        spread.addEventListener('click', (e) => {
            // Clicking a stacked spread directly turns to that spread
            if (spread.classList.contains('is-stacked-left') || spread.classList.contains('is-stacked-right')) {
                e.stopPropagation();
                stopAutoPlay();
                const dir = index > currentIndex ? 1 : -1;
                goToDay(index, dir);
                return;
            }

            // Clicking on active spread: left page turns back, right page turns forward
            if (spread.classList.contains('is-active')) {
                if (e.target.closest('button, a')) return;
                const leftPage = spread.querySelector('.fb-page--left');
                const rightPage = spread.querySelector('.fb-page--right');

                if (leftPage && leftPage.contains(e.target)) {
                    stopAutoPlay();
                    if (currentIndex > 0) goToDay(currentIndex - 1, -1);
                } else if (rightPage && rightPage.contains(e.target)) {
                    stopAutoPlay();
                    if (currentIndex < totalDays - 1) goToDay(currentIndex + 1, 1);
                }
            }
        });
    });

    // --- Simple Circular Navigation Controls ---
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stopAutoPlay();
            if (currentIndex > 0) goToDay(currentIndex - 1, -1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stopAutoPlay();
            if (currentIndex < totalDays - 1) goToDay(currentIndex + 1, 1);
        });
    }

    function startAutoPlay() {
        isPlaying = true;
        if (playBtn) playBtn.classList.add('is-playing');
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            if (currentIndex < totalDays - 1) {
                goToDay(currentIndex + 1, 1);
            } else {
                goToDay(0, -1);
            }
        }, 5800);
    }

    function stopAutoPlay() {
        isPlaying = false;
        if (playBtn) playBtn.classList.remove('is-playing');
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });
    }

    // Pause autoplay when reading
    flipbook.addEventListener('mouseenter', () => {
        if (isPlaying && autoTimer) {
            clearInterval(autoTimer);
        }
    });

    flipbook.addEventListener('mouseleave', () => {
        if (isPlaying && !autoTimer) {
            startAutoPlay();
        }
    });

    // --- Timeline Waypoint Interaction & Hover Previews ---
    nodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
            stopAutoPlay();
            const dir = idx > currentIndex ? 1 : -1;
            goToDay(idx, dir);
        });

        // Hover tooltip preview
        node.addEventListener('mouseenter', () => {
            if (!tooltip || window.innerWidth <= 768) return;
            const dayData = ITINERARY_DATA[idx];
            if (!dayData) return;

            if (tooltipImg) tooltipImg.src = dayData.thumb;
            if (tooltipDay) tooltipDay.textContent = `DAY ${dayData.day < 10 ? '0' + dayData.day : dayData.day}`;
            if (tooltipLoc) tooltipLoc.textContent = dayData.fullLocation;
            if (tooltipAlt) tooltipAlt.textContent = `${dayData.altitude.toLocaleString()} m`;

            if (elevationWrap) {
                const wrapRect = elevationWrap.getBoundingClientRect();
                const nodeRect = node.getBoundingClientRect();
                const centerOffset = (nodeRect.left + nodeRect.width / 2) - wrapRect.left;
                tooltip.style.left = `${centerOffset}px`;
            }
            tooltip.classList.add('is-visible');
        });

        node.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.classList.remove('is-visible');
        });
    });

    // --- Subtle First-Time Page Peel Affordance ---
    let hasPeeked = false;
    const peekObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasPeeked) {
                hasPeeked = true;
                const activeSpread = spreads[currentIndex];
                if (activeSpread) {
                    activeSpread.classList.add('fb-first-peek');
                    setTimeout(() => {
                        activeSpread.classList.remove('fb-first-peek');
                    }, 1800);
                }
                peekObserver.disconnect();
            }
        });
    }, { threshold: 0.35 });

    peekObserver.observe(flipbook);

    // --- Desktop Micro-Parallax: Gentle, Restrained Tilt on Viewport ---
    if (viewport && stage) {
        viewport.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 1024) return;
            const rect = viewport.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotX = -y * 2.0; // max 1.0 deg
            const rotY = x * 2.5;  // max 1.25 deg
            stage.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });

        viewport.addEventListener('mouseleave', () => {
            stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // --- Keyboard Navigation: Left/Right arrows, Space for Auto ---
    document.addEventListener('keydown', (e) => {
        const rect = flipbook.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            stopAutoPlay();
            if (currentIndex < totalDays - 1) goToDay(currentIndex + 1, 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stopAutoPlay();
            if (currentIndex > 0) goToDay(currentIndex - 1, -1);
        } else if (e.key === ' ' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (isPlaying) stopAutoPlay();
            else startAutoPlay();
        }
    });

    // --- Touch Swiping for Mobile ---
    let touchStartX = 0;
    let touchStartY = 0;

    if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            stopAutoPlay();
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 42) {
                if (dx < 0 && currentIndex < totalDays - 1) {
                    goToDay(currentIndex + 1, 1);
                } else if (dx > 0 && currentIndex > 0) {
                    goToDay(currentIndex - 1, -1);
                }
            }
        }, { passive: true });
    }


    // =======================================================================
    //  Unified Resize Engine (Debounced RAF)
    // =======================================================================
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        if (resizeTimer) cancelAnimationFrame(resizeTimer);
        resizeTimer = requestAnimationFrame(() => {
            factors = getParallaxFactors();
            updateJournalView();
        });
    }, { passive: true });

    // Initial render
    updateJournalView();
});

document.addEventListener('DOMContentLoaded', () => {
    const bgLayer = document.getElementById('bg-layer');
    const monkImg = document.querySelector('.monk-img');

    // Respect users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Viewport-aware parallax factors
    const getParallaxFactors = () => {
        const w = window.innerWidth;
        if (w <= 768) {
            return { hero: 0.15, monk: -0.04, monkScale: 0 };
        }
        return { hero: 0.3, monk: -0.09, monkScale: 0.00015 };
    };

    let factors = getParallaxFactors();
    window.addEventListener('resize', () => { factors = getParallaxFactors(); });

    // Parallax & fading effect on scroll
    window.addEventListener('scroll', () => {
        if (!bgLayer) return;
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
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
    });

    // =======================================================================
    //  Flipbook Itinerary Controller (Handcrafted 3D Travel Journal)
    // =======================================================================
    const flipbook = document.getElementById('flipbook');
    if (!flipbook) return;

    const spreads = Array.from(flipbook.querySelectorAll('.fb-spread'));
    const nodes = Array.from(flipbook.querySelectorAll('.fb-timeline-node'));
    const timelineFill = document.getElementById('fb-timeline-fill');
    const prevBtn = document.getElementById('fb-prev');
    const nextBtn = document.getElementById('fb-next');
    const playBtn = document.getElementById('fb-play');
    const viewport = document.getElementById('fb-viewport');

    const totalDays = spreads.length;
    // Default to Day 4 (index 3) to showcase the 3D coverflow stack on both sides, matching the mockup!
    let currentIndex = 3;
    let autoTimer = null;
    let isPlaying = false;
    let userInteracted = false;

    // Check if in mobile layout
    const isMobile = () => window.innerWidth <= 880;

    // 3D Cover Flow layout update
    function updateCoverflow() {
        if (isMobile()) {
            // Mobile: flat snap-scroll layout
            spreads.forEach(spread => {
                spread.style.transform = '';
                spread.style.opacity = '';
                spread.style.zIndex = '';
                spread.style.filter = '';
                spread.style.cursor = 'default';
            });
            // Scroll active card into view
            if (spreads[currentIndex]) {
                spreads[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        } else {
            // Desktop: 3D perspective cover-flow with stacked cards
            spreads.forEach((spread, index) => {
                const diff = index - currentIndex;

                if (diff === 0) {
                    // Active spread flat in the center
                    spread.style.transform = 'translate3d(0, 0, 0) rotateY(0deg) scale(1)';
                    spread.style.opacity = '1';
                    spread.style.zIndex = '50';
                    spread.style.pointerEvents = 'auto';
                    spread.style.cursor = 'default';
                    spread.style.filter = 'none';
                    spread.classList.add('is-active');
                    spread.classList.remove('is-stacked-left', 'is-stacked-right');
                } else if (diff < 0) {
                    // Stacked on the LEFT (Day 3, Day 2, Day 1...)
                    // Tightly tucked in behind the active book spread
                    const d = Math.abs(diff);
                    const xDist = d === 1 ? 105 : d === 2 ? 155 : d === 3 ? 195 : 195 + (d - 3) * 22;
                    const xOffset = -xDist;
                    const zOffset = -30 - (d - 1) * 20;
                    const rotY = 18;
                    const scale = Math.max(0.76, 0.90 - (d - 1) * 0.025);
                    const opacity = Math.max(0.35, 1 - (d - 1) * 0.08);

                    spread.style.setProperty('--stack-x', `${xOffset}px`);
                    spread.style.setProperty('--stack-z', `${zOffset}px`);
                    spread.style.setProperty('--stack-s', `${scale}`);

                    spread.style.transform = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotY}deg) scale(${scale})`;
                    spread.style.opacity = `${opacity}`;
                    spread.style.zIndex = `${30 - d}`;
                    spread.style.pointerEvents = 'auto';
                    spread.style.cursor = 'pointer';
                    spread.style.filter = `brightness(${Math.max(0.70, 0.95 - (d - 1) * 0.05)})`;
                    spread.classList.remove('is-active', 'is-stacked-right');
                    spread.classList.add('is-stacked-left');
                } else {
                    // Stacked on the RIGHT (Day 5, Day 6, Day 7...)
                    // Tightly tucked in behind the active book spread
                    const d = diff;
                    const xDist = d === 1 ? 105 : d === 2 ? 155 : d === 3 ? 195 : 195 + (d - 3) * 22;
                    const xOffset = xDist;
                    const zOffset = -30 - (d - 1) * 20;
                    const rotY = -18;
                    const scale = Math.max(0.76, 0.90 - (d - 1) * 0.025);
                    const opacity = Math.max(0.35, 1 - (d - 1) * 0.08);

                    spread.style.setProperty('--stack-x', `${xOffset}px`);
                    spread.style.setProperty('--stack-z', `${zOffset}px`);
                    spread.style.setProperty('--stack-s', `${scale}`);

                    spread.style.transform = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotY}deg) scale(${scale})`;
                    spread.style.opacity = `${opacity}`;
                    spread.style.zIndex = `${30 - d}`;
                    spread.style.pointerEvents = 'auto';
                    spread.style.cursor = 'pointer';
                    spread.style.filter = `brightness(${Math.max(0.70, 0.95 - (d - 1) * 0.05)})`;
                    spread.classList.remove('is-active', 'is-stacked-left');
                    spread.classList.add('is-stacked-right');
                }
            });
        }

        // Update Timeline Nodes
        nodes.forEach((node, i) => {
            const isActive = i === currentIndex;
            node.classList.toggle('active', isActive);
            if (isActive && isMobile()) {
                node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });

        // Update Timeline Progress Fill
        if (timelineFill && totalDays > 1) {
            const pct = (currentIndex / (totalDays - 1)) * 100;
            timelineFill.style.width = pct + '%';
        }

        // Update Button States
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === totalDays - 1;
    }

    // Go to Day
    function goToDay(index) {
        if (index < 0 || index >= totalDays) return;
        currentIndex = index;
        updateCoverflow();
    }

    // Stacked Spread Click to Advance
    spreads.forEach((spread, index) => {
        spread.addEventListener('click', (e) => {
            if (index !== currentIndex) {
                stopAutoPlay();
                goToDay(index);
            }
        });
    });

    // Timeline Node Clicks
    nodes.forEach((node, index) => {
        node.addEventListener('click', () => {
            stopAutoPlay();
            goToDay(index);
        });
    });

    // Nav Controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            if (currentIndex > 0) goToDay(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            if (currentIndex < totalDays - 1) goToDay(currentIndex + 1);
        });
    }

    // Auto-advance Logic
    function startAutoPlay() {
        isPlaying = true;
        if (playBtn) playBtn.classList.remove('is-paused');
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            if (currentIndex < totalDays - 1) {
                goToDay(currentIndex + 1);
            } else {
                goToDay(0); // loop back
            }
        }, 5500);
    }

    function stopAutoPlay() {
        isPlaying = false;
        if (playBtn) playBtn.classList.add('is-paused');
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });
    }

    // Auto-pause on hover / user interaction for accessibility
    flipbook.addEventListener('mouseenter', () => {
        if (isPlaying) {
            clearInterval(autoTimer);
        }
    });

    flipbook.addEventListener('mouseleave', () => {
        if (isPlaying && !autoTimer) {
            startAutoPlay();
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        const rect = flipbook.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            stopAutoPlay();
            if (currentIndex < totalDays - 1) goToDay(currentIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stopAutoPlay();
            if (currentIndex > 0) goToDay(currentIndex - 1);
        }
    });

    // Touch Swiping on Mobile
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
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
                if (dx < 0 && currentIndex < totalDays - 1) {
                    goToDay(currentIndex + 1);
                } else if (dx > 0 && currentIndex > 0) {
                    goToDay(currentIndex - 1);
                }
            }
        }, { passive: true });
    }

    // Full Itinerary Overview Modal Logic
    const openModalBtn = document.getElementById('fb-open-modal');
    const modal = document.getElementById('fb-itinerary-modal');
    const closeModalBtn = document.getElementById('fb-modal-close-btn');

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });

        // Jump to day from modal
        const modalDays = modal.querySelectorAll('.fb-modal-day');
        modalDays.forEach(mday => {
            mday.addEventListener('click', () => {
                const dayIndex = parseInt(mday.getAttribute('data-jump'), 10);
                if (!isNaN(dayIndex)) {
                    stopAutoPlay();
                    goToDay(dayIndex);
                    closeModal();
                    // Smoothly scroll flipbook into view
                    flipbook.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
    }

    // Window resize handler for responsive layout transitions
    window.addEventListener('resize', () => {
        updateCoverflow();
    });

    // Initial render
    updateCoverflow();
});

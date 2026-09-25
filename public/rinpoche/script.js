document.addEventListener('DOMContentLoaded', () => {
    const bgLayer = document.getElementById('bg-layer');
    const monkImg = document.querySelector('.monk-img');
    
    // Parallax & fading effect on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Calculate how much we've scrolled relative to viewport height
        // When scroll reaches 10% of viewport, start fading rapidly
        const fadeStart = windowHeight * 0.1;
        const fadeEnd = windowHeight * 0.6;
        
        let opacity = 1;
        
        if (scrollPosition > fadeStart) {
            opacity = 1 - ((scrollPosition - fadeStart) / (fadeEnd - fadeStart));
        }
        
        // Ensure opacity stays within 0-1 range
        opacity = Math.max(0, Math.min(1, opacity));
        
        // Apply opacity
        bgLayer.style.opacity = opacity;
        
        // Optional: Add a slight upward parallax movement to the text
        const translateY = scrollPosition * 0.3;
        bgLayer.style.transform = `translateX(-50%) translateY(-${translateY}px)`;

        // Monk parallax effect
        if (monkImg) {
            // Negative value moves the image UP vertically faster than the scroll, 
            // making it come further on top of the mountain image.
            const monkTranslateY = scrollPosition * -0.09; 
            // Scale up slightly as we scroll
            const monkScale = 1 + (scrollPosition * 0.00015);
            
            monkImg.style.transform = `translateY(${monkTranslateY}px) scale(${monkScale})`;
        }
    });

    // Synchronize Day Gallery Carousels with custom scroll tracks
    const galleryCols = document.querySelectorAll('.day-gallery-column');
    galleryCols.forEach(col => {
        const gallery = col.querySelector('.day-image-gallery');
        const track = col.querySelector('.day-scroll-track');
        const thumb = col.querySelector('.day-scroll-thumb');

        if (!gallery || !track || !thumb) return;

        const updateThumb = () => {
            const maxScroll = gallery.scrollWidth - gallery.clientWidth;
            if (maxScroll <= 0) {
                thumb.style.width = '100%';
                thumb.style.transform = 'translateX(0)';
                track.style.opacity = '0.35';
                return;
            }
            track.style.opacity = '1';
            // Sleek pill indicator like in Figma mock (approx 28% of track width)
            const thumbWidth = Math.max(48, track.clientWidth * 0.28);
            thumb.style.width = `${thumbWidth}px`;

            const scrollRatio = gallery.scrollLeft / maxScroll;
            const maxTravel = track.clientWidth - thumbWidth;
            thumb.style.transform = `translateX(${scrollRatio * maxTravel}px)`;
        };

        gallery.addEventListener('scroll', updateThumb, { passive: true });
        window.addEventListener('resize', updateThumb);

        // Click track to jump/scroll smoothly
        track.addEventListener('click', (e) => {
            const rect = track.getBoundingClientRect();
            const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const maxScroll = gallery.scrollWidth - gallery.clientWidth;
            gallery.scrollTo({ left: clickRatio * maxScroll, behavior: 'smooth' });
        });

        // Initialize after load
        setTimeout(updateThumb, 100);
        window.addEventListener('load', updateThumb);
    });
});


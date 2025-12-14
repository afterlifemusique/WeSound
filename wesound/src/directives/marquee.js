export default {
    mounted(el) {
        const content = el.firstElementChild;
        if (!content) return;

        const apply = () => {
            requestAnimationFrame(() => {
                // Force a reflow to ensure measurements are accurate
                el.offsetWidth;
                content.offsetWidth;

                const wrapperWidth = el.clientWidth;
                const contentWidth = content.scrollWidth;
                const overflow = contentWidth > wrapperWidth + 1;

                if (overflow) {
                    const distance = contentWidth - wrapperWidth;
                    el.style.setProperty("--scroll-distance", `-${distance}px`);
                    el.classList.add("marquee-enabled");
                } else {
                    el.classList.remove("marquee-enabled");
                    el.style.removeProperty("--scroll-distance");
                }
            });
        };

        // Delay initial application to ensure DOM is fully rendered
        setTimeout(apply, 100);

        // Watch for size changes
        const ro = new ResizeObserver(apply);
        ro.observe(el);
        ro.observe(content);

        // Watch for text/content changes
        const mo = new MutationObserver(apply);
        mo.observe(content, {
            childList: true,
            characterData: true,
            subtree: true
        });

        // Store handles for cleanup
        el.__marquee_cleanup = () => {
            ro.disconnect();
            mo.disconnect();
            el.classList.remove("marquee-enabled");
            el.style.removeProperty("--scroll-distance");
            delete el.__marquee_cleanup;
        };
    },

    updated(el) {
        const content = el.firstElementChild;
        if (!content) return;

        requestAnimationFrame(() => {
            // Force reflow
            el.offsetWidth;
            content.offsetWidth;

            const overflow = content.scrollWidth > el.clientWidth + 1;

            if (overflow) {
                const distance = content.scrollWidth - el.clientWidth;
                el.style.setProperty("--scroll-distance", `-${distance}px`);
                el.classList.add("marquee-enabled");
            } else {
                el.classList.remove("marquee-enabled");
                el.style.removeProperty("--scroll-distance");
            }
        });
    },

    unmounted(el) {
        if (el.__marquee_cleanup) el.__marquee_cleanup();
    }
};
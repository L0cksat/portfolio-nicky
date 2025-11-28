

// ---------------------------------------------------------
// 0. GSAP & LENIS IMPORTS
// ---------------------------------------------------------
/* We have to import GSAP into the script, which will
then execute on the client side.
*/

import { gsap } from "gsap";
// We have to import ScrollTrigger to get the scroll effects.
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from "lenis";

// ---------------------------------------------------------
// 1. PLUGIN REGISTRATION
// ---------------------------------------------------------
// We ALWAYS have to register the Plugin.
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ---------------------------------------------------------
// 2. LENIS CONFIGURATION
// ---------------------------------------------------------
// Added Lenis for smooth scrolling. We have to configure it.
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
});

//Time loop (mandatory for Lenis to work)
//This forces Lenis to update the position in each frame.
function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/*
    We have to connect GSAP ScrollTrigger and Lenis to make sure
    that they function correctly.
 */

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add(time => {
    lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// ---------------------------------------------------------
// 3. ENTRANCE AND SCROLL ANIMATIONS
// ---------------------------------------------------------
// A. ---Hero title Animation---
gsap.from(".hero-title", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
});

// B. ---Social Pills animation---
gsap.from("nav .social-pill", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.7)",
    delay: 0.5,
});

// ---C. Tech pill animations---
const projectCards = document.querySelectorAll("#projects article");

projectCards.forEach((card) => {
    const pills = card.querySelectorAll(".tech-pill");

    if (pills.length > 0) {
        gsap.from(pills, {
            // ScrollTrigger Object Configuration
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
            },
            // Animation configuration
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            immediateRender: false
        });
    }
});



// ---D. Social pill animations---
const pillContainers = ["#contact"];

pillContainers.forEach((container) => {
    const pills = document.querySelectorAll(`${container} .social-pill`);

    if (pills.length > 0) {
        gsap.from(pills, {
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
        });
    }
});

// ---E. Mouse Hover animation---
const allPills = document.querySelectorAll(".social-pill");

allPills.forEach((pill) => {
    pill.addEventListener("mousemove", (e) => {

        //We get the coordinates and dimensions of the button.
        // (We need to say to TS that it is a HTMLElement to access a getBoundingClientrect)
        const evt = e as MouseEvent;
        const element = pill as HTMLElement;
        const rect = element.getBoundingClientRect();

        // We'll calculate the center of the button
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        //We'll calculate the distance of the mouse respective to the center
        // We'll multiply it by 0.5 to soften the atraction (magnetic force)
        // If we put a 1, the buttton will follow the mouse 1:1 (too extreme)
        const x = (evt.clientX - centerX) * 0.5;
        const y = (evt.clientY - centerY) * 0.5;

        gsap.to(pill, {
            x: x,
            y: y,
            scale: 1.1,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.5)",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    pill.addEventListener("mouseleave", () => {
        gsap.to(pill, {
            x: 0,
            y: 0,
            scale: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto"
        });
    });
});

// ---F. Header nav menu hover---
function initMenuScroll() {
    // A more extensive selector
    const menuLinks = document.querySelectorAll('header nav a');

    console.log("Enlaces encontrados:", menuLinks.length);

    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");

            //We are only interested in the links that contain a '#'
            if (!href || !href.includes('#')) return;

            //We extract the ID (if the link is "#/contact", we only keep "#contact")
            const targetId = '#' + href.split('#')[1];

            // If the id is empty (it's only '#' o it is top, we go to 0)
            const destination = (targetId === '#' || targetId === '#top') ? 0 : targetId;

            console.log("Yendo a:", destination);

            lenis.scrollTo(destination, {
                offset: -50,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    })
}
initMenuScroll();

document.addEventListener('DOMContentLoaded', initMenuScroll);

// ---G. Header magnetic hover animation---
const navLinks = document.querySelectorAll('header nav a, footer ul a');

navLinks.forEach(link => {
    link.addEventListener("mousemove", (e) => {
        const evt = e as MouseEvent;
        const element = link as HTMLElement;

        const rect = element.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (evt.clientX - centerX) * 0.5;
        const y = (evt.clientY - centerY) * 0.5;

        gsap.to(link, {
            x: x,
            y: y,
            scale: 1.1,
            color: "#bfdbfe",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    link.addEventListener("mouseleave", () => {
        gsap.to(link, {
            x: 0,
            y: 0,
            scale: 1,
            color: "",
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto"
        });
    });
});

// ---Security Refresh---
// Using this to obligate ScrollTrigger to recalculate where they start and end
// once all the images an external resources have been loaded.
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});
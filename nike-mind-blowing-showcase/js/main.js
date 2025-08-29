document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".master-container", {
        scrollTrigger: {
            trigger: ".master-container",
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: 2,
        },
    });
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".master-container",
            start: "top top",
            end: "+=300%",
            scrub: 2,
        }
    });
    const heroShoe = document.querySelector(".hero-shoe");
    const gridCenterImg = document.querySelector(".grid-shoe-center .grid-shoe-img");
    const emptySpace = document.querySelector(".detail-images .empty-space");
    if (heroShoe && gridCenterImg && emptySpace) {
        const calculatePositions = () => {
            const heroRect = heroShoe.getBoundingClientRect();
            const gridImgRect = gridCenterImg.getBoundingClientRect();
            const emptySpaceRect = emptySpace.getBoundingClientRect();
            const gridScale = gridImgRect.height / heroRect.height;
            const gridX = (gridImgRect.left + gridImgRect.width / 2) - (heroRect.left + heroRect.width / 2);
            const gridY = (gridImgRect.top + gridImgRect.height / 2) - (heroRect.top + heroRect.height / 2);
            const emptySpaceScale = emptySpaceRect.width / heroRect.width;
            const emptySpaceX = (emptySpaceRect.left + emptySpaceRect.width / 2) - (heroRect.left + heroRect.width / 2);
            const emptySpaceY = (emptySpaceRect.top + emptySpaceRect.height / 2) - (heroRect.top + heroRect.height / 2);
            gsap.killTweensOf(".hero-shoe");
            tl.to(".hero-shoe", {
                x: gridX,
                y: gridY,
                scale: gridScale,
                ease: "power3.inOut",
                duration: 1
            }, 0);
            tl.to(".hero-shoe", {
                x: emptySpaceX,
                y: emptySpaceY,
                scale: emptySpaceScale,
                rotationY: 45,
                ease: "power3.inOut",
                duration: 1
            }, ">");
            tl.to("header", {
                opacity: 0,
                duration: 0.1,
                ease: "none"
            }, ">"); 
            tl.to(".hero-shoe", {
                rotationY: 0,
                rotationX: -15,
                rotationZ: 35,
                ease: "power3.out",
                duration: 0.8,
                onComplete: () => {
                    heroShoe.style.transform = `translate(${emptySpaceX}px, ${emptySpaceY}px) scale(${emptySpaceScale}) rotateX(-15deg) rotateY(0deg) rotateZ(35deg)`;
                    heroShoe.style.filter = "none";
                    heroShoe.style.position = "absolute";
                    heroShoe.classList.add("detail-main-shoe");
                    heroShoe.classList.remove("hero-shoe");
                    const finalShoeImg = document.createElement('img');
                    finalShoeImg.src = heroShoe.src;
                    finalShoeImg.alt = heroShoe.alt;
                    finalShoeImg.className = 'detail-main-shoe';
                    finalShoeImg.style.width = '100%';
                    finalShoeImg.style.height = '100%';
                    finalShoeImg.style.objectFit = 'contain';
                    finalShoeImg.style.padding = '10px';
                    finalShoeImg.style.transform = 'rotateZ(35deg) rotateX(-15deg)';
                    emptySpace.appendChild(finalShoeImg);
                    heroShoe.remove();
                }
            }, ">-0.2");
        };
        calculatePositions();
        window.addEventListener('resize', calculatePositions);
    }
    tl.to(".details-left, .details-bottom-right, .scroll-indicator, .background-text", { 
        opacity: 0, 
        ease: "power1.inOut" 
    }, 0);
    tl.from(".grid-shoe-left, .grid-shoe-right", { 
        opacity: 0, 
        y: 100,
        stagger: 0.1,
        ease: "power2.out" 
    }, ">-0.5");
    tl.to(".grid-shoe-center .text-block > *", {
        opacity: 1,
        stagger: 0.05,
        ease: "power2.out"
    }, "<");
    const detailInfoPanel = document.querySelector('.detail-info');
    if (detailInfoPanel) {
        let isDragging = false;
        let startY = 0;
        let deltaY = 0;
        const onPointerDown = (event) => {
            isDragging = true;
            startY = event.pageY || event.touches[0].pageY;
            deltaY = 0;
        };
        const onPointerMove = (event) => {
            if (!isDragging) return;
            const currentY = event.pageY || event.touches[0].pageY;
            deltaY = startY - currentY;
        };
        const onPointerUp = () => {
            if (!isDragging) return;
            isDragging = false;
            if (deltaY > 50) { 
                detailInfoPanel.classList.add('sizes-active');
            }
            else if (deltaY < -50) {
                detailInfoPanel.classList.remove('sizes-active');
            }
        };
        detailInfoPanel.addEventListener('mousedown', onPointerDown);
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mouseup', onPointerUp);
        detailInfoPanel.addEventListener('touchstart', onPointerDown);
        document.addEventListener('touchmove', onPointerMove);
        document.addEventListener('touchend', onPointerUp);
    }
});
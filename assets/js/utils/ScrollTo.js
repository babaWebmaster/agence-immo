
export class ScrollTo {
    constructor(button, destination, duration = 800) {
        this.button = document.querySelector(button);
        this.destination = document.querySelector(destination);
        this.duration = duration;
        this.animationFrame = null;

        if (!this.button || !this.destination) return;
      
        this.button.addEventListener('click', (ev) => {
            ev.preventDefault();
            this.scroll();
        });
    }

    scroll() {       

        const start = window.scrollY;
        const distance = this.destination.getBoundingClientRect().top;      
        const startTime = performance.now();

        const animate = (currentTime) => {
             
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);

            // Accélération et décélération progressives
            const ease = progress < 0.5
                ? 4 * progress ** 3
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, start + distance * ease);


            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.animationFrame = null;                 
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }
}

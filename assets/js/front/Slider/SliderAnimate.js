export class SliderAnimate {

    constructor(slider, sliderThumbnail, controlSlider) {

        this.slider = typeof slider === 'string' 
            ? document.querySelector(slider) 
            : slider;
            
        this.sliderThumbnail = typeof sliderThumbnail === 'string' 
            ? document.querySelector(sliderThumbnail) 
            :  sliderThumbnail;

        this.controlSlider = typeof controlSlider === 'string' 
            ? document.querySelector(controlSlider) 
            :  controlSlider;

        this.total = this.slider.querySelectorAll('.hero__slide').length;    
         
       this.slide ={
             current: 0,
             next: 1,
             previous: this.total -1
        }    
        
        this.isAnimating = false;
        this.pointer = {
            start: 0,
            current: 0,
            move:0 
        };

         this.statePointer = 'stop';
       
    }

    next() {

        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;

        const current = this.slider.querySelector(
        `[data-slide="${this.slide.current}"]`
        );

        this.sliderThumbnail.querySelector(`.hero__slide__thumbnail--${this.slide.current} .hero__slide__thumbnail__img`).classList.remove('hero__slide__thumbnail__img--is-selected');

        const next = this.slider.querySelector(
            `[data-slide="${this.slide.next}"]`
        );        
        
        current.classList.add('hero__slide__is-transform-piece');           
       

        setTimeout(()=>{

             next.addEventListener('transitionend', () => {
                            
               this.slide.current = this.slide.next;
               this.slide.next = this.slide.next + 1 === this.total ? 0 : this.slide.next + 1;
                this.slide.previous = this.slide.current === 0? this.total - 1: this.slide.current - 1;

                 this.sliderThumbnail.querySelector(`.hero__slide__thumbnail--${this.slide.current} .hero__slide__thumbnail__img`).classList.add('hero__slide__thumbnail__img--is-selected');
              

               this.isAnimating = false;



            }, { once: true });

            next.classList.add('hero__slide--is-active');
            next.classList.remove('hero__slide__is-transform-piece');
             current.classList.remove('hero__slide--is-active');
              current.classList.add('hero__slide__is-transform-piece');

        },500);
        

    }


    previous() {      
         if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;

        const current = this.slider.querySelector(
        `[data-slide="${this.slide.current}"]`
        );

           this.sliderThumbnail.querySelector(`.hero__slide__thumbnail--${this.slide.current} .hero__slide__thumbnail__img`).classList.remove('hero__slide__thumbnail__img--is-selected');

        const prev = this.slider.querySelector(
            `[data-slide="${this.slide.previous}"]`
        );
        
      
       current.classList.add('hero__slide__is-transform-piece');           
      

        setTimeout(()=>{
              prev.addEventListener('transitionend', () => {              
                this.slide.current = this.slide.previous;

                this.slide.previous = this.slide.current - 1 === -1
                    ? this.total - 1
                    : this.slide.current - 1;

                this.slide.next = this.slide.current + 1 === this.total
                    ? 0
                    : this.slide.current + 1;

                this.sliderThumbnail.querySelector(`.hero__slide__thumbnail--${this.slide.current} .hero__slide__thumbnail__img`).classList.add('hero__slide__thumbnail__img--is-selected');


                this.isAnimating = false;
                

            }, { once: true });

            prev.classList.add('hero__slide--is-active');
            prev.classList.remove('hero__slide__is-transform-piece');
             current.classList.remove('hero__slide--is-active');
              current.classList.add('hero__slide__is-transform-piece');

        },500);
    }




    start() {
        clearInterval(this.interval);
        
       this.interval = setInterval(() => {
            this.next();
        }, 5000);
    }


    loadImgBySliderThumbnail(){
        this.sliderThumbnail.addEventListener('click',(event)=>{

             if (this.isAnimating) {
              return;  }
           
            const target= event.target;
 
                if(target.closest('.hero__slide__thumbnail__img')){

                   clearInterval(this.interval);

                   const next =parseInt(target.parentElement.dataset.slideThumbnail);

                   if(next === this.slide.current){
                    return;
                   }

                  this.slide.next= next;

                  this.next();

                  this.start();


                }


        });
    }

    sliderManuel() {
        this.controlSlider.addEventListener('click', (event) => {
            const target = event.target;

            if (!target.closest('.hero__control-slider--prev') &&
                !target.closest('.hero__control-slider--next')
            ){              
                return 
            }

              if (target.closest('.hero__control-slider--prev')){
                if(this.interval){
                    clearInterval(this.interval);
                }
                this.previous();

                setTimeout(this.start(),500);
              }

               if (target.closest('.hero__control-slider--next')){
                if(this.interval){
                    clearInterval(this.interval);
                }
                this.next();
                 setTimeout(() =>{this.start()},500);
              }

        });
    }


    sliderMobile(){

        if(this.pointerdown|| this.pointermove || this.pointerup){
            this.slider.removeEventListener('pointerdown', this.pointerdown);
            this.slider.removeEventListener('pointermove', this.pointermove);
            this.slider.removeEventListener('pointerup', this.pointerup);
        }

           if (!window.matchMedia('(max-width: 767.8px)').matches) {
            return;
           }

           this.pointerdown = (event) => {
            if (this.statePointer !== 'stop') {
                return;
            }

            this.pointer.start = event.clientX;
            this.statePointer = 'start';
            };

            this.slider.addEventListener('pointerdown', this.pointerdown);
           
            this.pointermove= (event)=>{

                if(this.statePointer != 'start'){
                    return;
                }

                this.gap = event.clientX - this.pointer.start;

                if (Math.abs(this.gap) >= 30) {
                    this.statePointer = 'move';
                }

                if(this.interval){
                    clearInterval(this.interval);
                }
                this.gap = event.clientX - this.pointer.start;
              
                this.statePointer ='move';
                
                              
            }

            this.slider.addEventListener('pointermove', this.pointermove);

            this.pointerup = (event)=>{

                if(this.statePointer != 'move'){
                    return;
                }

                if(this.interval){
                    clearInterval(this.interval);
                }
                           

                if(this.gap < 0){
                    this.previous();

                      setTimeout(()=>{
                        this.statePointer ='stop';
                    },500);    
                }

                 if(this.gap > 0){
                    this.next();
                    setTimeout(()=>{
                        this.statePointer ='stop';
                    },500);                    
                    
                }

                setTimeout(() => {
                 this.start();
                }, 500);
                
                              
            };

            this.slider.addEventListener('pointerup', this.pointerup);
         
    }    





    loadSlider(){        
            const slide = this.slider.querySelector('.hero__slide--0');

            slide.classList.remove('hero__slide__is-transform-piece');

        }

    


    resize(){
        if(this.interval){
            clearInterval(this.interval);
        }

        this.sliderMobile();

        setTimeout(()=>{
            this.start()
        },500);

    }

}


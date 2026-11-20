import { TypeWriter } from "../TypeWriter/TypeWriter"

export class AnimateFormAnnonceContact extends TypeWriter{

    constructor(){
        super();
        this.animationStart = false;       
            this.addObserver();
    }

    async init(){
         if(this.animationStart === false){
            this.animationStart = true;
            const { signal } = this.abortController;

            await this.animateInput(signal);
            if (signal.aborted) return;

            await this.animateTextarea(signal);
            if (signal.aborted) return;

          //  this.computePositionTypeWriterTextarea(); 
         }  
                        
    }


    async animateInput(signal){
          if (signal.aborted) return;
         this.addGroupElement('.form__fieldset input'); 
         this.computePosition('.form__form');
         this.filtrageInput();
            
         this.addParentCursorDom('.form__form','form__wrapper-cursor-writer','form__writer-type-writer');
         this.cursor = this.createCursor('form__cursor-type-writer');
         this.cursor.style.height = this.heightCursor;
        
         const elements = document.querySelectorAll('.form__writer-type-writer');

        this.removeTypeWriter(document.querySelectorAll('.form__wrapper-cursor-writer'));

         await this.loop(elements, this.cursor, signal);
    }

    async animateTextarea(signal){
          if (signal.aborted) return;      
        const height =
                this.positions[0].height
                - this.positions[0].border.top
                - this.positions[0].border.bottom
                - this.positions[0].padding.top
                - this.positions[0].padding.bottom;          
        this.elements.length = 0;
        this.positions.length = 0;
         this.addOneElement('.form__message'); 
         this.computePosition('.form__form');
        this.filtrageInput();
        
        this.addParentCursorDom('.form__form','form__wrapper-cursor-writer','form__writer-type-writer');
        const wrappers = document.querySelectorAll('.form__wrapper-cursor-writer');
        const wrapper = wrappers[wrappers.length - 1];

        this.removeTypeWriter([wrapper]);

        wrapper.style.height =`${height}px`;
        const elements = document.querySelectorAll('.form__writer-type-writer');
        const element = [elements[elements.length - 1]];
        this.typeWriterTextarea = elements[elements.length - 1];

        await this.loop(element, this.cursor, signal);

           if (!signal.aborted) {
             this.cursor.remove();
        }   
    }


    computePositionTypeWriterTextarea() {
            const titleDays = document.querySelector('.form__title-days');
            const accordion = document.querySelector('.form__days');
            const wrapper = this.typeWriterTextarea.parentElement;

            titleDays?.addEventListener('click', () => {
                wrapper.style.opacity = '0';

              accordion?.addEventListener('transitionend', function onTransitionEnd(event) {
                if (event.target !== accordion || event.propertyName !== 'height') return;

                accordion.removeEventListener('transitionend', onTransitionEnd);

                this.elements.length = 0;
                this.positions.length = 0;

                this.addOneElement('.form__message');
                this.computePosition('.form__form');
                

                const position = this.positions[0];
                const top = position.y + position.border.top + position.padding.top;
                const left = position.x + position.border.left + position.padding.left;

                wrapper.style.left = `${left}px`;
                wrapper.style.top = `${top}px`;
                wrapper.style.opacity = '1';
            }.bind(this));
            });
        }

    removeTypeWriter(typeWriters) {        
            typeWriters.forEach((el) => {
                el.addEventListener('click', () => {
                this.inputFocus(el);
                });
            });
            
             const inputs = document.querySelectorAll(
                 'input[data-number], textarea[data-number]'
             );


            inputs.forEach(element => {
                element.addEventListener('focus',()=>{
                    
                    const number = element.dataset.number;

                      const typeWriter = document.querySelector(
                     `.form__wrapper-cursor-writer[data-number="${number}"]`);

                    element.placeholder = element.dataset.placeholder || ''; 

                     if(typeWriter){
                        typeWriter.remove();                             
                     }
                });
            });
        }

    inputFocus(el){
         el.classList.add('form__wrapper-cursor-writer--opacity-null');
                const number = el.dataset.number;
                const input = document.querySelector(
                 `input[data-number="${number}"], textarea[data-number="${number}"]`
                    );

                    el.remove();
                    if (input) {
                        input.placeholder = input.dataset.placeholder || '';
                        input.focus();
                    } 
    }


    resize() {
        this.abortController.abort();
      

        document.querySelectorAll('.form__wrapper-cursor-writer')
            .forEach(el => el.remove());

        this.cursor?.remove();

         this.elements.length = 0;
         this.positions.length = 0;


        this.abortController = new AbortController();
         this.animationStart = false;
         this.init();
    }


    addObserver(){
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {                 
                  this.init();                  
                }
            });
        }, {
            threshold: 0.6
        });

        observer.observe(document.querySelector('.form'));
    }

    filtrageInput() {
            this.positions = this.positions.filter(
                (el) => el.element.value.trim() === ''
            );
        }

}
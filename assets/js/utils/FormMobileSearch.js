export class FormMobile {

    constructor(autoComplete, priceRange) {

        this.form = document.querySelector('.hero__form-search');

        this.autoComplete = autoComplete;
        this.priceRange = priceRange;

        this.desktopTemplate = this.form.cloneNode(true);

        this.labels = document.querySelectorAll(
            '.hero__label--mobile'
        );

        this.fields = [];
        this.desktopWrapper = this.form.querySelector('.hero__wrapper-fieldsets--destock');

         this.mobileWrapper = this.form.querySelector(
        '.hero__wrapper-fieldsets--mobile'
        );


         this.desktopWrapperFirst = this.form.querySelector(
        '.hero__search-form__wrapper-first'
        );

        this.desktopWrapperSecond = this.form.querySelector(
        '.hero__search-form__wrapper-second'
        );

        this.toggleHandlers = new Map();

        this.mediaQuery = window.matchMedia('(max-width: 767.98px)');

        this.getFields();


        this.mediaMatchQuery();
       
    }

    getFields() {
        this.labels.forEach(label => {
            const field = this.getMobileWrapper(label);

            if (field) {
                this.fields.push(field);
            }
        });
    }

    addFieldsMobile() {

        this.fields.forEach(field =>{
            this.mobileWrapper.append(field);
            this.getMobileFieldsHeight(field);
            this.addToggleEvents(field);
        });
        this.autoComplete.resizeListPositiongList();
        this.priceRange.resizeRange();   
        this.form.classList.remove('hero__form-search--opacity-null');
           /*  requestAnimationFrame(() => {
            this.autoComplete.resizeListPositiongList();
            this.priceRange.resizeRange();
         });*/
          
    }

    addFieldsDesktop(){
         this.fields.forEach(field => {

            const button = field.querySelector(
            '.hero__search-form__toggle'
            );

            const handler = this.toggleHandlers.get(button);

            if (handler) {
                button.removeEventListener('click', handler);
                this.toggleHandlers.delete(button);
            }


            field.classList.remove('hero__search-form__field--mobile');
            field.classList.remove('open');
            field.style.removeProperty('--mobile-field-height');
            field.style.removeProperty('--mobile-field-open-height');

        });

        this.desktopWrapperFirst.append(this.fields[0], this.fields[1]);
        this.desktopWrapperSecond.append(this.fields[2], this.fields[3]);
         
            this.autoComplete.resizeListPositiongList();
            this.priceRange.resizeRange();
           

       /* this.autoComplete.resizeListPositiongList();
        this.priceRange.resizeRange();  */
    }


    getMobileWrapper(label) {

        let element = label.parentElement;

        while (element) {

            if (element.id.startsWith('search-mobile-')) {
                return element;
            }

            element = element.parentElement;
        }

        return null;
    }
   

    getMobileFieldsHeight(field) {
        
            const header = field.querySelector('.hero__search-form__header--mobile');

            if (!header) {
                return;
            }

            const height = header.getBoundingClientRect().height;

            field.style.setProperty(
                '--mobile-field-height',
                `${height}px`
            );

            field.classList.add('hero__search-form__field--mobile');
        
    }

  
    addToggleEvents(field) {        
            const button = field.querySelector('.hero__search-form__toggle');

            
            if (!button) {
                return;
            }

             const handler = () => {
                this.toggleField(field, button);
            };

            this.toggleHandlers.set(button, handler);


            button.addEventListener('click',handler);        
    }

    toggleField(field, button) {

            if (field.classList.contains('hero__search-form__field--mobile--open')) {
                const heightLess = field.scrollHeight;
                field.classList.remove('hero__search-form__field--mobile--open');                 
                button.setAttribute('aria-expanded', 'false');
                button.textContent = '+';
                                
               this.addEventCustomListenerFieldClose(field,heightLess);
                return;
            }

            this.fields.forEach(field => {

                if(field.classList.contains('hero__search-form__field--mobile--open')){

                    this.addEventCustomListenerFieldClose(field,field.scrollHeight);
                    
                }

                field.classList.remove('hero__search-form__field--mobile--open');              
                const button = field.querySelector('.hero__search-form__toggle');

                button.setAttribute('aria-expanded', 'false');
                button.textContent = '+';
            });

            const height = field.scrollHeight;
             field.style.setProperty('--mobile-field-open-height', `${height}px`);

             /*field.dispatchEvent(new CustomEvent('menuSearch:open', {
             detail: {height}
            }));*/

            this.addEventCustomListenerFieldOpen(field,height);

            field.classList.add('hero__search-form__field--mobile--open');            

            button.setAttribute('aria-expanded', 'true');
            button.textContent = '×';
    }
    
    mediaMatchQuery(){
        if (this.mediaQuery.matches) {
            console.log('version mobile portrait')
            this.addFieldsMobile();                            
        }
        else{
             this.addFieldsDesktop();           
            console.log('version desktop');           
        }

        this.mediaQuery.addEventListener('change', () => {
            if (this.mediaQuery.matches) {
                console.log('version landscape vers portrait')
                 this.addFieldsMobile();            
                

            }
            else{
                console.log('version portrait vers landscape');
                this.addFieldsDesktop();              
                
            }
           
        });
    }




    addEventCustomListenerFieldOpen(field, height){

        field.dispatchEvent(new CustomEvent('menuSearch:open', {
             detail: { height }
            }));

    }

    addEventCustomListenerFieldClose(field, height){

         field.dispatchEvent(new CustomEvent('menuSearch:close', {
                 detail: { height }
                }));  

    }


}
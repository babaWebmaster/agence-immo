export class Autocomplete{

    constructor(autocomplete, token,
        listAuto, select, listSelect , inputAuto, maxVille
    ){
        this.autocomplete = document.querySelector(autocomplete);
        this.token = document.querySelector(token);
        this.list = document.querySelector(listAuto); 
        this.select = document.querySelector(select);
        this.villeSelect = document.querySelector(listSelect);
        this.inputAuto = document.querySelector(inputAuto); 
        this.maxVille = document.querySelector(maxVille);   
        this.addKeyboardEvent();        
    }

    addAddEventListener(){
        this.controller = null;

        if(!this.autocomplete){
            return;
        }

        this.autocomplete.addEventListener('input', async (event) => {
         const result = await this.getQuery(event);

          if (!result) {
            return;
            }

         if(result.length > 0){
            this.createResults(result);            
         }

         if(result.length === 0){
            this.removeVilleFind();
         }

        });

    }

    async getQuery(event){
         const value = event.target.value;

            if (this.controller) {
                this.controller.abort();
            }

            if (value.length === 0) {
                this.removeVilleFind();
                return;
            }

            if(!this.token){
                return;
            }
           
           this.controller = new AbortController();

            

            try{
                const response = await fetch('/autocomplete-ville', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        value: value,
                        _token: this.token.value
                    }),
                    signal: this.controller.signal
                });

                const result = await response.json();

              return result;

            }catch(error){
                 if (error.name !== 'AbortError') {
                    console.error(error);
                }
            }
    }


    createResults(results) {

        this.removeVilleFind();

        if(!this.list){
            this.list = this.createAutocompleteList();
            this.autocomplete.after(this.list);
        }

        this.list.classList.add('hero__search_form__autocomplete-list--border');
     
        
        
        results.forEach((ville) => {

            const div = document.createElement('div');
            div.classList.add('hero__search-form__field--ville-find');

            div.textContent = `${ville.name} (${ville.postalCode})`;
            div.dataset.id=`${ville.id}`;
            div.dataset.name = ville.name;
            div.dataset.postalCode = ville.postalCode;

            div.setAttribute('role', 'option');
            div.setAttribute('aria-selected', 'false');


            div.addEventListener('click',()=>{
                this.addVille(ville);
                this.addVilleSelect(ville);
                div.setAttribute('aria-selected', 'true');
                this.removeVilleFind();
                this.inputAuto.value = '';
            });
            this.autocomplete.setAttribute('aria-expanded', 'true');
            this.list.appendChild(div);

            this.mouse();

        });        

        this.positioningList();

    }

    removeVilleFind(){
        if(!this.list){
            return;
        }
        this.list.classList.remove('hero__search_form__autocomplete-list--border');
        this.autocomplete.setAttribute('aria-expanded', 'false');        
         const  villeFind= this.list.querySelectorAll('.hero__search-form__field--ville-find');
           
                villeFind.forEach(ville =>{
                    ville.remove()
                            })      
            
    }

    addVille(ville) {

        if (this.villeSelect.children.length >= 3) {
            this.maxVille.classList.remove('hero__danger-max-ville--opacity-null');
                return;
        }



         if(this.villeSelect?.querySelector(`[data-id="${ville.id}"]`)){
            return;
        }

        if(!this.villeSelect){
            this.villeSelect = this.createVillesSelected();
            this.autocomplete.parentElement.prepend(this.villeSelect);            
        }

        const div = document.createElement('div');
        div.classList.add('hero__search-form__ville');

        div.dataset.id = ville.id;

        const span = document.createElement('span');
        span.textContent = `${ville.name} (${ville.postalCode})`;
        span.classList.add('hero__search-form__ville--text')

        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('hero__search-form__ville--remove');
        button.textContent = '×';
        button.setAttribute('aria-label',`Supprimer ${ville.name}`);

        button.addEventListener('click', () => {
            if(this.villeSelect.children.length === 3){
                this.maxVille.classList.add('hero__danger-max-ville--opacity-null');
            }
            div.remove();
            this.removeVilleSelect(ville); 
        });

        div.appendChild(span);
        div.appendChild(button);        

        this.villeSelect.appendChild(div);
    }

    addVilleSelect(ville){

        if( this.select.querySelector(
            `option[value="${ville.id}"]`
        )){
            return;
        }

        const option = document.createElement('option');
        option.value = ville.id;
        option.textContent = ville.name;
        option.selected = true;
        this.select.appendChild(option);

        this.select.dispatchEvent(new Event('change', {
            bubbles: true
        }));

    }

    removeVilleSelect(ville) {

        const option = this.select.querySelector(
            `option[value="${ville.id}"]`
        );

        if (option) {
            option.remove();
            this.select.dispatchEvent(new Event('change', {
            bubbles: true
            }));
        }
    }

    
    createVillesSelected() {

        const div = document.createElement('div');
        div.classList.add('hero__search-form__villes-selected');

         return div;
    }

    createAutocompleteList() {

      const div = document.createElement('div');
      div.classList.add('hero__search_form__autocomplete-list');

      return div;
    }

    initBoundingClient(){
        if(!this.rectAutocomplete){
            this.rectAutocomplete = this.autocomplete.getBoundingClientRect() 
        }

        if(!this.rectParentAutocomplete){
            this.rectParentAutocomplete = this.autocomplete.parentElement.getBoundingClientRect();
        }
    }


    positioningList(){
        this.initBoundingClient();         
        const style = getComputedStyle(this.autocomplete);        
       /* const styleParent = getComputedStyle(this.autocomplete.parentElement);
        const left = this.rectAutocomplete.left - this.rectParentAutocomplete.left - parseFloat(styleParent.borderLeftWidth);*/

        if (!this.list.offsetParent) {
             return;
        }
        
        const parentListRect = this.list.offsetParent.getBoundingClientRect();
        const styleParent = getComputedStyle(this.list.offsetParent);

        

        const left =this.rectAutocomplete.left - parentListRect.left -  parseFloat(styleParent.borderLeftWidth);
      
        this.list.style.position = 'absolute';
        this.list.style.left = `${left}px`;
        this.list.style.width = `${this.rectAutocomplete.width}px`;       
    }


    resizeListPositiongList(){
         this.rectAutocomplete = this.autocomplete.getBoundingClientRect();
         this.rectParentAutocomplete = this.autocomplete.parentElement.getBoundingClientRect();

         this.positioningList();
    }


    addKeyboardEvent() {
        this.autocomplete.addEventListener('keydown', (event) => {

            if (event.key === 'ArrowDown') {
                event.preventDefault();                
                this.navigateList(1);

            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                console.log('arrUp')
                this.navigateList(-1);
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                console.log('enter')
                this.selectCurrent();
                this.removeVilleFind();
                this.inputAuto.value = '';
            }

            if (event.key === 'Escape') {
                console.log('echap')
                this.removeVilleFind();
            }
        });
    }

    selectCurrent() {

            const selected = this.list.querySelector(
                '[aria-selected="true"]'
            );

            if (!selected) {
                return;
            }

            const ville = {
                id: selected.dataset.id,
                name: selected.dataset.name,
                postalCode: selected.dataset.postalCode
            };

            this.addVille(ville);
            this.addVilleSelect(ville);
        }



    navigateList(direction) {

            const results = [...this.list.querySelectorAll(
                '.hero__search-form__field--ville-find'
            )];

            if (!results.length) {
                return;
            }

            let currentIndex = results.findIndex(
                ville => ville.getAttribute('aria-selected') === 'true'
            );

            // Aucune ville sélectionnée
            if (currentIndex === -1) {
                currentIndex = direction === 1 ? 0 : results.length - 1;
            } else {
                currentIndex += direction;
            }

            // On sort de la liste
            if (currentIndex < 0 || currentIndex >= results.length) {
                results.forEach(ville => {
                    ville.setAttribute('aria-selected', 'false');
                    if(ville.classList.contains('hero__search-form__field--ville-find--selected')){
                        ville.classList.remove('hero__search-form__field--ville-find--selected');
                    }                    
                });

                return;
            }

            results.forEach((ville, index) => {
                ville.setAttribute(
                    'aria-selected',
                    index === currentIndex ? 'true' : 'false'
                );
                if(index === currentIndex){
                    ville.classList.add('hero__search-form__field--ville-find--selected');
                    ville.scrollIntoView({
                        block: 'nearest',
                        behavior: 'smooth'
                    });
                }
                if(index != currentIndex){
                    if(ville.classList.contains('hero__search-form__field--ville-find--selected')){
                        ville.classList.remove('hero__search-form__field--ville-find--selected');
                    }
                }
                
            });
    }


    mouse() {

            const villes = [
                ...this.list.querySelectorAll(
                    '.hero__search-form__field--ville-find'
                )
            ];

            villes.forEach(ville => {   
                ville.addEventListener('mouseenter', () => {
                
                    villes.forEach(ville => {
                        ville.classList.remove(
                            'hero__search-form__field--ville-find--selected'
                        );

                        ville.setAttribute('aria-selected', 'false');
                    });
                });
            });
    }


}
export class FormSearch {
    constructor(){

        this.form = document.querySelector('.hero__form-search');
        this.abortController = null;

       this.mediaQuery = window.matchMedia(
            '(max-width: 767.98px)'
        );
        this.searchMobile();
        this.submitForm();
        this.changePage();


    }

    changeUrl(data) {

        const newUrl = data.url.startsWith('/annonces/')
            ? data.url
            : `/annonces/${data.url}`;

        window.history.pushState({}, '', newUrl);
    }

    loadAnnonce(data) {
            const annonces = document.querySelector('.annonces');
            annonces.classList.add('annonces--fadeOut');


            setTimeout(() => {
                annonces.innerHTML = data.annonces;
                annonces.classList.add('annonces--padding');
                annonces.classList.remove('annonces--fadeOut');

            }, 500);

    }


    scrollToAnnonces(offset = 0) {
    const annonces = document.querySelector('.annonces');

    window.scrollTo({
        top: annonces.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
    });
}





    resultSearchAnnonceDesktop(data){
        this.changeUrl(data);
       this.loadAnnonce(data);
       this.scrollToAnnonces(-100);
    }



    resultSearchAnnonceMobile(data){
        this.changeUrl(data);
        this.loadAnnonce(data);
        this.loadCountResultatAnnonce(data);
    }




    change(callback) {

            const fields = [
                    ...this.form.querySelectorAll('input'),
                    ...this.form.querySelectorAll('select')
            ];

              const fieldsSearch = fields.filter(field => {

                    return field.id !== 'autocomplete-token'
                        && field.id !== 'annonce_search__token'
                        && field.id !== 'annonce_search_ville_recherche';
                });

            fieldsSearch.forEach(field => {
                field.addEventListener('change', callback);
            });
    }



    handleSearchChangeDesktop(page = 1) {
            this.abortController?.abort();
            this.abortController = new AbortController();

            this.search({
                url: '/recherche-annonces',
                page,
                responseType: 'json',
                signal: this.abortController.signal,
                onSuccess: this.resultSearchAnnonceDesktop.bind(this)
            });
        }

    handleSearchChangeMobile() {
            this.abortController?.abort();
            this.abortController = new AbortController();

            this.search({
                url: '/recherche-annonces',
                page: 1,
                responseType: 'json',
                signal: this.abortController.signal,
                onStart: this.loadLoaderSubmit.bind(this),
                onSuccess: this.resultSearchAnnonceMobile.bind(this)
            });
        }


    loadCountResultatAnnonce(data){
        const btn = document.querySelector('.hero__search-form__submit');


        if(data.total>1){
            btn.innerHTML=`${data.total} annonces`;
        }

         if(data.total=== 1){
            btn.innerHTML=`1 annonce `;
        }

        if(data.total===0){
            btn.innerHTML = '0 annonce '
        }

         btn.classList.remove('hero__search-form__submit--is-loading');
    }

    loadLoaderSubmit(){

        const btn = document.querySelector('.hero__search-form__submit');
        btn.classList.add('hero__search-form__submit--is-loading');
    }

    handleCountAnnonces(){
        this.search({
            url: '/compte-annonces',
            page: 1,
            onStart: this.loadLoaderSubmit.bind(this),
            responseType: 'json',
             onSuccess: this.loadCountResultatAnnonce.bind(this)
        });
    }


    changePage() {
    const annonces = document.querySelector('.annonces');

    annonces.addEventListener('click', (event) => {
        const target = event.target.closest(
            '.pagination__page, .pagination__next, .pagination__prev'
        );

        if (!target) {
            return;
        }

        event.preventDefault();

        const page = target.dataset.page;

        this.handleSearchChangeDesktop(page);
     });
    }


    searchMobile() {

        const isMobile = this.mediaQuery.matches;

        if (isMobile) {

            this.change(()=>{
                this.handleSearchChangeMobile();
            });

        } else {
            this.change(this.handleCountAnnonces.bind(this));

        }
    }

    submitForm() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();

            const annonces = document.querySelector('.annonces');

            if (this.mediaQuery.matches) {
                if (!annonces.children.length) {
                    this.abortController?.abort();
                    this.abortController = new AbortController();

                    this.search({
                        url: '/recherche-annonces',
                        page: 1,
                        responseType: 'json',
                        signal: this.abortController.signal,
                        onStart: this.loadLoaderSubmit.bind(this),
                        onSuccess: (data) => {
                            this.resultSearchAnnonceMobile(data);
                            setTimeout(() => {
                              this.scrollToAnnonces();
                            }, 550);
                        }
                    });
                } else {
                    this.scrollToAnnonces();
                }
            } else {
                this.handleSearchChangeDesktop();
            }
        });
    }




    search({
    url = '/recherche-annonces',
    page = 1,
    responseType = 'text',
    onStart=() =>{},
    onSuccess = (data) => console.log(data)
    } = {}) {

        onStart();

        this.abortController?.abort();
        this.abortController = new AbortController();

        const formData = new FormData(this.form);
        formData.set('annonce_search[page]', page);

        fetch(url, {
            method: 'POST',
            body: formData,
            signal: this.abortController.signal
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            return responseType === 'json'
                ? response.json()
                : response.text();
        })
        .then(data => {
            onSuccess(data);
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                return;
            }

            console.error('Erreur fetch', error);
        });
    }


}
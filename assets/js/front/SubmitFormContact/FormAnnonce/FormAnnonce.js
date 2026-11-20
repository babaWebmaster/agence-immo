import { SubmitFormContact } from "../SubmitFormContact";
import { Modal } from "../../Modal/Modal";

export class FormAnnonce extends SubmitFormContact{
    constructor(form){
        super(form);
        this.addObserver();
        this.modal = new Modal('.modal');
        this.modal;
        this.btn = document.querySelector('.form__submit');
             
    }


    addObserver(){
        if(!this.form) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                this.initSubmit();
                observer.unobserve(entry.target);
            });
            }, {
                threshold : 0.5
            });

        observer.observe(this.form);
        }

    initSubmit() {
        if(!this.form) return;

        this.form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            this.submitForm({
             body: {
                    annonceUrl: window.location.href
                    }
                    });
        });
    }

    onSuccess(data) {
    this.modal.addFlash(data.flash);

            const errors = document.querySelectorAll('.modal__error');

            if(errors){
                errors.forEach((er) => {
                er.remove();
                });
            }
            if (data.success === true) {
                const fields = this.form.querySelectorAll('input:not([type="hidden"]), select, textarea');

                fields.forEach((field) => {
                    
                  if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = false;
                    } else {
                        field.value = '';
                    }
                });             
            }

            if (data.success === false) {
                data.errors.forEach((error) => {
                    this.modal.addContent('modal__error', error.errors);
                  
                });
            }            

             this.modal.open();
    }


    beforeSubmit(){        
        if(!this.btn) return;
        this.btn.classList.add('form__submit--is-loading');
    }

    onError(){
        this.removeLoadingBtn();
    }

     afterSubmit(){
        this.removeLoadingBtn();
    }

    removeLoadingBtn(){
         if(!this.btn) return;
        this.btn.classList.remove('form__submit--is-loading');
    }


}
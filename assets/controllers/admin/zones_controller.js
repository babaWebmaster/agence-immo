import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect(){


        
        this.element.addEventListener('change',(event)=>{
           const target = event.target.closest('.zone-region-choice');

           if(!target){
            return;
           }

           const details = this.element.closest('.zone-region').querySelector('.zone-region__departements');

            const checked = details.querySelectorAll('input[type="checkbox"]:checked');

            const region = this.element.closest('.zone-region');

            const inputs = this.element.closest('.zone-region').querySelectorAll('.zone-region__departements input');

            [...inputs].forEach((input, key)=>{

                if(input.checked === true){
                    input.checked = false;
                }
               else if(input.checked === false){
                    input.checked = true;
                }

            });
            
        });

       
        const inputs = document.querySelectorAll(
        'input[name="zones[departements][]"]'
        );       
        this.styleDepartements(inputs);

        inputs.forEach(element =>{
            element.addEventListener('change',()=>{
                this.styleDepartement(element);
            })
        });

       

    }

    disconnect(){
        console.log('deconnection controller zones');
    }

    styleDepartement(element) {

        let checked = 0;

        const parent =
            element.parentElement
                .parentElement
                .parentElement
                .parentElement;


            parent.children[1].querySelectorAll('input[type="checkbox"]').forEach(input =>{

                if(input.checked){
                    checked++;
                }
            });
            
         

        if (checked > 0) {

            parent.children[0].style.fontWeight = 'bold';
            parent.children[1].children[0].style.fontWeight = 'bold';         

        } else {
            parent.children[0].style.fontWeight = 'normal';
            parent.children[1].children[0].style.fontWeight = 'normal';            
        }
    }   

    styleDepartements(inputs) {

        [...inputs].forEach((element) => {
            this.styleDepartement(element);
        });

    }









}
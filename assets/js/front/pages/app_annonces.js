import { Autocomplete } from "../../utils/Autocomplete";
import { CustomForm } from "../form/CustomForm";
import { FormResponsive } from "../../utils/FormResponsiveSearch";
import { FormMobile } from "../../utils/FormMobileSearch";
import { FormSearch } from "../../utils/FormSearch";
import { SvgAnnonce } from "../svgAnnonce/SvgAnnonce";
import { ImageLoader } from '../ImageLoader/ImageLoader.js';
import { HeroAnnonces } from "../HeroAnnonces/HeroAnnonces.js";

let autoComplete
let customForm;
let formResponsive;
let formMobile;
let svgAnnonce;
let hero

document.addEventListener('DOMContentLoaded', () => {
       /*hero = new HeroAnnonces();        
        hero.resize();


        const pathAnonce = 'M 0 0 H 400 V 400 H 0 C 100 300 100 100 0 0 V 0 Z';
        svgAnnonce = new SvgAnnonce('.hero__svg-annonce');
        svgAnnonce.pathInit = pathAnonce;
        svgAnnonce.init();*/

});


window.addEventListener('resize',()=>{

         requestAnimationFrame(()=>{
         customForm.resizeRange();
         autoComplete.resizeListPositiongList();        
         hero.resize();
         svgAnnonce.resize();     
         })
         
})


window.addEventListener('load',()=>{  

  autoComplete = new Autocomplete('.hero__input-autocomplete','#autocomplete-token', '.hero__search_form__autocomplete-list','.hero__select-villes','.hero__search-form__villes-selected', '.hero__input-autocomplete', '.hero__danger-max-ville');
       autoComplete.addAddEventListener();

        customForm = new CustomForm(autoComplete);    


        formMobile = new FormMobile(autoComplete, customForm);
        hero = new HeroAnnonces();        
        hero.resize();       


        const pathAnonce = 'M 0 0 H 400 V 400 H 0 C 100 300 100 100 0 0 V 0 Z';
        svgAnnonce = new SvgAnnonce('.hero__svg-annonce');
        svgAnnonce.pathInit = pathAnonce;
        svgAnnonce.init();       
        
        new FormSearch();

        const annonces =document.querySelector('.annonces');                
       

                if (annonces) {
                const handleImageLoad = (img) => {
                        img.parentElement.classList.add('annonces__picture--exit');
                        img.classList.add('annonces__img--translateNull');
                };

                // Images chargées après l'installation de l'écouteur
                annonces.addEventListener('load', (event) => {
                        if (event.target.matches('.annonces__img')) {
                        handleImageLoad(event.target);
                        }
                }, true);

                // Images déjà chargées au démarrage
                annonces.querySelectorAll('.annonces__img').forEach((img) => {
                        if (img.complete && img.naturalWidth > 0) {
                        handleImageLoad(img);
                        }
                });
                }
        
      
        });


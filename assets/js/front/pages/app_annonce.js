import { ImageLoader } from "../ImageLoader/ImageLoader";
import { SliderPuzzle } from "../Slider/SliderPuzzle";
import { SliderAnimate } from "../Slider/SliderAnimate";
import { ImageFormat } from "../ImageFormat/ImageFormat";
import { SvgFicheAnnonce } from "../SvgFicheAnnonce/SvgFicheAnnonce";
import { FormAnnonce as BuilderForm} from "../FormAnnonce/FormAnnonce";
import { AnimateFormAnnonceContact } from "../AnimateFormAnnonceContact/AnimateFormAnnonceContact";
import { ScrollTo } from "../../utils/ScrollTo";
import { FormAnnonce as SubmitForm} from "../SubmitFormContact/FormAnnonce/FormAnnonce";


let sliderAnimate;
let imagesLoaded = false;
let svgFicheAnnonce;
let animateFormAnnonceContact;
let scrollBtn ;

document.addEventListener('DOMContentLoaded',()=>{
       new SubmitForm('.form__form');
});

window.addEventListener('load',()=>{

   animateFormAnnonceContact = new AnimateFormAnnonceContact();

    scrollBtn = new ScrollTo('.hero__btn', '.form');

  
    /*form*/
    let from = new BuilderForm('.form__form');

    /*svg */
    svgFicheAnnonce = new SvgFicheAnnonce('.hero__svg', '.hero__annonce-intro', '.hero__description', '.hero__subtitle','.hero__svg-description','.hero__description');



       /*init pour le slider*/
       const mediaQuery = window.matchMedia('(min-width: 1200px)');
        const condition = ()=>{
            return mediaQuery.matches;
        }   

        const container = document.querySelector('.hero__slide');
        const rect = container.getBoundingClientRect();

        const containerData = {
                    width: rect.width,
                    height: rect.height,
                    ratio: rect.width / rect.height,
                    element: container
                };

        
        const fallback = new ImageFormat(document.querySelector('.hero__img__fallback'));
        const formatImg = fallback.getFormatFromPicture();
        const pictureHero = document.querySelector('.hero__picture');
      


        /*function init*/     
         const initSlider = () => {
         
            const images = new ImageLoader('.hero__slide__thumbnail img', condition, formatImg);
            const sliderThumbnail = document.querySelector('.hero__slider__thumbnails');
            const slider = document.querySelector('.hero__slider');
           const pictureHero = document.querySelector('.hero__picture');
    

    
                images.loadAllImages(
                    (img, containerData) => {           
                    new SliderPuzzle(img, containerData);      
                    if(img.parentElement){
                        img.parentElement.classList.add('hero__slide__thumbnail--is-loaded');
                    }
                    },()=>{
                        
                        sliderAnimate = new SliderAnimate('.hero__slider', '.hero__slider__thumbnails', '.hero__control-slider');   
                        imagesLoaded = true;
                        sliderAnimate.start();
                        sliderAnimate.loadImgBySliderThumbnail();
                        sliderAnimate.sliderManuel();
                        sliderAnimate.sliderMobile();
                        sliderAnimate.loadSlider();

                        pictureHero.classList.add('hero__picture--exit');
                        pictureHero.addEventListener('transitionend', (event) => {
                        if (event.propertyName === 'filter' || event.propertyName === 'opacity'){
                            pictureHero.remove();
                        }           
                            }, { once: true });

                    },
                    containerData
                    );
            };



        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(initSlider, { timeout: 3000 });
        } else {
         setTimeout(initSlider, 1000);
        }
      
});





window.addEventListener('resize',()=>{

        if(scrollBtn){
             scrollBtn = new ScrollTo('.hero__btn', '.form');
        }

       

       if (!imagesLoaded) {
        return;
        }

    sliderAnimate.resize();

    document.querySelectorAll('.hero__slide').forEach((slide) => {
        slide.replaceChildren();
    });

    const imagesResize = document.querySelectorAll('.hero__slide__thumbnail__img');

    const containerResize = document.querySelector('.hero__slide');
    const rectResize = containerResize.getBoundingClientRect();

    const containerDataResize = {
                    width: rectResize.width,
                    height: rectResize.height,
                    ratio: rectResize.width / rectResize.height,
                    element: containerResize
                };

     

  
    imagesResize.forEach((img)=>{
        new SliderPuzzle(img, containerDataResize);
    })

    svgFicheAnnonce.eventResize();

    animateFormAnnonceContact.resize();

});
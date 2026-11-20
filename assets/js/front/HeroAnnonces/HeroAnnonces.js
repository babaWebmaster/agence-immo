import { DeviceManager } from '../../utils/DeviceManager';
import { ElementPositions } from '../../utils/ElementPositions';


export class HeroAnnonces{
    constructor(){
        this.positionsButton;
        this.hero = document.querySelector('.hero');
        this.form = document.querySelector('.hero__wrapper-form_title');
        this.btn = document.querySelector('.hero__btn-form');

        this.eventFieldSearchMenuOpen()
        this.clickBtnSearch();
        sessionStorage.setItem('paddingBottomHero','50');
    }

    init(){
        this.formRect = this.form.getBoundingClientRect();        

        this.positionsButton = ElementPositions.getElementPosition('.hero__btn-form', '.hero');     
    
        
    }

    resize(){
       this.init();
       console.log()
       this.updatePosition();       
    }

    updatePosition(){
            if(DeviceManager.isTablet){
             document.documentElement.style.setProperty('--marginTopTablet', `${this.positionsButton.bottom}px`);
        }

        const margin = Number(sessionStorage.getItem('paddingBottomHero'));

        const heightHero = this.formRect.height + margin + this.positionsButton.bottom;

        document.documentElement.style.setProperty('--heightDesktop', `${heightHero}px`);

        sessionStorage.setItem('heightHero',heightHero);

        this.positionsTitle = ElementPositions.getElementPosition('.hero__title', '.hero');

        document.documentElement.style.setProperty('--heightCloseMobile', `${this.positionsTitle.bottom}px`);

    }

    clickBtnSearch(){        

        const btn = document.querySelector('.hero__btn-form');
       
        btn.addEventListener('click',(event)=>{            
           this.hero.classList.toggle('hero--close-mobile');
           if(!this.hero.classList.contains('hero--close-mobile')){
            btn.setAttribute('aria-expanded','true');
           }
           if(this.hero.classList.contains('hero--close-mobile')){
            btn.setAttribute('aria-expanded','false');
           }

        })

    }


    eventFieldSearchMenuOpen(){        const fields = document.querySelectorAll('[id^="search-mobile-"]');


        fields.forEach((field)=>{


             field.addEventListener('menuSearch:close', (event) => {
            const heightLess = event.detail.height;            
            const heightHero = parseFloat(
                document.documentElement.style.getPropertyValue('--heightDesktop')
            );

             document.documentElement.style.setProperty('--heightDesktop', `${heightHero - heightLess}px`);
            });


              field.addEventListener('menuSearch:open', (event) => {
            const heightAdd = event.detail.height;
            const heightHero = parseFloat(
                document.documentElement.style.getPropertyValue('--heightDesktop')
            );

             document.documentElement.style.setProperty('--heightDesktop', `${heightAdd + heightHero}px`);

            });


        });

    }





}
import { svgInit } from "../svg/svgInit";
import { ElementPositions } from "../../utils/ElementPositions";

export class SvgAnnonce extends svgInit{
    constructor(svg){
        super(svg);
        this.hero = document.querySelector('.hero');
        this.wrapperFormTitle= document.querySelector('.hero__wrapper-form_title');
        this.filter = document.querySelector('.hero__btn-form');
        this.filter.getBoundingClientRect();
    }


    init(){
        
        this.parsePath(this.pathInit);
        this.computePosition();
        this.geometryPath();
        const max = this.getPathBounds();
        this.setViewBox(0, 0, max.width, max.height);
        this.modifyDPathToDom();
    }

    computePosition(){
          this.tiltePosition = ElementPositions.getElementPosition('.hero__title','.hero');

        this.wrapperOne = ElementPositions.getElementPosition('.hero__search-form__field--type','.hero');

        this.wrapperTwo = ElementPositions.getElementPosition('.hero__search-form__field--loyer','.hero');

       this.btn = ElementPositions.getElementPosition('.hero__btn-form','.hero');

       this.heroRect= this.hero.getBoundingClientRect();

       this.wrapperFormTitleRect = this.wrapperFormTitle.getBoundingClientRect();
       
    }


    geometryPath(){        

        this.path[0].x = this.tiltePosition.left *0.95;

        this.path[1].x = this.heroRect.width;

        this.path[2].y = Number(sessionStorage.getItem('heightHero'));

        this.path[3].x = this.wrapperTwo.left * 0.7;

        this.path[4].x2 = this.wrapperTwo.left;

        this.path[4].y2 = this.wrapperTwo.top;

        this.path[4].x1 = this.wrapperTwo.left;

        this.path[4].y1 = this.wrapperOne.top;

        this.path[4].x = 0 ;
        this.path[4].y= this.btn.bottom + 10; 
       
    }

    resize(){
        this.computePosition();
        this.geometryPath();        
        const max = this.getPathBounds();           
        this.setViewBox(0, 0, max.width, max.height);
        this.modifyDPathToDom();
    }



}
import { svgInit } from "../svg/svgInit";
import { SvgDescription } from "./SvgDescription";
import { DeviceManager } from "../../utils/DeviceManager";

export class SvgFicheAnnonce extends svgInit{
    constructor(svg, annonceIntro, annonceDescription, title, svgDescription, description){
        super(svg);

      /* this.isTablet = DeviceManager.isTablet();
        

        this.pathInit = this.isTablet ?'M 0 0 H 0 V 0 C 0 0 0 0 0 0 V 0 Z' :'M 0 0 H -574.13330078125 C -580 200 -600 400 -574 450 C -400 550 -200 480 0 450 H 0 V 0 Z';*/

        this.intro = document.querySelector(annonceIntro);
        this.annonceDescription = document.querySelector(annonceDescription);
        this.title = document.querySelector(title);
        this.svgDescription = new SvgDescription(svgDescription, description);

       /* this.parsePath(this.pathInit);
        this.init();
       this.isTablet ? this.resizeTablet() : this.resizeDesktop();*/

       this.init();

    }

    init(){
        this.isTablet = DeviceManager.isTablet();
         this.pathInit = this.isTablet ?'M 0 0 H 0 V 0 C 0 0 0 0 0 0 V 0 Z' :'M 0 0 H -574.13330078125 C -580 200 -600 400 -574 450 C -400 550 -200 480 0 450 H 0 V 0 Z';

        this.parsePath(this.pathInit);




        this.introRect = this.intro.getBoundingClientRect();
        this.annonceDescriptionRect = this.annonceDescription.getBoundingClientRect();
        this.titleRect = this.title.getBoundingClientRect();

        this.isTablet ? this.resizeTablet() : this.resizeDesktop();
    }

    resizeDesktop() {
        const width = this.introRect.width;
        const bottomY = (this.annonceDescriptionRect.top - this.introRect.bottom)
            + this.introRect.height;

        const marginTitle = this.titleRect.top - this.svgDescription.descriptionRect.top;

        this.path[1].x = -width;

        this.path[2].x = -width;
        this.path[2].y = bottomY;
        this.path[2].x1 = -width * 1.05;
        this.path[2].x2 = -width * 1.02;
        this.path[2].y2 = this.introRect.height * 0.8;

        this.path[3].x = 0;
        this.path[3].y = bottomY;
        this.path[3].y1 = bottomY + Math.abs(marginTitle) * 0.9;
        this.path[3].y2 = bottomY + Math.abs(marginTitle)* 0.8; 
        
        const max = this.getPathBounds();

        this.setWidthHeight(max.width, max.height);
        this.setViewBox(max.minX, 0, max.width, max.height);

        this.modifyDPathToDom();
        
        this.svgDescription.resizeDesktop(this.path[2].x, this.path[3]);
       
    }

    resizeTablet(){       
         this.path[1].x = this.introRect.width;
         this.path[2].y = this.introRect.height;

         this.path[3].x = 0;
         this.path[3].y = this.introRect.height + 1;
         this.path[3].x1 = this.introRect.width * 0.8;
         this.path[3].x2 = this.introRect.width * 0.4;
         this.path[3].y1 = this.introRect.height * 1.2;
         this.path[3].y2 = this.introRect.height * 1.05;

        const max = this.getPathBounds();
        this.setWidthHeight(max.width, max.height);
        this.setViewBox(max.minX, max.minY, max.width, max.height);

         this.modifyDPathToDom();

         this.svgDescription.resizeTablet();
    }

    eventResize(){
        this.init();        
        this.svgDescription.init();       
        this.isTablet ? this.resizeTablet() : this.resizeDesktop();
    }



    

}
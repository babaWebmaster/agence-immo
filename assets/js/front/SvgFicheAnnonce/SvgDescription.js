import { svgInit } from "../svg/svgInit";
import { DeviceManager } from "../../utils/DeviceManager";
export class SvgDescription extends svgInit{
    constructor(svg, description){
        super(svg);
        this.description = document.querySelector(description);
        //this.pathInit = 'M 0 0 H 200 C 300 0 300 0 359 0 V 360  C 300 360 200 360 0 360 C 0 300 0 200 0 0 Z';
      

       /* this.pathInit = isTablet ? 'M 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 Z': 'M 0 0 H 200 C 300 0 300 0 359 0 V 360  C 300 360 200 360 0 360 C 0 300 0 200 0 0 Z';

        this.parsePath(this.pathInit); */

        this.init();
       
    }

    init(){
        this.isTablet = DeviceManager.isTablet();
        this.pathInit = this.isTablet ? 'M 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 Z': 'M 0 0 H 200 C 300 0 300 0 359 0 V 360  C 300 360 200 360 0 360 C 0 300 0 200 0 0 Z';

        this.parsePath(this.pathInit); 

        this.descriptionRect = this.description.getBoundingClientRect();

    }

    resizeDesktop(xFinishC2, curbe3){

        this.svg.removeAttribute('style');
        
        const H = this.descriptionRect.width - Math.abs(xFinishC2) - 2;
        const curbe1 =
            {key : "C" ,
            x1: this.descriptionRect.width - Math.abs(curbe3.x1),
             y1: curbe3.y1 - curbe3.y,
             x2: this.descriptionRect.width - Math.abs(curbe3.x2),
             y2: curbe3.y2 - curbe3.y,
             x: this.descriptionRect.width,
             y:0        
        }


        this.path[1].x = H;
        this.path[2]= curbe1;
        this.path[3].y = this.descriptionRect.height;

        this.path[4].x1 = this.descriptionRect.width * 0.8;
        this.path[4].x2 = this.descriptionRect.width * 0.5;
        this.path[4].y1 = this.descriptionRect.height * 1.1;
        this.path[4].y2 = this.descriptionRect.height + 1.05;

        this.path[4].x = 0;
        this.path[4].y = this.descriptionRect.height;

        this.path[5].x = 0;
        this.path[5].y = 0;

        this.path[5].x1 = -20;
        this.path[5].x2 = -50;

        this.path[5].y1 = this.descriptionRect.height * 0.8;
        this.path[5].y2 = this.descriptionRect.height * 0.5; 

        
        const max = this.getPathBounds();

        this.setWidthHeight(max.width, max.height);
        this.setViewBox(max.minX, 0, max.width, max.height);

        this.modifyDPathToDom();
    }


    resizeTablet(){

        const mediaMatch = window.matchMedia('(max-width: 575.8px)').matches;

        const c1X1 = this.descriptionRect.width * 0.3;
        const c1X2 = this.descriptionRect.width * 0.7;
        const c1Y1 = -30
        const c1Y2 = -80

        

        this.path[1].x= this.descriptionRect.width;
        this.path[1].y= 0;
        this.path[1].x1 = c1X1;
        this.path[1].x2 = c1X2;
        this.path[1].y1 = c1Y1;
        this.path[1].y2 = c1Y2;


        this.path[2].x = this.descriptionRect.width;
        this.path[2].y= this.descriptionRect.height;
        this.path[2].x1 = mediaMatch ?this.descriptionRect.width : this.descriptionRect.width * 1.1;
        this.path[2].x2 = mediaMatch ? this.descriptionRect.width: this.descriptionRect.width * 0.95;
        this.path[2].y1 = this.descriptionRect.height * 0.3;
        this.path[2].y2 = this.descriptionRect.height * 0.7;



        this.path[3].x = 0;
        this.path[3].y = this.descriptionRect.height;
        this.path[3].x1 = c1X2;
        this.path[3].x2 = c1X1;
        this.path[3].y1 = this.descriptionRect.height * 1.1;
        this.path[3].y2 = this.descriptionRect.height * 0.95;


        this.path[4].x= 0;
        this.path[4].y= 0;

        this.path[4].x1 = mediaMatch ? 0: -20;
        this.path[4].x2 = mediaMatch ? 0:-40;

        this.path[4].y2 = this.descriptionRect.height * 0.2;
        this.path[4].y1 = this.descriptionRect.height * 0.7;



        const max = this.getPathBounds();
        this.setWidthHeight(max.width, max.height);
        this.setViewBox(max.minX, max.minY, max.width, max.height);

       const translateX = (max.width - this.descriptionRect.width) / 2;
       const translateY =  (max.height - this.descriptionRect.height)/2;

       this.svg.style.transform = `translateX(-${translateX}px) translateY(-${translateY}px)`;
      

        this.modifyDPathToDom();

    }





}
//import { SliderPuzzle } from "../Slider/SliderPuzzle";

export class ImageLoader{
    constructor(images, condition, formatImg){        

        this.images = document.querySelectorAll(images);
        this.format = this.getFormatLoad(condition);          
        this.count = this.images.length;
        this.formatImg = formatImg;    
    }


    getFormatLoad(condition=()=>{},){        
         const format = condition() ? 'xlarge' : 'large';         
         return format;
    }

   
    loadImage(image){  
        return new Promise((resolve, reject) => {

        const img = new Image();

            const dataUrl = image.dataset[this.formatImg].split('--');

            const url = this.format === 'large' ? dataUrl[0]:dataUrl[1];

            img.onload = () => {
                image.src = url;
                resolve(image);}

            img.onerror = () => reject(new Error(`Erreur : ${url}`));
            img.src = url;
        });
    }

   async loadAllImages(onSuccess = () => {}, onComplete = () => {}, ...args){
        
        for (const image of this.images) {
            
           const img = await this.loadImage(image);                      
              onSuccess(img, ...args);
        }

         onComplete(...args);
    }

   



}
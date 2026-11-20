import { Controller } from '@hotwired/stimulus';
import { ImageElementFactoryAnnonce } from './ImageElementFactoryAnnonce.js';



export default class extends Controller {

    connect() {          
         
       this.currentDragover;
            
       
       this.pointerdown = this.pointerdown.bind(this);
       this.element.addEventListener('pointerdown', this.pointerdown);
       this.pointermove = this.pointermove.bind(this);
       this.element.addEventListener('pointermove', this.pointermove);
        this.pointerup = this.pointerup.bind(this);
       this.element.addEventListener('pointerup', this.pointerup);          
        
    }

    disconnect() {
       this.element.removeEventListener('pointerup', this.pointerup);
       this.element.removeEventListener('pointerdown', this.pointerdown);   
       this.element.removeEventListener('pointermove', this.pointermove);      
      

    }

    pointerdown(event) {

              const garbage = event.target.closest(
                '.gallery-selected__wrapper__img--delete'
            );

            if (garbage) {
                return;
            }

            event.preventDefault();
            this.state;
             // selector de la gallery d'img ou d'éléments 
            this.gallery = document.querySelector('.gallery-selected');
            this.childrenGallery = [...this.gallery.children];
            this.getGalleryPositions();
            this.getGalleryPositionsRelative();
            
            this.maxImgByLine = this.getMaxImgByLine(this.galleryRect.width, this.positionsGallery[0].width);
      

            this.draggedElement = event.target.closest(
                '.gallery-selected__wrapper'
            );

            if (!this.draggedElement) {
                return;
            }

            this.indexStart = this.childrenGallery.indexOf(
                this.draggedElement
            );

            this.currentOver = this.indexStart;

            this.client = {
                x: event.clientX,
                y: event.clientY
            };
            const width = this.positionsGallery[this.indexStart].width;
            const height = this.positionsGallery[this.indexStart].height;
           
            

             this.createDraggedElementCopy(this.positionsGallery[this.indexStart].left, this.positionsGallery[this.indexStart].top);

            this.gallery.appendChild(this.draggedElementCopy);
           
            this.createDropZone(width, height);

            this.state = 'down';
            
                   
            this.childrenGallery[this.indexStart].after(this.dropZone.element)
            this.childrenGallery[this.indexStart].classList.add('gallery-selected__wrapper--widthNull');             
            this.updatePositionGalleryDropZone(this.indexStart);
        
        }

    pointermove(event){
        if(this.state === 'down'){
            this.state = 'move';
        }
        
        
        if(this.state === 'move'){
                         
            this.gap = this.getGap(event);


              this.updateDraggedElementPosition(this.positionsGallery[this.indexStart].left + this.gap.x, this.positionsGallery[this.indexStart].top + this.gap.y);


            const zoneOver = this.matchDragGalleryImg(event);

           
            if(zoneOver === null){
                return;
            }


            if(zoneOver.element.type === 'dropZone'){
                this.dragDropZone = 'enabled';
                return;
            }

            if(zoneOver.element.type === 'position'){
                if(zoneOver.index > this.currentOver){

                    const indexAfter = zoneOver.element.positionInitGallery;

                    this.childrenGallery[indexAfter].after(this.dropZone.element);

                    this.updatePositionGalleryDropZone(indexAfter);
                    
                    this.currentOver = zoneOver.index;
                
                }

                if(zoneOver.index < this.currentOver){

                    const indexBefore = zoneOver.element.positionInitGallery;

                    this.childrenGallery[indexBefore].before(this.dropZone.element);                   

                    this.updatePositionGalleryDropZone(indexBefore );

                     this.currentOver = zoneOver.index;

                }

            }           
             
        }

    }


    pointerup(event){
            if(this.state ==='move' || this.state === 'down'){

                         
                this.childrenGallery[this.indexStart].classList.remove('gallery-selected__wrapper--widthNull');
                if(this.dragDropZone === 'enabled'){
                    
                    this.dropZone.element.replaceWith(this.childrenGallery[this.indexStart]);
                    
                    this.dragDropZone = 'disabled';

                    
                }

                 if(this.draggedElementCopy){
                    this.draggedElementCopy.remove();
                }
                if(this.dropZone.element){
                   this.dropZone.element.remove();
                }

                ImageElementFactoryAnnonce.buildSelectAfterDrag('.form-select-custom', '.gallery-selected__wrapper');
                
                this.state ='up';
            }
    }

    getGap(event) {

            return {
                x: event.clientX - this.client.x,
                y: event.clientY - this.client.y
            };
    }

    createDraggedElementCopy(left, top) {

        this.draggedElementCopy =
            this.childrenGallery[this.indexStart].cloneNode(true);

        this.draggedElementCopy.classList.add('position-absolute');

        this.gallery.appendChild(this.draggedElementCopy);

        this.updateDraggedElementPosition(left,top);
    }

    updateDraggedElementPosition(left, top) {

        this.draggedElementCopy.style.left =
            `${left}px`;

        this.draggedElementCopy.style.top =
            `${top}px`;
    }


       

       
   
       

     getElementPosition(element) {
        const position = this.childrenGallery.indexOf(element);

       return position;         
    }



    checkDragDirection(currentX) {

            if (currentX > this.previousX) {
                this.direction = 'right';
            } else if (currentX < this.previousX) {
                this.direction = 'left';
            }

            if (this.previousDirection && this.direction !== this.previousDirection) {
                this.returnDirection = true;
            }

            this.previousDirection = this.direction;
            this.previousX = currentX;            
    }

  

    createDropZone(width, height) {

        
            const element = document.createElement('div');

            element.classList.add('gallery-selected__drop-zone');

            element.style.width = `${width}px`;
            element.style.height = `${height}px`;

        this.dropZone = {
            element: element,
            width,
            height,
            left: null,
            right: null,
            top: null,
            bottom: null,
            middle: null,
            center: {
                x: null,
                y: null
            },
            line: null,
            index: null
        };

        
    }

  


    getGalleryPositions() {
        const positions = [];
        const lines = [];

            this.childrenGallery.forEach((element, index) => {

                const rect = element.getBoundingClientRect();
               
                let line = lines.indexOf(rect.top);

                if (line === -1) {
                    lines.push(rect.top);
                    line = lines.length - 1;
                }

                positions[index] = {
                    img: element,
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    bottom: rect.bottom,
                    middle: rect.left + rect.width / 2,
                    center: {x: (rect.left + rect.right) / 2, y: (rect.top+ rect.bottom)/2},
                    width: rect.right - rect.left,
                    height: rect.bottom - rect.top,
                    line: line,                   
                    positionLine: null
                };
            });

        this.positions = positions;

        return this.positions;
    }

    getGalleryPositionsRelative() {

            const positions = [];
            const lines = [];
            let column =0;
            const galleryRect = this.gallery.getBoundingClientRect();
            this.galleryRect = galleryRect;

            this.childrenGallery.forEach((element, index) => {

                const rect = element.getBoundingClientRect();

                const left = rect.left - galleryRect.left;
                const right = rect.right - galleryRect.left;
                const top = rect.top - galleryRect.top;
                const bottom = rect.bottom - galleryRect.top;

                let line = lines.indexOf(top);

                if (line === -1) {
                    lines.push(top);
                    line = lines.length - 1;
                    column = 0;
                }                
                column++;               

                positions[index] = {
                    type: 'position',
                    img: element,
                    left: left,
                    right: right,
                    top: top,
                    bottom: bottom,
                    middle: left + rect.width / 2,
                    center: {
                        x: (left + right) / 2,
                        y: (top + bottom) / 2
                    },
                    width: rect.width,
                    height: rect.height,
                    line: line,
                    positionLine: column - 1,
                    positionInitGallery : index
                };
            });

            this.positionsGallery = positions;

            return this.positionsGallery;
    }


    updatePositionGalleryDropZone(indexDropZone){
      
        const positions = [];
        let image;
        let positionIndex;
        let state;
        let type;
 
            this.positionsGallery.forEach((element,key)=>{

                if(key< indexDropZone && key< this.indexStart){
                    state=1;
                    positionIndex = key;
                    image = key;
                    type = 'position';
                }


                if(key>indexDropZone && key<=this.indexStart){
                    positionIndex = key  ;
                    image = key - 1;
                    state=2;
                    type = 'position';
                }

                if(key>indexDropZone && key > this.indexStart){
                    positionIndex = key;
                     image = key;
                     state=3;
                     type = 'position';
                }


                if(key === indexDropZone){
                    positionIndex = indexDropZone;
                    image = indexDropZone;
                    state=4;
                    type = 'dropZone';
                }

                if(key>= this.indexStart && key<indexDropZone){
                    positionIndex = key;
                    image = key +1;
                    state = 5;
                    type = 'position';
                }


                     
             
                
                positions[key] = {
                type: type,
                img: this.positionsGallery[image],
                left: this.positionsGallery[positionIndex].left,
                right: this.positionsGallery[positionIndex].right,
                top: this.positionsGallery[positionIndex].top,
                bottom: this.positionsGallery[positionIndex].bottom,
                middle: this.positionsGallery[positionIndex].middle,
                center: {
                    x: this.positionsGallery[positionIndex].center.x,
                    y: this.positionsGallery[positionIndex].center.y
                },
                width: this.positionsGallery[positionIndex].width,
                height: this.positionsGallery[positionIndex].height,
                line: this.positionsGallery[image].line,
                positionLine: this.positionsGallery[positionIndex].positionLine,
                positionInitGallery: this.positionsGallery[image].positionInitGallery
            };


            });

            this.positionsUpdateGallery = positions;
    }

    updatePositionDropZone(indexDropzone){


         this.dropZone = {
            type: 'dropZone',
            element: this.dropZone.element,
            width: this.dropZone.width,
            height: this.dropZone.height,
            left: this.positionsGallery[indexDropzone].left,
            right: this.positionsGallery[indexDropzone].right,
            top: this.positionsGallery[indexDropzone].top,
            bottom: this.positionsGallery[indexDropzone].bottom,
            middle: this.positionsGallery[indexDropzone].middle,
            center: {
                x: this.positionsGallery[indexDropzone].center.x,
                y: this.positionsGallery[indexDropzone].center.y
            },
            line: null,
            
        };

    }



  

    getInfoImg(index, key){
       return this.positions[index][key];
    }

      getNumberLines() {
        const tops = this.positions.map(position => position.top);
        const uniqueTops = [...new Set(tops)];

        return uniqueTops.length;
    }

    getLinesTop() {
         const tops = this.positions.map(position => position.top);

         return [...new Set(tops)];
    }

    getMaxImgByLine(widthGallery, widthImg){

        return Math.floor(widthGallery/ widthImg);
    }


    getImagesByLine() {
            const lines = {};

            this.positions.forEach((position) => {
                const top = position.top;

                if (!lines[top]) {
                    lines[top] = {
                        top: top,
                        numberImages: 0
                    };
                }

                lines[top].numberImages++;
            });

        return lines;
    }

    getTotalMovement(event) {
        return {
            x: event.clientX - this.client.x,
            y: event.clientY - this.client.y
        };
    }
    

    getPositionDragGallery(event, index) {

        const position = this.positionsGallery[index];

        const move = this.getTotalMovement(event);

        const dx = move.x;
        const dy = move.y;

        return {
            left: position.left + dx,
            right: position.right + dx,
            top: position.top + dy,
            bottom: position.bottom + dy,
            middle: position.middle + dx,
            center: {
                x: position.center.x + dx,
                y: position.center.y + dy
            },
            width: position.width,
            height: position.height,
            line: position.line
        };
    }

    comparePosition(positionDrag, position) {
        

        if (
            positionDrag.center.x >= position.left &&
            positionDrag.center.x <= position.right &&
            positionDrag.center.y >= position.top &&
            positionDrag.center.y <= position.bottom
        ) {
            return true;
        }

      return false;
    }

 
  

    matchDragGalleryImg(event){
        const positionDrag = this.getPositionDragGallery(event, this.indexStart);

        const positions = this.positionsUpdateGallery;

        for (let index = 0; index < positions.length; index++) {

                if (this.comparePosition(positionDrag, positions[index])) {
                    return {index: index,
                        element : positions[index]
                }
            }
        }

            return null;

    }


      

  
    clamp(value, min, max) {
         return Math.min(Math.max(value, min), max);
        }

  

}
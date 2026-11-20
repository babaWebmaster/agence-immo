export class SliderPuzzle{
    constructor(imgInput, container){
        /*const container = {
                    width: rect.width,
                    height: rect.height,
                    ratio: rect.width / rect.height,
                    element: container
                };*/
       
        this.image = typeof imgInput === 'string' 
            ? document.querySelector(imgInput) 
            : imgInput;
      
        this.container = container;
        this.imageInfos = this.getImageDimensions();
        this.scale =  this.calculateScale();
        this.backgroundSize = this.calculateBackgroundSize();
        this.offset = this.calculateBackgroundPosition(); 
             
        
        this.pieces = this.createPuzzlePieces(3, 2);
      
        this.pieces=this.calculatePiecesPosition();
     
        this.createPuzzle();


        }

    getContainerDimensions(container) {
        const rect =container.getBoundingClientRect();

        return {
            width: rect.width,
            height: rect.height,
            ratio: rect.width / rect.height,
            element: this.container
        };
    }

    getImageDimensions() {
        return {
            width: this.image.naturalWidth,
            height: this.image.naturalHeight,
            ratio: this.image.naturalWidth / this.image.naturalHeight,
            element: this.image,
        };
    }

    calculateScale(){
        let scale;
        if (this.imageInfos.ratio > this.container.ratio) {
            // image plus large proportionnellement
            // on se cale sur la HAUTEUR
            scale = this.container.height / this.imageInfos.height;

        } else {
             // image moins large proportionnellement
             // on se cale sur la LARGEUR
              scale = this.container.width / this.imageInfos.width;
        }

        return scale;
    }

    calculateBackgroundSize() {
        return {
            width: this.imageInfos.width * this.scale,
            height: this.imageInfos.height * this.scale
        };
    }

    calculateBackgroundPosition() {

        const offsetX = (this.container.width - this.backgroundSize.width) / 2;
        const offsetY = (this.container.height - this.backgroundSize.height) / 2;

        return {
            x: offsetX,
            y: offsetY
        };
    }

    calculatePiecesPosition() {

        return this.pieces.map(piece => ({
            ...piece,           
            backgroundX: this.offset.x - piece.x,
            backgroundY: this.offset.y - piece.y
        }));
    }

    createPuzzlePieces(col, row) {

            const columns = col;
            const rows = row;
            const pieces = [];

            const pieceWidth = this.container.width / columns;
            const pieceHeight = this.container.height / rows;

            for (let i = 0; i < columns * rows; i++) {

                const column = i % columns;
                const row = Math.floor(i / columns);

                pieces.push({
                    width: pieceWidth,
                    height: pieceHeight,
                    x: column * pieceWidth,
                    y: row * pieceHeight
                });
            }

            return pieces;
    }

    

    createPuzzle() {

            const index = this.imageInfos.element
                .closest('.hero__slide__thumbnail')
                .className
                .match(/hero__slide__thumbnail--(\d+)/)[1];

                
            const slide = document.querySelector(`.hero__slide--${index}`);

            this.pieces.forEach((piece, index) => {

                const element = document.createElement('div');

                element.classList.add(
                    'hero__puzzle__piece',
                    `hero__puzzle__piece--${index + 1}`
                );

               /* element.style.left = `${piece.x}px`;
                element.style.top = `${piece.y}px`;*/

                element.style.backgroundImage = `url(${this.imageInfos.element.src})`;

                element.style.backgroundSize =
                    `${this.backgroundSize.width}px ${this.backgroundSize.height}px`;

                element.style.backgroundPosition =
                    `${piece.backgroundX}px ${piece.backgroundY}px`;

                slide.appendChild(element);
            });
    }   

}
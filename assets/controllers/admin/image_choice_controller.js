import { Controller } from '@hotwired/stimulus';
import { ImageElementFactoryAnnonce } from './ImageElementFactoryAnnonce.js';

export default class extends Controller {
    init(){
        
        this.images = [];
        this.gallery = document.createElement('div');
        this.closeButton = document.createElement('button');
        this.uploadButton = document.createElement('button');
        this.selectButton = document.createElement('button');
        //selector
        this.classSelect = 'form-select';
       // this.form = '#new-Annonce-form';
        this.collectionItem = 'field-collection-item';
        this.collectionField = 'field-collection';
        //this.galleryThumbnail = 'gallery__images-thumbnail';
         this.gallerySelected = 'gallery-selected';
        this.ids =[];//ids selected
        
    }
    connect() {

         this.init();
         const gallery =document.querySelectorAll('.gallery');

         const form = document.querySelector('form[id]');

         this.form = form;

         if(gallery.length === 0){
            this.generateGallery();            
         } 
        
    }

    removeListenerBody(){
        document.body.removeEventListener('click', this.galleryListener);
    }

   

    generateGallery() {
            this.galleryListener = (event) => {
                const button = event.target.closest('.field-collection-add-button');

               const gallerySelected = document.querySelector(`.${this.gallerySelected}`);
                if (!button) {
                    return;
                }

                this.addButton = button;
                this.addButton.disabled = true;

                this.generateListImage();
                this.removeCollectionSymfony();

               

                if (this.images.length > 0) {
                    this.createGallery(this.images);
                    this.addGalleryAtBody(this.gallery);

                    this.addSelectToImgAtGallery(gallerySelected);                 
                     
                }
            };

             document.body.addEventListener('click', this.galleryListener);

             
        }

    generateListImage(){
        Array.from(this.element.options).forEach(option => {
            const dataSet ={url:option.dataset.thumbnail,
                           id: option.value,
                           name: option.textContent
            }
            const img = ImageElementFactoryAnnonce.createImage(dataSet);
            this.images.push(img);
        });
     
    }
 

    createGallery(images) {
            this.gallery.classList.add(
                'gallery',
                'position-fixed',
                'p-5'
            );

            this.closeButton.type = 'button';
            this.closeButton.classList.add('gallery__close');

            this.closeButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-x"
                    viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            `;
            this.closeButton.setAttribute('aria-label', 'Fermer');
            this.closeButton.addEventListener('click', () => {
                this.closeGallery();
            });

            const imagesContainer = document.createElement('div');
            imagesContainer.classList.add(
                'gallery__images',
                'd-flex',
                'flex-wrap'
            );

            images.forEach((image) => {
                const item = document.createElement('div');
                item.classList.add('gallery__item', 'me-3');

                item.appendChild(image);
                imagesContainer.appendChild(item);

                this.selectImage(item);
                
            });

            this.selectButton.type = 'button';
            this.selectButton.textContent = 'Images sélectionnées';
            this.selectButton.classList.add('gallery__select');

            this.selectButton.addEventListener('click', () => {     
                //ajout de this.form;            
                ImageElementFactoryAnnonce.addGallerySelected(this.collectionField, this.gallerySelected, this.gallery, this.form);
                this.closeGallery();
                 
            });

           
            this.gallery.appendChild(this.closeButton);
            this.gallery.appendChild(imagesContainer);
            this.gallery.appendChild(this.selectButton);
            
            return this.gallery;
    }

    addGalleryAtBody(gallery){
       document.body.appendChild(gallery);
    }


    closeGallery() {
        this.gallery.remove();
        this.images = [];
        this.addButton.disabled = false;

        document.body.removeEventListener('click', this.galleryListener);
    }

    selectImage(imgWrapper){
      
        
        imgWrapper.addEventListener('click',()=>{
            imgWrapper.classList.toggle('gallery__item--select');            
            const img = imgWrapper.children[0];
            const id = img.dataset.id;
            if(img.dataset.select ==='no'){              
                img.dataset.select = 'yes';
                const select = document.querySelectorAll('.form-select-custom');
                const index = select.length;
                const name = img.dataset.name;              
             
            }
            else if(img.dataset.select ==='yes'){           
                img.dataset.select = 'no';  
            }         

        })
    }
    

  

    removeCollectionSymfony(){        

         document.querySelectorAll(`.${this.collectionItem}`).forEach((collection)=>{
            collection.remove();
         })       
    }  


   /* addGallerySelected(){      
        const fieldCollection = document.querySelector(`.${this.collectionField}`);    

            const selectedItems = this.gallery.querySelectorAll(
            '.gallery__item--select'
         );

         const galleryThumbnail = ImageElementFactoryAnnonce.createGallerySelected(selectedItems, this.gallerySelected);

        if(fieldCollection){
            fieldCollection.appendChild(galleryThumbnail);
        }
        
    }*/

    addSelectToImgAtGallery(gallerySelected){

             if(gallerySelected){
                   const wrappersImage = gallerySelected.children;
                   const gallery = document.querySelectorAll('.gallery__item');
                   if(wrappersImage.length > 0){
                     
                     [...wrappersImage].forEach((wrapperImage)=>{                     
                        const id = wrapperImage.children[0].dataset.id;

                        gallery.forEach((item)=>{
                          const image = item.children[0];
                            if(image.dataset.id === id){
                                item.classList.add('gallery__item--select');
                                image.dataset.select ='yes';
                               // this.ids.push(id);
                            }

                        });

                    });
                      
                   }
                }
            
    }

}
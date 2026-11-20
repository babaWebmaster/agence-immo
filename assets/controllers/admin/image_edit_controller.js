import { Controller } from '@hotwired/stimulus';
import { ImageElementFactoryAnnonce } from './ImageElementFactoryAnnonce.js';

export default class extends Controller {

    connect(){

        console.log('CONTROLLER---EDIT');

        let imagesContainer;

        const selects = ImageElementFactoryAnnonce.getExistingSelects();
       

        if(selects.length>0){
            
            this.disconnectControllerImageChoice();
            ImageElementFactoryAnnonce.deleteSelectInit();

            imagesContainer = ImageElementFactoryAnnonce.createGallery('gallery-selected');

            const form = document.getElementById('edit-Annonce-form');

            selects.forEach((select)=>{
                
                const image = ImageElementFactoryAnnonce.createImageWrapperSelected('gallery-selected', select.value, select.url, select.filename);
                 ImageElementFactoryAnnonce.addSelectToForm( select.value,select.filename,'form-select' ,form);

                 imagesContainer.appendChild(image);
            })


            const gallery = document.createElement('div');

            ImageElementFactoryAnnonce.addGallerySelected('field-collection', 'gallery-selected', gallery,form ,imagesContainer);

        }

      

        this.disconnect();

    }

    disconnectControllerImageChoice(){
        const elements = document.querySelectorAll(
             '[data-controller~="admin--image-choice"]'
        );
        
        elements.forEach(element => {
            const controller =
                    this.application.getControllerForElementAndIdentifier(
                        element,
                        'admin--image-choice'
                    );
                   
                    controller?.removeListenerBody();
                });
    }

    disconnect(){
        this.element.removeAttribute('data-controller');
    }



}



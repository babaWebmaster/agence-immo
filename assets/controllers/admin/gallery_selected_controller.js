import { Controller } from '@hotwired/stimulus';
import { ImageElementFactoryAnnonce } from './ImageElementFactoryAnnonce.js';

export default class extends Controller {

    connect() {console.log('garbage');          
        this.deleteImg = this.deleteImg.bind(this);        

        this.element.addEventListener('click', this.deleteImg);      
        
    }

    disconnect() {
        this.element.removeEventListener('click', this.deleteImg);
        
    }

    deleteImg(event) {
        
        const garbage = event.target.closest(
            '.gallery-selected__wrapper__img--delete'
        );

      
        if (!garbage) {
            return;
        }

  
        const wrapper = garbage.closest('.gallery-selected__wrapper');
        const image = wrapper.querySelector('img');

        wrapper.remove();

        ImageElementFactoryAnnonce.removeSelect(
            image.dataset.id,
            '.form-select-custom'
        );
    }

    

}
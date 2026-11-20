import { Controller } from "@hotwired/stimulus";
import { ImageLoader } from "../../js/front/ImageLoader/ImageLoader.js";

export default class extends Controller {

    connect() {
       
        this.handleLoad = this.loadingImgAnnonce.bind(this);

        window.addEventListener('load', this.handleLoad, { once: true });

        // Si l'événement load a déjà eu lieu
        if (document.readyState === 'complete') {
            console.log('image');
            this.loadingImgAnnonce();
        }
    }

    removeLoader(image) {
        image.classList.add('annonces__img--translateNull');

        const loader = image.parentElement.querySelector(
            '.annonces__picture__loader'
        );

        if (!loader) return;

        loader.addEventListener('transitionend', (event) => {
            if (event.propertyName !== 'opacity') return;
            loader.remove();
        }, { once: true });

        loader.classList.add('annonces__picture__loader--exit');
    }

    loadingImgAnnonce() {
        const imageLoader = new ImageLoader(
            '.annonces__img',
            this.isDesktop.bind(this)
        );

        imageLoader.loadAllImages(
            (image) => {
                this.removeLoader(image);
            },
            () => {}
        );
    }

    isDesktop() {
        return window.matchMedia('(min-width: 1200px)').matches;
    }

    disconnect() {
        window.removeEventListener('load', this.handleLoad);
    }
}
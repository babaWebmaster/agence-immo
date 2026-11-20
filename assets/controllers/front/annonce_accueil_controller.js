import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    connect() {

        this.annonces = document.querySelectorAll('.annonces__annonce');

        [...this.annonces].forEach(element => {

            const left = element.querySelector('.annonces__annonce__block__left');
            const right = element.querySelector('.annonces__annonce__block__right');

            const swapPictures = () => {

                const pictureGrande = left.querySelector('.annonces__picture');
                const pictureThumbnail = right.querySelector('.annonces__picture');

                const temp = document.createElement('div');

                pictureGrande.before(temp);
                pictureThumbnail.before(pictureGrande);
                temp.replaceWith(pictureThumbnail);
            };

            right.addEventListener('click', event => {

                if (!event.target.closest('.annonces__img')) {
                    return;
                }

                swapPictures();
            });
        });
    }

    disconnect() {

    }
}
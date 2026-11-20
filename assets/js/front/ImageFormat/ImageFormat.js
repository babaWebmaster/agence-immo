export class ImageFormat {

    constructor(image) {
        this.image = image;
    }

    getFormatFromPicture() {
        const url = this.getCurrentSrc().toLowerCase();

        if (url.includes('.avif')) return 'avif';
        if (url.includes('.webp')) return 'webp';

        return null;
    }

    getCurrentSrc() {
        return this.image.currentSrc;
    }

}
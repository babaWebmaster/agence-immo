export class DeviceManager {

    static getDevice() {

        const ua = navigator.userAgent.toLowerCase();
        const touch = navigator.maxTouchPoints > 0;

        // Smartphone
        const isMobile =
            /iphone|ipod|android.*mobile/.test(ua);

        if (isMobile) {
            return "mobile";
        }


        // Tablette
        const isTablet =
            /ipad|tablet|android/.test(ua)
            || (touch && window.innerWidth < 1200);


        if (isTablet) {
            return "tablet";
        }


        // Ordinateur
        return "desktop";
    }

    static isMobile() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    static isTablet() {
        return window.matchMedia('(max-width: 991px)').matches;
    }

    static isSmBreakPoint(){
        return window.matchMedia('(max-width: 576px)').matches;
    }


    static getOrientation() {

        return window.innerWidth > window.innerHeight
            ? "landscape"
            : "portrait";
    }

}
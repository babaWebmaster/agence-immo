export class ElementPositions {
    constructor(){

    }

    static getElementPosition(elementClass, parentClass) {
        const element = document.querySelector(elementClass);
        const parent = document.querySelector(parentClass);

        const rect = element.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        return {
            left: rect.left - parentRect.left,
            top: rect.top - parentRect.top,
            right: rect.right - parentRect.left,
            bottom: rect.bottom - parentRect.top,
            width: rect.width,
            height: rect.height,
        };
    }


}


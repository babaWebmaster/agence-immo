export class ImageElementFactoryAnnonce {
    static createGallerySelected(selectedItems, classGallery, form){

        const gallery = document.querySelector(`.${classGallery}`);
        let imagesContainer;
        let idsSelected =[];
        let idCurrent = [];
        let idsToRemove ;
        let idsToAdd ;

        const arraySelected = [...selectedItems];

        arraySelected.forEach((item)=>{
            idsSelected.push(item.children[0].dataset.id);
        });
   
        if(gallery){
            imagesContainer = gallery;
            const currentWrappersImg = imagesContainer.children;


             [...currentWrappersImg].forEach(wrapper => {                
                 const id = wrapper.children[0].dataset.id;
                idCurrent.push(id);
            });

          
            idsToRemove = idCurrent.filter(id => !idsSelected.includes(id));
            idsToAdd = idsSelected.filter(id => !idCurrent.includes(id));

            
                 [...currentWrappersImg].forEach(wrapper => {
                    
                    const id = wrapper.children[0].dataset.id;
                    
                    if(idsToRemove.includes(id)){
                        
                        wrapper.remove();             
                    
                        ImageElementFactoryAnnonce.removeSelect(id,'.form-select-custom');}
          

                 });
           
        }
        else{           

            imagesContainer = ImageElementFactoryAnnonce.createGallery(classGallery);

            idsToAdd = idsSelected;
        }
     
       

         arraySelected.forEach(item => {
            const img = item.querySelector('img');
            const id = img.dataset.id;     
             if(!idsToAdd.includes(id)){
                return 
            }

            const image = ImageElementFactoryAnnonce.createImageWrapperSelected( classGallery, id, img.src, img.dataset.name);
          

            imagesContainer.appendChild(image);
                        
            //ImageElementFactoryAnnonce.addSelectToForm( id, img.dataset.name, '#new-Annonce-form', 'form-select', form);
            ImageElementFactoryAnnonce.addSelectToForm( id, img.dataset.name, 'form-select', form);
        });       
    
        
        return imagesContainer;
    }

   static createImageWrapperSelected(classGallery, id, src, name){

         
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add(`${classGallery}__wrapper`);

            const thumbnail = document.createElement('img');

            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add(`${classGallery}__wrapper__img--delete`);
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
             <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg>`;
            button.setAttribute('aria-label', 'Supprimer');

            thumbnail.src = src;
            thumbnail.dataset.id = id;
            thumbnail.dataset.name = name;
            thumbnail.setAttribute('width', '150');
            thumbnail.setAttribute('height', '150');
            thumbnail.classList.add(`${classGallery}__wrapper__img`, 'me-2', 'ms-2', 'mt-2', 'mb-2');

            //imgWrapper.setAttribute('draggable', 'true');

            imgWrapper.appendChild(thumbnail);
            imgWrapper.appendChild(button);

            return imgWrapper;
    }

    static createGallery(classGallery) {
        const imagesContainer = document.createElement('div');

        imagesContainer.classList.add(
            classGallery,
            'd-flex',
            'flex-wrap'
        );

        imagesContainer.dataset.controller = 'admin--gallery-selected admin--drag-and-drop-gallery';

         return imagesContainer;
    }



    static createSelect(index, id, name, classSelect) {
        const select = document.createElement('select');
        
        const option = document.createElement('option');

        select.id = `Annonce_annonceImages_${index}_image`;
        select.name = `Annonce[annonceImages][${index}][image]`;
       // select.dataset.controller = 'admin--image-choice';
        select.classList.add(classSelect, `${classSelect}-custom`);
        select.value = id;
        option.value= id;
        option.textContent = name;
       
        select.appendChild(option);              

        return select;
    }
//ajout de fom
    static addSelectToForm(id, name, /*classForm,*/ classSelect, form){

         const selects = document.querySelectorAll(`.${classSelect}-custom`);
         const index = selects.length;

         ImageElementFactoryAnnonce.reorganizeSelects(`.${classSelect}-custom`);
         const select = ImageElementFactoryAnnonce.createSelect(index, id, name,classSelect)
        /* const form = document.querySelector(classForm);
         
         if(form){
            form.appendChild(select);
         }*/

            if(form){
                form.appendChild(select);
            }


    }

   /* static addSelectToForm(id, name, classForm, classSelect, form){

         const selects = document.querySelectorAll(`.${classSelect}-custom`);
         const index = selects.length;

         ImageElementFactoryAnnonce.reorganizeSelects(`.${classSelect}-custom`);
         const select = ImageElementFactoryAnnonce.createSelect(index, id, name,classSelect)
        // const form = document.querySelector(classForm);
         
         if(form){
            form.appendChild(select);
         }

    }*/

  


    static createImage(image) {
        const img = document.createElement('img');        
        img.src = image.url;
        img.dataset.id = image.id;
        img.dataset.select = 'no';
        img.dataset.name = image.name;
        img.setAttribute('width','150px');
        img.setAttribute('height','150px');     

        return img;
    }



    static removeSelect(imageId, formSelectCustom){
        const selects = document.querySelectorAll(formSelectCustom);

        const found = [...selects].find((select)=>{return select.options[0].value=== imageId});

        if(found){
             found.remove();
             ImageElementFactoryAnnonce.reorganizeSelects('.form-select-custom');
        }
        
       
        
    }

   static sortSelect(formSelectCustom){        
        const selects = [...document.querySelectorAll(formSelectCustom)];       

        selects.sort((a, b) => {
        const indexA = Number(a.name.match(/\[(\d+)\]\[image\]$/)[1]);
        const indexB = Number(b.name.match(/\[(\d+)\]\[image\]$/)[1]);

            return indexA - indexB;
        });
        
        return selects;
   }


   static updateSelectIndexes(selects){

        selects.forEach((select, index) => {
            select.id = `Annonce_annonceImages_${index}_image`;
            select.name = `Annonce[annonceImages][${index}][image]`;
        });

   }

   static buildSelectAfterDrag(formSelectCustom, wrapperImg){
    const selects = document.querySelectorAll(formSelectCustom);   
    const wrappersImg = document.querySelectorAll(wrapperImg);
   
    [...wrappersImg].forEach((element, key)=>{

        const id = element.children[0].dataset.id;
        const name = element.children[0].dataset.name;

        selects[key].id = `Annonce_annonceImages_${key}_image`;
        selects[key].name = `Annonce[annonceImages][${key}][image]`;
        selects[key].options[0].value = id;
        selects[key].options[0].textContent = name;        

    });

        

   }

   static reorganizeSelects(formSelectCustom){
        const selects = ImageElementFactoryAnnonce.sortSelect(formSelectCustom);
        ImageElementFactoryAnnonce.updateSelectIndexes(selects);
   }

   static getExistingSelects() {
     return [...document.querySelectorAll( 'select[name^="Annonce[annonceImages]"][name$="[image]"]')].map(select => {
        const option = select.selectedOptions[0];
        const match = select.name.match(/\[(\d+)\]\[image\]$/);

            return {
                value: select.value,
                name: select.name,
                filename: option.textContent,
                url: option.dataset.thumbnail,
                index: match ? Number(match[1]) : null
                };
         });
    }

    static deleteSelectInit(){
        [...document.querySelectorAll('select[name^="Annonce[annonceImages]"][name$="[image]"]')].forEach(select=>{
            select.remove();
        });

        document.querySelector('.field-collection-item')?.remove();
    }

  /*  static addGallerySelected(collectionField, gallerySelected, gallery){      
        const fieldCollection = document.querySelector(`.${collectionField}`);    

            const selectedItems = gallery.querySelectorAll(
            '.gallery__item--select'
         );

         const galleryThumbnail = ImageElementFactoryAnnonce.createGallerySelected(selectedItems, gallerySelected);

        if(fieldCollection){
            fieldCollection.appendChild(galleryThumbnail);
        }
        
    }*/
//ajout de form
    static addGallerySelected(collectionField, gallerySelected, gallery,form, galleryThumbnail = null) {
            const fieldCollection = document.querySelector(`.${collectionField}`);

            if (!galleryThumbnail) {
                const selectedItems = gallery.querySelectorAll(
                    '.gallery__item--select'
                );

                galleryThumbnail = ImageElementFactoryAnnonce.createGallerySelected(
                    selectedItems,
                    gallerySelected,
                    form                                        
                );
            }

            if (fieldCollection) {
                fieldCollection.appendChild(galleryThumbnail);
            }
        }

  


}
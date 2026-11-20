export class FormAnnonce{

    constructor(form){
        this.form = document.querySelector(form);
       
        this.labelDays = this.form.querySelectorAll('.form__day');
        this.labelHours = this.form.querySelectorAll('.form__hours');
        this.formDays = this.form.querySelector('.form__days');
        this.addObserver();
    }

     
    addFakeCheckbox() {
        this.labelDays.forEach(container => {
            const labelDays = container.querySelector('label');
            labelDays.append(this.createFakeCheck('form__checkbox-fake'));
        });

        this.labelHours.forEach(container => {
            const labelHours = container.querySelector('label');
            labelHours.append(this.createFakeCheck('form__checkbox-fake'));
            
        })

    }

    createFakeCheck(addClass){
        const check = document.createElement('span');
        check.classList.add(addClass);
        return check;
    }


    heightAvailability(){
        const height = this.formDays.offsetHeight;
        this.formDays.style.setProperty('--day-height-open', `${height}px`);
        this.formDays.style.setProperty('--day-height', `${0}px`);

    }

    showAvailability(){
        const title = document.querySelector('.form__title-days');

        title.addEventListener('click',()=>{
            this.formDays.classList.toggle('form__days--open');
            const isOpen = title.getAttribute('aria-expanded') === 'true';
            title.setAttribute('aria-expanded', String(!isOpen));            
        })
    }


    selectedDays(){
        const days = document.querySelectorAll('.form__days-hours');

        days.forEach((day)=>{
            const checkbox = day.querySelector('.form__checkbox-day');

            checkbox.addEventListener(('change'),()=>{
                  const hours =day.querySelectorAll('.form__checkbox-hour');

                  if (checkbox.checked) {
                    this.modifyCheckedHours(hours, true);
           
                } else {
                      this.modifyCheckedHours(hours, false);
                    
                }
            });

        })
    }

    selectedHours(){
         const hours =document.querySelectorAll('.form__checkbox-hour');

         hours.forEach((hour)=>{
            hour.addEventListener('change',()=>{
                const parent = hour.parentElement.parentElement;

                const checked = parent.querySelectorAll('.form__checkbox-hour:checked');

                if(checked.length === 0){
                    parent.querySelector('.form__checkbox').checked = false;                    
                }

                if(checked.length >=1){
                     parent.querySelector('.form__checkbox').checked = true;   
                }

            })
         });

    }

    modifyCheckedHours(hours, state = true){
        hours.forEach((hour)=>{
            hour.checked = state;
        });
    }

       addObserver(){
    const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
                if (entry.isIntersecting) {
                  this.addFakeCheckbox();
                    this.heightAvailability();
                    this.showAvailability();
                    this.selectedDays();
                    this.selectedHours();
                }
              });
                },{
             rootMargin: '200px 0px'
            });

        observer.observe(document.querySelector('.form'));
    }

 



}
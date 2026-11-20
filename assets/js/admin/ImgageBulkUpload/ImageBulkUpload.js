export class ImageBulkUpload{
    constructor(message){
        this.uploadButton = document.querySelector('[data-action-name="uploadMultiple"]');
        if(!this.uploadButton) return;
        this.createInputFileMultiple();
        this.changeInputMultiple();
        this.createOrder(message);
    }


    createInputFileMultiple(){
       this.inputMultiple = document.createElement('input');
       this.inputMultiple.type = 'file';
       this.inputMultiple.name = 'multiUpload[]';
       this.inputMultiple.accept = 'image/*';
       this.inputMultiple.multiple = true;
       this.inputMultiple.style.display = 'none';

       this.uploadButton.parentNode.insertBefore(this.inputMultiple,this.uploadButton);

       this.uploadButton.addEventListener('click',(e) =>{
            e.preventDefault();
            this.inputMultiple.click();
       });
    }

    changeInputMultiple(){
        this.inputMultiple.addEventListener('change',()=>{


            this.uploadFile(this.inputMultiple.files);

        });
    }

    async uploadFile(files) {

    let completed = 0;
    const total = files.length;

    if (!files.length) return;

    if(total > 5){
         this.createProgressBar('Veuillez ne pas upload plus de 5 fichiers.');
         this.closeWarning();
         return;
    }

     this.createGauge();

    try {
        for (const file of files) {

            try {

                await this.sendFile(file);
                completed++;

                const percent = (completed / total) * 100;
              //  this.updateProgress(percent);
                this.updateGauge(percent);
                } catch (error) {
                    console.error(`Erreur avec ${file.name}`, error);
                }
             }
        } finally {
            setTimeout(()=>{this.removeProgressBar()},1000);
            }
    }

    async sendFile(file) {

            const formData = new FormData();
            formData.append('multiUpload[]', file);
            formData.append('_token', this.uploadButton.dataset.token);

            const response = await fetch('/admin-baba-5487894613734/back-office/images/bulk-upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l’upload');
            }

        return response.json();
    }


     createProgressBar(text) {
        // Créer le conteneur
        this.containerBar = document.createElement('div');
        this.containerBar.classList.add('progress-bar');

        // Créer la barre
        this.warning = document.createElement('div');
        this.warning.classList.add('progress-bar__warning');
        this.warning.innerHTML = text;
        //créer close
        this.close = document.createElement('div');
        this.close.classList.add('progress-bar__close');
        this.close.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"/>
            </svg>
            `;
        this.warning.append(this.close);
        this.containerBar.appendChild(this.warning);
        // Ajouter au body
        document.body.appendChild(this.containerBar);
    }

    updateProgress(percent) {

            if (this.bar && this.text) {
                this.bar.style.width = percent + '%';
                this.text.textContent = percent.toFixed(0) + '%';
            }
    }

    removeProgressBar(){
        if(!this.containerBar) return;
        this.containerBar.remove();
    }

    createGauge() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 160;
        this.canvas.height = 160;
        this.canvas.classList.add('progress-bar__gauge');

        this.ctx = this.canvas.getContext('2d');

        this.containerBar = document.createElement('div');
        this.containerBar.classList.add('progress-bar');
        this.containerBar.appendChild(this.canvas);

        document.body.appendChild(this.containerBar);
        this.createBackgroundArc(80, 65);

        this.updateGauge(0);
    }

    updateGauge(percent) {
            const center = 80;
            const radius = 65;

            this.createBackgroundArc(center, radius);

            // Progression
            this.ctx.beginPath();
            this.ctx.arc(
                center,
                center,
                radius,
                -Math.PI / 2,
                -Math.PI / 2 + (Math.PI * 2 * percent / 100)
            );

            this.ctx.strokeStyle = '#33F0E0';
            this.ctx.lineWidth = 10;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Pourcentage
            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 26px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${Math.round(percent)}%`, center, center);
    }

    createBackgroundArc(center, radius) {
        this.ctx.clearRect(0, 0, 160, 160);
        this.ctx.beginPath();
        this.ctx.arc(center, center, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#e0f5f3';
        this.ctx.lineWidth = 10;
        this.ctx.stroke();
    }

    closeWarning(){
        if(!this.close) return;

        this.close.addEventListener('click',()=>{
            this.containerBar.classList.add('progress-bar--opacity-null');
             setTimeout(()=>{this.containerBar.remove()},300);

        });

    }

    createOrder(message){
        const container = document.querySelector('.page-actions');

        if(!container) return;
        container.style.display ='flex';
        container.style.flexDirection= 'column';
        const div = document.createElement('span');
        div.innerHTML = message;

        container.append(div);
    }


}
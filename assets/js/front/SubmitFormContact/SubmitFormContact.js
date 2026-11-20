export class SubmitFormContact{
    constructor(form){        
        this.form = document.querySelector(form);
         this.abortController = null;
            }

    async submitForm({ responseType = 'json', body = {} } = {}) {

             if(!this.form) return;

             // Annule le précédent fetch s'il est encore en cours
                this.abortController?.abort();

                this.abortController = new AbortController();


            this.beforeSubmit();         

            try {

                const formData = new FormData(this.form);

                Object.entries(body).forEach(([key, value]) => {
                    formData.append(key, value);
                });

               
                const response = await fetch(this.form.action, {
                    method: this.form.method,
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    signal: this.abortController.signal
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }

                const data = await response[responseType]();

                
                this.onSuccess(data);

                return data;

            } catch (error) {
                this.onError(error);
                throw error;

            } finally {
                this.afterSubmit();
            }
    }
   

    beforeSubmit(){

    }

    onError(){

    }

    afterSubmit(){

    }

    onSuccess(){

    }

}
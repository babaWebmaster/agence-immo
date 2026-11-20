export function search({
    form,
    url = '/recherche-annonces',
    page = 1,
    responseType = 'text',
    onStart = () => {},
    onSuccess = data => console.log(data),
    signal
} = {}) {
    onStart();

    const formData = new FormData(form);
    formData.set('annonce_search[page]', page);

    return fetch(url, {
        method: 'POST',
        body: formData,
        signal
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        return responseType === 'json'
            ? response.json()
            : response.text();
    })
    .then(data => onSuccess(data))
    .catch(error => {
        if (error.name !== 'AbortError') {
            console.error('Erreur fetch', error);
        }
    });
}
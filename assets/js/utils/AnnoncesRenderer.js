 export function loadAnnonce(data) {
            const annonces = document.querySelector('.annonces');
            annonces.classList.add('annonces--fadeOut');


            setTimeout(() => {
                annonces.innerHTML = data.annonces;
                annonces.classList.add('annonces--padding');
                annonces.classList.remove('annonces--fadeOut');
                
            }, 500);
           
    }

  export function scrollToAnnonces(offset = 0) {
    const annonces = document.querySelector('.annonces');

    window.scrollTo({
        top: annonces.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
    });
}
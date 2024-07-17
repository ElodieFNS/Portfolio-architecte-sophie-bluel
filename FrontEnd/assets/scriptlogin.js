function isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== null;
}


document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname; //permet de savoir sur quelle page l'utilisateur se trouve actuellement et de le stocker
    const loginLink = document.querySelector('.login');

    if (currentPage.includes('login.html')) {
        loginLink.classList.add('active');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event){
        event.preventDefault(); // empeche l'envoi par défaut du formulaire

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const apiUrlLogin = 'http://localhost:5678/api/users/login';

        const data = { //envoies de données à l'api sous forme json
            email: email,
            password: password
        };

        const requestOptions = { //option pour la requete fetch
            method: 'POST', //méthode post pour envoyer données
            headers: {
                'Content-Type': 'application/json' //défini que tu JSON est envoyé
            },
            body: JSON.stringify(data) //converti l'objet "data" en JSION pour l'envoie
        };

        fetch(apiUrlLogin, requestOptions) //envoie requete POST
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de connexion');
            }
            return response.json(); // Conversion de la réponse en JSON
        })
        .then(data => { //traite les données JSON renvoyées par l'API après une connexion réussie
            localStorage.setItem('token', data.token); //stock token d'authentificztion dans "localStorage"
            console.log('Connexion réussie');
            window.location.href = '/Portfolio-architecte-sophie-bluel/FrontEnd/index.html';
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('error-message').textContent = 'Identifiants incorrects. Veuillez réessayer.';
        });

    });
});
function isAuthenticated() { //utilise l'API localStorage pour essayer de récupérer une valeur associée à la clé 'token'
    const token = localStorage.getItem('token');
    return token !== null;
}

//mettre en gras le login
document.addEventListener('DOMContentLoaded', function() { //écouteur d'événement qui exécute une fonction lorsque le DOM est entièrement chargé
    const currentPage = window.location.pathname; //permet de savoir sur quelle page l'utilisateur se trouve actuellement et de le stocker
    const loginLink = document.querySelector('.login');

    if (currentPage.includes('login.html')) {
        loginLink.classList.add('active'); //met en gras la police
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event){
        event.preventDefault(); // empeche l'envoi par défaut du formulaire

        const email = document.getElementById('email').value; //accéder à la valeur d'un élément de formulaire, ici input
        const password = document.getElementById('password').value;

        const apiUrlLogin = 'http://localhost:5678/api/users/login';

        const data = { //envoies de données à l'api sous forme json
            email: email,
            password: password
        };

        const requestOptions = { //option pour la requete fetch
            method: 'POST', //méthode post pour envoyer données au serveur
            headers: {
                'Content-Type': 'application/json' //défini que contenu de la requête est au format JSON
            },
            body: JSON.stringify(data) //converti l'objet "data" en JSON pour l'envoie dans le corps de la requête
        };

        fetch(apiUrlLogin, requestOptions) //envoie requete POST à l'url apiUrlLogin
        .then(response => { //Vérifie si la réponse est correcte. Si oui, convertit la réponse en JSON
            if (!response.ok) {
                throw new Error('Erreur de connexion');
            }
            return response.json(); // Conversion de la réponse en JSON
        })
        .then(data => { //traite les données JSON renvoyées par l'API après une connexion réussie
            localStorage.setItem('token', data.token); //stock token d'authentificztion dans "localStorage"
            console.log('Connexion réussie');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('error-message').textContent = 'Identifiants incorrects. Veuillez réessayer.';
        });

    });
});
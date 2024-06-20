// URL de l'API à partir de laquelle récupérer les données
const apiUrlWorks = 'http://localhost:5678/api/works';

// Fonction pour créer et ajouter des balises d'image dans la galerie
function createImageElements(data) {
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = ''; // Efface le contenu précédent de la galerie

    data.forEach(item => {
        // Création de l'élément <img> pour chaque image
        let img = document.createElement("img");
        img.src = item.imageUrl;
        img.alt = item.title; // Texte alternatif pour l'accessibilité
        img.classList.add("image");

        // Création de la légende pour chaque image
        let figcaption = document.createElement("figcaption");
        figcaption.textContent = item.title;
        figcaption.classList.add("title");

        // Création du conteneur <figure> pour chaque image et légende
        let figure = document.createElement("figure");
        figure.classList.add("figure");
        figure.appendChild(img);
        figure.appendChild(figcaption);

        // Ajout du <figure> à la galerie
        gallery.appendChild(figure);
    });
}

// Fonction pour ajouter dynamiquement des boutons de filtre basés sur les catégories disponibles
function addFilterButtons(data) {
    // Sélectionne l'élément <h2> dans la section avec l'id "portfolio"
    let h2 = document.querySelector("#portfolio h2");

    // Crée un conteneur <div> pour les filtres
    let filtersDiv = document.createElement("div");
    filtersDiv.classList.add("filters");

    // Tableau des catégories uniques à partir des données
    const categories = Array.from(new Set(data.map(item => item.category.name)));

    // Crée un bouton "Tous" pour afficher toutes les images
    let allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-button", "active");
    allButton.setAttribute("data-filter", "all");
    filtersDiv.appendChild(allButton);

    // Crée des boutons pour chaque catégorie unique
    categories.forEach(category => {
        let button = document.createElement("button");
        button.textContent = category;
        button.classList.add("filter-button");
        button.setAttribute("data-filter", category.toLowerCase()); // Utilisez le nom de la catégorie en minuscules comme filtre
        filtersDiv.appendChild(button);
    });

    // Insère les boutons de filtre après l'élément <h2>
    h2.parentNode.insertBefore(filtersDiv, h2.nextSibling);

    function activateButton(button) {
        // Désactive tous les boutons
        document.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
        // Active le bouton cliqué
        button.classList.add("active");
    }

    // Gestionnaire d'événements pour les boutons de filtre
    filtersDiv.addEventListener("click", (event) => {
        if (event.target.classList.contains("filter-button")) {
            const filter = event.target.getAttribute("data-filter");
            if (filter === "all") {
                createImageElements(data); // Affiche toutes les images
            } else {
                const filteredData = data.filter(item => item.category.name.toLowerCase() === filter);
                createImageElements(filteredData); // Affiche les images filtrées par catégorie
            }
            activateButton(event.target);
        }
    });
    allButton.click();
}

// Fonction asynchrone pour récupérer les données de l'API et initialiser l'affichage
async function fetchData() {
    try {
        // Effectue une requête GET à l'API
        const response = await fetch(apiUrlWorks);

        // Vérifie si la requête est réussie
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        // Convertit la réponse en format JSON
        let data = await response.json();

        // Vérifie s'il y a des données à afficher
        if (data.length > 0) {
            createImageElements(data); // Affiche toutes les images par défaut
            addFilterButtons(data); // Ajoute les boutons de filtre basés sur les catégories
        } else {
            console.log('Aucune donnée disponible');
        }
    } catch (error) {
        console.error('Erreur :', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname; //permet de savoir sur quelle page l'utilisateur se trouve actuellement et de le stocker
    const loginLink = document.querySelector('.login');

    if (currentPage.includes('login.html')) {
        loginLink.classList.add('active');
    }
});


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
        //window.location.href = '/dashboard.html';
    })
    .catch(error => {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = 'Identifiants incorrects. Veuillez réessayer.';
    });

});
// Appelle la fonction fetchData pour démarrer le processus
fetchData();



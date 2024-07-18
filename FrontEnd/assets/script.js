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
    let buttonModal = document.getElementById("butonModal");

    // Crée un conteneur <div> pour les filtres
    let filtersDiv = document.createElement("div");
    filtersDiv.classList.add("filters");

    // Insère le conteneur de filtres après l'élément buttonModal
    buttonModal.insertAdjacentElement('afterend', filtersDiv);

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

// Fonction pour gérer la déconnexion
function logout() {
    console.log('Déconnexion en cours...');
    localStorage.removeItem('token'); // Supprime le token
    window.location.href = '/Portfolio-architecte-sophie-bluel/FrontEnd/index.html'; // Redirige vers la page d'accueil
}

document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si l'utilisateur est authentifié avant d'afficher les éléments de la modale
    if (isAuthenticated()) {
        const updateLogout = document.getElementById('login');
        updateLogout.textContent = 'logout'; // Change le texte en 'logout'

        updateLogout.addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le comportement par défaut du lien
            logout(); // Gère la déconnexion
        });

        const updateHeader = document.getElementById('header');
        updateHeader.classList.add('headerEditionMod');
        const updateBody = document.getElementById('body');
        updateBody.classList.add('bodyEditionMod');
        const updateMain = document.getElementById('main');
        updateMain.classList.add('mainEditionMod');
        const upadteTitle = document.getElementById('band');
        upadteTitle.classList.add('bandEditionMod');


    };
});
// Fonction pour obtenir les données de l'API et afficher les photos dans la modale
document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si l'utilisateur est authentifié avant d'afficher les éléments de la modale
    if (isAuthenticated()) {
        // Récupérer les éléments de la modale de galerie
        const openModalButton = document.getElementById('openModalButton');
        const myModal = document.getElementById('myModal');
        const closeModalButton = myModal.querySelector('.close');
        const addPhotoBtn = document.getElementById('addPhotoBtn');

        // Récupérer les éléments de la modale de téléchargement
        const uploadModal = document.getElementById('uploadModal');
        const closeUploadModalBtn = uploadModal.querySelector('.close');
        const uploadFileInput = document.getElementById('uploadFileInput'); 
        const uploadTitleInput = document.getElementById('uploadTitleInput'); 
        const uploadCategorySelect = document.getElementById('uploadCategorySelect'); 
        const uploadFileBtn = document.getElementById('uploadFileBtn');

       

        // Fonction pour ouvrir la modale de galerie
        function openModal() {
            myModal.style.display = "block";
            fetchPhotos(); // Charger les photos lorsque la modale est ouverte
        }

        // Fonction pour fermer la modale de galerie
        function closeModal() {
            myModal.style.display = "none";
        }

        // Ouvrir la modale au clic sur le bouton
        openModalButton.addEventListener('click', openModal);

        // Fermer la modale au clic sur le <span> de fermeture
        closeModalButton.addEventListener('click', closeModal);

        // Fermer la modale au clic à l'extérieur de celle-ci
        window.addEventListener('click', function(event) {
            if (event.target === myModal) {
                closeModal();
            }
        });

        // ouverture modale téléchargement
        addPhotoBtn.onclick = function() {
            uploadModal.style.display = 'block';
        }

        // fermeture modale téléchargement
        closeUploadModalBtn.onclick = function() {
            uploadModal.style.display = 'none';
        }

        // Fermer la modale au clic à l'extérieur de celle-ci
        window.onclick = function(event) {
            if (event.target == myModal) {
                myModal.style.display = 'none';
            } else if (event.target == uploadModal) { 
                uploadModal.style.display = 'none';
            }
        }

        // gérer le chargement du fichier et l'envoi à l'API
        uploadFileBtn.onclick = function() { //quand clique sur le bouton déclenche  la fonction
            const imageUrl = uploadFileInput.files[0];
            const title = uploadTitleInput.value;
            const category = uploadCategorySelect.value;
        
            if (imageUrl && title && category) { //définis que les variables ne sont pas vides
                const formData = new FormData(); //nouvel objet FormData qui est utilisé pour construire des paires clé-valeur à envoyer dans la requête HTTP
                formData.append('image', imageUrl);
                formData.append('title', title);
                formData.append('category', category);
        
                fetch(apiUrlWorks, { //requête POST vers l'URL
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur HTTP ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    uploadModal.style.display = 'none'; // Fermer la modale après succès
                    fetchPhotos(); // Met à jour la galerie après l'ajout d'une nouvelle image
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi de la requête:', error);
                    alert('Erreur lors de l\'envoi de la photo. Veuillez réessayer.');
                });
            } else {
                alert('Veuillez remplir tous les champs et sélectionner un fichier');
            }
        }

        // Fonction pour vider la galerie de la modale
        function clearModalGallery() {
            const gallery = document.getElementById('modalGallery');
            gallery.innerHTML = ''; // Efface le contenu précédent de la galerie
        }

        // Fonction pour créer les éléments d'image et les ajouter à la galerie de la modale
        function createModalImageElements(data) {
            clearModalGallery();
            const gallery = document.getElementById('modalGallery');

            data.forEach(item => {
                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.title;

                const figcaption = document.createElement('figcaption');
                figcaption.textContent = item.title;

                const figure = document.createElement('figure');
                figure.appendChild(img);
                figure.appendChild(figcaption);

                const deleteButton = document.createElement('button');
                deleteButton.onclick = () => deletePhoto(item.id);
                const icon = document.createElement('i');
                icon.classList.add('fa-solid', 'fa-trash-can', 'butonDelete');
                deleteButton.appendChild(icon);

                figure.appendChild(deleteButton);
                gallery.appendChild(figure);
            });
        }

        // Fonction pour obtenir les données de l'API et afficher les photos dans la modale
        function fetchPhotos() {
            fetch(apiUrlWorks)
                .then(response => response.json())
                .then(data => {
                    createModalImageElements(data);
                })
                .catch(error => {
                    console.error('Erreur:', error);
                });
        }

        // Fonction pour supprimer une photo
        function deletePhoto(photoId) {
            const apiUrl = `http://localhost:5678/api/works/${photoId}`;

            fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(() => {
                fetchPhotos(); // Met à jour la galerie après la suppression
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
        }
    } else {
        // Cache les boutons et autres éléments si l'utilisateur n'est pas authentifié
        document.getElementById('openModalButton').style.display = 'none';
        document.getElementById('addPhotoBtn').style.display = 'none';
        document.getElementById('editionDiv').style.display = 'none';
    }

    // Appel initial pour récupérer et afficher les données
    fetchData();
});
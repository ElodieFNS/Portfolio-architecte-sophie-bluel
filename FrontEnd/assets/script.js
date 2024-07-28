// URL de l'API à partir de laquelle récupérer les données
const apiUrlWorks = 'http://localhost:5678/api/works';

// Fonction asynchrone pour récupérer les données de l'API et initialiser l'affichage
async function fetchData() {
    try {
        // Effectue une requête GET à l'API
        const response = await fetch(apiUrlWorks); // requête HTTP GET à l'URL

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

// Fonction pour créer et ajouter des balises d'image dans la galerie
function createImageElements(data) {
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = ''; // Efface le contenu précédent de la galerie

    data.forEach(item => {
        // Création de l'élément <img> pour chaque image
        let img = document.createElement("img");
        img.src = item.imageUrl; //assigner une url
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
    let buttonModal = document.getElementById("butonModal"); //ligne 94 html

    // Crée un conteneur <div> pour les filtres
    let filtersDiv = document.createElement("div");
    filtersDiv.classList.add("filters");

    // Insère le conteneur de filtres après l'élément buttonModal
    buttonModal.insertAdjacentElement('afterend', filtersDiv);

    //map = créer tableau des noms des categs à partir du tableau data, set = créer un ensemble des noms pour éliminer doublons
    //arrayw.from = convertir cet ensemble en un tableau
    //résultat est un tableau "categories" contenant des noms uniques venant du tableau "data"
    const categories = Array.from(new Set(data.map(item => item.category.name))); 


    // Crée un bouton "Tous" pour afficher toutes les images
    let allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-button", "active");
    allButton.setAttribute("data-filter", "all"); //data-filter = attibut qui permet de stocker des informations
    filtersDiv.appendChild(allButton);

    // Crée des boutons pour chaque catégorie unique
    categories.forEach(category => {
        let button = document.createElement("button");
        button.textContent = category;
        button.classList.add("filter-button");
        button.setAttribute("data-filter", category.toLowerCase()); // Utilisez le nom de la catégorie en minuscules comme filtre
        filtersDiv.appendChild(button);
    });

    //fct pour changer le style du bouton actif ou non
    function activateButton(button) { //fct qui prend pour arg le bouton activé
        //Désactive tous les boutons avec la classe filter-button
        document.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
        // Active le bouton cliqué
        button.classList.add("active");
    }

    // Gestionnaire d'événements pour les boutons de filtre
    filtersDiv.addEventListener("click", (event) => { //creation d'une fonction fléchée pour gérer l'événement click
        if (event.target.classList.contains("filter-button")) {
            const filter = event.target.getAttribute("data-filter"); //récupère la valeur de l'attribut data-filter, détermine quel filtre doit etre appliqué
            if (filter === "all") {
                createImageElements(data); // Affiche toutes les images
            } else {
                const filteredData = data.filter(item => item.category.name.toLowerCase() === filter); //créer un tableau avec les photos qui ont le filtre souhaité
                createImageElements(filteredData); // Affiche les images filtrées par catégorie
            }
            activateButton(event.target); //fonction désactive tous les autres boutons et active visuellement le bouton cliqué
        }
    });
    allButton.click(); //affiche autimatiquement toutes les images au début
}


// Fonction pour gérer la déconnexion
function logout() {
    console.log('Déconnexion en cours...');
    localStorage.removeItem('token'); // Supprime le token
    window.location.href = 'index.html'; // Redirige vers la page d'accueil
}

//fonction pour verifier la connexion de l'utilisateur
document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si l'utilisateur est authentifié avant d'afficher les éléments de la modale
    if (isAuthenticated()) {
        const updateLogout = document.getElementById('login');
        updateLogout.textContent = 'logout'; // Change le texte en 'logout'

        updateLogout.addEventListener('click', function(event) { //écouteur d'évènement -> function(event) exécutée quand clic est détecté sur updateLogout
            event.preventDefault(); // Empêche le comportement par défaut du lien
            logout(); // appelle la fonction logout
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

// Fonction pour obtenir les données de l'API et afficher les photos dans la modale et les upload
document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si l'utilisateur est authentifié avant d'afficher les éléments de la modale
    if (isAuthenticated()) {
        // Récupérer les éléments de la modale de galerie
        const openModalButton = document.getElementById('openModalButton'); //l 95
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
        const backToGallery = document.getElementById('backToGallery');

        // Fonction pour obtenir les données de l'API et afficher les photos dans la modale
        function fetchPhotos() { 
            fetch(apiUrlWorks) //fetch : Envoie une requête HTTP GET à l'URL spécifiée par apiUrlWorks
                .then(response => response.json()) //Convertit la réponse HTTP en format JSON.
                .then(data => {
                    createModalImageElements(data); // Utilise les données JSON pour créer des éléments d'image dans un modal en appelant createModalImageElements
                })
                .catch(error => {
                    console.error('Erreur:', error);
                });
        }
       

        // Fonction pour ouvrir la modale de galerie
        function openModal() {
            myModal.style.display = "block";
            uploadModal.style.display = "none";
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
            myModal.style.display = 'none';

        }

        // fermeture modale téléchargement
        closeUploadModalBtn.onclick = function() {
            uploadModal.style.display = 'none';
        }

        backToGallery.onclick = function() {
            uploadModal.style.display = 'none';
            myModal.style.display = 'block';
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
            const imageUrl = uploadFileInput.files[0]; //Récupère le premier fichier sélectionné par l'utilisateur dans un élément <input type="file">
            const title = uploadTitleInput.value; //récupère le texte rentré par l'utilisateur
            const category = uploadCategorySelect.value;
        
            if (imageUrl && title && category) { //Vérifie que tous les champs requis sont remplis
                const formData = new FormData(); //Crée un objet FormData pour envoyer les données via une requête POST
                formData.append('image', imageUrl); //FormData utilisé pour construire paires clé-valeur pour les données de formulaire, méthodes append ajoutent les données à l'objet formData
                formData.append('title', title);
                formData.append('category', category);
        
                fetch(apiUrlWorks, { //envoie requête POST vers l'URL avec le jeton d'authentification
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
                //Vérifie si la réponse est correcte, convertit la réponse en JSON, et met à jour l'interface utilisateur en cas de succès
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

        //écouteur d'évènement pour élément change, événement se déclenche lorsque l'utilisateur sélectionne un fichier
        document.getElementById('uploadFileInput').addEventListener('change', function() { 
        var file = this.files[0]; //récupèere 1er fichier selectionné
        var preview = document.getElementById('previewImage');
        var icon = document.querySelector('.iconDownlodImage');
        var label = document.querySelector('.custom-file-upload');
        var sizeText = document.getElementById('sizeUpload');
        var sizeBox = document.getElementById('uploadFile');
        var reader = new FileReader(); //FileReader = API JavaScript intégrée qui permet aux applications web de lire le contenu des fichiers stockés sur l'ordinateur de l'utilisateur.

        reader.onloadend = function() { //Définit une fonction qui s'exécute lorsque la lecture du fichier est terminée
            preview.src = reader.result; //Définit la source de l'image d'aperçu avec le résultat de la lecture du fichier
            preview.style.display = 'block';
            sizeBox.classList.add('uploadFileImg');
            icon.classList.add('hidden');
            label.classList.add('hidden');
            sizeText.classList.add('hidden');
        };

        if (file) { // Si un fichier est sélectionné, le lecteur de fichier commence à lire le fichier et le convertit en URL de données
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            preview.style.display = 'none';
            icon.classList.remove('hidden');
            label.classList.remove('hidden');
            sizeText.classList.remove('hidden');
        }
    });

    // Permettre de cliquer sur l'image pour réouvrir le sélecteur de fichiers
    document.getElementById('previewImage').addEventListener('click', function() {
        document.getElementById('uploadFileInput').click();
    });

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

        

        
        // Fonction pour supprimer une photo
        function deletePhoto(id) {
            const apiUrl = `http://localhost:5678/api/works/${id}`;

            fetch(apiUrl, { //fonction fetch pour envoyer une requête HTTP à l'URL apiUrl
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
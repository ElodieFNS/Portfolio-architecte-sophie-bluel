// URL de l'API à partir de laquelle récupérer les données
const apiUrlWorks = 'http://localhost:5678/api/works';

// Fonction pour vider la galerie
function clearGallery() {
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = ''; // Efface le contenu précédent de la galerie
}

// Fonction pour créer un élément <img>
function createImageElement(imageUrl, title) {
    let img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title; // Texte alternatif pour l'accessibilité
    img.classList.add("image");
    return img;
}

// Fonction pour créer un élément figcaption
function createFigcaptionElement(title) {
    let figcaption = document.createElement("figcaption");
    figcaption.textContent = title;
    figcaption.classList.add("title");
    return figcaption;
}

// Fonction pour créer un élément <figure> contenant l'image et la légende
function createFigureElement(img, figcaption) {
    let figure = document.createElement("figure");
    figure.classList.add("figure");
    figure.appendChild(img);
    figure.appendChild(figcaption);
    return figure;
}

// Fonction principale pour créer les éléments d'image et les ajouter à la galerie
function createImageElements(data) {
    clearGallery();
    let gallery = document.querySelector(".gallery");

    data.forEach(item => {
        let img = createImageElement(item.imageUrl, item.title);
        let figcaption = createFigcaptionElement(item.title);
        let figure = createFigureElement(img, figcaption);
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

// Fonction pour obtenir les données de l'API et afficher les photos dans la modale
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour ouvrir la modale
    function openModal() {
        document.getElementById('myModal').style.display = "block";
        fetchPhotos(); // Charger les photos lorsque la modale est ouverte
    }

    // Fonction pour fermer la modale
    function closeModal() {
        document.getElementById('myModal').style.display = "none";
    }

    // Ouvrir la modale au clic sur le bouton
    document.getElementById('openModalButton').addEventListener('click', openModal);

    // Fermer la modale au clic sur le <span> de fermeture
    document.querySelector('.close').addEventListener('click', closeModal);

    // Fermer la modale au clic à l'extérieur de celle-ci
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('myModal')) {
            closeModal();
        }
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
            deleteButton.textContent = 'Supprimer';
            deleteButton.onclick = () => deletePhoto(item.id);

            figure.appendChild(deleteButton);
            gallery.appendChild(figure);
        });
    }

    // Fonction pour obtenir les données de l'API et afficher les photos dans la modale
    function fetchPhotos() {
        const apiUrl = 'http://localhost:5678/api/works'; // Remplacez par l'URL de votre API

        fetch(apiUrl)
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
});





/*document.addEventListener('DOMContentLoaded', function() {

    // Fonction pour ouvrir la modale d'ajout de photo
    function openAddModal() {
        document.getElementById('addModal').style.display = "block";
    }

    // Fonction pour fermer la modale d'ajout de photo
    function closeAddModal() {
        document.getElementById('addModal').style.display = "none";
    }

    // Ouvrir la modale d'ajout de photo au clic sur le bouton "Ajouter une Photo"
    document.getElementById('addPhotoButton').addEventListener('click', openAddModal);

    // Fermer la modale d'ajout de photo au clic sur le <span> de fermeture
    document.querySelector('.close-add-modal').addEventListener('click', closeAddModal);

    // Fermer la modale d'ajout de photo au clic à l'extérieur de celle-ci
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('addModal')) {
            closeAddModal();
        }
    });

    // Soumission du formulaire pour ajouter une nouvelle photo
    document.getElementById('newPhotoForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = document.getElementById('newPhotoTitle').value;
        const imageUrl = document.getElementById('newPhotoUrl').files[0];
        const category = document.getElementById('newPhotoCategory').value;
        const apiUrl = 'http://localhost:5678/api/works';

        const formData = new FormData();
        formData.append('title', title);
        formData.append('imageUrl', imageUrl);
        formData.append('category', category);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Photo ajoutée avec succès:', data);
            fetchPhotos();
            closeAddModal(); // Fermer la modale d'ajout après succès
        } catch (error) {
            console.error('Erreur:', error);
        }
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
            const img = createImageElement(item.imageUrl, item.title);
            const figcaption = createFigcaptionElement(item.title);
            const figure = createFigureElement(img, figcaption);
            gallery.appendChild(figure);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.onclick = () => deletePhoto(item.id);

            figure.appendChild(deleteButton);
        });
    }

    // Fonction pour obtenir les données de l'API et afficher les photos dans la modale principale
    function fetchPhotos() {
        const apiUrl = 'http://localhost:5678/api/works';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                createModalImageElements(data);

                // Extraire et mettre à jour les catégories
                const categories = extractCategoriesFromWorks(data);
                updateCategorySelect(categories);
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
    }

    // Appeler fetchPhotos pour charger les photos quand l'utilisateur est connecté et afficher la modale principale
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('myModal').style.display = 'block';
        fetchPhotos();
    }
});
*/

// Appelle la fonction fetchData pour démarrer le processus
fetchData();



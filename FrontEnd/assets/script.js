const apiUrl = 'http://localhost:5678/api/works';


function creatBalises(data){
  let gallery = document.querySelector(".gallery");

  for (i=0;  i<data.length; i++){
    let img = document.createElement("img");
    img.src = data[i].imageUrl;
    img.alt = data[i].title;
    img.classList.add("image");

    let figcaption = document.createElement("figcaption");
    figcaption.textContent = data[i].title;
    figcaption.classList.add("title");

    let figure = document.createElement("figure");
    figure.classList.add("figure");
    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);

  }
}

async function fetchData(){ //fonction asynchrone
  try{
    const response = await fetch(apiUrl); //requete get à l'api
    
    if (!response.ok) { //vérifie que la requette fonctionne
      throw new Error('Erreur lors de la récupération des données');
    }

    let data = await response.json(); //Convertit la réponse en un format JSON, stocké dans data

    if (data.length > 0){
      creatBalises(data); // Appel de la fonction creatBalises avec les données
    } else {
      console.log('Aucune donnée disponible');
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
}

fetchData()
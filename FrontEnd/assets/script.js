const apiUrl = 'http://localhost:5678/api/works';
const response = await fetch(apiUrl); //requete get à l'api
let data = await response.json();

function creatBaslises(){
  let gallery = document.querySelector(".gallery");

  for (i=0;  i<=data.length; i++){
    let img = document.createElement("img");
    img.src = data[i].imageUrl;
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
    apiUrl;
    response;

    if (!response.ok) { //vérifie que la requette fonctionne
      throw new Error('Erreur lors de la récupération des données');
    }

    data; //données stockées dans la variable data

    if (data.length > 0){
      data.forEach(item => { //parcourir tous les objets du tableau
        let id = item.id;
        let title = item.title;
        let imageUrl = item.imageUrl;
        let categoryId = item.categoryId;
        let userId = item.userId;
        const categoryName = item.category.name;

        creatBaslises()

        let figure = document.querySelector(".figure");
        figure.setAttribute("img", imageUrl);
        figure.setAttribute("alt", title);
        figure.setAttribute("figcaption", title);
      });
    }
    else {
      console.log('Aucune donnée disponible');
    }
  }
  catch (error) {
    console.error('Erreur :', error);
  }
}

fetchData()
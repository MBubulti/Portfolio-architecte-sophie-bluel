//Appel des différents Projets
const appelApiProjets = await fetch("http://localhost:5678/api/works/");
const projets = await appelApiProjets.json();

//Appel des différentes Catégories pour les filtres
const appelApiCategories = await fetch("http://localhost:5678/api/categories/")
const categories = await appelApiCategories.json()

//Fonction pour générer l'affichage de tous les projets
function projetsGallery(Filtre){
    // Récupération de l'élément DOM qui accueille la figure
    const divProjets = document.querySelector(".gallery");
    divProjets.innerHTML = "";
  for (let i = 0; i <Filtre.length; i++){
    const travaux = Filtre[i];
    // Création d'une figure dédiée aux projets
    const figuresProjet = document.createElement("figure");
    figuresProjet.dataset.id = travaux.id
    //Création des éléments de la figure
    const imgProjet = document.createElement("img");
    imgProjet.src = travaux.imageUrl
    const titreProjet = document.createElement("figcaption");
    titreProjet.innerText = travaux.title 
    divProjets.appendChild(figuresProjet);
    figuresProjet.appendChild(imgProjet);
    figuresProjet.appendChild(titreProjet);
  }  
}

//Fonction pour générer les filtres de tous les projets
function filtresCategories(){
  for (let i = 0; i< categories.length; i++){
    const categoriesFiltres = categories[i];
    const filtres = document.createElement("div")
    filtres.dataset.id = categoriesFiltres.id
    const filtresTitre =  document.createElement("p")
    filtresTitre.innerText = categoriesFiltres.name
    filtresNav.appendChild(filtres);
    filtres.appendChild(filtresTitre);
  }
}

//Barre de navigation Filtres des projets
const filtresProjet = document.querySelector("#portfolio h2");
const filtresNav = document.createElement("nav")
filtresProjet.appendChild(filtresNav);

//Ajout de l'élément Tous dans le tableau & tri des filtres
categories.push({id: 0, name: 'Tous'})
categories.sort(function(a,b){
  return a.id - b.id;
});

//Lancement des fonctions
projetsGallery(projets);

filtresCategories(categories);

//Filtrer les projets - Tous
const btnTriTous = document.querySelector("div[data-id='0']")
btnTriTous.addEventListener("click", function(){
  projetsGallery(projets);
})

//Filtrer les projets - Objets
const btnTriObjets = document.querySelector("div[data-id='1']")
btnTriObjets.addEventListener("click", function(){
  const projetsFiltreObjets = projets.filter(
    projet => projet.category.name === "Objets"
  )
  projetsGallery(projetsFiltreObjets);
})

//Filtrer les projets - Appartements
const btnTriApparts = document.querySelector("div[data-id='2']")
btnTriApparts.addEventListener("click", function(){
  const projetsFiltreApparts = projets.filter(
    projet => projet.category.name === "Appartements"
  )
  projetsGallery(projetsFiltreApparts);
})

//Filtrer les projets - Hotels & Restaurants
const btnTriHotels = document.querySelector("div[data-id='3']")
btnTriHotels.addEventListener("click", function(){
  const projetsFiltreHotels = projets.filter(
    projet => projet.category.name === "Hotels & restaurants"
  )
  projetsGallery(projetsFiltreHotels);
})
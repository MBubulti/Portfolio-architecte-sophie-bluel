const appelApiProjets = await fetch("http://localhost:5678/api/works/");
const projets = await appelApiProjets.json();

console.log(projets)

//Fonction pour générer l'affichage de tous les projets
function projetsGallery(){
  for (let i = 0; i <projets.length; i++){
    const travaux = projets[i];
    // Récupération de l'élément DOM qui accueille la figure
    const divProjets = document.querySelector(".gallery");
    // Création d'une figure dédiée au projet 1
    const figuresProjet = document.createElement("figure");
    figuresProjet.dataset.id = travaux.id
    //Création des éléments de la figure
    const imgProjet = document.createElement("img");
    imgProjet.src = travaux.imageUrl
    const titreProjet = document.createElement("figcaption");
    titreProjet.innerHTML = travaux.title
    
    divProjets.appendChild(figuresProjet);
    figuresProjet.appendChild(imgProjet);
    figuresProjet.appendChild(titreProjet);
  }  
}

projetsGallery(projets);
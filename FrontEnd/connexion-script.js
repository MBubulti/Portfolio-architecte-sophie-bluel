//Création de la fonction Connexion
function connexionSite(){
    document.querySelector("#formulaire-connexion").addEventListener("submit", async function(event){
        event.preventDefault(); //Pas de rechargement de la page
        
        //Prendre les valeurs des deux input mail & pwd
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#pwd").value;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (emailRegex.test(email)){
            //Requête API pour la connexion - Try pour bonnes pratiques & éviter les erreurs
            try{
                const reponse = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({email, password}),
                    });
                //Vérification Réponse HTTP
                if (!reponse.ok) {
                    alert("Erreur dans l’identifiant ou le mot de passe");
                    return; // Sort de la fonction si la requête n'est pas valide
                }       
                //Récupération de la réponse en cas de validation
                const msgReponse = await reponse.json();
    
                //verification de la présence du token
                if (msgReponse.token){
                    //stocker le token en localStorage
                    localStorage.setItem("token", msgReponse.token);
                    //Redirection vers index.HTML
                    window.location.href = "/FrontEnd/index.html"
                }
            }
            //Catch toutes les erreurs qui sortent de la boucle try (pb serveur etc)
            catch (error) {
                    console.error("Rencontre d'une erreur :" + error.message)
            }
            return
        } return alert("Erreur dans l’identifiant ou le mot de passe");
    });
}

connexionSite()
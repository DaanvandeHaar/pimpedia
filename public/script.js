document.addEventListener("DOMContentLoaded", event => {

    const app = firebase.app();

    console.log(app);

    getData();
    setName();

});


function googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            alert("hallo " + user.displayName);
            sessionStorage.setItem("gebruiker", user.displayName);
        })
}

function getData(){
    const db = firebase.firestore();
    db.collection("artikel").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setData(doc.data().titel, doc.data().datum.seconds, doc.data().tekst, doc.data().gebruikerNaam)
        });
    });
}

function setData(titel, seconds, tekst, gebruikerNaam){
    var div = document.createElement("div");
    var br = document.createElement("br")
    div.classList.add("main");


    var datum = new Date(1970, 0, 1); // Epoch
    datum.setSeconds(seconds);
    var datumString = datum.toString();

    var titelRegel = document.createElement("H2");
    titelRegel.classList.add("titel");
    var gebruikerRegel = document.createElement("H4");
    var datumRegel = document.createElement("H9");
    datumRegel.classList.add("datumregel");
    var tekstRegel = document.createElement("p");

    titelRegel.innerHTML = titel;
    gebruikerRegel.innerHTML = "toegevoegd door: " +  gebruikerNaam;
    datumRegel.innerHTML = datumString;
    tekstRegel.innerHTML = tekst;

    div.appendChild(titelRegel);
    div.appendChild(gebruikerRegel);
    div.appendChild(tekstRegel);
    div.appendChild(datumRegel);

    document.body.appendChild(div);
    document.body.appendChild(br);

    var loader = document.getElementById("loader");
    loader.style.display = "none";


}
function uploadData(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var naam = document.getElementById('naam').value;
            var titel = document.getElementById('titel').value;
            var tekst = document.getElementById('tekst').value;
            var googleUser = user.displayName;

            if(!naam || !titel || !tekst ){
                alert("Vul alle velden in!");

            }
            else{
                const db = firebase.firestore();
                var firebaseDatumFormat = firebase.firestore.Timestamp.fromDate(new Date());
                db.collection("artikel").add({
                    datum: firebaseDatumFormat,
                    gebruikerNaam: naam,
                    tekst: tekst,
                    titel: titel,
                    googleUser: googleUser
                })
                    .then(function(docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        location.reload();
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });
            }
        } else {
            alert("U moet inloggen met Google!");
            location.reload();
        }
    });
}
function setName() {
    document.getElementById("naam").value = sessionStorage.getItem("gebruiker");

}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("toevoegenKnop");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

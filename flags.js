const previousPlayedCountries = new Array();        // include all the previous played countries (not to be re-selected)
const urlCountry = 'https://restcountries.eu/rest/v2/name/';
const urlCode = 'https://restcountries.eu/rest/v2/alpha/';

var globalCountry = "";
var globalNeighbors = "";
var globalFoundCountries = 0;
var globalWrongCountries = 0;
var globalClickedCountries = [];

class PlayingCountry{
    constructor(country, neighbours){
        this.country = country;
        this.neighbours = neighbours;
    }  
}

class Game{

    constructor(){
        this.score = 0;
        this.round = 0;
    }

    nextRound(country){
        fetch(urlCode+country.code3.toLowerCase())  // fetch by 3-letter code and not by name to avoid issues when name has spaces or special characters
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .then((result) => {
            if (result.length < 1) {
                throw new Error("Η χώρα δεν βρέθηκε!");
            } else {
                if (result.borders.length > 0) {
                    let realNeighbors = new Array();
                    let country = result.borders;
                    for(var i=0; i<result.borders.length; i++){
                        realNeighbors.push(countryObjects.find((s) => s['code3']===result.borders[i]))
                    }
                    let playingCountry = new PlayingCountry(country.name, realNeighbors);
                    globalNeighbors = realNeighbors;    // reset the real neighbors of the country
                    globalFoundCountries = 0;           // reset the real neighbors found by the user
                    globalWrongCountries = 0;           // reset the wrong choices the user made
                    return playingCountry;
                }
                else {
                    let country = this.chooseRandomCountry(); // if country has no neighbors, pick another country
                    console.log("Χώρα: ", country.name)
                    game.nextRound(country);
                }
            }
        }).then(playingCountry=>{
            globalClickedCountries = []; // empty the list for each playing round
            let possibleNeighbors = this.generateNeighbors(playingCountry); // the neighbors to appear in the Flexbox
            globalCountry = country;
            console.log("Γείτονες που θα εμφανιστούν στο παίκτη: ", possibleNeighbors);
            document.getElementById("countries_flexbox").innerHTML = ''; // clear the div from previous countries
            document.getElementById("my-country-flag").src = 'https://restcountries.eu/data/' + country.code3.toLowerCase() + '.svg';
            document.getElementById("my-country-name").innerHTML = country.name;
            for (var i = 0; i < possibleNeighbors.length; i++) {
                var countryCode = possibleNeighbors[i].code3.toLowerCase();
                var countryName = possibleNeighbors[i].name;
                var countryDiv = document.createElement('div');
                var countryDivHref = document.createElement('a');
                var countryDivImage = document.createElement('img');
                var countryDivName = document.createElement('p');
                var element = document.getElementById("countries_flexbox");
                countryDiv.setAttribute("id", "id_" + countryCode);
                countryDiv.setAttribute("class", "flex-country");
                countryDiv.setAttribute("style", "word-wrap: break-word;");
                countryDiv.setAttribute("onclick","game.getClickedCountry(this.id)")
                countryDivHref.setAttribute('href', "#");
                countryDivHref.setAttribute('onclick', "changeProgressBar(10)");
                countryDivImage.src = 'https://restcountries.eu/data/' + countryCode + '.svg';
                countryDivName.innerHTML = countryName;
                countryDivName.setAttribute("style","text-align: center;");
                countryDivHref.appendChild(countryDivImage);
                countryDiv.appendChild(countryDivHref);
                countryDiv.appendChild(countryDivImage);
                countryDiv.appendChild(countryDivName);
                element.appendChild(countryDiv);
            }
            console.log("Πραγματικοί Γείτονες: ");
            for (var i=0; i<globalNeighbors.length; i++) {
                console.log(globalNeighbors[i]);
            }
            var surroundingBox = document.getElementsByClassName("game-panel");
            if (surroundingBox[0].clientWidth > 800) 
                document.getElementById("sidebar").style.height = (surroundingBox[0].clientHeight-25) + "px";
            game.round = game.round + 1;
            game.changeDisplayedStats(game.round, game.score, 0)
            document.getElementById("btn-next-round").disabled = true; // disable the New Round button
        });
    }

    chooseRandomCountry() {               
        let arrayWithSuffledCountries = shuffleArray(countryObjects);
        while (previousPlayedCountries.find((s) => s['code']===arrayWithSuffledCountries[0]['code']) != undefined){
            arrayWithSuffledCountries = shuffleArray(countryObjects);
        }
        let country = arrayWithSuffledCountries[0];
        previousPlayedCountries.push(country);
        return country
    }

    generateNeighbors(playingCountry) {
        let list= new Array();
        for (let i=0; i<playingCountry.neighbours.length; i++){
            list.push(countryObjects.find((s) => s['code3']===playingCountry.neighbours[i].code3))
        }
        let numberOfNeededCountries = playingCountry.neighbours.length * 3;
        while (list.length < numberOfNeededCountries)
        {
            let arrayWithSuffledCountries = shuffleArray(countryObjects);
            while (list.find((s) => s['code']===arrayWithSuffledCountries[0]['code']) != undefined){
                arrayWithSuffledCountries = shuffleArray(countryObjects);
            }
            let country = arrayWithSuffledCountries[0];
            list.push(country);
        }
        let displayCountriesList = shuffleArray(list);
        return displayCountriesList;
    }

    changeDisplayedStats(round, score, progressBarStep) {
        var elem = document.getElementById("progress-bar");
        elem.style.width = progressBarStep + "%";   
        document.getElementById("player-round-value").innerHTML = round;
        document.getElementById("player-score-value").innerHTML = score;
    }

    resetOverlay() {
        document.getElementById("overlayBox").style.backgroundColor = "#fff"; 
        document.getElementById("overlayBox").style.opacity = 1.0;
        document.getElementById("overlayBox").style.pointerEvents = "auto"; // enable functionality on the overlay
        document.getElementById("overlayText").style.display = "none";
        document.getElementById("overlayText").innerHTML = "";
        for (var i = 0; i < globalClickedCountries.length; i++) {
            document.getElementById(globalClickedCountries[i]).style.backgroundColor = "#fff"; 
        }
    }

    displayOverlay(text,color) {
        var elmnt = document.getElementById("countries_flexbox");
        let centerX = elmnt.offsetLeft + elmnt.offsetWidth/2;
        let centerY = elmnt.offsetTop + elmnt.offsetHeight/2;
        document.getElementById("overlayBox").style.backgroundColor = "rgb(0,0,0,0.4)"; 
        document.getElementById("overlayBox").style.opacity = 0.3;
        document.getElementById("overlayBox").style.pointerEvents = "none"; // disable functionality on the overlay
        document.getElementById("overlayText").style.left = centerX-100 + "px";
        document.getElementById("overlayText").style.top = centerY-50 + "px";
        document.getElementById("overlayText").style.display = "block";
        document.getElementById("overlayText").innerHTML = text;
        document.getElementById("overlayText").style.color = color;
        for (var i = 0; i < globalClickedCountries.length; i++) {
            document.getElementById(globalClickedCountries[i]).style.backgroundColor = "#a6a6a6"; 
        }
    }

    getClickedCountry(div_id) {
        globalClickedCountries.push(div_id);    // gather all the clicked ids of the countries
        var clickedCountryCode = div_id.split("id_")[1].toUpperCase();
        if (globalNeighbors.find((s) => s['code3']===clickedCountryCode) != undefined){
            document.getElementById(div_id).style.border = "2px solid green";
            document.getElementById(div_id).style.backgroundColor = "#f2f2f2";
            globalFoundCountries = globalFoundCountries + 1;
            var progressBarStep = globalFoundCountries/globalNeighbors.length * 100;
            game.changeDisplayedStats(game.round, game.score, progressBarStep)
            if (progressBarStep == 100) {
                document.getElementById("btn-next-round").disabled = false; // if all countries found, win round and enable the button for next round
                game.displayOverlay("You find all the neighbors!", "black");
            }
            game.score = game.score + 5;
            game.changeDisplayedStats(game.round, game.score, progressBarStep)
        } else {
            document.getElementById(div_id).style.border = "2px solid red";
            document.getElementById(div_id).style.backgroundColor = "#f2f2f2";
            game.score = game.score - 3;
            globalWrongCountries = globalWrongCountries + 1;
            if (globalWrongCountries === globalNeighbors.length){
                document.getElementById("btn-next-round").disabled = false; // if max number of wrong countries selected, lose round and enable the button for next round
                game.displayOverlay("Oh no, you lost!", "red");
            }
            game.changeDisplayedStats(game.round, game.score, progressBarStep)
        }
    }

}

document.addEventListener("DOMContentLoaded", () => {

    // Begin game when page loads for the 1st time
    game = new Game();
    let country = game.chooseRandomCountry();
    console.log("Χώρα: ", country.name)
    game.nextRound(country);
    alert("Καλωσήρθατε στο παιχνίδι γεωγραφίας 'Βρές τους γείτονες'\n\nΤο παιχνίδι επιλέγει αρχικά μια τυχαία χώρα που εμφανίζεται στην οθόνη σας, μαζί με μια λίστα από τις πιθανές της γειτονικές χώρες (πραγματικές και μη).\nΓια τη χώρα αυτή, πρέπει να επιλέξετε τις χώρες που συνορεύουν πραγματικά, και μόνο αυτές.\nΓια κάθε σωστή επιλογή, κερδίζετε 5 πόντους και για κάθε λάθος επιλογή χάνετε 3 πόντους.\nΤο παιχνίδι τελειώνει όταν ολοκληρώσετε στο σύνολο 10 γύρους παιχνιδιού!");

    document.querySelector("#btn-new-game").addEventListener("click", () => {
        var response = confirm("Σίγουρα; Θα χάσετε όλο σας το σκορ!");
        if (response == true) {   
            game = new Game();
            let country = game.chooseRandomCountry();
            console.log("Χώρα: ", country)
            game.nextRound(country);
            game.changeDisplayedStats(1,0,0) // reset round, score, progressbar
            game.resetOverlay();             // remove the overlay message
        }
    });

    document.querySelector("#btn-next-round").addEventListener("click", () => {
        if (game.round == 10){
            alert("Το παιχνίδι μόλις τελείωσε. Το τελικό σας σκόρ είναι: " + game.score + " .\nΣας ευχαριστούμε που παίξατε!")
            document.getElementById("btn-next-round").disabled = true; // disable the button for next round, since game ended!
        } else {
            let country = game.chooseRandomCountry();
            console.log("Χώρα: ", country)
            game.nextRound(country);
            game.changeDisplayedStats(game.round, game.score, 0) // reset the progressbar
            game.resetOverlay();                                 // remove the overlay message
        }
    })

    $(window).resize(function () {
        var surroundingBox = document.getElementsByClassName("game-panel");
        if (surroundingBox[0].clientWidth > 800) 
            document.getElementById("sidebar").style.height = (surroundingBox[0].clientHeight-25) + "px"; // ensure correct sidebar height to go along with the countries flexbox
        var countriesBox = document.getElementById("countries_flexbox");
        let centerX = countriesBox.offsetLeft + countriesBox.offsetWidth/2;
        let centerY = countriesBox.offsetTop + countriesBox.offsetHeight/2;
        document.getElementById("overlayText").style.left = centerX-100 + "px";
        document.getElementById("overlayText").style.top = centerY-50 + "px";
    });

});
       // Ένας βοηθητικός πίνακας που θα περιέχει τις χώρες από το countries.js σε λίγο πιο βολική μορφή
       const allCountries = new Array();
       // πχ. allCountries['GRE'] = { code2: "GR", name: "Greece"}, ή κάτι παρόμοιο 
       const previousPlayedCountries = new Array();

       const urlCountry = 'https://restcountries.eu/rest/v2/name/';
       const urlCode = 'https://restcountries.eu/rest/v2/alpha/';
       
       countryObjects.forEach(element =>{
           let obj = loadCountryNameFromCode(element.code)
           allCountries.push(obj);
       })
       // Εδώ μπορείτε να βάλετε τον κώδικα για όλο το παιχνίδι
       // Μπορείτε γράψετε κλάσεις που να έχουν κάποια συμπεριφορά, 
       // π.χ. Game, PlayingCountry, Neighbour, ...
       // ή να και ακολουθήσετε άλλη τακτική, που να σας είναι πιο προσιτή

       function loadCountryNameFromCode(code) {
       // επιστρέφει Promise του αποτελέσματος – του ονόματος της χώρας
           return new Promise((resolve, reject) => {
               fetch(urlCode + code)
               .then((resp) => {
                   if (resp.status == 200) {
                       return resp.json();
                   } else reject(new Error(resp.status));
               })
           });
       }
       class Game{
           constructor(){
               this.score = 0;
               this.round = 0;
           }

           nextRound(){
               this.increaseRound();
               let selectedCountry = this.chooseCountry();
               let playingCountry = new PlayingCountry(selectedCountry);
               //this.createDisplayedCountries(playingCountry);
           }

           createDisplayedCountries(playingCountry){
               let list= new Array();
               list.push(playingCountry.neighbours);
               console.log("in createDisplayedCountries playingCountry ",playingCountry," playingCountry.neighbours ", playingCountry.neighbours)
               let numberOfNeededCountries = playingCountry.neighbours.length * 3;

               while ( list.length < numberOfNeededCountries)
               {
                   
                   this.chooseRoundCountries(list);
               }
               let displayCountriesList = list.shuffleArray();
               return displayCountriesList;
           }

           increaseRound(){
               this.round ++ ;
           }

           chooseCountry(){               
               let arrayWithSuffledCountries = shuffleArray(countryObjects);
               while ( previousPlayedCountries.find((s) => s['code']===arrayWithSuffledCountries[0]['code']) != undefined){
                   arrayWithSuffledCountries = shuffleArray(countryObjects);
               }
               previousPlayedCountries.push(arrayWithSuffledCountries[0]);
               let selectedCountry = arrayWithSuffledCountries[0]
               return selectedCountry
           }

           chooseRoundCountries(previousPlayedCountries){
               let arrayWithSuffledCountries = shuffleArray(countryObjects);
               while ( previousPlayedCountries.find((s) => s['code']===arrayWithSuffledCountries[0]['code']) != undefined){
                   arrayWithSuffledCountries = shuffleArray(countryObjects);
               }
               previousPlayedCountries.push(arrayWithSuffledCountries[0].code);
               let selectedCountry = arrayWithSuffledCountries[0]
           }

       }

       class PlayingCountry{
           constructor(country){
               this.country = country;
               this.neighbours = PlayingCountry.prototype.findNeighbours(this.country.name);
               console.log("PlayingCountry ", this.neighbours);
           }  
       }
       
       PlayingCountry.prototype.findNeighbours = function(country) {//anti gia this to eixa country
               fetch(urlCountry + country)
               .then((response) => {
                   if (response.status === 200) {
                       return response.json();
                   } else throw new Error(response.status);
               })
               .then((data) => {
                   console.log("the data ", data[0].borders)
                   if (data[0].borders.length > 0) { // οι κωδικοί των γειτόνων
                       const theCountries = [];
                       data[0].borders.forEach((item) => {
                           theCountries.push(loadCountryNameFromCode(item));
                           console.log("item ",item)
                       });
                       Promise.all(theCountries) //  array από Promises
                       .then((allCountriesNames) => {
                           console.log("allCountriesNames ",allCountriesNames)
                           console.log(
               `H χώρα ${country} συνορεύει με τις εξής χώρες: ${allCountriesNames}`
               
                       ); // render the result
                       
               })
           .catch((error) => { console.log(error); });
           }});}
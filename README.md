# 'Find the neighbors' Online Game!!
## 0. Project Contributors
Evangelos Michos
Spyridon Aniceto Katsampiris Salgado

## 1. Introduction in the Game
The following online game was developed for personal puproses in a group of 2 developers. It is an online game that uses the Open Source API of REST countries [REST countries](https://restcountries.eu/) under the Mozilla Public License MPL 2.0 in order to randomly fetch the user's playing country. 

* After the country is fetched (and alongside, all the relevant information, such as the URL for the country's flag, its neighbors, its 3-letter code etc.), we randomly present 3 times the possible neighbors of each country for the user to guess which countries are indeed the neighbors of the playing country. 
* This means that if a country has for example 4 real neighbors, then the total neighbors that will appear to the user in the game are equal to 4x3 = 12 countries to choose from.
* For every correctly guessed country as neighbor, the player's score is increased by + 5 points.
* For every wrongly selected country as neighbor, the player's score is reduced by - 3 points.
* During each round, the player is unable to select a new country unless he either loses or wins the round.
* In order to win the round, he must guess all the neighbors of the playing country.
* The round is lost when the player makes so many wrong selections as are the country's actual neighbors (e.g. for a country with 4 neighbors, the round ends at 4 wrong user guesses)

## 2. Explaining the Approach

## 3. Playing the Game

![enter image description here](https://i.ibb.co/R4rqHj9/Screenshot-1.png)

Image 1: Starting the game with the random country selected to be Venezuela (3 actual country neighbors)

![enter image description here](https://i.ibb.co/cXCZRNb/Screenshot-2.png)

Image 2: Guessing the neighbors of Venezuela (ProgressBar fills up depending on the correct guesses)

![enter image description here](https://i.ibb.co/s52HvkN/Screenshot-3.png)

Image 3: Too many wrong guesses, overlay message appears and the 'Next Country' button is activated

![enter image description here](https://i.ibb.co/tKvFNsg/Screenshot-4.png)

Image 4: Resizing the game

![enter image description here](https://i.ibb.co/ZXppBZL/Screenshot-6.png)

Image 5: Resizing the game (below 800 pixels)


## 3. Tools needed
* IDE Version : `Visual Studio Code` (Find the IDE [here](https://code.visualstudio.com/))
* IDE addons : `Live Server Extension 5.6.1` (Find the addon [here](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer))
* Programming Language : `HTML/CSS/JavaScript`
* CSS Version : `Boostrap 5.0.0`

# 4. Deploying the platform

The steps to deploy the website should be the following:

1. Creating the database
2. 
4. That's it! You have successfully deployed the website...

/******************************/
/********** Constants **********/
/******************************/
class Player {
    constructor(name, num) {
        this.name = name;
        this.player = num;
        this.victoryPoints = 0;
        this.victoryPointsHidden = 0;
        this.special = {
            roadSize: 0,
            longestRoad: false,
            armySize: 0,
            largestArmy: false
        }
        this.pieces = {
            road: 15,
            settlement: 5,
            city: 4,
        };
        this.resources = {
            lumber: 0,
            brick: 0,
            wool: 0,
            grain: 0,
            ore: 0
        };
        this.totalResources = 0;
        this.totalDevelopmentCards = 0;
        this.developmentCards = {
            knight: {
                quantity: 0,
                img: 'resources/imgs/dcs/vector/dcs__knight.png',
                use: function () {
                    game.players[turn].moveRobber();
                }
            },
            monopoly: {
                quantity: 0,
                img: 'resources/imgs/dcs/vector/dcs__monopoly.png',

            },
            yearOfPlenty: {
                quantity: 0,
                img: 'resources/imgs/dcs/vector/dcs__yearOfPlenty.png',

            },
            roadBuilding: {
                quantity: 0,
                img: 'resources/imgs/dcs/vector/dcs__roadBuilding.png',

            },
            market: {
                quantity: 0,
                img: 'resources/imgs/dcs/vector/dcs__market.png',

            },
            chapel: {
                quantity: 0,
                img: 'resources/imgs/dcs/vector/dcs__chapel.png',

            },
            library: {
                quantity: 0,
                img: 'resources/imgs/dcs/vector/dcs__library.png',

            },
            university: {
                quantity: 0,
                img: 'resources/imgs/dcs/vector/dcs__university.png',

            },
            palace: {
                quantity: 1,
                img: 'resources/imgs/dcs/vector/dcs__palace.png',

            }
        };
        this.hexesSettled = [];
        this.roadsOwned = [];
    }

    roll () {
        dice1 = Math.floor(Math.random() * 6) + 1;
        dice2 = Math.floor(Math.random() * 6) + 1;
        diceTotal = dice1 + dice2;

        //animates dice
        gameDice1.html(`<img src="resources/imgs/dice/vector/dice-${dice1}.png" alt="Dice 1 Image" title="Dice 1 Image">`).velocity({
            rotateX: '360deg',
            rotateY: '360deg'
        },{
            duration: 100,
            loop: 1,
            easing:'linear'
        });
        gameDice2.html(`<img src="resources/imgs/dice/vector/dice-${dice2}.png" alt="Dice 2 Image" title="Dice 2 Image">`).velocity({
            rotateX: '360deg',
            rotateY: '360deg'
        },{
            duration: 100,
            loop: 1,
            easing:'linear'
        });

        game.render();
        textBox.append(`<br>${this.name} rolled ${diceTotal}.`);

        if (game.state === 'initializing') {
            return diceTotal
        }

        if (diceTotal === 7 && game.state !== 'initializing') this.moveRobber();

        game.distributeResources();
    }

    moveRobber () {
        textBox.append(`<br>${this.name} must now move the robber.`);

        //hides player action buttons
        playerActions.css('visibility', 'hidden');

        //adds event listener that lets player click on robber
        gameHex.on('click', placeRobber);
    }

    buildRoad (e) {
        if (this.pieces.road > 0) {
            if ($(e.target).hasClass('road')) {
                let id = $(e.target).attr('data-id');

                //if the road you are trying to place is next to a settlement you own or next to a road you own, you can occupy that road
                for (let i = 0; i < game.roadAreas[id].adjacentRoads.length; i++) {
                    if ((game.roadAreas[game.roadAreas[id].adjacentRoads[i]].ownedByPlayer === turn) || (game.settlementAreas[game.roadAreas[id].settlements[0]].ownedByPlayer === turn || game.settlementAreas[game.roadAreas[id].settlements[1]].ownedByPlayer === turn)) {
                        game.roadAreas[id].canOccupy = true;
                    }
                }

                //changes clicked area to current player's color
                if (game.roadAreas[id].canOccupy === true && game.roadAreas[id].occupied === false) {
                    textBox.append(`<br>Player ${turn} just placed a road.`);

                    game.roadAreas[id].occupied = true;
                    game.roadAreas[id].canOccupy = false;
                    game.roadAreas[id].ownedByPlayer = turn;

                    $(e.target).css('background-color', `var(--player-${turn}-color1)`).css('opacity', '1').css('box-shadow', '.2rem .2rem .2rem rgba(0, 0, 0, .7)');

                    //reduce player's road pieces by 1
                    this.pieces.road -= 1;
                    if (game.state !== 'initializing') {
                        this.resources.lumber--;
                        this.resources.brick--;
                        this.totalResources -= 2;

                        catan.resources.lumber.quantity++;
                        catan.resources.brick.quantity++;

                        //hides cancel button
                        cancel.css('visibility', 'hidden');
                        //shows player action buttons
                        playerActions.css('visibility', 'visible');
                    }

                    //turns off event listeners for road and settlement divs on gameboard
                    gameRoad.off('click', buildRoadClick);
                    
                    game.render();

                    if (game.state === 'initializing') {
                        howManyInitialTurns++
                        game.initialPlacement();
                    } 
                } else {
                    textBox.append('<br>This road must be placed adjacent to one of your existing settlements.');
                }
            } else {
                textBox.append('<br>This is not a valid area to place a road.');
            }

        } else {
            textBox.append(`<br>You don't have anymore road pieces.`);
        }
        
        game.render();
    }

    buildSettlement (e) {
        if (this.pieces.settlement > 0) {
            if ($(e.target).hasClass('settlement')) {
                let id = $(e.target).attr('data-id');

                for (let i = 0; i < game.settlementAreas[id].neighbors.length; i++) {
                    if (game.settlementAreas[game.settlementAreas[id].neighbors[i]].occupied === true) {
                        game.settlementAreas[id].canOccupy = false;
                    }
                }

                if (game.state === 'inProgress') {
                    for (let i = 0; i < game.settlementAreas[id].adjacentRoads.length; i++) {
                        if (game.roadAreas[game.settlementAreas[id].adjacentRoads[i]].ownedByPlayer === turn) {
                            game.settlementAreas[id].canOccupy = true;
                        }
                    }
                }

                //changes clicked area to current player's color
                if (game.settlementAreas[id].canOccupy === true && game.settlementAreas[id].occupied === false) {
                    textBox.append(`<br>Player ${turn} just placed a settlement.`);

                    game.settlementAreas[id].occupied = true;
                    game.settlementAreas[id].canOccupy = false;
                    game.settlementAreas[id].ownedByPlayer = turn;
                    //updates hex objects data to include who is settled on it for resource distribution
                    game.settlementAreas[id].adjacentHexes.forEach(function (hex) {
                        game.hexes[hex].settledBy.push(turn);
                    });

                    $(e.target).css('background-color', `var(--player-${turn}-color1)`).css('opacity', '1').css('box-shadow', '.2rem .2rem .2rem rgba(0, 0, 0, .7)').text('S');

                    if (turn === 3) {
                        $(e.target).css('color', 'black');
                    }

                    //reduces player's settlement pieces by 1
                    this.pieces.settlement -= 1;
                    //changes resource amounts
                    if (game.state !== 'initializing') {
                        this.resources.lumber--;
                        this.resources.brick--;
                        this.resources.wool--;
                        this.resources.grain--;
                        this.totalResources -= 4;

                        catan.resources.lumber.quantity++;
                        catan.resources.brick.quantity++;
                        catan.resources.wool.quantity++;
                        catan.resources.grain.quantity++;
                    }
                    //increase player's victory points
                    this.victoryPoints++;

                    //hides cancel button
                    cancel.css('visibility', 'hidden');

                    //turns off event listeners for road and settlement divs on gameboard
                    gameSettlement.off('click', buildSettlementClick);

                    if (game.state === 'initializing') {
                        textBox.append(`<br>${game.players[turn].name}, please place a road on the board adjacent to the settlement you just placed.`);
                        textBox.animate({ scrollTop: textBox.prop('scrollHeight') - textBox.height() }, 1);
                        
                        gameRoad.on('click', buildRoadClick);
                        if (howManyInitialTurns >= initialTurns.length / 2 ) game.distributeResources(id);
                    } else {
                        //hides cancel button
                        cancel.css('visibility', 'hidden');
                        //shows player action buttons
                        playerActions.css('visibility', 'visible');
                    }

                    game.render();
                } else {
                    textBox.append('<br>This settlement cannot be placed within 1 vertex of another already-placed settlement.');
                }
            } else {
                textBox.append('<br>This is not a valid area to place a settlement.');
            }
        } else {
            textBox.append(`<br>You don't have anymore settlement pieces.`)
        }
        
        game.render();
    }

    buildCity (e) {
        if (this.pieces.city > 0) {
            //if the player has clicked an existing settlement that he/she owns and he/she has the appropriate resources
            if (($(e.target).attr('data-type') === 'settlement')) {
                let id = $(e.target).attr('data-id');
                if (game.settlementAreas[$(e.target).attr('data-id')].ownedByPlayer === turn) {
                    if (this.resources.grain >= 2 && this.resources.ore >= 3) {
                        //changes the DOM to display that a settlement has turned into a city
                        $(e.target).text('C');

                        //changes the settlement's data-type to "city"
                        $(e.target).attr('data-type', 'city');

                        //updates hex objects data to include who is settled on it for resource distribution
                        game.settlementAreas[id].adjacentHexes.forEach(function (hex) {
                            game.hexes[hex].settledBy.push(turn);
                        });

                        //reduces player's city pieces
                        this.pieces.city--;
                        //increased player's settlement pieces by 1
                        this.pieces.settlement++;
                        //increases player's points by 2
                        this.victoryPoints++;
                        //changes resource amounts for player & bank
                        if (game.state !== 'initializing') {
                            this.resources.grain -= 2;
                            this.resources.ore -= 3;
                            this.totalResources -= 5;

                            catan.resources.grain.quantity += 2;
                            catan.resources.ore.quantity += 3;
                        }

                        //hides cancel button
                        cancel.css('visibility', 'hidden');
                        //shows player action buttons
                        playerActions.css('visibility', 'visible');

                        //removes City event listener after it has been built
                        gameSettlement.off('click', buildCityClick);
                    } else {
                        textBox.append(`<br>You don't have the proper resources to build a city.  A city requires 2 grain and 3 ore to build.`);
                    }
                } else {
                    textBox.append(`<br>Please click on a settlement that you own.`);
                }
            } else {
                textBox.append(`<br>Please click on a settlement.`);
            }
        } else {
            textBox.append(`<br>You don't have anymore city pieces.`);
        }
        
        game.render();
    }

    buyDevelopmentCard () {
        if (dcDeck.length > 0) {
            let randomCardIdx = Math.floor(Math.random() * dcDeck.length);
            this.developmentCards[(dcDeck.slice(randomCardIdx, randomCardIdx + 1)[0])].quantity++;
            this.totalDevelopmentCards++;
        } else {
            textBox.append(`<br>There are no more development cards in the deck.`);
        }
        
    }
    
    endTurn () {
        game.render();
        //checks win logic: if this player has 10 actual victory points (actual = shown + hidden) at the end of his/her turn, he/she has won the game
        if (this.victoryPointsActual >= 10) {
            textBox.append(`<br><h2>${this.name} HAS WON THE GAME!</h2>`);
            textBox.animate({ scrollTop: textBox.prop('scrollHeight') - textBox.height() }, 1);

            game.endGame();
        } else if (this.victoryPointsActual < 10){
            game.changeTurn();
        }
    }
}

Object.defineProperties(Player.prototype, {
    victoryPointsActual: {
        get: function() { return this.victoryPoints + this.victoryPointsHidden; }
    }
});

const catan = {
    areas: [
        {
            area: 'desert',
            quantity: 1,
            img: 'resources/imgs/hexes/vector/desert.png',
            resource: null
        },
        {
            area: 'forest',
            quantity: 4,
            img: 'resources/imgs/hexes/vector/forest.png',
            resource: 'lumber'
        },
        {
            area: 'hill',
            quantity: 3,
            img: 'resources/imgs/hexes/vector/hill.png',
            resource: 'brick'
        },
        {
            area: 'pasture',
            quantity: 4,
            img: 'resources/imgs/hexes/vector/pasture.png',
            resource: 'wool'
        },
        {
            area: 'field',
            quantity: 4,
            img: 'resources/imgs/hexes/vector/field.png',
            resource: 'grain'
        },
        {
            area: 'mountain',
            quantity: 3,
            img: 'resources/imgs/hexes/vector/mountain.png',
            resource: 'ore'
        }
    ],
    numberTokens: [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11],
    resources: {
        back: {
            resource: 'back',
            quantity: 0,
            img: 'resources/imgs/resources/vector/resources--back.png'
        },
        lumber: {
            resource: 'lumber',
            quantity: 19,
            img: 'resources/imgs/resources/vector/resources--lumber.png'
        },
        brick: {
            resource: 'brick',
            quantity: 19,
            img: 'resources/imgs/resources/vector/resources--brick.png'
        },
        wool: {
            resource: 'wool',
            quantity: 19,
            img: 'resources/imgs/resources/vector/resources--wool.png'
        },
        grain: {
            resource: 'grain',
            quantity: 19,
            img: 'resources/imgs/resources/vector/resources--grain.png'
        },
        ore: {
            resource: 'ore',
            quantity: 19,
            img: 'resources/imgs/resources/vector/resources--ore.png'
        }
    },
    developmentCards: {
        knight: {
            quantity: 14,
            img: 'resources/imgs/dcs/vector/dcs__knight.png'
        },
        monopoly: {
            quantity: 2,
            img: 'resources/imgs/dcs/vector/dcs__monopoly.png'
        },
        yearOfPlenty: {
            quantity: 2,
            img: 'resources/imgs/dcs/vector/dcs__yearOfPlenty.png'
        },
        roadBuilding: {
            quantity: 2,
            img: 'resources/imgs/dcs/vector/dcs__roadBuilding.png'
        },
        market: {
            quantity: 1,
            img: 'resources/imgs/dcs/vector/dcs__market.png'
        },
        chapel: {
            quantity: 1,
            img: 'resources/imgs/dcs/vector/dcs__chapel.png'
        },
        library: {
            quantity: 1,
            img: 'resources/imgs/dcs/vector/dcs__library.png'
        },
        university: {
            quantity: 1,
            img: 'resources/imgs/dcs/vector/dcs__university.png'
        },
        palace: {
            quantity: 1,
            img: 'resources/imgs/dcs/vector/dcs__palace.png'
        }
    }
};

//this is a let instead of a const because the development card deck needs to be cleared on a new game (reassigned to an empty array)
let dcDeck = [];



/******************************/
/********** App's State (Variables) **********/
/******************************/
//this is a let instead of a const because the "Knight" development card can reassign the diceTotal to 7
let dice1, dice2, diceTotal, turn, numPlayers, currentSet, robberTemp, tradingPartner;

//this is a let instead of a const because this needs to be reassigned to a new [] when the game is reinitialized
let initialTurns = [];
let howManyInitialTurns = 0;



/******************************/
/********** Cached Element References **********/
/******************************/
const textBox = $('.text-box');
const gameHex = $('.hexes .row .hex');
const gameRoad = $('.hexes .row .road');
const gameSettlement = $('.hexes .row .settlement');
const gameDice1 = $('#dice1');
const gameDice2 = $('#dice2');
const playerActions = $('#player__actions');
const cancel = $('#cancel');
const tradeWho = $('.trade-who');
const tradeWhat = $('.trade-what');



/******************************/
/********** Functions **********/
/******************************/
const game = {
    state: 'initializing',
    players: [],
    hexes: [
        //numberTokens are initialized to 7 because 7s do not produce any resources
        {
            'data-type': 'hex',
            'data-id': 0,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 1,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 2,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 3,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 4,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 5,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 6,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 7,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 8,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 9,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 10,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 11,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 12,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 13,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 14,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 15,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 16,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 17,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        },
        {
            'data-type': 'hex',
            'data-id': 18,
            area: 'desert',
            resource: null,
            numberToken: 7,
            settledBy: []
        }
    ],
    settlementAreas: [
        {
            'data-type': 'settlement',
            'data-id': 0,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [0],
            neighbors: [1, 14],
            adjacentRoads: [0, 9]
        },
        {
            'data-type': 'settlement',
            'data-id': 1,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [0],
            neighbors: [0,2],
            adjacentRoads: [0, 1]
        },
        {
            'data-type': 'settlement',
            'data-id': 2,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [0, 1],
            neighbors: [1, 3, 12],
            adjacentRoads: [1, 2, 8]
        },
        {
            'data-type': 'settlement',
            'data-id': 3,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [1],
            neighbors: [2, 4],
            adjacentRoads: [2, 3]
        },
        {
            'data-type': 'settlement',
            'data-id': 4,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [1, 2],
            neighbors: [3, 10, 5],
            adjacentRoads: [3, 4, 7]
        },
        {
            'data-type': 'settlement',
            'data-id': 5,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [2],
            neighbors: [4, 6],
            adjacentRoads: [4, 5]
        },
        {
            'data-type': 'settlement',
            'data-id': 6,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [2],
            neighbors: [5, 8],
            adjacentRoads: [5, 6]
        },
        {
            'data-type': 'settlement',
            'data-id': 7,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [3],
            neighbors: [8, 25],
            adjacentRoads: [17, 18]
        },
        {
            'data-type': 'settlement',
            'data-id': 8,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [2, 3],
            neighbors: [6, 7, 9],
            adjacentRoads: [6, 16, 17]
        },
        {
            'data-type': 'settlement',
            'data-id': 9,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [2, 3, 13],
            neighbors: [8, 23, 10],
            adjacentRoads: [15, 16, 19]
        },
        {
            'data-type': 'settlement',
            'data-id': 10,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [1, 2, 13],
            neighbors: [4, 9, 11],
            adjacentRoads: [7, 14, 15]
        },
        {
            'data-type': 'settlement',
            'data-id': 11,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [1, 12, 13],
            neighbors: [10, 12, 21],
            adjacentRoads: [13, 14, 20]
        },
        {
            'data-type': 'settlement',
            'data-id': 12,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [0, 1, 12],
            neighbors: [2, 11, 13],
            adjacentRoads: [8, 12, 13]
        },
        {
            'data-type': 'settlement',
            'data-id': 13,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [0, 11, 12],
            neighbors: [12, 14, 19],
            adjacentRoads: [11, 12, 21]
        },
        {
            'data-type': 'settlement',
            'data-id': 14,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [0, 11],
            neighbors: [0, 13, 15],
            adjacentRoads: [9, 10, 11]
        },
        {
            'data-type': 'settlement',
            'data-id': 15,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [11],
            neighbors: [14, 17],
            adjacentRoads: [10, 22]
        },
        {
            'data-type': 'settlement',
            'data-id': 16,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [10],
            neighbors: [17, 37],
            adjacentRoads: [23, 38]
        },
        {
            'data-type': 'settlement',
            'data-id': 17,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [10, 11],
            neighbors: [15, 16, 18],
            adjacentRoads: [22, 23, 24]
        },
        {
            'data-type': 'settlement',
            'data-id': 18,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [10, 11, 17],
            neighbors: [17, 19, 35],
            adjacentRoads: [24, 25, 27]
        },
        {
            'data-type': 'settlement',
            'data-id': 19,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [11, 12, 17],
            neighbors: [13, 18, 20],
            adjacentRoads: [21, 25, 26]
        },
        {
            'data-type': 'settlement',
            'data-id': 20,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [12, 17, 18],
            neighbors: [19, 21, 33],
            adjacentRoads: [26, 27, 36]
        },
        {
            'data-type': 'settlement',
            'data-id': 21,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [12, 13, 18],
            neighbors: [11, 20, 22],
            adjacentRoads: [20, 27, 28]
        },
        {
            'data-type': 'settlement',
            'data-id': 22,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [13, 18, 14],
            neighbors: [21, 23, 31],
            adjacentRoads: [28, 29, 35]
        },
        {
            'data-type': 'settlement',
            'data-id': 23,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [3, 13, 14],
            neighbors: [9, 22, 24],
            adjacentRoads: [19, 29, 30]
        },
        {
            'data-type': 'settlement',
            'data-id': 24,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [3, 4, 14],
            neighbors: [23, 29, 25],
            adjacentRoads: [30, 31, 34]
        },
        {
            'data-type': 'settlement',
            'data-id': 25,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [3, 4],
            neighbors: [7, 24, 26],
            adjacentRoads: [18, 31, 32]
        },
        {
            'data-type': 'settlement',
            'data-id': 26,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [4],
            neighbors: [25, 27],
            adjacentRoads: [32, 33]
        },
        {
            'data-type': 'settlement',
            'data-id': 27,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [4],
            neighbors: [26, 28],
            adjacentRoads: [33, 48]
        },
        {
            'data-type': 'settlement',
            'data-id': 28,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [4, 5],
            neighbors: [27, 29, 46],
            adjacentRoads: [47, 48, 49]
        },
        {
            'data-type': 'settlement',
            'data-id': 29,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [4, 5, 14],
            neighbors: [24, 28, 30],
            adjacentRoads: [34, 46, 47]
        },
        {
            'data-type': 'settlement',
            'data-id': 30,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [5, 14, 15],
            neighbors: [29, 31, 44],
            adjacentRoads: [45, 46, 50]
        },
        {
            'data-type': 'settlement',
            'data-id': 31,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [14, 15, 18],
            neighbors: [22, 30, 32],
            adjacentRoads: [35, 44, 45]
        },
        {
            'data-type': 'settlement',
            'data-id': 32,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [15, 16, 18],
            neighbors: [31, 33, 42],
            adjacentRoads: [43, 44, 51]
        },
        {
            'data-type': 'settlement',
            'data-id': 33,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [16, 17, 18],
            neighbors: [20, 32, 34],
            adjacentRoads: [36, 42, 43]
        },
        {
            'data-type': 'settlement',
            'data-id': 34,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [9, 16, 17],
            neighbors: [33, 35, 40],
            adjacentRoads: [41, 42, 52]
        },
        {
            'data-type': 'settlement',
            'data-id': 35,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [9, 10, 17],
            neighbors: [18, 34, 36],
            adjacentRoads: [37, 40, 41]
        },
        {
            'data-type': 'settlement',
            'data-id': 36,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [9, 10],
            neighbors: [35, 37, 38],
            adjacentRoads: [39, 40, 53]
        },
        {
            'data-type': 'settlement',
            'data-id': 37,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [10],
            neighbors: [16, 36],
            adjacentRoads: [38, 39]
        },
        {
            'data-type': 'settlement',
            'data-id': 38,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [9],
            neighbors: [36, 39],
            adjacentRoads: [53, 54]
        },
        {
            'data-type': 'settlement',
            'data-id': 39,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [8, 9],
            neighbors: [38, 40, 53],
            adjacentRoads: [54, 55, 65]
        },
        {
            'data-type': 'settlement',
            'data-id': 40,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [8, 9, 16],
            neighbors: [34, 39, 41],
            adjacentRoads: [52, 55, 56]
        },
        {
            'data-type': 'settlement',
            'data-id': 41,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [7, 8, 16],
            neighbors: [40, 42, 51],
            adjacentRoads: [56, 57, 64]
        },
        {
            'data-type': 'settlement',
            'data-id': 42,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [7, 15, 16],
            neighbors: [32, 41, 43],
            adjacentRoads: [51, 57, 58]
        },
        {
            'data-type': 'settlement',
            'data-id': 43,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [6, 7, 15],
            neighbors: [42, 44, 49],
            adjacentRoads: [58, 59, 63]
        },
        {
            'data-type': 'settlement',
            'data-id': 44,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [5, 6, 15],
            neighbors: [30, 43, 45],
            adjacentRoads: [50, 59, 60]
        },
        {
            'data-type': 'settlement',
            'data-id': 45,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [5, 6],
            neighbors: [44, 46, 47],
            adjacentRoads: [60, 61, 62]
        },
        {
            'data-type': 'settlement',
            'data-id': 46,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [5],
            neighbors: [28, 45],
            adjacentRoads: [49, 61]
        },
        {
            'data-type': 'settlement',
            'data-id': 47,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [6],
            neighbors: [45, 48],
            adjacentRoads: [62, 71]
        },
        {
            'data-type': 'settlement',
            'data-id': 48,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [6],
            neighbors: [47, 49],
            adjacentRoads: [70, 71]
        },
        {
            'data-type': 'settlement',
            'data-id': 49,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [6, 7],
            neighbors: [43, 48, 50],
            adjacentRoads: [63, 69, 70]
        },
        {
            'data-type': 'settlement',
            'data-id': 50,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [7],
            neighbors: [49, 51],
            adjacentRoads: [68, 69]
        },
        {
            'data-type': 'settlement',
            'data-id': 51,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [7, 8],
            neighbors: [41, 50, 52],
            adjacentRoads: [64, 67, 68]
        },
        {
            'data-type': 'settlement',
            'data-id': 52,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [8],
            neighbors: [51, 53],
            adjacentRoads: [66, 67]
        },
        {
            'data-type': 'settlement',
            'data-id': 53,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            adjacentHexes: [8],
            neighbors: [39, 52],
            adjacentRoads: [65, 66]
        }
    ],
    roadAreas: [
        {
            'data-type': 'road',
            'data-id': 0,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [1, 9],
            settlements: [0, 1]
        },
        {
            'data-type': 'road',
            'data-id': 1,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [0, 2, 8],
            settlements: [1, 2]
        },
        {
            'data-type': 'road',
            'data-id': 2,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [1, 3, 8],
            settlements: [2, 3]
        },
        {
            'data-type': 'road',
            'data-id': 3,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [2, 4, 7],
            settlements: [3, 4]
        },
        {
            'data-type': 'road',
            'data-id': 4,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [3, 5, 7],
            settlements: [4, 5]
        },
        {
            'data-type': 'road',
            'data-id': 5,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [4, 6],
            settlements: [5, 6]
        },
        {
            'data-type': 'road',
            'data-id': 6,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [5, 16, 17],
            settlements: [6, 8]
        },
        {
            'data-type': 'road',
            'data-id': 7,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [3, 4, 14, 15],
            settlements: [4, 10]
        },
        {
            'data-type': 'road',
            'data-id': 8,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [1, 2, 12, 13],
            settlements: [2, 12]
        },
        {
            'data-type': 'road',
            'data-id': 9,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [0, 10, 11],
            settlements: [0, 14]
        },
        {
            'data-type': 'road',
            'data-id': 10,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [9, 11, 22],
            settlements: [14, 15]
        },
        {
            'data-type': 'road',
            'data-id': 11,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [9, 10, 12, 21],
            settlements: [13, 14]
        },
        {
            'data-type': 'road',
            'data-id': 12,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [8, 11, 13, 21],
            settlements: [12, 13]
        },
        {
            'data-type': 'road',
            'data-id': 13,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [8, 12, 14, 20],
            settlements: [11, 12]
        },
        {
            'data-type': 'road',
            'data-id': 14,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [7, 13, 15, 20],
            settlements: [10, 11]
        },
        {
            'data-type': 'road',
            'data-id': 15,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [7, 14, 16, 19],
            settlements: [9, 10]
        },
        {
            'data-type': 'road',
            'data-id': 16,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [6, 15, 17, 19],
            settlements: [8, 9]
        },
        {
            'data-type': 'road',
            'data-id': 17,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [6, 16, 18],
            settlements: [7, 8]
        },
        {
            'data-type': 'road',
            'data-id': 18,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [17, 31, 32],
            settlements: [7, 25]
        },
        {
            'data-type': 'road',
            'data-id': 19,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [15, 16, 29, 30],
            settlements: [9, 23]
        },
        {
            'data-type': 'road',
            'data-id': 20,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [13, 14, 27, 28],
            settlements: [11, 21]
        },
        {
            'data-type': 'road',
            'data-id': 21,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [12, 13, 25, 26],
            settlements: [13, 19]
        },
        {
            'data-type': 'road',
            'data-id': 22,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [10, 23, 24],
            settlements: [15, 17]
        },
        {
            'data-type': 'road',
            'data-id': 23,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [22, 24, 38],
            settlements: [16, 17]
        },
        {
            'data-type': 'road',
            'data-id': 24,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [22, 23, 25, 37],
            settlements: [17, 18]
        },
        {
            'data-type': 'road',
            'data-id': 25,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [21, 24, 26, 37],
            settlements: [18, 19]
        },
        {
            'data-type': 'road',
            'data-id': 26,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [21, 25, 27, 36],
            settlements: [19, 20]
        },
        {
            'data-type': 'road',
            'data-id': 27,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [20, 26, 28, 36],
            settlements: [20, 21]
        },
        {
            'data-type': 'road',
            'data-id': 28,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [20, 27, 29, 35],
            settlements: [21, 22]
        },
        {
            'data-type': 'road',
            'data-id': 29,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [19, 28, 30, 35],
            settlements: [22, 23]
        },
        {
            'data-type': 'road',
            'data-id': 30,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [19, 29, 31, 34],
            settlements: [23, 24]
        },
        {
            'data-type': 'road',
            'data-id': 31,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [18, 30, 32, 34],
            settlements: [24, 25]
        },
        {
            'data-type': 'road',
            'data-id': 32,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [18, 31, 33],
            settlements: [25, 26]
        },
        {
            'data-type': 'road',
            'data-id': 33,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [32, 48],
            settlements: [26, 27]
        },
        {
            'data-type': 'road',
            'data-id': 34,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [30, 31, 46, 47],
            settlements: [24, 29]
        },
        {
            'data-type': 'road',
            'data-id': 35,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [28, 29, 44, 45],
            settlements: [22, 31]
        },
        {
            'data-type': 'road',
            'data-id': 36,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [26, 27, 42, 43],
            settlements: [20, 33]
        },
        {
            'data-type': 'road',
            'data-id': 37,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [24, 25, 40, 41],
            settlements: [18, 35]
        },
        {
            'data-type': 'road',
            'data-id': 38,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [23, 39],
            settlements: [16, 37]
        },
        {
            'data-type': 'road',
            'data-id': 39,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [38, 40, 53],
            settlements: [36, 37]
        },
        {
            'data-type': 'road',
            'data-id': 40,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [37, 39, 41, 53],
            settlements: [35, 36]
        },
        {
            'data-type': 'road',
            'data-id': 41,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [37, 40, 42, 52],
            settlements: [34, 35]
        },
        {
            'data-type': 'road',
            'data-id': 42,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [36, 41, 43, 52],
            settlements: [33, 34]
        },
        {
            'data-type': 'road',
            'data-id': 43,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [36, 42, 44, 51],
            settlements: [32, 33]
        },
        {
            'data-type': 'road',
            'data-id': 44,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [35, 43, 45, 51],
            settlements: [31, 32]
        },
        {
            'data-type': 'road',
            'data-id': 45,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [35, 44, 46, 50],
            settlements: [30, 31]
        },
        {
            'data-type': 'road',
            'data-id': 46,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [34, 45, 47, 50],
            settlements: [29, 30]
        },
        {
            'data-type': 'road',
            'data-id': 47,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [34, 46, 48, 49],
            settlements: [28, 29]
        },
        {
            'data-type': 'road',
            'data-id': 48,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [33, 47, 49],
            settlements: [27, 28]
        },
        {
            'data-type': 'road',
            'data-id': 49,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [47, 48, 61],
            settlements: [28, 46]
        },
        {
            'data-type': 'road',
            'data-id': 50,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [45, 46, 59, 60],
            settlements: [30, 44]
        },
        {
            'data-type': 'road',
            'data-id': 51,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [43, 44, 57, 58],
            settlements: [32, 42]
        },
        {
            'data-type': 'road',
            'data-id': 52,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [41, 42, 55, 56],
            settlements: [34, 40]
        },
        {
            'data-type': 'road',
            'data-id': 53,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [39, 40, 54],
            settlements: [36, 38]
        },
        {
            'data-type': 'road',
            'data-id': 54,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [53, 55, 65],
            settlements: [38, 39]
        },
        {
            'data-type': 'road',
            'data-id': 55,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [52, 54, 56, 65],
            settlements: [39, 40]
        },
        {
            'data-type': 'road',
            'data-id': 56,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [52, 55, 57, 64],
            settlements: [40, 41]
        },
        {
            'data-type': 'road',
            'data-id': 57,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [51, 56, 58, 64],
            settlements: [41, 42]
        },
        {
            'data-type': 'road',
            'data-id': 58,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [51, 57, 59, 63],
            settlements: [42, 43]
        },
        {
            'data-type': 'road',
            'data-id': 59,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [50, 58, 60, 63],
            settlements: [43, 44]
        },
        {
            'data-type': 'road',
            'data-id': 60,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [50, 59, 61, 62],
            settlements: [44, 45]
        },
        {
            'data-type': 'road',
            'data-id': 61,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [49, 60, 62],
            settlements: [45, 46]
        },
        {
            'data-type': 'road',
            'data-id': 62,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [60, 61, 71],
            settlements: [45, 47]
        },
        {
            'data-type': 'road',
            'data-id': 63,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [58, 59, 69, 70],
            settlements: [43, 49]
        },
        {
            'data-type': 'road',
            'data-id': 64,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [56, 57, 67, 68],
            settlements: [41, 51]
        },
        {
            'data-type': 'road',
            'data-id': 65,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [54, 55, 60],
            settlements: [39, 53]
        },
        {
            'data-type': 'road',
            'data-id': 66,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [65, 67],
            settlements: [52, 53]
        },
        {
            'data-type': 'road',
            'data-id': 67,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [64, 66, 68],
            settlements: [51, 52]
        },
        {
            'data-type': 'road',
            'data-id': 68,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [64, 67, 69],
            settlements: [50, 51]
        },
        {
            'data-type': 'road',
            'data-id': 69,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [63, 68, 70],
            settlements: [49, 50]
        },
        {
            'data-type': 'road',
            'data-id': 70,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [63, 69, 71],
            settlements: [48, 49]
        },
        {
            'data-type': 'road',
            'data-id': 71,
            occupied: false,
            canOccupy: false,
            ownedByPlayer: null,
            adjacentRoads: [62, 70],
            settlements: [47, 48]
        }
    ],
    init () {
        $('.initial-player-creation').css('visibility', 'hidden');
        //randomly generates the areas for the hexes on the board
        for (let hex of game.hexes) {
            //gets random area from catan.areas
            let randomArea = Math.floor((Math.random() * catan.areas.length));

            let chosenArea;
            //assign that chosen area to chosenArea and reduce its quantity by 1
            chosenArea = catan.areas[randomArea];
            catan.areas[randomArea].quantity -= 1;
            //if that area's quantity is 0, remove it from array catan.areas
            if (catan.areas[randomArea].quantity === 0) {
                catan.areas.splice(randomArea, 1);
            } 

            //assign the resource of the assigned Area to that hex
            hex.resource = chosenArea.resource;

            $(`#hex${hex['data-id']}`).append(`<img src="${chosenArea.img}" alt="Hex Area" title="Hex Area">`);
            hex.area = chosenArea.area;
            hex.resource = chosenArea.resource;

            //assigns number tokens to each hex, starting from hex1, and skipping over any desert
            if (hex.area !== 'desert') {
                hex.numberToken = catan.numberTokens[`${hex['data-id']}`]; 
                $(`#hex${hex["data-id"]}`).append(`<div><h3>${hex.numberToken}</h3></div>`);
            } else {
                hex.numberToken = '<img src="resources/imgs/robber/vector/robber.png" id="robber" data-type="numberToken" data-id="robber" alt="Robber" title="Robber">';
                $(`#hex${hex["data-id"]}`).append(`<div>${hex.numberToken}</div>`);
                //at the current index, splice in the string 'robber' so that we can continue assigning the appropriate tokens to the rest of the hexes
                catan.numberTokens.splice([`${hex["data-id"]}`], 0, 'robber');
            }   
        }

        //creates development card Deck (dcDeck)
        for (let card in catan.developmentCards) {
            while (catan.developmentCards[card].quantity > 0) {
                let dcObj;
                dcObj = card;
                dcDeck.push(dcObj);
                catan.developmentCards[card].quantity -= 1;
            }
        }

        //generates new players
        for (let i = 0; i < numPlayers; i++) {
            game.players.push(new Player(i, i));
        }

        turn = 0;

        this.getFirstPlayer();
        this.initialTurns();
    },
    render () {
        //updates dice images
        gameDice1.html(`<img src="resources/imgs/dice/vector/dice-${dice1}.png" alt="Dice 1 Image" title="Dice 1 Image">`);
        gameDice2.html(`<img src="resources/imgs/dice/vector/dice-${dice2}.png" alt="Dice 2 Image" title="Dice 2 Image">`);

        //renders player sections
        for (let player of game.players) {
            //renders player's Victory Points
            $(`#player-${player.player}__vp`).text(`${player.victoryPoints}`);

            //renders player's longest road count
            $(`#player-${player.player}__road--num`).text(`${player.special.roadSize}`);

            //renders player's largest army count
            $(`#player-${player.player}__army--num`).text(`${player.special.armySize}`);

            //renders player's piece counts
            for (let piece in player.pieces) {
                $(`.player-${player.player}__pieces__${piece}--num`).text(`${player.pieces[piece]}`);
            }

            //renders player's total resource count
            $(`#player-${player.player}__resource--num`).text(`${player.totalResources}`);

            //renders player's resource counts
            for (let resource in player.resources) {
                $(`.player-${player.player}__resource__${resource}--num`).text(`${player.resources[resource]}`);
            }
        }

        //updates bank section
        for (let resource in catan.resources) {
            if (resource !== 'back') {
                $(`.bank__resource__${resource}--num`).text(`${catan.resources[resource].quantity}`)
            } 
        }

        //if the player has the Longest Road or the Largest Army, their card will become visible        
        for (let player of game.players) {
            if (player.special.longestRoad === true) {
                $(`#player-${player.player} .road-card .road--card img`).css('opacity', '1');
            } else {
                $(`#player-${player.player} .road-card .road--card img`).css('opacity', '0.5');
            }

            if (player.special.largestArmy === true) {
                $(`#player-${player.player} .army-card .army--card img`).css('opacity', '1');
            } else {
                $(`#player-${player.player} .army-card .army--card img`).css('opacity', '0.5');
            }
        }

        for (let i = 0; i < 4; i++) {
            if (i !== turn) {
                //if it is the current player's turn, remove the background-image, else make the background-img mask gray
                $(`#player-${i}`).css('background-image', 'linear-gradient(to right bottom, var(--background-color-light), var(--background-color-medium))').css('opacity', '0.5');

                //hide other players' resource imgs & counts from current player
                for (let resource in catan.resources) {
                    if (resource !== 'back') {
                        //resource images turn to back
                        $(`.player-${i}__resource__${resource}--pic img`).attr('src', `${catan.resources.back.img}`);

                        //resource counts become invisible
                        $(`.player-${i}__resource__${resource}--num`).css('visibility', 'hidden');
                    }
                }
            } else {
                //make current player's section opaque and unmasked
                $(`#player-${i}`).css('background-image', 'none').css('opacity', '1');

                //reveal current player's resource counts and card images
                for (let resource in game.players[i].resources) {
                    //resource images repopulate
                    $(`.player-${i}__resource__${resource}--pic img`).attr('src', `resources/imgs/resources/vector/resources--${resource}.png`);

                    //resource counts become invisible
                    $(`.player-${i}__resource__${resource}--num`).css('visibility', 'visible');
                }
            }
        }
        //scrolls text box to bottom of content
        textBox.animate({ scrollTop: textBox.prop('scrollHeight') - textBox.height() }, 1);
    },
    getFirstPlayer () {
        let diceRolls = [];
        let highestRoll = 0;
        let firstPlayer = 0;

        //makes each player roll dice and return total
        for (let player of game.players) {
            diceRolls.push(player.roll());
        }
        
        //compares those dice totals from diceRolls array to determine firstPlayer & sets that person as first player
        for (let i = 0; i < diceRolls.length; i++) {
            if (diceRolls[i] > highestRoll) {
                highestRoll = diceRolls[i];
                firstPlayer = i;
            }  
        }
        turn = firstPlayer;
        textBox.append(`<br>${game.players[firstPlayer].name} is the first player.`);
    },
    initialTurns () {
        //this refers to the 2 initial settlements and roads players can place
        this.roundRobin();
        //loops backwards through initialTurns to create the initial "crescent" turn order described above
        for (let i = initialTurns.length - 1; i >= 0; i--) {
            initialTurns.push(initialTurns[i]);
        }

        //loops through initialTurns array to let the appropriate players build 1 settlement & 1 road using the initial turn order described above
        this.initialPlacement();
    },
    initialPlacement () {
        if (howManyInitialTurns === initialTurns.length) {
            //now sets the default property of every settlement on the board to false
            for (let i = 0; i < game.settlementAreas.length; i++) {
                game.settlementAreas[i].canOccupy = false;
            }

            //lets first player roll
            game.players[turn].roll();

            game.state = 'inProgress';
            textBox.append(`<br>The game is now in progress <br>${game.players[turn].name}, please decide what you want to do by clicking on an action button above.`);

            //makes player actions buttons visible
            playerActions.css('visibility', 'visible');

            textBox.animate({ scrollTop: textBox.prop('scrollHeight') - textBox.height() }, 1);

            return
        }

        turn = initialTurns[howManyInitialTurns];
        textBox.append(`<br>${game.players[initialTurns[howManyInitialTurns]].name}, please place a settlement on the board.`);
        textBox.animate({ scrollTop: textBox.prop('scrollHeight') - textBox.height() }, 1);

        gameSettlement.on('click', buildSettlementClick);
    },
    changeTurn () {
        turn === (game.players.length - 1) ? turn = 0 : turn += 1;
        game.players[turn].roll();

        textBox.append(`<br>It is now Player ${turn}'s turn.`);
        textBox.animate({ scrollTop: textBox.prop('scrollHeight') - textBox.height() }, 1);
    },
    distributeResources (id) {
        if (game.state === 'initializing') {

            let player = game.players[turn];
            let settlement = this.settlementAreas[id];
            settlement.adjacentHexes.forEach(function(hexIdx) {
                let hex = game.hexes[hexIdx];
                if (hex.area !== 'desert') {
                    //increase player's resource count
                    player.resources[hex.resource]++;
                    //increases player's total resource count
                    player.totalResources++;
                    //decreases the bank's quantity of that resource
                    catan.resources[hex.resource].quantity--;
                }
            });

        } else {
            this.roundRobin();

            //loops through game.hexes to see if that hex's numberToken was rolled and to capture what resource it produces, distributing that resource to the players settled on it
            for (let j = 0; j < game.hexes.length; j++) {
                let resource = game.hexes[j].resource;
                let hex = game.hexes[j];

                if ((hex.numberToken === diceTotal) && (catan.resources[resource].quantity > 0)) {
                    hex.settledBy.forEach(function(settler) {
                        //loops through initialTurns array to distribute resources to each player starting from the current player
                        for (let i = 0; i < initialTurns.length; i++) {
                            let player = game.players[initialTurns[i]];
                            if (hex.settledBy.includes(player.player)) {
                                //increases player's resource count
                                player.resources[resource]++;
                                //increases player's total resource count
                                player.totalResources++;
                                //decreases the bank's quantity of that resource
                                catan.resources[hex.resource].quantity--;
                            }
                        }
                    });  
                }
                
            }
        }
        
        game.render();  
    },
    roundRobin () {
        //this goes through all players, starting from the current player
        initialTurns = [];
        
        //the following 2 for loops & while loop create initialPlacement "crescent" turn order, which is different from regular turn order.  initialPlacement turn order starts at current first player and after the last player takes his/her turn, then initial order reverses.  This ends when the first player has placed his/her second settlement and road.
        for (let i = turn; i < game.players.length; i++) {
            initialTurns.push(i);
        }
        //if initialTurns is not the same size as game.players array, continue adding player numbers
        let j = 0;
        while (initialTurns.length < game.players.length) {
            initialTurns.push(j);
            j++;
        }
    },
    endGame () {
        //makes the player action buttons invisible
        playerActions.css('visibility', 'hidden');
        textBox.append(`<br>~~~~~Thank youf or playing!~~~~~<br>Please refresh the page to start a new game.`);
        textBox.animate({ scrollTop: textBox.prop('scrollHeight') - textBox.height() }, 1);
    }
};


//the callback function for the buildRoad event listener
let buildRoadClick = function(e) {
    game.players[turn].buildRoad(e);
};

//the callback function for the buildSettlement event listener
let buildSettlementClick = function (e) {
    game.players[turn].buildSettlement(e);
};

//the callback function for the buildCity event listener
let buildCityClick = function (e) {
    game.players[turn].buildCity(e);
};

//the callback function for Player Actions Click
let buildPlayerActionsClick = function (e) {
    let action = $(e.target).attr('data-action')
    if (action !== 'changeTurn' && action !== 'trade') {
        playerActions.css('visibility', 'hidden');
        cancel.css('visibility', 'visible');
    }
    
    switch ($(e.target).attr('data-action')) {
        case 'buildRoad':
            textBox.append(`<br>${game.players[turn].name} has clicked buildRoad.`);
            if (game.players[turn].resources.lumber >= 1 && game.players[turn].resources.brick >= 1) {
                gameRoad.on('click', buildRoadClick);
            } else {
                textBox.append(`<br>${game.players[turn].name} does not have the proper resources to build a road.`);
            }
            break;
        case 'buildSettlement':
            textBox.append(`<br>${game.players[turn].name} has clicked buildSettlement`);
            if (game.players[turn].resources.lumber >= 1 && game.players[turn].resources.brick >= 1 && game.players[turn].resources.wool >= 1 && game.players[turn].resources.grain > 0) {
                gameSettlement.on('click', buildSettlementClick);
            } else {
                textBox.append(`<br>${game.players[turn].name} does not have the proper resources to build a settlement.`);
            }
            break;
        case 'buildCity':
            textBox.append(`<br>${game.players[turn].name} has clicked buildCity`);
            if (game.players[turn].resources.grain >= 2 && game.players[turn].resources.ore >= 3) {
                gameSettlement.on('click', buildCityClick);
            } else {
                textBox.append(`<br>${game.players[turn].name} does not have the proper resources to build a city.`);
            }
            break;
        case 'trade':
            textBox.append(`<br>${game.players[turn].name} has clicked trade`);

            if (game.players[turn].totalResources > 0) {
                //hides player action buttons
                playerActions.css('visibility', 'hidden');

                //shows trade-who of every player except current player
                tradeWho.css('visibility', 'visible');
                for (let i = 0; i < game.players.length; i++) {
                    if (i !== turn) {
                        $(`.trade-who .traders input[value="${i}"]`).css('visibility', 'visible');
                    }
                }
            } else {
                textBox.append(`<br>${game.players[turn].name} does not have any resources to trade.`);
            }
            break;
        case 'buyDevelopmentCard':
            textBox.append(`<br>${game.players[turn].name} has clicked buyDevelopmentCard`);
            if (game.players[turn].resources.grain >= 1 && game.players[turn].resources.wool >= 1 && game.players[turn].resources.ore >= 1) {
                game.players[turn].buyDevelopmentCard();
            } else {
                textBox.append(`<br>${game.players[turn].name} does not have the proper resources to buy a development card.`);
            }
            break;
        case 'changeTurn':
            textBox.append(`<br>${game.players[turn].name} has clicked changeTurn`);
            game.players[turn].endTurn();
            break;
    }
};

//the callback function for the Cancel Button event listener
let buildCancelClick = function (e) {
    //hides cancel button
    cancel.css('visibility', 'hidden');

    //shows player action buttons
    playerActions.css('visibility', 'visible');

    //turns off all of the event listeners on the board
    gameRoad.off('click', buildRoadClick);
    gameSettlement.off('click', buildSettlementClick);
    gameSettlement.off('click', buildCityClick);
};
//the callback function for the trade-who event listener
let buildTradeWhoClick = function (e) {
    //hides all trade-who player buttons
    for (let i = 0; i < game.players.length; i++) {
        if (i !== turn) {
            $(`.trade-who .traders input[value="${i}"]`).css('visibility', 'hidden');
        }
    }

    //hides trade-who
    tradeWho.css('visibility', 'hidden');

    if ($(e.target).val() === 'bank') {
        tradingPartner = catan;
    } else {
        tradingPartner = parseInt($(e.target).val());
    }

    //updates the maximumValues for each trade partner based on his/her resources
    let player = game.players[turn];
    for (let resource in player.resources) {
        if (player.resources[resource] > 0) {
            //if that player has resources equal to or greater than the value specified, the new max input is that value
            $(`.trade-player input[data-trade="${resource}"]`).attr('max', `${player.resources[resource]}`);
        } else {
            $(`.trade-player input[data-trade="${resource}"]`).attr('max', '0');
        }
    }

    let partner;
    if (tradingPartner === catan) {
        partner = catan
        for (let resource in partner.resources) {
            if (partner.resources[resource].quantity > 0) {
                //if that player has resources equal to or greater than the value specified, the new max input is that value
                $(`.trade-partner input[data-trade="${resource}"]`).attr('max', `${partner.resources[resource].quantity}`);
            } else {
                $(`.trade-partner input[data-trade="${resource}"]`).attr('max', '0');
            }
        }
    } else {
        partner = game.players[tradingPartner];
        for (let resource in partner.resources) {
            if (partner.resources[resource] > 0) {
                //if that player has resources equal to or greater than the value specified, the new max input is that value
                $(`.trade-partner input[data-trade="${resource}"]`).attr('max', `${partner.resources[resource]}`);
            } else {
                $(`.trade-partner input[data-trade="${resource}"]`).attr('max', '0');
            }
        }
    }
    //shows trade-what
    tradeWhat.css('visibility', 'visible');
}

//callback for trade what event listener
let buildTradeWhatClick = function () {
    let player = game.players[turn];
    for (let resource in player.resources) {
        if (player.resources[resource] > 0) {
            //if current player has resources equal to or greater than the value specified, reduce current player's quantity of that resource and increase the trading partner's quantity
            player.resources[resource] -= parseInt($(`.trade-player input[data-trade="${resource}"]`).val());

            if (tradingPartner === catan) {
                catan.resources[resource].quantity += parseInt($(`.trade-player input[data-trade="${resource}"]`).val());
            } else {
                game.players[tradingPartner].resources[resource] += parseInt($(`.trade-player input[data-trade="${resource}"]`).val());
            }

            //resets value back to 0
            $(`.trade-player input[data-trade="${resource}"]`).val('0');
        }
    }

    //receiving
    let partner;
    if (tradingPartner === catan) {
        partner = catan;
        for (let resource in partner.resources) {
            if (partner.resources[resource].quantity > 0 && resource !== 'back') {
                //if the bank has resources equal to or greater than the value specified, decrease the traded amount from bank and increase current player's amount by that much
                partner.resources[resource].quantity -= parseInt($(`.trade-partner input[data-trade="${resource}"]`).val());
                player.resources[resource] += parseInt($(`.trade-partner input[data-trade="${resource}"]`).val());

                //resets value back to 0
                $(`.trade-partner input[data-trade="${resource}"]`).val('0');
            }
        }
    } else {
        partner = game.players[tradingPartner];
        for (let resource in partner.resources) {
            if (partner.resources[resource] > 0) {
                //if trading partner has resources equal to or greater than the value specified, decrease the traded amount from partner and increase current player's amount by that much
                partner.resources[resource] -= parseInt($(`.trade-partner input[data-trade="${resource}"]`).val());
                player.resources[resource] += parseInt($(`.trade-partner input[data-trade="${resource}"]`).val());

                //resets value back to 0
                $(`.trade-partner input[data-trade="${resource}"]`).val('0');
            }
        }
    }
    
    //resets tradingPartner
    tradingPartner = null;

    //updates DOM
    game.render();

    //hides trade-what
    tradeWhat.css('visibility', 'hidden');

    //brings back the player-actions panel in controls section
    playerActions.css('visibility', 'visible');
}

//callback function for robber placement event listener
let placeRobber = function (e) {
    textBox.append(`<br>Please click on a hex to place the robber.`);
    let hexIdx = $(e.target).attr('data-id');
    let hex = game.hexes[hexIdx];
    if ($(e.target).attr('data-type') === 'hex') {
        if (hex.area !== 'desert') {
            for (let i = 0; i < game.hexes.length; i++) {
                if (game.hexes[i].numberToken === null) {
                    game.hexes[i].numberToken = robberTemp;
                    $(`#hex${i} div`).html(`<h3>${game.hexes[i].numberToken}</h3>`);
                }
            }

            robberTemp = hex.numberToken;
            hex.numberToken = null;

            //hides #robber on board
            $('#robber').css('visibility', 'hidden');
    
            //update the DOM so clicked hex now has the robber image on it
            $(`#hex${hex["data-id"]} div`).html(`<img src="resources/imgs/robber/vector/robber.png" id="robber" data-type="numberToken" data-id="robber" alt="Robber" title="Robber">`);
    
            //turns off click on hexes
            gameHex.off('click', placeRobber);
    
            //shows player action buttons
            playerActions.css('visibility', 'visible');
        } else {
            textBox.append(`<br>Please click on a hex that is not a desert.`);
        }
    } else {
        textBox.append(`<br>Please click on a hex.`);
    }
}



/******************************/
/********** Event Listeners **********/
/******************************/
//event listener for New Game button initializes game
$('.new-game__button').on('click', function () {
    $('.new-game__button').css('visibility', 'hidden');
    $('.initial-player-creation').css('visibility', 'visible');
});

//event listener for initial player creation
$('.initial-player-creation').on('click', 'input', function (e) {
    numPlayers = parseInt($(e.target).val());
    game.init();
});

//event listener for Player Action Buttons
playerActions.on('click', buildPlayerActionsClick);

//event listener for Cancel Button
cancel.on('click', buildCancelClick);

//event listener for trade-who button
tradeWho.on('click', buildTradeWhoClick);

//event listener for trade-what button
$('#trade-submit').on('click', buildTradeWhatClick);
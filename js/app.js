/******************************/
/********** Pseudocode **********/
/******************************/
//JavaScript
/*
1. add event listeners to all road areas, settlement & port areas, buttons, robber, hexes, and cards
2. initialize the state
    2a. define players (#, name, etc.) 
    2b. decide turn order
    2c. set player victory points to 0
    2d. refill deck
3. call render
4. initial turn
    4a. players click board to place initial settlements and roads
    4b. store settlement/port areas, road areas taken
    4c. distribute initial hand based on initial settlement placement
    4d. update remaining cards in deck
5. prompt dice roll
    5a. store dice roll value
    5b. check dice roll value
            5bi. if 7
                5bi.i. check player's hand amounts.
                    5bi.i.i. if >7, prompt to discard Math.floor(hand/2)
                5bi.ii. display areas where current player can move robber
                5bi.iii. prompt who current player can steal from
                5bi.iv. remove chosen card from opponent's hand and place it into player's hand.
                5bi.v. update class of settlements on robbed land to "robbed"
            5bii. if not 7 
                5bii.i. check value against stored settlement/port area values
                5bii.ii. distribute resource cards accordingly
    5d. update remaining cards in deck
    5e. prompt user for build, purchase, trade, or end turn
        5ei. if build
            5ei.i. check player's current resources
            5ei.ii. display build options
            5ei.iii. on click, display possible areas to build
            5ei.iv. store player's choice
            5ei.v. update player resources
        5eii. if purchase
            5eii.i. check player's current resources
            5eii.ii. display possible purchase options
            5eii.iii. update player's resources
        5eiii. if trade
            5eiii.i. display trade rates
            5eiii.ii. store player's choice
            5eiii.iii. update player's resources & remaining deck
        5eiv. if end turn, continue to step 5f.
    5f.check special condition fulfillment
        5fi. if yes allot victory points & distribute cards accordingly
        5fii. if no continue to 5g
    5g. allot victory points accordingly
    5h. calculate if there is winner
        5hi. if yes, find winner & end game
        5hii. if no continue
6. change player turn
    6a. repeat step 5

*/

/******************************/
/********** Constants **********/
/******************************/
class Player {
    constructor(name, num) {
        this.name = name;
        this.player = num;
        this.victoryPoints = 0;
        this.victoryPointsHidden = 0;
        this.victoryPointsActual = this.victoryPoints + this.victoryPointsHidden;
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
        //NEED TO ADD: check to see if player has a knight card.  if so, ask if they want to use it.

        dice1 = Math.floor(Math.random() * 6) + 1;
        dice2 = Math.floor(Math.random() * 6) + 1;
        diceTotal = dice1 + dice2;
        game.render();
        $('.text-box').append(`<br>${this.name} rolled ${diceTotal}.`);

        if (game.state === 'initializing') {
            return diceTotal
        }

        if (diceTotal === 7) this.moveRobber();

        game.distributeResources();
    }

    moveRobber () {
        $('.text-box').append(`<br>${this.name} must now move the robber.`);

        //NEED TO ADD: use mouseover, mouseclick, mousehold, and mouserelease events coupled with my Tic-Tac-Toe floating pointer
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
                    $('.text-box').append(`<br>Player ${turn} just placed a road.`);

                    game.roadAreas[id].occupied = true;
                    game.roadAreas[id].canOccupy = false;
                    game.roadAreas[id].ownedByPlayer = turn;

                    $(e.target).css('background-color', `var(--player-${turn}-color1)`).css('opacity', '1').css('box-shadow', '.2rem .2rem .2rem rgba(0, 0, 0, .7)');

                    //reduce player's road pieces by 1
                    this.pieces.road -= 1;
                    if (game.state !== 'initializing') {
                        this.resources.lumber--;
                        this.resources.brick--;

                        catan.resources.lumber.quantity++;
                        catan.resources.brick.quantity++;
                    }

                    //turns off event listeners for road and settlement divs on gameboard
                    // $('.hexes .row .settlement').off('click', buildSettlementClick);
                    // $('.hexes .row .road').off('click', buildRoadClick);
                    
                    game.render();

                    if (game.state === 'initializing') {
                        $('.hexes .row .road').off('click', buildRoadClick);
                        $('.hexes .row .settlement').on('click', buildSettlementClick);
                        howManyInitialTurns++
                        game.initialPlacement();
                    }
                } else {
                    $('.text-box').append('<br>This road must be placed adjacent to one of your existing settlements.');
                }
            } else {
                $('.text-box').append('<br>This is not a valid area to place a road.');
            }

        } else {
            $('.text-box').append(`<br>You don't have anymore road pieces.`);
            $('.hexes .row .road').off('click', buildRoadClick);
        }

        //turns off event listeners for road and settlement divs on gameboard
        if (game.state !== 'initializing') {
            $('.hexes .row .settlement').off('click', buildSettlementClick);
            $('.hexes .row .road').off('click', buildRoadClick);
        }
        
        game.render();
        // $('.hexes .row .settlement').off('click', buildSettlementClick);
        // $('.hexes .row .road').off('click', buildRoadClick);
        // //change turns
        // //function that would 
        // game.render();
        // if (game.state === 'initializing') {
        //     $('.hexes .row .settlement').on('click', buildSettlementClick);
        //     howManyInitialTurns++
        //     game.initialPlacement();
        // }
    }

    buildSettlement (e) {
        debugger
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
                    $('.text-box').append(`<br>Player ${turn} just placed a settlement.`);

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

                        catan.resources.lumber.quantity++;
                        catan.resources.brick.quantity++;
                        catan.resources.wool.quantity++;
                        catan.resources.grain.quantity++;
                    }
                    //increase player's victory points
                    this.victoryPoints++;

                    //turns off event listeners for road and settlement divs on gameboard
                    $('.hexes .row .settlement').off('click', buildSettlementClick);

                    if (game.state === 'initializing') {
                        $('.text-box').append(`<br>${game.players[turn].name}, please place a road on the board adjacent to the settlement you just placed.`);
                        $('.text-box').animate({ scrollTop: $('.text-box').prop('scrollHeight') - $('.text-box').height() }, 500);
                        
                        $('.hexes .row .road').on('click', buildRoadClick);
                        if (howManyInitialTurns >= initialTurns.length / 2 ) game.distributeResources(id);
                    }

                    game.render();
                } else {
                    $('.text-box').append('<br>This settlement cannot be placed within 1 vertex of another already-placed settlement.');
                }
            } else {
                $('.text-box').append('<br>This is not a valid area to place a settlement.');
            }
        } else {
            $('.text-box').append(`<br>You don't have anymore settlement pieces.`)
        }

        //turns off event listeners for road and settlement divs on gameboard
        if (game.state !== 'initializing') {
            $('.hexes .row .settlement').off('click', buildSettlementClick);
            $('.hexes .row .road').off('click', buildRoadClick);
        }
        
        game.render();
        // $('.hexes .row .settlement').off('click', buildSettlementClick);
        // if (game.state === 'initializing') {
        //     $('.text-box').append(`<br>${game.players[turn].name}, please place a road on the board adjacent to the settlement you just placed.`);
        //     $('.text-box').animate({ scrollTop: $('.text-box').prop('scrollHeight') - $('.text-box').height() }, 500);

        //     $('.hexes .row .road').on('click', buildRoadClick);
        // }
        // game.render();
    }

    buildCity (e) {
        if (this.pieces.city > 0) {
            //if the player has clicked an existing settlement that he/she owns and he/she has the appropriate resources
            if (($(e.target).attr('data-type') === settlement)) {
                if (game.settlementAreas[$(e.target).attr('data-id')].ownedByPlayer === turn) {
                    if (this.resources.grain >= 2 && this.resources.ore >= 3) {
                        //changes the DOM to display that a settlement has turned into a city
                        $(e.target).text('C');

                        //changes the settlement's data-type to "city"
                        $(e.target).attr('data-type', 'city');

                        //reduces player's city pieces
                        this.pieces.city -= 1;
                        //increases player's points by 2
                        this.victoryPoints += 2;
                        //changes resource amounts for player & bank
                        if (game.state !== 'initializing') {
                            this.resources.grain -= 2;
                            this.resources.ore -= 3;

                            catan.resources.grain.quantity += 2;
                            catan.resources.ore.quantity += 3;
                        }
                    } else {
                        $('.text-box').append(`<br>You don't have the proper resources to build a city.  A city requires 2 grain and 3 ore to build.`);
                    }
                } else {
                    $('.text-box').append(`<br>Please click on a settlement that you own.`);
                }
            } else {
                $('.text-box').append(`<br>Please click on a settlement.`);
            }
        } else {
            $('.text-box').append(`<br>You don't have anymore city pieces.`);
        }
        
        $('.hexes .row .settlement').off('click', buildCityClick);
        game.render();
    }

    buyDevelopmentCard () {
        let randomCardIdx = Math.floor(Math.random() * dcDeck.length);
        this.developmentCards[(dcDeck.slice(randomCardIdx, randomCardIdx + 1)[0])].quantity++;
        // this.developmentCards.push(dcDeck.slice(randomCardIdx, randomCardIdx + 1)[0]);
        console.log(this.developmentCards);
    }

    tradePlayer () {

    }

    tradeBank () {

    }

    playDevelopmentCard () {
        //if the player played a "knight" card, increase the player's army size by 1
        // if (_____ === 'knight') {
        //     this.special.armySize++;
        // }
    }

    endTurn () {
        game.render();
        //check win logic: if this player has 10 actual victory points (actual = shown + hidden) at the end of his/her turn, he/she has won the game
        if (this.victoryPointsActual === 10) {
            $('.text-box').append(`<br><h2>${this.name} HAS WON THE GAME!</h2>`);
            $('.text-box').animate({ scrollTop: $('.text-box').prop('scrollHeight') - $('.text-box').height() }, 500);

            game.endGame();
        } else if (this.victoryPointsActual !== 10){
            game.changeTurn();
        }
    }
}

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
let dice1, dice2, diceTotal, turn, numPlayers, currentSet;
// //for TESTING purposes
// turn = 0;

//this is a let instead of a const because this needs to be reassigned to a new [] when the game is reinitialized
let initialTurns = [];
let howManyInitialTurns = 0;



/******************************/
/********** Cached Element References **********/
/******************************/





/******************************/
/********** Functions **********/
/******************************/
const game = {
    state: 'initializing',
    players: [],
    hexes: [
        //numberTokens are initialized to 7 because those do not produce any resources
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
        },
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

            $(`#hex${hex['data-id']}`).append(`<img src="${chosenArea.img}">`);
            hex.area = chosenArea.area;
            hex.resource = chosenArea.resource;

            //assigns number tokens to each hex, starting from hex1, and skipping over any desert
            if (hex.area !== 'desert') {
                hex.numberToken = catan.numberTokens[`${hex['data-id']}`]; 
                $(`#hex${hex["data-id"]}`).append(`<div><h3>${hex.numberToken}</h3></div>`);
            } else {
                hex.numberToken = '<img src="resources/imgs/robber/vector/robber.png">';
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

        //Uncommented below for TESTING purposes
        this.getFirstPlayer();
        this.initialTurns();
    },
    render () {
        //updates dice images
        $('#dice1').html(`<img src="resources/imgs/dice/vector/dice-${dice1}.png">`);
        $('#dice2').html(`<img src="resources/imgs/dice/vector/dice-${dice2}.png">`);

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
            console.log(resource);
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

        $('.text-box').animate({ scrollTop: $('.text-box').prop('scrollHeight') - $('.text-box').height() }, 500);
    },
    getFirstPlayer () {
        let diceRolls = [];
        let highestRoll = 0;
        let firstPlayer = 0;

        //makes each player roll dice and return total
        for (let player of game.players) {
            console.log(player);
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
        $('.text-box').append(`<br>${game.players[firstPlayer].name} is the first player.`);
    },
    initialTurns () {
        //this refers to the 2 initial settlements and roads players can place
        this.roundRobin();
        //loops backwards through initialTurns to create the initial "crescent" turn order described above
        for (let i = initialTurns.length - 1; i >= 0; i--) {
            initialTurns.push(initialTurns[i]);
        }
        console.log(initialTurns);

        //loops through initialTurns array to let the appropriate players build 1 settlement & 1 road using the initial turn order described above
        this.initialPlacement();
        // $('.text-box').append(`<br>${game.players[initialTurns[0]].name}, please place a settlement on the board.`);
        // $('.hexes .row .settlement').on('click', buildSettlementClick);
        // for (let i = 0; i < initialTurns.length; i++) {
        //     // this.initialTurn();
        //     // turn = initialTurns[howManyTurns];
        //     // game.initialBuildSettlement();
        //     // game.initialBuildRoad();
        //     $('.text-box').append(`<br>${game.players[initialTurns[i]].name}, please place a settlement on the board.`);
        //     // game.players[initialTurns[i]].buildSettlement();
        //     if (game.players[initialTurns[i]].pieces.settlements === 5) {
        //         $('.hexes .row .settlement').on('click', buildSettlementClick);

        //         s
        //     }

        //     $('.text-box').append(`<br>${game.players[initialTurns[i]].name}, please place a road on the board adjacent to the settlement you just placed.`);
        //     // game.players[initialTurns[i]].buildRoad();
        // }
        
        // game.state = 'inProgress';
        // $('.text-box').append('<br>The game is now in progress');
    },
    initialPlacement () {
        if (howManyInitialTurns === initialTurns.length) {
            //now sets the default property of every settlement on the board to false
            for (let i = 0; i < game.settlementAreas.length; i++) {
                game.settlementAreas[i].canOccupy = false;
            }

            game.state = 'inProgress';
            $('.text-box').append(`<br>The game is now in progress <br>${game.players[turn].name}, please decide what you want to do by clicking on an action button above.`);

            //makes player actions buttons visible
            $('#player__actions').css('visibility', 'visible');

            $('.text-box').animate({ scrollTop: $('.text-box').prop('scrollHeight') - $('.text-box').height() }, 500);

            return
        }

        turn = initialTurns[howManyInitialTurns];
        $('.text-box').append(`<br>${game.players[initialTurns[howManyInitialTurns]].name}, please place a settlement on the board.`);
        $('.text-box').animate({ scrollTop: $('.text-box').prop('scrollHeight') - $('.text-box').height() }, 500);

        $('.hexes .row .settlement').on('click', buildSettlementClick);
        // $('.text-box').append(`<br>${game.players[turn].name}, please place a settlement on the board.`);
        // $('.text-box').append(`<br>${game.players[turn].name}, please place a road on the board adjacent to the settlement you just placed.`);
        // game.initialBuildSettlement();
        // game.initialBuildRoad();
    },
    // initialBuildSettlement () {
    //     $('.text-box').append(`<br>${game.players[turn].name}, please place a settlement on the board.`);
    //         // click to build -> do this   
    // },
    // initialBuildRoad () {
    //     $(".text-box").append(`<br>${game.players[turn].name}, please place a road on the board adjacent to the settlement you just placed.`);
    // },
    changeTurn () {
        //change 3 to game.players.length, this is just for TESTING purposes
        turn === 3 ? turn = 0 : turn += 1;
        game.players[turn].roll();

        $('.road--vertical:hover, .road--left:hover, .road--right:hover, .settlement--side:hover, .settlement--top:hover').css('background-color', `var(--player-${turn}-color1)`);

        $('.text-box').append(`<br>It is now Player ${turn}'s turn.`);
        $('.text-box').animate({ scrollTop: $('.text-box').prop('scrollHeight') - $('.text-box').height() }, 500);
    },
    distributeResources (id) {

        if (game.state === 'initializing') {

            let player = game.players[turn];
            let settlement = this.settlementAreas[id];
            settlement.adjacentHexes.forEach(function(hexIdx) {
                let hex = game.hexes[hexIdx];
                if (hex.area !== 'desert') {
                    player.resources[hex.resource]++;
                    catan.resources[hex.resource].quantity--;
                }
            });

            // if () {
                // currentSett = $(e.target).attr('data-id');
                // for (let i = 0; i < game.settlementAreas[currentSett].adjacentHexes.length; i++) {
                //     if (game.hexes[game.settlementAreas[currentSett].adjacentHexes[i]].area !== 'desert') {
                //         game.players[turn].resources[game.hexes[game.settlementAreas[currentSett].adjacentHexes[i]].resource] += 1;
                //     }
                // }
            // }
            // for (let resource in catan.resources) {
            //     if (resource !== 'back') {
            //         $(`bank__resource__${resource}--num`).text(`${resource.quantity}`);
            //     }
            // }
        } else {
            this.roundRobin();

            for (let i = 0; i < initialTurns.length; i++) {
                //loops through initialTurns array to distribute resources to each player starting from the current player
                let player = game.players[initialTurns[i]];
                //loops through game.hexes to see if that hex's numberToken was rolled and to capture what resource it produces, distributing that resource to the players settled on it
                for (let j = 0; j < game.hexes.length; j++) {
                    let resource = game.hexes[j].resource;
                    let hex = game.hexes[j];

                    if ((game.hexes[j].numberToken === diceTotal) && (catan.resources[resource].quantity > 0) && (game.hexes[j].settledBy.includes(player.player))) {
                        player.resources[resource]++;
                        //decreases the bank's quantity of that resource
                        catan.resources[hex.resource].quantity--;
                    }
                }
            }
            //copied from initializing state above
            // let player = game.players[turn];
            // let settlement = this.settlementAreas[id];
            // settlement.adjacentHexes.forEach(function(hexIdx) {
            //     let hex = game.hexes[hexIdx];
            //     if (hex.area !== 'desert') {
            //         player.resources[hex.resource]++;
            //         catan.resources[hex.resource].quantity--;
            //     }
            // });
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
        //turns off all event listeners in the switch statement below

        //makes the player action buttons invisible
        $('#player__actions').css('visibility', 'hidden');
    }
};


/******************************/
/********** Event Listeners **********/
/******************************/
//event listener for New Game button initializes game
$('.new-game__button').on('click', function () {
    $('.new-game__button').css('visibility', 'hidden');
    $('.initial-player-creation').css('visibility', 'visible');
});

//the callback function for the buildRoad event listener
let buildRoadClick = function(e) {
    game.players[turn].buildRoad(e);
};
// $('.hexes .row .road').on('click', buildRoadClick);
// $('.hexes .row .road').on('click', function (e) {
//     game.players[turn].buildRoad(e);
// });

//the callback function for the buildSettlement event listener
let buildSettlementClick = function (e) {
    game.players[turn].buildSettlement(e);
};
// $('.hexes .row .settlement').on('click', buildSettlementClick);
// $('.hexes .row .settlement').on('click', function (e) {
//     game.players[turn].buildSettlement(e);
// });

//the callback function for the buildCity event listener
let buildCityClick = function (e) {
    game.players[turn].buildCity(e);
};
// $('.hexes .row .settlement').on('click', buildCityClick);
// $('.hexes .row .settlement').on('click', function (e) {
//     game.players[turn].buildCity(e);
// });

//event listener for Player Action Buttons
$('#player__actions').on('click', function (e) {
    console.log($(e.target).attr('data-action'));

    
    switch ($(e.target).attr('data-action')) {
      case 'buildRoad':
        $('.text-box').append(`<br>${game.players[turn].name} has clicked buildRoad`);
        if (game.players[turn].resources.lumber >= 1 && game.players[turn].resources.brick >= 1) {
            $('.hexes .row .road').on('click', buildRoadClick);
        } else {
            $('.text-box').append(`<br>${game.players[turn].name} does not have the proper resources to build a road.`);
        }
        break;
      case 'buildSettlement':
        $('.text-box').append(`<br>${game.players[turn].name} has clicked buildSettlement`);
        if (game.players[turn].resources.lumber >= 1 && game.players[turn].resources.brick >= 1 && game.players[turn].resources.wool >= 1 && game.players[turn].resources.grain > 0) {
            $('.hexes .row .settlement').on('click', buildSettlementClick);
        } else {
            $('.text-box').append(`<br>${game.players[turn].name} does not have the proper resources to build a settlement.`);
        }
        break;
      case 'buildCity':
        $('.text-box').append(`<br>${game.players[turn].name} has clicked buildCity`);
        if (game.players[turn].resources.grain >= 2 && game.players[turn].resources.ore >= 3) {
            $('.hexes .row .settlement').on('click', buildCityClick);
        } else {
            $('.text-box').append(`<br>${game.players[turn].name} does not have the proper resources to build a settlement.`);
        }
        break;
      case 'trade':
        $('.text-box').append(`<br>${game.players[turn].name} has clicked trade`);
        if (game.players[turn].resources.grain >= 2 && game.players[turn].resources.ore >= 3) {
            game.players[turn].buyDevelopmentCard();
        } else {
            $('.text-box').append(`<br>${game.players[turn].name} does not have the proper resources to buy a development card.`);
        }
        game.players[turn].tradeBank();
        break;
      case 'buyDevelopmentCard':
        $('.text-box').append(`<br>${game.players[turn].name} has clicked buyDevelopmentCard`);
        if (game.players[turn].resources.grain >= 1 && game.players[turn].resources.wool >= 1 && game.players[turn].resources.ore >= 1) {
            game.players[turn].buyDevelopmentCard();
        } else {
            $('.text-box').append(`<br>${game.players[turn].name} does not have the proper resources to buy a development card.`);
        }
        break;
      case 'changeTurn':
        $('.text-box').append(`<br>${game.players[turn].name} has clicked changeTurn`);
        game.changeTurn();
        break;
    }
});

$('.initial-player-creation').on('click', 'input', function (e) {
    console.log();
    numPlayers = parseInt($(e.target).val());
    game.init();
});
//individual event listeners
// $(`#buildRoad`).on('click', function () {
//     game.players[turn].buildRoad();
// });
// $(`#buildSettlement`).on('click', function () {
//     game.players[turn].buildSettlement();
// });
// $(`#buildCity`).on('click', function () {
//     game.players[turn].buildCity();
// });
// $(`#trade`).on('click', function () {
//     game.players[turn].tradeBank();
// });
// $(`#buyDevelopmentCard`).on('click', function () {
//     game.players[turn].buyDevelopmentCard();
// });
// $(`#endTurn`).on('click', function () {
//     game.changeTurn();
// });

//implement later
// function updateScroll () {
//     $('.text-box').scrollHeight
// }
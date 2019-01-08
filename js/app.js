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
    constructor(name) {
        this.name = name;
        this.player = game.players.length - 1;
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
            roads: 15,
            settlements: 5,
            cities: 4,
        };
        this.resources = {
            lumber: 0,
            brick: 0,
            wool: 0,
            grain: 0,
            ore: 0
        };
        this.developmentCards = [];
        this.hexesSettled = [];
        this.roadsOwned = [];
    }

    roll () {
        //NEED TO ADD: check to see if player has a knight card.  if so, ask if they want to use it.

        dice1 = Math.floor(Math.random() * 7);
        dice2 = Math.floor(Math.random() * 7);
        game.render();

        if (game.state === 'initializing') {
            return diceTotal
        }

        if (diceTotal === 7) this.moveRobber();

        game.distributeResources();
    }

    moveRobber () {
        console.log(`${this.name} must now move the robber.`);

        //NEED TO ADD: use mouseover, mouseclick, mousehold, and mouserelease events coupled with my Tic-Tac-Toe floating pointer
    }

    buildRoad (e) {
        if (this.pieces.roads > 0) {
            if (game.state === 'initializing') {
                return
            }

            this.pieces.roads -= 1;
        } else {
            console.log(`You don't have anymore road pieces.`)
        }
        
        game.render();
    }

    buildSettlement (e) {
        if (this.pieces.settlements > 0) {
            if (game.state === 'initializing') {
                return
            }
            
            this.pieces.settlements -= 1;
        } else {
            console.log(`You don't have anymore settlement pieces.`)
        }

        game.render();
    }

    buildCity () {
        if (this.pieces.cities > 0) {
            
            this.pieces.cities -= 1;
        } else {
            console.log(`You don't have anymore city pieces.`)
        }
        
        game.render();
    }

    buyDevelopmentCard () {

    }

    tradePlayer () {

    }

    tradeBank () {

    }

    playDevelopmentCard () {

    }

    endTurn () {
        game.changeTurn();
        game.render();
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
            resource: 'mountain'
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





/******************************/
/********** App's State (Variables) **********/
/******************************/
let dice1, dice2, turn;

//this is a let instead of a const because the "Knight" development card can reassign the diceTotal to 7
let diceTotal = dice1 + dice2;

let initialTurns = [];




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
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 1,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 2,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 3,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 4,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 5,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 6,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 7,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 8,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 9,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 10,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 11,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 12,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 13,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 14,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 15,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 16,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 17,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
        {
            'data-type': 'hex',
            'data-id': 18,
            area: 'desert',
            resource: null,
            numberToken: 7
        },
    ],
    settlementAreas: [
        {
            'data-type': 'settlement',
            'data-id': 0,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [1, 14],
            adjacentRoads: [0, 9]
        },
        {
            'data-type': 'settlement',
            'data-id': 1,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [0,2],
            adjacentRoads: [0, 1]
        },
        {
            'data-type': 'settlement',
            'data-id': 2,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [1, 3, 12],
            adjacentRoads: [1, 2, 8]
        },
        {
            'data-type': 'settlement',
            'data-id': 3,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [2, 4],
            adjacentRoads: [2, 3]
        },
        {
            'data-type': 'settlement',
            'data-id': 4,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [3, 10, 5],
            adjacentRoads: [3, 4, 7]
        },
        {
            'data-type': 'settlement',
            'data-id': 5,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [4, 6],
            adjacentRoads: [4, 5]
        },
        {
            'data-type': 'settlement',
            'data-id': 6,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [5, 8],
            adjacentRoads: [5, 6]
        },
        {
            'data-type': 'settlement',
            'data-id': 7,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [8, 25],
            adjacentRoads: [17, 18]
        },
        {
            'data-type': 'settlement',
            'data-id': 8,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [6, 7, 9],
            adjacentRoads: [6, 16, 17]
        },
        {
            'data-type': 'settlement',
            'data-id': 9,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [8, 23, 10],
            adjacentRoads: [15, 16, 19]
        },
        {
            'data-type': 'settlement',
            'data-id': 10,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [4, 9, 11],
            adjacentRoads: [7, 14, 15]
        },
        {
            'data-type': 'settlement',
            'data-id': 11,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [10, 12, 21],
            adjacentRoads: [13, 14, 20]
        },
        {
            'data-type': 'settlement',
            'data-id': 12,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [2, 11, 13],
            adjacentRoads: [8, 12, 13]
        },
        {
            'data-type': 'settlement',
            'data-id': 13,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [12, 14, 19],
            adjacentRoads: [11, 12, 21]
        },
        {
            'data-type': 'settlement',
            'data-id': 14,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [0, 13, 15],
            adjacentRoads: [9, 10, 11]
        },
        {
            'data-type': 'settlement',
            'data-id': 15,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [14, 17],
            adjacentRoads: [10, 22]
        },
        {
            'data-type': 'settlement',
            'data-id': 16,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [17, 37],
            adjacentRoads: [23, 38]
        },
        {
            'data-type': 'settlement',
            'data-id': 17,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [15, 16, 18],
            adjacentRoads: [22, 23, 24]
        },
        {
            'data-type': 'settlement',
            'data-id': 18,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [17, 19, 35],
            adjacentRoads: [24, 25, 27]
        },
        {
            'data-type': 'settlement',
            'data-id': 19,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [13, 18, 20],
            adjacentRoads: [21, 25, 26]
        },
        {
            'data-type': 'settlement',
            'data-id': 20,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [19, 21, 33],
            adjacentRoads: [26, 27, 36]
        },
        {
            'data-type': 'settlement',
            'data-id': 21,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [11, 20, 22],
            adjacentRoads: [20, 27, 28]
        },
        {
            'data-type': 'settlement',
            'data-id': 22,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [21, 23, 31],
            adjacentRoads: [28, 29, 35]
        },
        {
            'data-type': 'settlement',
            'data-id': 23,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [9, 22, 24],
            adjacentRoads: [19, 29, 30]
        },
        {
            'data-type': 'settlement',
            'data-id': 24,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [23, 29, 25],
            adjacentRoads: [30, 31, 34]
        },
        {
            'data-type': 'settlement',
            'data-id': 25,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [7, 24, 26],
            adjacentRoads: [18, 31, 32]
        },
        {
            'data-type': 'settlement',
            'data-id': 26,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [25, 27],
            adjacentRoads: [32, 33]
        },
        {
            'data-type': 'settlement',
            'data-id': 27,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [26, 28],
            adjacentRoads: [33, 48]
        },
        {
            'data-type': 'settlement',
            'data-id': 28,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [27, 29, 46],
            adjacentRoads: [47, 48, 49]
        },
        {
            'data-type': 'settlement',
            'data-id': 29,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [24, 28, 30],
            adjacentRoads: [34, 46, 47]
        },
        {
            'data-type': 'settlement',
            'data-id': 30,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [29, 31, 44],
            adjacentRoads: [45, 46, 50]
        },
        {
            'data-type': 'settlement',
            'data-id': 31,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [22, 30, 32],
            adjacentRoads: [35, 44, 45]
        },
        {
            'data-type': 'settlement',
            'data-id': 32,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [31, 33, 42],
            adjacentRoads: [43, 44, 51]
        },
        {
            'data-type': 'settlement',
            'data-id': 33,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [20, 32, 34],
            adjacentRoads: [36, 42, 43]
        },
        {
            'data-type': 'settlement',
            'data-id': 34,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [33, 35, 40],
            adjacentRoads: [41, 42, 52]
        },
        {
            'data-type': 'settlement',
            'data-id': 35,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [18, 34, 36],
            adjacentRoads: [37, 40, 41]
        },
        {
            'data-type': 'settlement',
            'data-id': 36,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [35, 37, 38],
            adjacentRoads: [39, 40, 53]
        },
        {
            'data-type': 'settlement',
            'data-id': 37,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [16, 36],
            adjacentRoads: [38, 39]
        },
        {
            'data-type': 'settlement',
            'data-id': 38,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [36, 39],
            adjacentRoads: [53, 54]
        },
        {
            'data-type': 'settlement',
            'data-id': 39,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [38, 40, 53],
            adjacentRoads: [54, 55, 65]
        },
        {
            'data-type': 'settlement',
            'data-id': 40,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [34, 39, 41],
            adjacentRoads: [52, 55, 56]
        },
        {
            'data-type': 'settlement',
            'data-id': 41,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [40, 42, 51],
            adjacentRoads: [56, 57, 64]
        },
        {
            'data-type': 'settlement',
            'data-id': 42,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [32, 41, 43],
            adjacentRoads: [51, 57, 58]
        },
        {
            'data-type': 'settlement',
            'data-id': 43,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [42, 44, 49],
            adjacentRoads: [58, 59, 63]
        },
        {
            'data-type': 'settlement',
            'data-id': 44,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [30, 43, 45],
            adjacentRoads: [50, 59, 60]
        },
        {
            'data-type': 'settlement',
            'data-id': 45,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [44, 46, 47],
            adjacentRoads: [60, 61, 62]
        },
        {
            'data-type': 'settlement',
            'data-id': 46,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [28, 45],
            adjacentRoads: [49, 61]
        },
        {
            'data-type': 'settlement',
            'data-id': 47,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [45, 48],
            adjacentRoads: [62, 71]
        },
        {
            'data-type': 'settlement',
            'data-id': 48,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [47, 49],
            adjacentRoads: [70, 71]
        },
        {
            'data-type': 'settlement',
            'data-id': 49,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [43, 48, 50],
            adjacentRoads: [63, 69, 70]
        },
        {
            'data-type': 'settlement',
            'data-id': 50,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [49, 51],
            adjacentRoads: [68, 69]
        },
        {
            'data-type': 'settlement',
            'data-id': 51,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [41, 50, 52],
            adjacentRoads: [64, 67, 68]
        },
        {
            'data-type': 'settlement',
            'data-id': 52,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
            neighbors: [51, 53],
            adjacentRoads: [66, 67]
        },
        {
            'data-type': 'settlement',
            'data-id': 53,
            occupied: false,
            canOccupy: true,
            ownedByPlayer: null,
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

        //NEED TO ADD: Shuffle catan.developmentCards

        //Uncommented below for TESTING purposes
        // this.getFirstPlayer();
        // this.initialPlacement();
    },
    render () {
        for (let player of game.players) {
            if (player.special.longestRoad === true) {
                $(`#player-${player.player} .road-card .road--card img`).css('opacity', '1');
            }

            if (player.special.largestArmy === true) {
                $(`#player-${player.player} .army-card .army--card img`).css('opacity', '1');
            }
        }
    },
    getFirstPlayer () {
        let diceRolls = [];
        let highestRoll = 0;
        let firstPlayer = 0;

        //makes each player roll dice and return total
        for (let player of game.players) {
            diceRolls.push(player.rollDice());

            console.log(`${player.name} rolled a ${diceTotal}`);
        }
        
        //compares those dice totals from diceRolls array to determine firstPlayer & sets that person as first player
        for (let i = 0; i < diceRolls.length; i++) {
            if (diceRolls[i] > highestRoll) {
                highestRoll = diceRolls[i];
                firstPlayer = i;
            }  
        }
        turn = firstPlayer;
        console.log(`${game.players[firstPlayer].name} is the first player.`);
    },
    initialPlacement () {
        //this refers to the 2 initial settlements and roads players can place
        this.roundRobin();
        //loops backwards through initialTurns to create the initial "crescent" turn order described above
        for (let i = initialTurns.length - 1; i >= 0; i--) {
            initialTurns.push(initialTurns[i]);
        }
        console.log(initialTurns);

        //loops through initialTurns array to let the appropriate players build 1 settlement & 1 road using the initial turn order described above
        for (let i = 0; i < initialTurns.length; i++) {
            game.players[initialTurns[i]].buildSettlement();
            game.players[initialTurns[i]].buildRoad();
        }
        
        game.state = 'inProgress';
        console.log('The game is now in progress');
    },
    changeTurn () {
        //change 3 to game.players.length, this is just for TESTING purposes
        turn === 3 ? turn = 0 : turn += 1;

        $('.road--vertical:hover, .road--left:hover, .road--right:hover, .settlement--side:hover, .settlement--top:hover').css('background-color', `var(--player-${turn}-color1)`);

        console.log(`It is now Player ${turn + 1}'s turn.`);
    },
    distributeResources () {
        this.roundRobin();
        
    },
    roundRobin () {
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
    }
};

//for TESTING purposes
turn = 2;


/******************************/
/********** Event Listeners **********/
/******************************/
//Places current player's appropriate piece on the gameboard
$('.hexes .row .settlement').on('click', function (e) {
    console.log(e.target);
    if ($(e.target).hasClass('settlement')) {
        let id = $(e.target).attr('data-id');
        
        for (let i = 0; i < game.settlementAreas[id].neighbors.length; i++) {
            if (game.settlementAreas[game.settlementAreas[id].neighbors[i]].occupied === true) {
                game.settlementAreas[id].canOccupy = false;
            }
        }

        //changes clicked area to current player's color
        if (game.settlementAreas[id].canOccupy === true) {
            console.log(`Player ${turn + 1} just placed a settlement.`);

            game.settlementAreas[id].occupied = true;
            game.settlementAreas[id].canOccupy = false;
            game.settlementAreas[id].ownedByPlayer = turn;

            $(e.target).css("background-color", `var(--player-${turn}-color1)`).css("opacity", "1").css("box-shadow", ".2rem .2rem .2rem rgba(0, 0, 0, .7)");

            //change turn
            game.changeTurn();
        } else {
            console.log('This settlement cannot be placed within 1 vertex of another already-placed settlement.')
        }
    } else {
        console.log('This is not a valid area to place a settlement.')
    }
});

$('.hexes .row .road').on('click', function (e) {
    console.log(e.target);
    if ($(e.target).hasClass('road')) {
        let id = $(e.target).attr('data-id');
        console.log(`road data-id: ${id}`);
        
        //this was just copied and pasted from player.buildSettlement() method.  Commented out in case I need something from it later
        // for (let i = 0; i < game.roadAreas[id].settlements.length; i++) {
        //     if (game.roadAreas[game.roadAreas[id].settlements[i]].occupied === true) {
        //         game.roadAreas[id].canOccupy = false;
        //     }
        // }

        //if the road you are trying to place is next to a settlement you own or next to a road you own, you can occupy that road
        for (let i = 0; i < game.roadAreas[id].adjacentRoads.length; i++) {
            if ((game.roadAreas[game.roadAreas[id].adjacentRoads[i]].ownedByPlayer === turn) || (game.settlementAreas[game.roadAreas[id].settlements[0]].ownedByPlayer === turn || game.settlementAreas[game.roadAreas[id].settlements[1]].ownedByPlayer === turn)) {
                game.roadAreas[id].canOccupy = true;
            } 
        }

        //changes clicked area to current player's color
        if (game.roadAreas[id].canOccupy === true && game.roadAreas[id].occupied === false) {
            console.log(`Player ${turn + 1} just placed a road.`);

            game.roadAreas[id].occupied = true;
            game.roadAreas[id].canOccupy = false;
            game.roadAreas[id].ownedByPlayer = turn;

            $(e.target).css("background-color", `var(--player-${turn}-color1)`).css("opacity", "1").css("box-shadow", ".2rem .2rem .2rem rgba(0, 0, 0, .7)");

            //change turn
            game.changeTurn();
            
        } else {
            console.log('This road must be placed adjacent to one of your existing settlements.')
        }
    } else {
        console.log('This is not a valid area to place a road.')
    }
});
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





/******************************/
/********** Cached Element References **********/
/******************************/





/******************************/
/********** Event Listeners **********/
/******************************/





/******************************/
/********** Functions **********/
/******************************/
const game = {
    players: [],
    hexes: [
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

    },
    render () {

    }
};

let turn = 2;

//Places current player's appropriate piece on the gameboard
$('.hexes').on('click', function (e) {
    console.log(e.target);
    console.log($(e.target).attr('class'));
    if ($(e.target).attr('class') !== "row" && $(e.target).attr('class') !== "hex" && $(e.target).attr('class') !== "hexes") {
        console.log(`Player ${turn + 1} is taking his/her turn.`);

      $(e.target).css("background-color", `var(--player-${turn}-color1)`).css("opacity", "1").css("box-shadow", ".2rem .2rem .2rem rgba(0, 0, 0, .7)");

        //change turn
        turn === 3 ? turn = 0 : turn += 1;
        console.log(`It is now Player ${turn + 1}'s turn.`)
    }
    
    
});


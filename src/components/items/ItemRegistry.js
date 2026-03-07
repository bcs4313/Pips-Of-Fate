
// architecture relies on the Inventory object to queue engine state changes for item steps
// for items that modify the inventory itself a hook must be retrieved from the engine to
// get the inventory context, getting access to its various public functions.
export const ItemRegistry = {
    shiny_coin: {
        id: "shiny_coin",
        basePrice: 10,
        name: "Shiny Coin",
        rarity: "common",
        description: "Earn an extra 5 gold per round",
        image: "shiny_coin.png",
        stackable: true,
        steps: {
            END_ROLL: (engineState, hooks) => {
                return {...engineState, gold: engineState.gold + 5}
            }
        }
    },
    beggars_luck: {
        id: "beggars_luck",
        basePrice: 25,
        name: "Beggar's Luck",
        rarity: "rare",
        description: "If you roll a 1, turn it into a 6 instead",
        image: "shiny_coin.png",
        stackable: false,
        steps: {
            PRE_ROLL_RESULT: (engineState, hooks) => {
                //return {...engineState, gold: engineState.gold + 5}
            }
        }
    }
}

// valid step examples:
// END_ROUND

// a uiBus will handle updates on the ui side
// some ideas...
//uiBus.emit("DIE_FLASH", { dieIndex: 2, ms: 120 })
//uiBus.emit("DIE_OVERLAY_SET", { dieIndex: 2, overlay: "ice" })
//uiBus.emit("FLOATING_TEXT", { anchor: "die:2", text: "+5" })
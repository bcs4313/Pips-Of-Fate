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
            END_ROUND: (engineState, InventoryInterface, hooks) => {
                return {...engineState, gold: engineState.gold + 5}
            }
        }
    },
    beggars_candle: {
        id: "beggars_candle",
        basePrice: 25,
        name: "Beggar's Candle",
        rarity: "rare",
        description: "If you roll a 1, the next roll is guaranteed to be a 6",
        image: "beggars_candle.png",
        stackable: false,
        steps: {
            PRE_ROLL_RESULT: async (engineState, inventoryInterface, hooks) => {
                console.log("hooks:::")
                console.log(hooks)
                const UIBus = hooks["getUIBus"]()
                const diceValues = hooks["getDiceValues"]()
                const newDiceValues = [...diceValues]
                console.log(newDiceValues)
                for(let i = 0; i < newDiceValues.length; i++)
                {
                    const val = newDiceValues[i]
                    if(val == 1)
                    {
                        console.log("reacted to val = 1")
                        newDiceValues[i] = 6

                        UIBus.emit("DIE_FLASH", {
                            dice: [i]
                        })
                        hooks["setDiceValues"]([i], [6])
                    }
                }

                return {...engineState}
            }
        },
    }
}

// valid step examples:
// END_ROUND

// a uiBus will handle updates on the ui side
// some ideas...
//uiBus.emit("DIE_FLASH", { dieIndex: 2, ms: 120 })
//uiBus.emit("DIE_OVERLAY_SET", { dieIndex: 2, overlay: "ice" })
//uiBus.emit("FLOATING_TEXT", { anchor: "die:2", text: "+5" })
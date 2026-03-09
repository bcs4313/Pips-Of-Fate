import { assetMap } from "./../../utilities/assetMap"

// architecture relies on the Inventory object to queue engine state changes for item steps
// for items that modify the inventory itself a hook must be retrieved from the engine to
// get the inventory context, getting access to its various public functions.
export const ItemRegistry = {
    shiny_coin: {
        id: "shiny_coin",
        basePrice: 10,
        name: "Shiny Coin",
        rarity: "common",
        description: "Earn an extra 2 gold per round",
        image: "shiny_coin.png",
        stackable: true,
        steps: {
            END_ROUND: (engineState, InventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                UIBus.emit("ITEM_FLASH", {
                    itemID: "shiny_coin"
                })
                return {...engineState, gold: engineState.gold + 2}
            }
        }
    },
    beggars_candle: {
        id: "beggars_candle",
        basePrice: 20,
        name: "Beggar's Candle",
        rarity: "rare",
        description: "If you roll a 1, the next roll is guaranteed to be a 6",
        image: "beggars_candle.png",
        stackable: false,
        steps: {
            PRE_ROLL_RESULT: async (engineState, inventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                const diceValues = hooks["getDiceValues"]()
                const newDiceValues = [...diceValues]
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
                        
                        UIBus.emit("ITEM_FLASH", {
                            itemID: "beggars_candle"
                        })
                        hooks["setDiceValues"]([i], [6])
                    }
                }

                return {...engineState}
            }
        },
    },
        russian_roulette: {
        id: "russian_roulette",
        basePrice: 15,
        name: "Russian Roulette",
        rarity: "uncommon",
        description: "Activate: 1/6 chance to instantly lose, increase your current score and gold by 50%",
        image: "russian_roulette.png",
        stackable: false,
        active: async (engineState, inventoryInterface, hooks) => {
            console.log("russian roulette: activate")
            let outcome = Math.floor(Math.random() * 6) + 1
            const UIBus = hooks["getUIBus"]()
            UIBus.emit("ITEM_FLASH", {
                itemID: "russian_roulette"
            })

            if(outcome === 6)
            {
                // GAME OVER
                const audio = new Audio(assetMap["items/sounds_unique/ShootGun.mp3"])
                audio.play()

                await new Promise((resolve, reject) => setTimeout(() => resolve("done"), 1000))

                hooks["forceGameOver"]()
                return {...engineState}
            } 
            else
            {
                const audio = new Audio(assetMap["items/sounds_unique/EmptyGun.mp3"])
                audio.play()
                const newGold = Math.ceil(engineState.gold * 1.5)
                hooks["addScore"](Math.ceil(hooks["getScore"]() * 0.5))

                return {...engineState, gold: newGold}
            }
        },
    },
    pot_of_gold: {
        id: "pot_of_gold",
        basePrice: 20,
        name: "Pot of Gold",
        rarity: "rare",
        description: "Every roll adds 5% of your current gold to the score, rounded up.",
        image: "pot_of_gold.png",
        stackable: true,
        steps: {
           PRE_ROLL_RESULT: (engineState, InventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                if(engineState.gold != 0)
                {
                    UIBus.emit("ITEM_FLASH", {
                        itemID: "pot_of_gold"
                    })

                    UIBus.emit("ITEM_FLOATING_TEXT", {
                        itemID: "pot_of_gold",
                        msg: "+" + (engineState.gold * 0.05).toFixed(1),
                    })
                }
                hooks["addScore"](engineState.gold * 0.05)
                return engineState
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
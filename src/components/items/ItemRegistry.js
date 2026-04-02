import { assetMap } from "./../../utilities/assetMap"
import { useSoundChannel } from "./../../utilities/soundManagerProvider"

// architecture relies on the Inventory object to queue engine state changes for item steps
// for items that modify the inventory itself a hook must be retrieved from the engine to
// get the inventory context, getting access to its various public functions.
export const ItemRegistry = {
    shiny_coin: {
        id: "shiny_coin",
        basePrice: 7.5,
        name: "Shiny Coin",
        rarity: "common",
        description: "Earn an extra 2.5 gold per round",
        image: "shiny_coin.png",
        stackable: true,
        steps: {
            END_ROUND: (engineState, inventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                const itemStacks = inventoryInterface.getItemStacks("shiny_coin")
                UIBus.emit("ITEM_FLASH", {
                    itemID: "shiny_coin"
                })
                return {...engineState, gold: engineState.gold + (2.5*itemStacks)}
            }
        }
    },
    beggars_candle: {
        runtime: {},  // stores state variables
        id: "beggars_candle",
        basePrice: 10,
        name: "Beggar's Candle",
        rarity: "common",
        description: "Turn every 1 you roll into a 6",
        image: "beggars_candle.png",
        stackable: false,
        steps: {
            POST_ROLL_RESULT: async (engineState, inventoryInterface, hooks) => {
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

                //await new Promise(resolve => setTimeout(resolve, 1000));
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
                hooks.playSound("ShootGun")

                await new Promise((resolve, reject) => setTimeout(() => resolve("done"), 1000))

                hooks["forceGameOver"]()
                return {...engineState}
            } 
            else
            {
                hooks.playSound("EmptyGun")
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
        description: "Every roll adds 20% of your current gold to the score. +1 gold per roll.",
        image: "pot_of_gold.png",
        stackable: false,
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
                        msg: "+" + (engineState.gold * 0.1).toFixed(1),
                        color:"lime",
                    })
                }
                hooks["addScore"](engineState.gold * 0.2)
                return engineState
            },
            END_ROLL: (engineState, InventoryInterface, hooks) => {
                return  {...engineState, gold: engineState.gold+1}
            }
        }
    },
    frozen_assets: {
        id: "frozen_assets",
        basePrice: 25,
        name: "Frozen Assets",
        rarity: "epic",
        description: "After you roll, all frozen dice give 6 minus their die value in gold.",
        image: "frozen_assets.png",
        stackable: false,
        steps: {
        END_ROLL: (engineState, InventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                const diceValues = hooks["getDiceValues"]()
                const frozenDice = engineState["frozenDice"]

                let goldToGive = 0
                frozenDice.forEach((dieIndex) => {
                    goldToGive += 6 - diceValues[dieIndex]
                })
                //console.log("goldToGive = " + goldToGive)
                

                if(goldToGive > 0)
                {
                    UIBus.emit("ITEM_FLASH", {
                        itemID: "frozen_assets"
                    })
                    
                    UIBus.emit("ITEM_FLOATING_TEXT", {
                        itemID: "frozen_assets",
                        color:"yellow",
                        msg: "+" + (goldToGive).toFixed(0) + " G",
                    })
                }

                return  {...engineState, gold: engineState.gold+goldToGive}
            }
        }
    },
    cardboard_box: {
        id: "cardboard_box",
        basePrice: 10,
        name: "Cardboard Box",
        rarity: "common",
        description: "At the end of each roll, store 15% of your score in this item. Click on the box to empty it onto your current score.",
        image: "cardboard_box.png",
        stackable: false,
        steps: {
            END_ROLL: (engineState, InventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                const itemData = InventoryInterface.getItemData()
                const currentBoxScore = itemData["cardboard_box.score"] ? parseFloat(parseFloat(itemData["cardboard_box.score"]).toFixed(1)) : 0
                const newBoxScore = currentBoxScore + Math.floor(hooks["getScore"]()*0.15)
                UIBus.emit("ITEM_FADING_TEXT", {
                    itemID: "cardboard_box",
                    color:"cyan",
                    msg: "Storage: " + newBoxScore,
                })
                itemData["cardboard_box.score"] = currentBoxScore + Math.floor(hooks["getScore"]()*0.15)
                InventoryInterface.setItemData(itemData)
                return  {...engineState}
            }
        },
        active: async (engineState, inventoryInterface, hooks) => {
            console.log("cardboard box : activate")
            const UIBus = hooks["getUIBus"]()
            const itemData = inventoryInterface.getItemData()
            let amount = itemData["cardboard_box.score"]
            UIBus.emit("ITEM_FLASH", {
                itemID: "cardboard_box"
            })
            itemData["cardboard_box.score"] = 0

            if(amount == null || amount == undefined)
            {
                amount = 0
            }

            hooks.playSound("OpenBox")
            inventoryInterface.setItemData({...itemData})

            await new Promise((resolve, reject) => setTimeout(() => resolve("done"), 1000))

            hooks["addScore"](amount)
            return  {...engineState}
        },
    },
    furnace : {
        id: "furnace",
        basePrice: 15,
        name: "Furnace",
        rarity: "Uncommon",
        description: "+15% base multiplier to all rolls. Activate: sacrifice a roll. Permanently gain +5% more score per sacrifice (additive).",
        image: "furnace.png",
        stackable: false,
        steps: {
        },
        steps: {
            START_ROLL: (engineState, inventoryInterface, hooks) => {
                console.log("START_ROLL")
                const itemData = inventoryInterface.getItemData() 
                console.log(itemData)
                itemData["furnace.prevScore"] = hooks["getScore"]()
                inventoryInterface.setItemData(itemData)
                return  {...engineState}
            },
            END_ROLL: (engineState, inventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                const itemData = inventoryInterface.getItemData()
                const prevScore = itemData["furnace.prevScore"] ? parseFloat(parseFloat(itemData["furnace.prevScore"]).toFixed(2)) : 0
                const scoreDifference = hooks["getScore"]() - prevScore
                const currentScoreMultiplier = itemData["furnace.multiplier"] ? parseFloat(parseFloat(itemData["furnace.multiplier"]).toFixed(2)) : 0.15
                const amount = (parseFloat(scoreDifference) * parseFloat(currentScoreMultiplier))
                hooks["addScore"](amount)
                UIBus.emit("ITEM_FLOATING_TEXT", {
                    itemID: "furnace",
                    color:"orange",
                    msg: "+" + amount.toFixed(),
                })
                return  {...engineState}
            }
        },
        active: async (engineState, inventoryInterface, hooks) => {
            const UIBus = hooks["getUIBus"]()
            const itemData = inventoryInterface.getItemData()
            const currentScoreMultiplier = itemData["furnace.multiplier"] ? parseFloat(parseFloat(itemData["furnace.multiplier"]).toFixed(2)) : 0.15
            const newMult = currentScoreMultiplier + 0.05

            console.log("current score mult: " + currentScoreMultiplier)
            console.log("new mult = " + newMult)
            UIBus.emit("ITEM_FLOATING_TEXT", {
                itemID: "furnace",
                color:"orange",
                msg: "Multiplier +0.05x",
            })
            UIBus.emit("ITEM_FADING_TEXT", {
                itemID: "furnace",
                color:"cyan",
                msg: "Current multiplier: " + (1+parseFloat(newMult.toFixed(2))) + "x",
            })
            UIBus.emit("ITEM_FLASH", {
                itemID: "furnace"
            })

            hooks.playSound("FurnaceBurn")

            itemData["furnace.multiplier"] = newMult.toFixed(2)
            inventoryInterface.setItemData(itemData)
            hooks["addRolls"](-1)
            return  {...engineState}
        },
    },
    uranium_rod: {
        id: "uranium_rod",
        basePrice: 15,
        name: "Uranium Rod",
        rarity: "uncommon",
        description: "Rolling a 3 applies 2 radiation stacks to the board.",
        image: "uranium_rod.png",
        stackable: true,
        steps: {
            END_ROLL: (engineState, inventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                const rads = engineState["radiationStacks"]
                const diceValues = hooks["getDiceValues"]()
                const itemStacks = inventoryInterface.getItemStacks("uranium_rod")
 
                const itemBounds = inventoryInterface["getItemBounds"]("uranium_rod")
                let threeCount = diceValues.reduce((accum, value, index) => {
                    if(value == 3)
                    {
                        accum += 1
                        // particle effect
                        const die = document.getElementById("dice-img-" + index)
                        const dieBounds = die.getBoundingClientRect()
                        UIBus.emit("PARTICLE_RAY", {
                            travelTime:1,
                            emissionTime:1,
                            killTime:2,
                            maxParticles:300,
                            originX: dieBounds.x + dieBounds.width/2,
                            originY: dieBounds.y + dieBounds.height/2,
                            destX: itemBounds.x + itemBounds.width/2,
                            destY: itemBounds.y + itemBounds.height/2,
                            spreadX: dieBounds.width/4,
                            spreadY: dieBounds.height/4,
                        })
                    }
                    return accum
                }, 0)

                if(threeCount > 0)
                {
                    console.log("uranium rod trigger")
                    console.log(diceValues)
                    if(Math.random() > 0.5)
                    {
                        hooks.playSound("RadAbsorb1")
                    }
                    else
                    {
                        hooks.playSound("RadAbsorb2")
                    }
                }

                console.log("accum = " + threeCount * itemStacks * 2)

                if(rads == undefined)
                {
                    engineState["radiationStacks"] = threeCount * itemStacks * 2
                } 
                else
                {
                    engineState["radiationStacks"] = parseInt(engineState["radiationStacks"]) + threeCount * itemStacks * 2
                }
                return  {...engineState}
            }
        },
    },
    dumbbell: {
        id: "dumbbell",
        basePrice: 15,
        name: "Dumbbell",
        rarity: "uncommon",
        description: "Gain +1 score on your first roll in the round. Increase this gain by 1 every round.",
        image: "dumbbell.png",
        stackable: true,
        steps: {
            END_ROUND: (engineState, inventoryInterface, hooks) => {
                console.log("end round dumbbell")
                const UIBus = hooks["getUIBus"]()
                const itemData = inventoryInterface.getItemData()
                const currentStacks = itemData["dumbbell.scoreStacked"] ? parseInt(itemData["dumbbell.scoreStacked"]) : 0
                const itemStacks = inventoryInterface.getItemStacks("dumbbell")
                UIBus.emit("ITEM_FADING_TEXT", {
                    itemID: "dumbbell",
                    color:"cyan",
                    msg: "Stacked Score: " + (parseInt(currentStacks)+itemStacks),
                })

                if(itemData["dumbbell.scoreStacked"] == undefined || isNaN(itemData["dumbbell.scoreStacked"]))
                {
                    itemData["dumbbell.scoreStacked"] = itemStacks
                }
                else
                {
                    itemData["dumbbell.scoreStacked"] += itemStacks
                }
                inventoryInterface.setItemData(itemData)
                return engineState
            },
            PRE_ROLL_RESULT: (engineState, inventoryInterface, hooks) => {
                console.log("end roll dumbbell")
                const UIBus = hooks["getUIBus"]()
                const itemData = inventoryInterface.getItemData()
                const currentStacks = itemData["dumbbell.scoreStacked"] ? parseInt(itemData["dumbbell.scoreStacked"]) : 0

                if((engineState.baseRolls) == hooks["getRollsLeft"]())
                {
                    UIBus.emit("ITEM_FLOATING_TEXT", {
                        itemID: "dumbbell",
                        color:"lime",
                        msg: "+" + currentStacks,
                    })

                    hooks["addScore"](currentStacks)
                }
                return  {...engineState}
            }
        },
    },
    clover: {
        id: "clover",
        basePrice: 10,
        name: "Green Clover",
        rarity: "common",
        description: "50% chance for any dice to roll +1 higher. Stacks apply their chance separately, potentially boosting a die multiple times.",
        image: "clover.png",
        stackable: true,
        steps: {
            POST_ROLL_RESULT: (engineState, inventoryInterface, hooks) => {
                const UIBus = hooks["getUIBus"]()
                const diceValues = hooks["getDiceValues"]()
                const newDiceValues = [...diceValues]
                const itemStacks = inventoryInterface.getItemStacks("clover")
                let totalGain = 0
                for(let s = 0; s < itemStacks; s++)
                {
                    for(let i = 0; i < newDiceValues.length; i++)
                    {
                        if(Math.random() < 0.5)
                        {
                            newDiceValues[i] += 1
                            totalGain+=1
                        }
                    }
                }
                console.log("new dice values ")
                console.log(newDiceValues)
                const indexes = Array.from({length: newDiceValues.length}, (_, i) => i)
                hooks["setDiceValues"](indexes, newDiceValues)

                UIBus.emit("ITEM_FLOATING_TEXT", {
                    itemID: "clover",
                    color:"lime",
                    msg: "+" + totalGain,
                })


                //await new Promise(resolve => setTimeout(resolve, 1000));
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

// architecture relies on the Inventory object to call setEngineState for item steps
export const ItemRegistry = {
    shiny_coin: {
        id: "shiny_coin",
        name: "Shiny Coin",
        rarity: "common",
        description: "Earn an extra 5 gold per round",
        image: "shiny_coin.png",
        stackable: true,
        steps: {
            END_ROUND: (engineState) => {
                return {...engineState, gold: engineState.gold + 5}
            }
        }
    }
}

// a uiBus will handle updates on the ui side
// some ideas...
//uiBus.emit("DIE_FLASH", { dieIndex: 2, ms: 120 })
//uiBus.emit("DIE_OVERLAY_SET", { dieIndex: 2, overlay: "ice" })
//uiBus.emit("FLOATING_TEXT", { anchor: "die:2", text: "+5" })
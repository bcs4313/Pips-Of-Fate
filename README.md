# Pips of Fate


A fast-paced roguelite where every roll matters.

Build your strategy with dice, items, and upgrades to beat increasingly difficult quotas across rounds.

<a href="https://pipsoffate.com/">Play the Game Now</a>

## Why its interesting
- Risk vs consistency: freeze high-value dice or gamble for better rolls
- Build synergy: items stack and interact in unexpected ways
- Scaling pressure: quotas increase every round, forcing adaptation

## Gameplay Loop
1. Roll dice (3 rolls per round, increased with upgrades)
2. Freeze valuable dice or reroll
3. Hit the quota to survive
4. Earn gold → buy upgrades and items
5. Repeat with increasing difficulty

<img src="https://i.imgur.com/dhNVS0h.png" alt="Main Page" width="100%">


### Starting a run
You start with a single die. Your goal is to get enough points to score above a set quota in 3 rolls:

![1 Dice](https://i.allthepics.net/2026/03/18/Screenshot-2026-03-18-073757.md.png)

<img src="https://i.imgur.com/HKuovo6.png" alt="Score" height="100px">

Get some gold, and then acquire some Attribute upgrades and items!


## Attribute Upgrades
You are free to buy upgrades that increase your base stats. These will help you score more
by having more rolls, total dice, freezing abilities, etc.
<br>

<img src="https://i.allthepics.net/2026/03/18/Screenshot-2026-03-18-070146.md.png" alt="Attribute Upgrade Section" width="100%">

<details>
<summary>Items</summary>
  
## Items
Items are presented in the shop. You may buy any item to *permanently* add it to your inventory. 
Items can be rerolled in the shop for $5, but rerolls get more expensive every time you do it. Some items can be stacked.
<br>

<img src="https://i.allthepics.net/2026/03/18/Screenshot-2026-03-18-072920.png" alt="Shop Preview" width="100%">

### Passive Items
Items that function simply by playing the game. 
<br>

![Passive Item Example](https://i.allthepics.net/2026/03/18/Screenshot-2026-03-18-070255.png)

### Active Items
Items that do an action if you click on them. Usually there is a *correct* time to activate these items, so 
think carefully before you do so.

![Active Item Example](https://i.allthepics.net/2026/03/18/Screenshot-2026-03-18-070442.png)

</details>

### Freezing
Dice can be frozen. Frozen dice will remain at their same value for the rest of the round. Useful for number oriented
items and for scoring consistently.

![Ready to Freeze Dice](https://i.allthepics.net/2026/03/18/Screenshot-2026-03-18-072002.png)
![Frozen Dice](https://i.allthepics.net/2026/03/18/Screenshot-2026-03-18-072022.png)

## Current State
- Core gameplay loop implemented
- Item system with passive/active effects
- Upgrade system

### Planned
- Expanded item pool
- More upgrade paths
- Audio + settings improvements
- Monetization (non-invasive)

## System Design
Each round is resolved through a deterministic engine loop:

- Dice state is stored centrally and updated per roll
- Items register effects into specific phases (e.g. END_ROUND, ON_ROLL)
- Engine processes phases sequentially to avoid conflicting mutations
- UI reacts via an event bus rather than direct state mutation

This allows new items to be added without modifying core engine logic.

## Technical Highlights
- Modular game engine separated from UI layer
- Item system supports dynamic effect registration
- State-driven architecture for deterministic round resolution
- Event-based system for UI feedback (animations, item triggers)

### Registering Items in Code:
Items are registered in a const object in ItemRegistry.js, requiring a list of properties to be automatically incorporated into the engine.
Fields include: id, basePrice, name, rarity, description, image, stacability, and a steps object.
- The steps object hooks onto an Engine Step ID, which stakes in a delegate function that supplies the engine's state, inventory, and hooks.
- Items then return a modified version of the engine state, performing their intended function.
<img src="https://i.imgur.com/zh2cdBX.png" alt="Shop Preview" width="50%">

## Tech Stack
React  
JavaScript  
Tailwind  
Reactstrap  
Vercel

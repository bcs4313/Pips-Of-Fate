
// Items are assigned to specifc engine steps, of which they check
// and execute their own code. EngineSteps call a forwardStep(<identity>) function in their
// execution to trigger items that belong to that step.

// @param stepLinks { list<string> } which engine steps does the item run its conditions on? (Engine_Step ids)
// @param effect { function() }
// a function. The function makes conditional checks with useEngine as a source of knowledge
// when a target engine step is ran. The second function executes a target effect.
export default function ItemCard({name, stacks, rarity, description, imagePath})
{
    return (<>
        <h1>{name}</h1>
        <h1>{stacks}</h1>
        <h1>{rarity}</h1>
        <h1>{description}</h1>
        <h1>{imagePath}</h1>
    </>) 
}
import { useRef } from "react"

// global sound manager
// used for two things, caching and volume mixing
// load() preloads the audio object. It does nothing if the object already exists.
// play() function calls load() if the Audio object isn't loaded, then plays
export function useSoundManager() {
    const globalVolume = useRef(0.5)
    const sounds = import.meta.glob("/src/assets/sounds/*.mp3")
    //console.log(sounds)
    const soundMap = useRef({})

    // takes a shortened .mp3 name and finds its path from the import.meta.glob list 
    function resolvePath(audioName) {
        const entry = Object.keys(sounds).find(path =>
            path.endsWith(`/${audioName}.mp3`)
        )

        if (!entry) {
            throw new Error("Missing sound: " + audioName)
        }

        return entry
    }

    // retrieves a dynamic loader given an audio name, loading the Audio file and caching it to play
    // otherwise does nothing if the file is already loaded
    async function load(audioName) {
        if(!soundMap.current[audioName])
        {
            const path = resolvePath(audioName)
            const importer = sounds[path]
            if (!importer) throw new Error("Missing sound: " + audioName)

            const mod = await importer()
            const audio = new Audio(mod.default)
            soundMap.current[audioName] = audio
            return audio
        }
    }

    // play the file in the sound channel. May load the audio file with a delay in playing if it isn't already loaded.
    async function play(audioName) {
        if(!soundMap.current[audioName]) { await load(audioName) }
        if(soundMap.current[audioName] instanceof Audio)
        {
            soundMap.current[audioName].volume = globalVolume.current
            soundMap.current[audioName].currentTime = 0
            soundMap.current[audioName].play()
        }
    }

    return [load, play]
}
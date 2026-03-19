import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"

/* audio channel debugging
const originalPlay = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function (...args) {
    console.log(
        "[AUDIO PLAY]",
        this.src,
        "time:", performance.now()
    );

    return originalPlay.apply(this, args);
};

const OriginalAudio = window.Audio;

window.Audio = function (...args) {
    console.log("[AUDIO CREATED]", args[0]);
    return new OriginalAudio(...args);
};
*/

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

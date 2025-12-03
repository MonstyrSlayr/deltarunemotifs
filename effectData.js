import { IMGLINK } from "./data.js";

class SongEffect
{
    onLoad;
    onActive;
    onDeactive;
    deactivateOnPause = true;
    onIntermediate = null;
    isOneshot = false;
    interval = null;

    constructor(onLoad, onActive, onDeactive = null, deactivateOnPause = true, onIntermediate = null, isOneshot = false)
    {
        this.onLoad = onLoad;
        this.onActive = onActive;
        this.onDeactive = onDeactive;
        this.deactivateOnPause = deactivateOnPause;
        this.onIntermediate = onIntermediate;
        this.isOneshot = isOneshot;
    }
}

function easeOutCubic(x)
{
    return 1 - Math.pow(1 - x, 3);
}

export const Effects = {};

Effects.BLACKSCREEN = new SongEffect(
    () =>
    {
        const blackScreen = document.createElement("div");
        blackScreen.id = "blackScreen";
        blackScreen.classList.add("gone");
        document.body.appendChild(blackScreen);
    },
    () =>
    {
        const blackScreen = document.getElementById("blackScreen");
        blackScreen.classList.remove("gone");
    },
    () =>
    {
        const blackScreen = document.getElementById("blackScreen");
        blackScreen.classList.add("gone");
    },
    true
);

Effects.HERO = new SongEffect(
    () => {},
    () =>
    {
        document.body.classList.add("hero");
    },
    () =>
    {
        document.body.classList.remove("hero");

        const motifDivs = document.getElementsByClassName("motifMainDiv");

        for (const motifDiv of motifDivs)
        {
            motifDiv.style.top = `0px`;
        }
    },
    false,
    (t) =>
    {
        const motifDivs = document.getElementsByClassName("motifMainDiv");
        let i = 0;
        
        const oscillations = 12;
        const amplitude = 16;
        const offset = 1;

        for (const motifDiv of motifDivs)
        {
            const y = amplitude * Math.sin((t * Math.PI * 2 * oscillations) - (offset * i));
            motifDiv.style.top = `${y}px`;
            i++;
        }
    }
);

Effects.FLASH = new SongEffect(
    () =>
    {
        const flashScreen = document.createElement("div");
        flashScreen.id = "flash";
        flashScreen.classList.add("gone");
        flashScreen.style.opacity = `50%`;
        document.body.appendChild(flashScreen);
    },
    () =>
    {
        const flashScreen = document.getElementById("flash");
        flashScreen.classList.remove("gone");

        const duration = 3000;
        const elf = 15;
        const startTime = new Date();

        Effects.FLASH.interval = setInterval(() =>
        {
            const t = (new Date() - startTime) / duration;
            flashScreen.style.opacity = `${50 - (easeOutCubic(t) * 50)}%`;

            if (t >= 1)
            {
                Effects.FLASH.onDeactive();
            }
        }, elf);
    },
    () =>
    {
        const flashScreen = document.getElementById("flash");
        flashScreen.classList.add("gone");
        
        clearInterval(Effects.FLASH.interval);
        Effects.FLASH.interval = null;
    },
    false,
    null,
    true
);

Effects.BLACKFLASH = new SongEffect(
    () =>
    {
        const flashScreen = document.createElement("div");
        flashScreen.id = "blackFlash";
        flashScreen.classList.add("gone");
        document.body.appendChild(flashScreen);
    },
    () =>
    {
        const flashScreen = document.getElementById("blackFlash");
        flashScreen.classList.remove("gone");

        const duration = 9000;
        const elf = 15;
        const startTime = new Date();

        Effects.BLACKFLASH.interval = setInterval(() =>
        {
            const t = (new Date() - startTime) / duration;
            flashScreen.style.opacity = `${100 - (easeOutCubic(t) * 100)}%`;

            if (t >= 1)
            {
                Effects.BLACKFLASH.onDeactive();
            }
        }, elf);
    },
    () =>
    {
        const flashScreen = document.getElementById("blackFlash");
        flashScreen.classList.add("gone");
                
        clearInterval(Effects.BLACKFLASH.interval);
        Effects.BLACKFLASH.interval = null;
    },
    false,
    null,
    true
);

Effects.STATIC = new SongEffect(
    () =>
    {
        const staticWrapper = document.createElement("div");
        staticWrapper.id = "staticWrapper";
        staticWrapper.classList.add("gone");
        document.body.appendChild(staticWrapper);

            const staticNoise = document.createElement("img");
            staticNoise.src = IMGLINK + "staticNoise.gif";
            staticWrapper.appendChild(staticNoise);
    },
    () =>
    {
        const staticWrapper = document.getElementById("staticWrapper");
        staticWrapper.classList.remove("gone");
    },
    () =>
    {
        const staticWrapper = document.getElementById("staticWrapper");
        staticWrapper.classList.add("gone");
    }
)

export class EffectRef
{
    // fun stuff
    type;
    startTime = 0; // seconds
    endTime = 0; // seconds
    t = 0; // for intermediate oneshots

    constructor(type, startTime, endTime)
    {
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

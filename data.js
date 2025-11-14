function normalizeAndTrim(str)
{
    return str
        .normalize("NFD")                  // decompose accented characters
        .replace(/[\u0300-\u036f]/g, "")   // remove diacritical marks
        .replace(/[^a-z0-9]/gi, "")        // remove non alphanumeric characters
        .toLowerCase();                    // take a wild guess
}

export const allMotifs = [];
export const allSongs = [];

class Motif
{
    name;
    image;
    imagePlaying = null;
    color;
    color2; // ideally transparent
    id;
    letter = "";

    // elements
    mainDiv = null;
    letterDiv = null;
    variationDiv = null;

    constructor(name, letter = "", color = "#ffffff", color2 = "#ffffff33", image = null)
    {
        this.name = name;
        this.color = color;
        this.color2 = color2;
        this.letter = letter;

        this.id = normalizeAndTrim(name);
        allMotifs.push(this);

        this.image = image;
    }

    toString()
    {
        if (this.letter.length == 0) return this.name;
        return this.name + " (" + this.letter + ")";
    }
}

class MotifReference
{
    motif;
    isVariation = false;
    startTime = 0; // seconds
    endTime = 0; // seconds

    constructor(motif, startTime, endTime, isVariation = false)
    {
        this.motif = motif;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isVariation = isVariation;
    }
}

class SongEffect
{
    onLoad;
    onActive;
    onDeactive;
    deactivateOnPause = true;
    onIntermediate = null;

    constructor(onLoad, onActive, onDeactive, deactivateOnPause = true, onIntermediate = null)
    {
        this.onLoad = onLoad;
        this.onActive = onActive;
        this.onDeactive = onDeactive;
        this.deactivateOnPause = deactivateOnPause;
        this.onIntermediate = onIntermediate;
    }
}

function easeOutCubic(x)
{
    return 1 - Math.pow(1 - x, 3);
}

const BLACKSCREENEFFECT = new SongEffect(
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

const HEROEFFECT = new SongEffect(
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
            const y = amplitude * Math.sin((t * Math.PI * 2 * oscillations) + (offset * i));
            motifDiv.style.top = `${y}px`;
            i++;
        }
    }
);

const FLASHEFFECT = new SongEffect(
    () =>
    {
        const flashScreen = document.createElement("div");
        flashScreen.id = "flash";
        flashScreen.classList.add("gone");
        document.body.appendChild(flashScreen);
    },
    () =>
    {
        const flashScreen = document.getElementById("flash");
        flashScreen.classList.remove("gone");
    },
    () =>
    {
        const flashScreen = document.getElementById("flash");
        flashScreen.classList.add("gone");
    },
    false,
    (t) =>
    {
        const flashScreen = document.getElementById("flash");
        flashScreen.style.opacity = `${50 - (easeOutCubic(t) * 50)}%`;
    }
);

const BLACKFLASHEFFECT = new SongEffect(
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
    },
    () =>
    {
        const flashScreen = document.getElementById("blackFlash");
        flashScreen.classList.add("gone");
    },
    false,
    (t) =>
    {
        const flashScreen = document.getElementById("blackFlash");
        flashScreen.style.opacity = `${100 - (easeOutCubic(t) * 100)}%`;
    }
);

class EffectRef
{
    // fun stuff
    type;
    startTime = 0; // seconds
    endTime = 0; // seconds

    constructor(type, startTime, endTime)
    {
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class Song
{
    name;
    youtubeId;
    motifRefs = [];
    loopPoint = null;
    mainMotifs = null;
    effectRefs = [];

    constructor(name, mainMotifs, youtubeId = "", motifRefs = [], id = "", loopPoint = null, effectRefs = [])
    {
        this.name = name;
        this.mainMotifs = mainMotifs;
        this.youtubeId = youtubeId;
        this.motifRefs = motifRefs.sort((a, b) => a.startTime - b.startTime);

        if (id == "") this.id = normalizeAndTrim(name);
        else this.id = id; // in case the name is the same in multiple albums

        this.loopPoint = loopPoint;
        this.effectRefs = effectRefs;

        allSongs.push(this);
    }
}

export function isLiveServer()
{
    return location.hostname === "127.0.0.1" || location.hostname === "localhost";
}

const LINK = isLiveServer() ? "http://127.0.0.1:5500/" : "https://monstyrslayr.github.io/deltarunemotifs/";
const IMGLINK = LINK + "img/";

const ONCEUPONATIMEMOTIF = new Motif("Once Upon a Time");
const RUINSMOTIF = new Motif("The Ruins");
const UWAAMOTIF = new Motif("Uwa!!");
const HOMEMOTIF = new Motif("Home");
const ENEMYAPPROACHINGMOTIF = new Motif("Enemy Approaching", "A");
const DOGSONGMOTIF = new Motif("Enemy Approaching", "D");
const GHOSTFIGHTAMOTIF = new Motif("Ghost Fight", "A");
const GHOSTFIGHTBMOTIF = new Motif("Ghost Fight", "B");
const DETERMINATIONMOTIF = new Motif("Determination");
const HEARTACHEMOTIF = new Motif("Heartache");
const SNOWDINAMOTIF = new Motif("Snowdin", "A");
const SNOWDINBMOTIF = new Motif("Snowdin", "B");
const ANOTHERMEDIUMMOTIF = new Motif("Another Medium");
const SHOWTIMEMOTIF = new Motif("Showtime!");
const HOTELMOTIF = new Motif("Hotel");
const OHMOTIF = new Motif("Oh!");
const SPOOKTUNEMOTIF = new Motif("Spooktune");
const JINGLEBELLSMOTIF = new Motif("Jingle Bells");
const YOURBESTNIGHTMAREMOTIF = new Motif("Your Best Nightmare");
YOURBESTNIGHTMAREMOTIF.toString = function() { return "Your Best Nightmare / The Dark Truth"; }
const POWEROFNEOMOTIF = new Motif("Power of NEO");
const MEGALOVANIAMOTIF = new Motif("MEGALOVANIA");

const FLOWEYMOTIF = new Motif("Flowey");
const TORIELMOTIF = new Motif("Toriel");
const SANSMOTIF = new Motif("Sans");
const PAPYRUSMOTIF = new Motif("Papyrus");
const UNDYNEMOTIF = new Motif("Undyne", "", "#6299c1", "#c9473e33", IMGLINK + "undyne.png");
const ALPHYSMOTIF = new Motif("Alphys");
const METTATONMOTIF = new Motif("Mettaton");
const ASRIELMOTIF = new Motif("Asriel");
const ASGOREMOTIF = new Motif("Asgore");
const GASTERMOTIF = new Motif("Gaster");

const DONTFORGETMOTIF = new Motif("Don't Forget", "", "#4dcc8e", "#f60e9733", IMGLINK + "ralsei.png");
const HOMETOWNMOTIF = new Motif("Hometown", "");
const THELEGENDAMOTIF = new Motif("The Legend", "A", "#c08226", "#00000033", IMGLINK + "thelegend.png");
const THELEGENDBMOTIF = new Motif("The Legend", "B", "#c08226", "#00000033");
const THELEGENDCMOTIF = new Motif("The Legend", "C", "#c08226", "#00000033");
const THEDOORMOTIF = new Motif("The Door", "", "#ffffff", "#00000033", IMGLINK + "thedoor.png");
const RUDEBUSTERMOTIF = new Motif("Rude Buster", "");
const SCARLETFORESTMOTIF = new Motif("Scarlet Forest", "");
const FANFAREMOTIF = new Motif("Fanfare", "");
const QUIETAUTUMNMOTIF = new Motif("Quiet Autumn", "");
const DARKNESSFALLSMOTIF = new Motif("Darkness Falls", "");
const HIPSHOPMOTIF = new Motif("Hip Shop", "", "#ffffff", "#b6497233", IMGLINK + "hipshop.png");
const FREEDOMMOTIF = new Motif("Freedom", "", "#6d6ebf", "#fbfd0133", IMGLINK + "jevil.webp");
const THEHOLYMOTIF = new Motif("THE HOLY", "");

const SUSIEMOTIF = new Motif("Susie", "", "#ae67af", "#54468f33", IMGLINK + "susiegaster.webp");
const LANCERAMOTIF = new Motif("Lancer", "A", "#5585bd", "#32323233", IMGLINK + "lancer.png");
const LANCERBMOTIF = new Motif("Lancer", "B", "#5585bd", "#ffffff33");
const ROUXLSKAARDMOTIF = new Motif("Rouxls Kaard", "");
const KINGMOTIF = new Motif("King", "", "#004876", "#32323233", IMGLINK + "king.webp");
const MANMOTIF = new Motif("man", "");

const CYBERWORLDMOTIF = new Motif("Cyber World", "");
const ROOTSMOTIF = new Motif("Roots", "");
const POWERSCOMBINEDMOTIF = new Motif("Knock You Down !!", "");

const GIRLNEXTDOORMOTIF = new Motif("Girl Next Door", "");
const QUEENAMOTIF = new Motif("Queen", "A", "#6fd1ff", "#6d86e733", IMGLINK + "queen.webp");
const QUEENBMOTIF = new Motif("Queen", "B", "#6fd1ff", "#6d86e733");
const QUEENCMOTIF = new Motif("Queen", "C", "#6fd1ff", "#6d86e733");
const QUEENDMOTIF = new Motif("Queen", "D", "#6fd1ff", "#6d86e733");
const SWEETCAPNCAKESAMOTIF = new Motif("Sweet Cap'n Cakes", "A");
const SWEETCAPNCAKESBMOTIF = new Motif("Sweet Cap'n Cakes", "B");
const BERDLYAMOTIF = new Motif("Berdly", "A", "#46b3fc", "#30b18133", IMGLINK + "berdly.webp");
const BERDLYBMOTIF = new Motif("Berdly", "B", "#46b3fc", "#30b18133");
const SPAMTONAMOTIF = new Motif("Spamton", "A", "#ffffff", "#ffaec933", IMGLINK + "spamton.webp");
const SPAMTONBMOTIF = new Motif("Spamton", "B", "#ffffff", "#fff30133");
const LOSTGIRLAMOTIF = new Motif("Lost Girl", "A", "#331d0a", "#332a3b33", IMGLINK + "lostgirl.png");
const LOSTGIRLBMOTIF = new Motif("Lost Girl", "B", "#331d0a", "#332a3b33");

const TVTIMEMOTIF = new Motif("TV Time!", "", "#fbe63b", "#ff342b33", IMGLINK + "tvtime.webp");
const DOOMBOARDMOTIF = new Motif("Doom Board", "", "#d02d86", "#511a8633", IMGLINK + "doomboard.png");

const TENNAMOTIF = new Motif("Tenna", "", "#db1f53", "#fffb5b33", IMGLINK + "tenna.webp");

const SANCTUARYMOTIF = new Motif("Dark Sanctuary", "", "#1c5ba4", "#93599833", IMGLINK + "darksanctuary.png");
const SUBSANCMOTIF = new Motif("Subsequent Sanctuary", "", "#4f378f", "#2d193e33", IMGLINK + "subsequentsanctuary.jpg");

const MIKEMOTIF = new Motif("Mike", "", "#69be60", "#ff0e0033", IMGLINK + "mike.webp");
const GERSONMOTIF = new Motif("Gerson", "", "#64a926", "#fe73fe33", IMGLINK + "gerson.png");
const TITANMOTIF = new Motif("Titan", "", "#ffffff", "#00000033", IMGLINK + "titan.png");
TITANMOTIF.imagePlaying = IMGLINK + "titan.gif";

export function getMotifById(id)
{
    return allMotifs.find(motif => id == motif.id);
}

export function getMotifsById(id)
{
    return allMotifs.filter(motif => id == motif.id);
}

export function createMotifDiv(motifId, isLink = true, isPlaying = false)
{
    const motifsWithId = getMotifsById(motifId);
    let hasSongs = false;
    motifsWithId.forEach(motif => {
        if (getSongsWithMotif(motif).length > 0)
        {
            hasSongs = true;
        }
    });

    const motifMainDiv = isLink ? document.createElement("a") : document.createElement("div");
    motifMainDiv.classList.add("motifMainDiv");
    if (isLink) motifMainDiv.href = LINK + "motifs/" + motifId;
    if (isPlaying && hasSongs) motifMainDiv.classList.add("playing");
    motifMainDiv.classList.add("m" + motifId);
    motifMainDiv.style.borderColor = motifsWithId[0].color;
    motifsWithId.forEach(motif => {
        motif.mainDiv = motifMainDiv;
    });

        const leftTime = document.createElement("div");
        leftTime.style.backgroundColor = motifsWithId[0].color2;
        motifMainDiv.appendChild(leftTime);

        motifMainDiv.image = null;
        if (motifsWithId[0].image != null)
        {
            const notTempImg = document.createElement("img");
            notTempImg.src = motifsWithId[0].image;
            notTempImg.alt = motifId + " image";
            notTempImg.color = motifsWithId[0].color;
            leftTime.appendChild(notTempImg);

            if (motifsWithId[0].imagePlaying != null && isPlaying)
            {
                notTempImg.src = motifsWithId[0].imagePlaying;
            }

            motifMainDiv.image = notTempImg; // stupid
        }

        const otherChide = document.createElement("div");
        leftTime.appendChild(otherChide);

            const motifText = document.createElement("h3");
            motifText.textContent = motifsWithId[0].name;
            motifText.style.color = motifsWithId[0].color;
            otherChide.appendChild(motifText);

        const rightSide = document.createElement("div");
        motifMainDiv.appendChild(rightSide);

        if (motifsWithId.length > 1)
        {
            motifsWithId.forEach(motif =>
            {
                const lilGuyDiv = document.createElement("div");
                motif.letterDiv = lilGuyDiv;
                if (isPlaying) lilGuyDiv.classList.add("playing");
                lilGuyDiv.style.borderColor = motif.color;
                lilGuyDiv.style.backgroundColor = motif.color2;
                rightSide.appendChild(lilGuyDiv);

                    const hisLetter = document.createElement("p");
                    hisLetter.textContent = motif.letter;
                    hisLetter.style.color = motif.color;
                    lilGuyDiv.appendChild(hisLetter);

                    const daVariation = document.createElement("div");
                    motif.variationDiv = daVariation;
                    daVariation.classList.add("variationDiv");
                    lilGuyDiv.appendChild(daVariation);

                        const variationText = document.createElement("p");
                        variationText.textContent = "(variation)";
                        variationText.style.color = motif.color;
                        daVariation.appendChild(variationText);
            });
        }
        else
        {
            const daVariation = document.createElement("div");
            motifsWithId.forEach(motif => {
                motif.variationDiv = daVariation;
            });
            daVariation.classList.add("variationDiv");
            otherChide.appendChild(daVariation);

                const variationText = document.createElement("p");
                variationText.textContent = "(variation)";
                variationText.style.color = motifsWithId[0].color;
                daVariation.appendChild(variationText);
        }

    return motifMainDiv;
}

export function getSongById(id)
{
    return allSongs.find(song => id == song.id);
}

export function getSongsWithMotif(motif)
{
    return allSongs.filter(song => song.motifRefs.some(ref => ref.motif.id == motif.id));
}

export function createSongDiv(daSong, isLink = true)
{
    const motifMainDiv = isLink ? document.createElement("a") : document.createElement("div");
    motifMainDiv.classList.add("songDiv");
    if (daSong.motifRefs.length == 0) motifMainDiv.classList.add("noMotifs");
    if (isLink) motifMainDiv.href = LINK + "songs/" + daSong.id;
    motifMainDiv.classList.add("s" + daSong.id);

    switch (daSong.mainMotifs.length)
    {
        case 0: default:
            break;

        case 1:
            motifMainDiv.style.borderColor = daSong.mainMotifs[0].color;
            motifMainDiv.style.backgroundColor = daSong.mainMotifs[0].color2;
            break;

        case 2:
            motifMainDiv.style.borderTopColor = daSong.mainMotifs[0].color;
            motifMainDiv.style.borderLeftColor = daSong.mainMotifs[0].color;
            motifMainDiv.style.borderBottomColor = daSong.mainMotifs[1].color;
            motifMainDiv.style.borderRightColor = daSong.mainMotifs[1].color;

            motifMainDiv.style.background = `
                linear-gradient(
                    to bottom right,
                    ${daSong.mainMotifs[0].color2},
                    ${daSong.mainMotifs[1].color2}
                )
            `;
            break;
    }

        const motifText = document.createElement("h3");
        motifText.textContent = daSong.name;
        motifMainDiv.appendChild(motifText);

    return motifMainDiv;
}

export function exportIdsToTxt(data, filename = "ids.txt")
{
    // Extract ids from the objects
    const idsArr = data.map(obj => obj.id);
    const idsSet = new Set();
    for (const id of idsArr)
    {
        idsSet.add(id);
    }
    const ids = [...idsSet];

    // Join them with newlines
    const text = ids.join("\n");

    // Create a blob with the text
    const blob = new Blob([text], { type: "text/plain" });

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function quickSec(bpm, numberOfBeats)
{
    if (bpm <= 0 || numberOfBeats < 0)
    {
        console.error("erm, BPM must be positive and number of beats must be non-negative!!!");
        return null;
    }

    const beatDurationInSeconds = 60 / bpm;
    const totalSeconds = beatDurationInSeconds * numberOfBeats;
    return totalSeconds;
}

//#region CHAPTER 1

const theLegendBPM = 110;
const theLegend = new Song("The Legend",
    [THELEGENDAMOTIF],
    "PibYmujLubI",
    [
        new MotifReference(THELEGENDAMOTIF, 0, quickSec(theLegendBPM, 8)),
        new MotifReference(THELEGENDBMOTIF, quickSec(theLegendBPM, 36), quickSec(theLegendBPM, 36 + 16)),
        new MotifReference(THELEGENDBMOTIF, quickSec(theLegendBPM, 36 + 16), quickSec(theLegendBPM, 36 + 32)),
        new MotifReference(THELEGENDBMOTIF, quickSec(theLegendBPM, 36 + 32), quickSec(theLegendBPM, 36 + 48)),
        new MotifReference(THELEGENDBMOTIF, quickSec(theLegendBPM, 36 + 48), quickSec(theLegendBPM, 36 + 64)),
        new MotifReference(THELEGENDBMOTIF, quickSec(theLegendBPM, 36 + 64), quickSec(theLegendBPM, 36 + 80)),
        new MotifReference(THELEGENDBMOTIF, quickSec(theLegendBPM, 36 + 80), quickSec(theLegendBPM, 36 + 96)),
        new MotifReference(THELEGENDAMOTIF, quickSec(theLegendBPM, 36 + 96), quickSec(theLegendBPM, 36 + 96 + 7)),
        new MotifReference(THELEGENDCMOTIF, quickSec(theLegendBPM, 36 + 128), quickSec(theLegendBPM, 36 + 128 + 34)),
    ],
    "", quickSec(theLegendBPM, 36 + 128 + 35)
);

const lancerBPM = 125;
const lancer = new Song("Lancer",
    [LANCERAMOTIF],
    "GAhBQH0Kf1I",
    [
        new MotifReference(LANCERAMOTIF, 0, quickSec(lancerBPM, 24.66)),
        new MotifReference(LANCERAMOTIF, quickSec(lancerBPM, 24.66), quickSec(lancerBPM, 48.66)),
        new MotifReference(LANCERBMOTIF, quickSec(lancerBPM, 49), quickSec(lancerBPM, 73.33)),
        new MotifReference(LANCERBMOTIF, quickSec(lancerBPM, 73.33), quickSec(lancerBPM, 73 + 22)),
    ],
    "", quickSec(lancerBPM, 99)
);

const vsLancerBPM = 177;
const vsLancer = new Song("Vs. Lancer",
    [LANCERAMOTIF],
    "Ce-gU8G6Vik",
    [
        new MotifReference(LANCERAMOTIF, quickSec(vsLancerBPM, 2.5), quickSec(vsLancerBPM, 33.5)),
        new MotifReference(LANCERAMOTIF, quickSec(vsLancerBPM, 33.5), quickSec(vsLancerBPM, 64.75)),
        new MotifReference(LANCERBMOTIF, quickSec(vsLancerBPM, 64.75), quickSec(vsLancerBPM, 64.25 + 32)),
        new MotifReference(LANCERBMOTIF, quickSec(vsLancerBPM, 64.25 + 32), quickSec(vsLancerBPM, 123)),
    ],
    "", quickSec(vsLancerBPM, 123)
);

const cardCastleBPM = 125;
const cardCastle = new Song("Card Castle",
    [KINGMOTIF],
    "tvjuTn9LZwY",
    [
        new MotifReference(KINGMOTIF, 0, quickSec(cardCastleBPM, 32)),
        new MotifReference(KINGMOTIF, quickSec(cardCastleBPM, 32), quickSec(cardCastleBPM, 62.5)),
        new MotifReference(LANCERAMOTIF, quickSec(cardCastleBPM, 62.5), quickSec(cardCastleBPM, 96)),
        new MotifReference(LANCERAMOTIF, quickSec(cardCastleBPM, 96), quickSec(cardCastleBPM, 128)),
    ],
    "", quickSec(cardCastleBPM, 128)
);

const chaosKingBPM = 147;
const chaosKing = new Song("Chaos King",
    [KINGMOTIF],
    "tPwzoZ-e664",
    [
        new MotifReference(KINGMOTIF, quickSec(chaosKingBPM, 8), quickSec(chaosKingBPM, 40)),
        new MotifReference(KINGMOTIF, quickSec(chaosKingBPM, 40), quickSec(chaosKingBPM, 40 + 32)),
        new MotifReference(KINGMOTIF, quickSec(chaosKingBPM, 40 + 32), quickSec(chaosKingBPM, 40 + 64)),
        new MotifReference(LANCERAMOTIF, quickSec(chaosKingBPM, 38.5 + 64), quickSec(chaosKingBPM, 40 + 96)),
        new MotifReference(LANCERAMOTIF, quickSec(chaosKingBPM, 40 + 96), quickSec(chaosKingBPM, 40 + 96 + 32)),
        new MotifReference(THELEGENDCMOTIF, quickSec(chaosKingBPM, 40 + 96 + 32), quickSec(chaosKingBPM, 40 + 96 + 64)),
        new MotifReference(THELEGENDCMOTIF, quickSec(chaosKingBPM, 40 + 96 + 64), quickSec(chaosKingBPM, 40 + 96 + 92)),
        new MotifReference(THELEGENDCMOTIF, quickSec(chaosKingBPM, 40 + 96 + 92), quickSec(chaosKingBPM, 40 + 96 + 92 + 32), true),
    ],
    "", quickSec(chaosKingBPM, 40 + 96 + 92 + 32)
);

const theWorldRevolvingBPM = 190;
const theWorldRevolving = new Song("THE WORLD REVOLVING",
    [FREEDOMMOTIF],
    "Z01Tsgwe2dQ",
    [
        new MotifReference(FREEDOMMOTIF, quickSec(theWorldRevolvingBPM, 64), quickSec(theWorldRevolvingBPM, 96)), 
        new MotifReference(FREEDOMMOTIF, quickSec(theWorldRevolvingBPM, 96), quickSec(theWorldRevolvingBPM, 128)), 
        new MotifReference(FREEDOMMOTIF, quickSec(theWorldRevolvingBPM, 208), quickSec(theWorldRevolvingBPM, 220)), 
        new MotifReference(FREEDOMMOTIF, quickSec(theWorldRevolvingBPM, 208 + 32), quickSec(theWorldRevolvingBPM, 220 + 32)), 
        new MotifReference(DONTFORGETMOTIF, quickSec(theWorldRevolvingBPM, 259), quickSec(theWorldRevolvingBPM, 267)),
        new MotifReference(DONTFORGETMOTIF, quickSec(theWorldRevolvingBPM, 259 + 8), quickSec(theWorldRevolvingBPM, 267 + 8)),
        new MotifReference(DONTFORGETMOTIF, quickSec(theWorldRevolvingBPM, 259 + 16), quickSec(theWorldRevolvingBPM, 267 + 16)),
        new MotifReference(DONTFORGETMOTIF, quickSec(theWorldRevolvingBPM, 259 + 24), quickSec(theWorldRevolvingBPM, 267 + 24)),
        new MotifReference(DONTFORGETMOTIF, quickSec(theWorldRevolvingBPM, 259 + 32), quickSec(theWorldRevolvingBPM, 267 + 32)),
        new MotifReference(DONTFORGETMOTIF, quickSec(theWorldRevolvingBPM, 259 + 40), quickSec(theWorldRevolvingBPM, 267 + 40)),
        new MotifReference(DONTFORGETMOTIF, quickSec(theWorldRevolvingBPM, 259 + 48), quickSec(theWorldRevolvingBPM, 267 + 48)),
        new MotifReference(DONTFORGETMOTIF, quickSec(theWorldRevolvingBPM, 259 + 56), quickSec(theWorldRevolvingBPM, 264 + 56)),
    ],
    "", quickSec(theWorldRevolvingBPM, 264 + 56)
);

//#endregion

//#region CHAPTER 2

const queen = new Song("Queen",
    [QUEENAMOTIF],
    "6XQv5CHmITA",
    [

    ]
);

const aSimpleDiversionBPM = 130;
const aSimpleDiversion = new Song("A Simple Diversion",
    [QUEENAMOTIF],
    "p1U5FjgwDhA",
    [
        new MotifReference(QUEENAMOTIF, 0, quickSec(aSimpleDiversionBPM, 16)),
        new MotifReference(QUEENCMOTIF, quickSec(aSimpleDiversionBPM, 16), quickSec(aSimpleDiversionBPM, 32)),
        new MotifReference(QUEENAMOTIF, quickSec(aSimpleDiversionBPM, 32), quickSec(aSimpleDiversionBPM, 48)),
        new MotifReference(QUEENCMOTIF, quickSec(aSimpleDiversionBPM, 48), quickSec(aSimpleDiversionBPM, 60))
    ],
    "", quickSec(aSimpleDiversionBPM, 64)
);

const berdlyBPM = 98;
const berdly = new Song("Berdly",
    [BERDLYAMOTIF],
    "2S8I1h-wNzc",
    [
        new MotifReference(BERDLYAMOTIF, 0, quickSec(berdlyBPM, 24)),
        new MotifReference(BERDLYAMOTIF, quickSec(berdlyBPM, 24), quickSec(berdlyBPM, 48.5)),
        new MotifReference(BERDLYBMOTIF, quickSec(berdlyBPM, 48.5), quickSec(berdlyBPM, 72.5)),
    ],
    "", quickSec(berdlyBPM, 72.5)
);

const smartRaceBPM = 150;
const smartRace = new Song("Smart Race",
    [BERDLYAMOTIF],
    "HZO3xw91eHw",
    [
        new MotifReference(QUEENAMOTIF, quickSec(smartRaceBPM, 4), quickSec(smartRaceBPM, 8)),
        new MotifReference(QUEENAMOTIF, quickSec(smartRaceBPM, 12), quickSec(smartRaceBPM, 16)),
        new MotifReference(QUEENAMOTIF, quickSec(smartRaceBPM, 20), quickSec(smartRaceBPM, 24)),
        new MotifReference(QUEENAMOTIF, quickSec(smartRaceBPM, 25), quickSec(smartRaceBPM, 32)),
        new MotifReference(BERDLYAMOTIF, quickSec(smartRaceBPM, 32), quickSec(smartRaceBPM, 64)),
        new MotifReference(BERDLYAMOTIF, quickSec(smartRaceBPM, 64), quickSec(smartRaceBPM, 96)),
        new MotifReference(BERDLYBMOTIF, quickSec(smartRaceBPM, 96), quickSec(smartRaceBPM, 128)),
        new MotifReference(BERDLYBMOTIF, quickSec(smartRaceBPM, 128), quickSec(smartRaceBPM, 128 + 32)),
    ],
    "", quickSec(smartRaceBPM, 128 + 32)
);

const coolMixtapeBPM = 144;
const coolMixtape = new Song("Cool Mixtape",
    [QUEENAMOTIF],
    "EeVEyBGPgLY",
    [
        new MotifReference(QUEENAMOTIF, 0, quickSec(coolMixtapeBPM, 16)),
        new MotifReference(QUEENCMOTIF, quickSec(coolMixtapeBPM, 16), quickSec(coolMixtapeBPM, 32)),
        new MotifReference(QUEENDMOTIF, quickSec(coolMixtapeBPM, 32), quickSec(coolMixtapeBPM, 64)),
    ],
    "", quickSec(coolMixtapeBPM, 64)
);

const elegantEntranceBPM = 100;
const elegantEntrance = new Song("Elegant Entrance",
    [QUEENAMOTIF],
    "j6baKyF2Ksc",
    [
        new MotifReference(QUEENAMOTIF, 0, quickSec(elegantEntranceBPM, 32)),
        new MotifReference(QUEENAMOTIF, quickSec(elegantEntranceBPM, 32), quickSec(elegantEntranceBPM, 64), true),
        new MotifReference(QUEENBMOTIF, quickSec(elegantEntranceBPM, 64), quickSec(elegantEntranceBPM, 96)),
        new MotifReference(QUEENBMOTIF, quickSec(elegantEntranceBPM, 96), quickSec(elegantEntranceBPM, 128), true),
    ],
    "", quickSec(elegantEntranceBPM, 128)
);

const bluebirdOfMisfortuneBPM = 120;
const bluebirdOfMisfortune = new Song("Bluebird of Misfortune",
    [BERDLYAMOTIF],
    "yud5H-vnbJw",
    [
        new MotifReference(BERDLYAMOTIF, 0, quickSec(bluebirdOfMisfortuneBPM, 49)),
        new MotifReference(BERDLYBMOTIF, quickSec(bluebirdOfMisfortuneBPM, 49), quickSec(bluebirdOfMisfortuneBPM, 97)),
    ],
    "", quickSec(bluebirdOfMisfortuneBPM, 97)
)

const pandoraPalaceBPM = 100;
const pandoraPalace = new Song("Pandora Palace",
    [QUEENAMOTIF],
    "q-5cXVcCOUs",
    [
        new MotifReference(QUEENAMOTIF, quickSec(pandoraPalaceBPM, 34), quickSec(pandoraPalaceBPM, 34 + 16)),
        new MotifReference(QUEENAMOTIF, quickSec(pandoraPalaceBPM, 34 + 16), quickSec(pandoraPalaceBPM, 34 + 32), true),
        new MotifReference(QUEENBMOTIF, quickSec(pandoraPalaceBPM, 34 + 64), quickSec(pandoraPalaceBPM, 34 + 80)),
        new MotifReference(QUEENBMOTIF, quickSec(pandoraPalaceBPM, 34 + 80), quickSec(pandoraPalaceBPM, 34 + 96), true),
        new MotifReference(QUEENBMOTIF, quickSec(pandoraPalaceBPM, 34 + 64 + 32), quickSec(pandoraPalaceBPM, 34 + 80 + 32)),
        new MotifReference(QUEENBMOTIF, quickSec(pandoraPalaceBPM, 34 + 80 + 32), quickSec(pandoraPalaceBPM, 34 + 96 + 32), true),
    ],
    "", quickSec(pandoraPalaceBPM, 34 + 96 + 32)
);

const attackOfTheKillerQueenBPM = 144;
const attackOfTheKillerQueen = new Song("Attack of the Killer Queen",
    [QUEENAMOTIF, BERDLYAMOTIF],
    "vBjscyFC3jo",
    [
        new MotifReference(QUEENAMOTIF, 0, quickSec(attackOfTheKillerQueenBPM, 16)),
        new MotifReference(QUEENCMOTIF, quickSec(attackOfTheKillerQueenBPM, 16), quickSec(attackOfTheKillerQueenBPM, 32), true),
        new MotifReference(QUEENAMOTIF, quickSec(attackOfTheKillerQueenBPM, 32), quickSec(attackOfTheKillerQueenBPM, 48)),
        new MotifReference(QUEENCMOTIF, quickSec(attackOfTheKillerQueenBPM, 48), quickSec(attackOfTheKillerQueenBPM, 64)),
        new MotifReference(QUEENDMOTIF, quickSec(attackOfTheKillerQueenBPM, 64), quickSec(attackOfTheKillerQueenBPM, 96)),
        new MotifReference(BERDLYBMOTIF, quickSec(attackOfTheKillerQueenBPM, 96), quickSec(attackOfTheKillerQueenBPM, 128)),
        new MotifReference(BERDLYBMOTIF, quickSec(attackOfTheKillerQueenBPM, 128), quickSec(attackOfTheKillerQueenBPM, 128 + 32)),
        new MotifReference(BERDLYAMOTIF, quickSec(attackOfTheKillerQueenBPM, 128 + 31.5), quickSec(attackOfTheKillerQueenBPM, 128 + 63.5)),
        new MotifReference(BERDLYAMOTIF, quickSec(attackOfTheKillerQueenBPM, 128 + 63.5), quickSec(attackOfTheKillerQueenBPM, 128 + 95.5)),
        new MotifReference(BERDLYBMOTIF, quickSec(attackOfTheKillerQueenBPM, 128 + 96), quickSec(attackOfTheKillerQueenBPM, 128 + 120)),
        new MotifReference(BERDLYBMOTIF, quickSec(attackOfTheKillerQueenBPM, 128 + 120), quickSec(attackOfTheKillerQueenBPM, 128 + 128 + 16), true),
        new MotifReference(QUEENAMOTIF, quickSec(attackOfTheKillerQueenBPM, 128 + 128 + 16), quickSec(attackOfTheKillerQueenBPM, 128 + 128 + 28), true),
    ],
    "", quickSec(attackOfTheKillerQueenBPM, 128 + 128 + 32)
);

const gigaSizeBPM = 125;
const gigaSize = new Song("Giga Size",
    [QUEENAMOTIF],
    "_bVl2e-Wxzg",
    [
        new MotifReference(QUEENAMOTIF, quickSec(gigaSizeBPM, 64), quickSec(gigaSizeBPM, 80)),
        new MotifReference(QUEENAMOTIF, quickSec(gigaSizeBPM, 96), quickSec(gigaSizeBPM, 112), true),
        new MotifReference(QUEENCMOTIF, quickSec(gigaSizeBPM, 112), quickSec(gigaSizeBPM, 128)),
        new MotifReference(QUEENCMOTIF, quickSec(gigaSizeBPM, 128), quickSec(gigaSizeBPM, 128 + 8), true),
        new MotifReference(QUEENCMOTIF, quickSec(gigaSizeBPM, 128 + 8), quickSec(gigaSizeBPM, 128 + 16), true),
        new MotifReference(QUEENCMOTIF, quickSec(gigaSizeBPM, 128 + 16), quickSec(gigaSizeBPM, 128 + 24), true),
        new MotifReference(QUEENCMOTIF, quickSec(gigaSizeBPM, 128 + 32), quickSec(gigaSizeBPM, 128 + 40), true),
        new MotifReference(QUEENCMOTIF, quickSec(gigaSizeBPM, 128 + 40), quickSec(gigaSizeBPM, 128 + 48), true),
        new MotifReference(QUEENCMOTIF, quickSec(gigaSizeBPM, 128 + 48), quickSec(gigaSizeBPM, 128 + 56), true),
    ],
    "", quickSec(gigaSizeBPM, 128 + 96)
);

const knockYouDownBPM = 195;
const knockYouDown = new Song("Knock You Down !!",
    [POWERSCOMBINEDMOTIF],
    "L9qRYVZLets",
    [
        new MotifReference(POWERSCOMBINEDMOTIF, 0, quickSec(knockYouDownBPM, 16)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 16), quickSec(knockYouDownBPM, 32)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 32), quickSec(knockYouDownBPM, 48)), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 32), quickSec(knockYouDownBPM, 48), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 48), quickSec(knockYouDownBPM, 64)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 64), quickSec(knockYouDownBPM, 80), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 68), quickSec(knockYouDownBPM, 80), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 80), quickSec(knockYouDownBPM, 96)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 96), quickSec(knockYouDownBPM, 112)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 112), quickSec(knockYouDownBPM, 128)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128), quickSec(knockYouDownBPM, 128 + 16), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 68 + 64), quickSec(knockYouDownBPM, 80 + 64), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 16), quickSec(knockYouDownBPM, 128 + 32), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 68 + 80), quickSec(knockYouDownBPM, 80 + 80), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 32), quickSec(knockYouDownBPM, 128 + 48)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 48), quickSec(knockYouDownBPM, 128 + 64)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 64), quickSec(knockYouDownBPM, 128 + 80)), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 128 + 64), quickSec(knockYouDownBPM, 128 + 80), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 80), quickSec(knockYouDownBPM, 128 + 96)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 96), quickSec(knockYouDownBPM, 128 + 112), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 128 + 100), quickSec(knockYouDownBPM, 128 + 112), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 112), quickSec(knockYouDownBPM, 128 + 128)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128), quickSec(knockYouDownBPM, 128 + 128 + 16)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 16), quickSec(knockYouDownBPM, 128 + 128 + 32)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 32), quickSec(knockYouDownBPM, 128 + 128 + 48), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 36), quickSec(knockYouDownBPM, 128 + 128 + 48), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 48), quickSec(knockYouDownBPM, 128 + 128 + 64), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 52), quickSec(knockYouDownBPM, 128 + 128 + 64), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 64), quickSec(knockYouDownBPM, 128 + 128 + 80)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 80), quickSec(knockYouDownBPM, 128 + 128 + 96)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 96), quickSec(knockYouDownBPM, 128 + 128 + 112)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 112), quickSec(knockYouDownBPM, 128 + 128 + 128)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128), quickSec(knockYouDownBPM, 128 + 128 + 128 + 16)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128 + 16), quickSec(knockYouDownBPM, 128 + 128 + 128 + 32)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128 + 32), quickSec(knockYouDownBPM, 128 + 128 + 128 + 48)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128 + 48), quickSec(knockYouDownBPM, 128 + 128 + 128 + 64)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128 + 64), quickSec(knockYouDownBPM, 128 + 128 + 128 + 80), true),
    ],
    "", quickSec(knockYouDownBPM, 128 + 128 + 128 + 80)
);

//#endregion

//#region CHAPTER 3

const raiseUpYourBatBPM = 115;
const raiseUpYourBat = new Song("Raise Up Your Bat",
    [LOSTGIRLAMOTIF],
    "85WD93lz5GU",
    [
        new MotifReference(LOSTGIRLAMOTIF, quickSec(raiseUpYourBatBPM, 144 - 32), quickSec(raiseUpYourBatBPM, 144 - 24)),
        new MotifReference(LOSTGIRLAMOTIF, quickSec(raiseUpYourBatBPM, 144 - 16), quickSec(raiseUpYourBatBPM, 144 - 8)),
        new MotifReference(LOSTGIRLAMOTIF, quickSec(raiseUpYourBatBPM, 144), quickSec(raiseUpYourBatBPM, 144 + 8)),
        new MotifReference(LOSTGIRLAMOTIF, quickSec(raiseUpYourBatBPM, 144 + 16), quickSec(raiseUpYourBatBPM, 144 + 24)),
    ],
    "", quickSec(raiseUpYourBatBPM, 144 + 110)
);

const doomBoardBPM = 129 / 2;
const doomBoard = new Song("Doom Board",
    [DOOMBOARDMOTIF, TENNAMOTIF],
    "ZQ4AZI9dirA",
    [
        new MotifReference(DOOMBOARDMOTIF, 0, quickSec(doomBoardBPM, 4)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 4), quickSec(doomBoardBPM, 8)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 8), quickSec(doomBoardBPM, 12)),
        new MotifReference(TENNAMOTIF, quickSec(doomBoardBPM, 8.25), quickSec(doomBoardBPM, 11.5)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 12), quickSec(doomBoardBPM, 16)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 16), quickSec(doomBoardBPM, 20)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 20), quickSec(doomBoardBPM, 24)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 24), quickSec(doomBoardBPM, 28)),
        new MotifReference(TENNAMOTIF, quickSec(doomBoardBPM, 24.25), quickSec(doomBoardBPM, 27.5)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 28), quickSec(doomBoardBPM, 32)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 32), quickSec(doomBoardBPM, 36)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 36), quickSec(doomBoardBPM, 40)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 40), quickSec(doomBoardBPM, 44), true),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 44), quickSec(doomBoardBPM, 48), true),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 48), quickSec(doomBoardBPM, 52)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(doomBoardBPM, 52), quickSec(doomBoardBPM, 56)),
    ],
    "", quickSec(doomBoardBPM, 56)
);

const metaphysicalChallenge = new Song("Metaphysical Challenge",
    [DOOMBOARDMOTIF, TENNAMOTIF],
    "nqxdUy5hoLc",
    doomBoard.motifRefs,
    "", doomBoard.loopPoint
);

const tvWorldBPM = 145;
const tvWorld = new Song("TV WORLD",
    [TENNAMOTIF],
    "DstO9slC_5U",
    [
        new MotifReference(HIPSHOPMOTIF, quickSec(tvWorldBPM, 148), quickSec(tvWorldBPM, 148 + 16), true),
        new MotifReference(HIPSHOPMOTIF, quickSec(tvWorldBPM, 148 + 16), quickSec(tvWorldBPM, 148 + 32), true),
        new MotifReference(HIPSHOPMOTIF, quickSec(tvWorldBPM, 148 + 32), quickSec(tvWorldBPM, 148 + 48), true),
        new MotifReference(TENNAMOTIF, quickSec(tvWorldBPM, 148 + 33), quickSec(tvWorldBPM, 148 + 42)),
        new MotifReference(HIPSHOPMOTIF, quickSec(tvWorldBPM, 148 + 48), quickSec(tvWorldBPM, 148 + 64), true),
        new MotifReference(TENNAMOTIF, quickSec(tvWorldBPM, 148 + 49), quickSec(tvWorldBPM, 148 + 58), true),
        new MotifReference(HIPSHOPMOTIF, quickSec(tvWorldBPM, 148 + 64), quickSec(tvWorldBPM, 148 + 80), true),
        new MotifReference(TENNAMOTIF, quickSec(tvWorldBPM, 148 + 65), quickSec(tvWorldBPM, 148 + 74)),
        new MotifReference(HIPSHOPMOTIF, quickSec(tvWorldBPM, 148 + 80), quickSec(tvWorldBPM, 148 + 96), true),
        new MotifReference(TENNAMOTIF, quickSec(tvWorldBPM, 148 + 81), quickSec(tvWorldBPM, 148 + 90), true),

        new MotifReference(TVTIMEMOTIF, quickSec(tvWorldBPM, 148 + 96), quickSec(tvWorldBPM, 148 + 100)),
        new MotifReference(TVTIMEMOTIF, quickSec(tvWorldBPM, 148 + 104), quickSec(tvWorldBPM, 148 + 108)),
        new MotifReference(TVTIMEMOTIF, quickSec(tvWorldBPM, 148 + 112), quickSec(tvWorldBPM, 148 + 116)),
        new MotifReference(TVTIMEMOTIF, quickSec(tvWorldBPM, 148 + 120), quickSec(tvWorldBPM, 148 + 124)),
        new MotifReference(TVTIMEMOTIF, quickSec(tvWorldBPM, 148 + 128), quickSec(tvWorldBPM, 148 + 132)),
        new MotifReference(TVTIMEMOTIF, quickSec(tvWorldBPM, 148 + 136), quickSec(tvWorldBPM, 148 + 140)),
        new MotifReference(TVTIMEMOTIF, quickSec(tvWorldBPM, 148 + 144), quickSec(tvWorldBPM, 148 + 148)),
        new MotifReference(TVTIMEMOTIF, quickSec(tvWorldBPM, 148 + 152), quickSec(tvWorldBPM, 148 + 156)),
    ],
    "", quickSec(tvWorldBPM, 156 + 156)
);

const itsTvTimeBPM = 148;
const itsTvTime = new Song("It's TV Time!",
    [TENNAMOTIF, TVTIMEMOTIF],
    "F2PJbTuZlTU",
    [
        new MotifReference(TENNAMOTIF, quickSec(itsTvTimeBPM, 48.5), quickSec(itsTvTimeBPM, 52)),
        new MotifReference(TENNAMOTIF, quickSec(itsTvTimeBPM, 56.5), quickSec(itsTvTimeBPM, 60)),
        new MotifReference(TENNAMOTIF, quickSec(itsTvTimeBPM, 80.5), quickSec(itsTvTimeBPM, 84)),
        new MotifReference(TENNAMOTIF, quickSec(itsTvTimeBPM, 88.5), quickSec(itsTvTimeBPM, 92)),

        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 - 8), quickSec(itsTvTimeBPM, 128 + 64)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64), quickSec(itsTvTimeBPM, 128 + 64 + 8)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 8), quickSec(itsTvTimeBPM, 128 + 64 + 16)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 16), quickSec(itsTvTimeBPM, 128 + 64 + 24)),

        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 24), quickSec(itsTvTimeBPM, 128 + 64 + 32)),
        new MotifReference(TVTIMEMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 24), quickSec(itsTvTimeBPM, 128 + 64 + 28)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 32), quickSec(itsTvTimeBPM, 128 + 64 + 40)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 40), quickSec(itsTvTimeBPM, 128 + 64 + 48)),
        new MotifReference(TVTIMEMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 40), quickSec(itsTvTimeBPM, 128 + 64 + 44)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 48), quickSec(itsTvTimeBPM, 128 + 64 + 56)),

        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 56), quickSec(itsTvTimeBPM, 128 + 64 + 64)),
        new MotifReference(TENNAMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 56.5), quickSec(itsTvTimeBPM, 128 + 64 + 63)),
        new MotifReference(TVTIMEMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 56), quickSec(itsTvTimeBPM, 128 + 64 + 60)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 64), quickSec(itsTvTimeBPM, 128 + 64 + 72)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 72), quickSec(itsTvTimeBPM, 128 + 64 + 80)),
        new MotifReference(TVTIMEMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 72), quickSec(itsTvTimeBPM, 128 + 64 + 76)),
        new MotifReference(DOOMBOARDMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 80), quickSec(itsTvTimeBPM, 128 + 64 + 88)),

        new MotifReference(TENNAMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 89), quickSec(itsTvTimeBPM, 128 + 64 + 88 + 12)),
        new MotifReference(TENNAMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 89 + 32), quickSec(itsTvTimeBPM, 128 + 64 + 88 + 12 + 32)),
        new MotifReference(TENNAMOTIF, quickSec(itsTvTimeBPM, 128 + 64 + 89 + 64), quickSec(itsTvTimeBPM, 128 + 64 + 88 + 12 + 64)),
    ],
    "", quickSec(itsTvTimeBPM, 128 + 64 + 88 + 16 + 112)
);

const blackKnifeBPM = 147.5;
const blackKnife = new Song("Black Knife",
    [THEDOORMOTIF],
    "B8Us0DZgexw",
    [
        new MotifReference(THEDOORMOTIF, quickSec(blackKnifeBPM, 64), quickSec(blackKnifeBPM, 96)),
        new MotifReference(THEDOORMOTIF, quickSec(blackKnifeBPM, 96), quickSec(blackKnifeBPM, 128)),
    ],
    "", quickSec(blackKnifeBPM, 144 + 144)
);

//#endregion

//#region CHAPTER 4

const knockYouDownRhythmVer = new Song("Knock You Down!! (Rhythm Ver.)",
    [POWERSCOMBINEDMOTIF],
    "27oficnsQPo",
    [
        new MotifReference(POWERSCOMBINEDMOTIF, 0, quickSec(knockYouDownBPM, 16)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 16), quickSec(knockYouDownBPM, 32)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 32), quickSec(knockYouDownBPM, 48)), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 32), quickSec(knockYouDownBPM, 48), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 48), quickSec(knockYouDownBPM, 64)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 64), quickSec(knockYouDownBPM, 80), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 68), quickSec(knockYouDownBPM, 80), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 80), quickSec(knockYouDownBPM, 96)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 96), quickSec(knockYouDownBPM, 112)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 112), quickSec(knockYouDownBPM, 128)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128), quickSec(knockYouDownBPM, 128 + 16), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 68 + 64), quickSec(knockYouDownBPM, 80 + 64), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 16), quickSec(knockYouDownBPM, 128 + 32), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 68 + 80), quickSec(knockYouDownBPM, 80 + 80), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 32), quickSec(knockYouDownBPM, 128 + 48)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 48), quickSec(knockYouDownBPM, 128 + 64)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 64), quickSec(knockYouDownBPM, 128 + 80)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 80), quickSec(knockYouDownBPM, 128 + 96)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 96), quickSec(knockYouDownBPM, 128 + 112)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 112), quickSec(knockYouDownBPM, 128 + 128)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128), quickSec(knockYouDownBPM, 128 + 128 + 16)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 16), quickSec(knockYouDownBPM, 128 + 128 + 32)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 32), quickSec(knockYouDownBPM, 128 + 128 + 48), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 48), quickSec(knockYouDownBPM, 128 + 128 + 64)), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 48), quickSec(knockYouDownBPM, 128 + 128 + 64), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 64), quickSec(knockYouDownBPM, 128 + 128 + 80)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 80), quickSec(knockYouDownBPM, 128 + 128 + 96), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 84), quickSec(knockYouDownBPM, 128 + 128 + 96), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 96), quickSec(knockYouDownBPM, 128 + 128 + 112)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 112), quickSec(knockYouDownBPM, 128 + 128 + 128)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128), quickSec(knockYouDownBPM, 128 + 128 + 128 + 16)),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128 + 16), quickSec(knockYouDownBPM, 128 + 128 + 128 + 32), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128 + 20), quickSec(knockYouDownBPM, 128 + 128 + 128 + 32), true),
        new MotifReference(POWERSCOMBINEDMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128 + 32), quickSec(knockYouDownBPM, 128 + 128 + 128 + 48), true), new MotifReference(QUEENAMOTIF, quickSec(knockYouDownBPM, 128 + 128 + 128 + 36), quickSec(knockYouDownBPM, 128 + 128 + 128 + 48), true),
    ],
    "", quickSec(knockYouDownBPM, 128 + 128 + 128 + 56)
);

const gyaaHaHaBPM = 125;
const gyaaHaHa = new Song("Gyaa Ha ha!",
    [GERSONMOTIF],
    "HeAXR0UKRxY",
    [
        new MotifReference(UNDYNEMOTIF, quickSec(gyaaHaHaBPM, 1.66), quickSec(gyaaHaHaBPM, 5)),
        new MotifReference(UNDYNEMOTIF, quickSec(gyaaHaHaBPM, 5.66), quickSec(gyaaHaHaBPM, 9)),
        new MotifReference(UNDYNEMOTIF, quickSec(gyaaHaHaBPM, 9.66), quickSec(gyaaHaHaBPM, 13)),
    ]
    // TODO: add loop point
);

const wiseWords = new Song("Wise words",
    [GERSONMOTIF],
    "YYl_CuHvVRs",
    [
        
    ]
);

const hammerOfJustice = new Song("Hammer of Justice",
    [GERSONMOTIF, FREEDOMMOTIF],
    "tBdLO8u-0L8",
    [
        
    ]
);

const heavyFootstepsBPM = 100;
const heavyFootsteps = new Song("Heavy Footsteps",
    [TITANMOTIF],
    "4f5XPpd3oiU",
    [
        new MotifReference(TITANMOTIF, 0, quickSec(heavyFootstepsBPM, 16)),
        new MotifReference(TITANMOTIF, quickSec(heavyFootstepsBPM, 16), quickSec(heavyFootstepsBPM, 32)),
        new MotifReference(TITANMOTIF, quickSec(heavyFootstepsBPM, 32), quickSec(heavyFootstepsBPM, 48)),
        new MotifReference(TITANMOTIF, quickSec(heavyFootstepsBPM, 48), quickSec(heavyFootstepsBPM, 64)),
    ],
    "", quickSec(heavyFootstepsBPM, 64)
);

const crumblingTowerBPM = 115;
const crumblingTower = new Song("Crumbling Tower",
    [TITANMOTIF, SANCTUARYMOTIF],
    "z2IT2YzscSE",
    [
        new MotifReference(TITANMOTIF, 0, quickSec(crumblingTowerBPM, 16)),
        new MotifReference(TITANMOTIF, quickSec(crumblingTowerBPM, 16), quickSec(crumblingTowerBPM, 32)),
        new MotifReference(TITANMOTIF, quickSec(crumblingTowerBPM, 32), quickSec(crumblingTowerBPM, 48)),
        new MotifReference(TITANMOTIF, quickSec(crumblingTowerBPM, 48), quickSec(crumblingTowerBPM, 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 64), quickSec(crumblingTowerBPM, 72)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 72), quickSec(crumblingTowerBPM, 80)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 80), quickSec(crumblingTowerBPM, 88)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 88), quickSec(crumblingTowerBPM, 96)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 96), quickSec(crumblingTowerBPM, 104)),
        new MotifReference(TITANMOTIF, quickSec(crumblingTowerBPM, 96), quickSec(crumblingTowerBPM, 112)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 112), quickSec(crumblingTowerBPM, 120)),
        new MotifReference(TITANMOTIF, quickSec(crumblingTowerBPM, 112), quickSec(crumblingTowerBPM, 128)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 64 + 64), quickSec(crumblingTowerBPM, 72 + 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 72 + 64), quickSec(crumblingTowerBPM, 80 + 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 80 + 64), quickSec(crumblingTowerBPM, 88 + 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 88 + 64), quickSec(crumblingTowerBPM, 96 + 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 96 + 64), quickSec(crumblingTowerBPM, 104 + 64)),
        new MotifReference(TITANMOTIF, quickSec(crumblingTowerBPM, 96 + 64), quickSec(crumblingTowerBPM, 112 + 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 112 + 64), quickSec(crumblingTowerBPM, 120 + 64)),
        new MotifReference(TITANMOTIF, quickSec(crumblingTowerBPM, 112 + 64), quickSec(crumblingTowerBPM, 128 + 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 64 + 128), quickSec(crumblingTowerBPM, 80 + 128)),
        new MotifReference(DONTFORGETMOTIF, quickSec(crumblingTowerBPM, 64 + 13 + 128), quickSec(crumblingTowerBPM, 80 + 128)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 80 + 128), quickSec(crumblingTowerBPM, 96 + 128)),
        new MotifReference(DONTFORGETMOTIF, quickSec(crumblingTowerBPM, 80 + 13 + 128), quickSec(crumblingTowerBPM, 96 + 128)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 96 + 128), quickSec(crumblingTowerBPM, 112 + 128)),
        new MotifReference(DONTFORGETMOTIF, quickSec(crumblingTowerBPM, 96 + 13 + 128), quickSec(crumblingTowerBPM, 112 + 128)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 112 + 128), quickSec(crumblingTowerBPM, 128 + 128)),
        new MotifReference(DONTFORGETMOTIF, quickSec(crumblingTowerBPM, 112 + 13 + 128), quickSec(crumblingTowerBPM, 128 + 128)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 112 + 128 + 48), quickSec(crumblingTowerBPM, 128 + 128 + 48), true),
        new MotifReference(DONTFORGETMOTIF, quickSec(crumblingTowerBPM, 112 + 13 + 128 + 48), quickSec(crumblingTowerBPM, 128 + 128 + 48)),
        new MotifReference(SANCTUARYMOTIF, quickSec(crumblingTowerBPM, 112 + 128 + 64), quickSec(crumblingTowerBPM, 128 + 128 + 64), true),
        new MotifReference(DONTFORGETMOTIF, quickSec(crumblingTowerBPM, 112 + 13 + 128 + 64), quickSec(crumblingTowerBPM, 128 + 128 + 64)),
    ],
    "", quickSec(crumblingTowerBPM, 128 + 128 + 64 + 4)
);

const spawnBPM = 135;
const spawn = new Song("SPAWN",
    [TITANMOTIF],
    "oZywM_ZwvJQ",
    [
        new MotifReference(TITANMOTIF, 0, quickSec(spawnBPM, 16)),
        new MotifReference(TITANMOTIF, quickSec(spawnBPM, 16), quickSec(spawnBPM, 32)),
        new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 32), quickSec(spawnBPM, 40)), new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 40), quickSec(spawnBPM, 48)),
        new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 48), quickSec(spawnBPM, 56)), new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 56), quickSec(spawnBPM, 64)),
        new MotifReference(TITANMOTIF, quickSec(spawnBPM, 64), quickSec(spawnBPM, 80)), new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 64), quickSec(spawnBPM, 72)),
        new MotifReference(TITANMOTIF, quickSec(spawnBPM, 80), quickSec(spawnBPM, 96)), new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 80), quickSec(spawnBPM, 88)),
    ],
    "", quickSec(spawnBPM, 128 + 32)
);

const guardianBPM = 140;
const guardian = new Song("GUARDIAN",
    [TITANMOTIF, SANCTUARYMOTIF],
    "nP9mB1sVJz4",
    [
        new MotifReference(TITANMOTIF, 0, quickSec(guardianBPM, 16)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 16), quickSec(guardianBPM, 32)),

        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 32), quickSec(guardianBPM, 48)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 32), quickSec(guardianBPM, 48)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 48), quickSec(guardianBPM, 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 48), quickSec(guardianBPM, 64)),

        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 64), quickSec(guardianBPM, 80)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 80), quickSec(guardianBPM, 96)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 96), quickSec(guardianBPM, 96 + 16)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 96 + 16), quickSec(guardianBPM, 96 + 32)),

        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 8), quickSec(guardianBPM, 128 + 8 + 16)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 8 + 13), quickSec(guardianBPM, 128 + 8 + 16)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 24), quickSec(guardianBPM, 128 + 24 + 16)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 24 + 13), quickSec(guardianBPM, 128 + 24 + 16)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 40), quickSec(guardianBPM, 128 + 40 + 16)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 56), quickSec(guardianBPM, 128 + 56 + 16)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 56 + 7), quickSec(guardianBPM, 128 + 56 + 16)),

        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 128 + 56 + 16), quickSec(guardianBPM, 128 + 56 + 32)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 128 + 56 + 32), quickSec(guardianBPM, 128 + 56 + 48)),

        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 32 + 200), quickSec(guardianBPM, 48 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 32 + 200), quickSec(guardianBPM, 48 + 200)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 48 + 200), quickSec(guardianBPM, 64 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 48 + 200), quickSec(guardianBPM, 64 + 200)),

        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 64 + 200), quickSec(guardianBPM, 64 + 200 + 16)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 64 + 200 + 16), quickSec(guardianBPM, 64 + 200 + 32)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 64 + 200 + 32), quickSec(guardianBPM, 64 + 200 + 48)),
        new MotifReference(TITANMOTIF, quickSec(guardianBPM, 64 + 200 + 48), quickSec(guardianBPM, 64 + 200 + 64)),

        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 8 + 200), quickSec(guardianBPM, 128 + 8 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 8 + 13 + 200), quickSec(guardianBPM, 128 + 8 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 24 + 200), quickSec(guardianBPM, 128 + 24 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 24 + 13 + 200), quickSec(guardianBPM, 128 + 24 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 40 + 200), quickSec(guardianBPM, 128 + 40 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 56 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 56 + 7 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200)),

        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 72 + 200), quickSec(guardianBPM, 128 + 72 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 72 + 13 + 200), quickSec(guardianBPM, 128 + 72 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 88 + 200), quickSec(guardianBPM, 128 + 88 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 88 + 13 + 200), quickSec(guardianBPM, 128 + 88 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 104 + 200), quickSec(guardianBPM, 128 + 104 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 104 + 13 + 200), quickSec(guardianBPM, 128 + 104 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 120 + 200), quickSec(guardianBPM, 128 + 120 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 120 + 13 + 200), quickSec(guardianBPM, 128 + 120 + 16 + 200)),
    ],
    "", quickSec(guardianBPM, 128 + 120 + 16 + 200 + 64),
    [
        new EffectRef(BLACKSCREENEFFECT, quickSec(guardianBPM, 96 + 32), quickSec(guardianBPM, 96 + 32 + 8)),
        new EffectRef(FLASHEFFECT, quickSec(guardianBPM, 96 + 32 + 8), quickSec(guardianBPM, 96 + 32 + 8 + 4)),
        new EffectRef(BLACKSCREENEFFECT, quickSec(guardianBPM, 64 + 200 + 64), quickSec(guardianBPM, 64 + 200 + 64 + 8)),
        new EffectRef(FLASHEFFECT, quickSec(guardianBPM, 64 + 200 + 64 + 8), quickSec(guardianBPM, 64 + 200 + 64 + 8 + 4)),

        new EffectRef(BLACKFLASHEFFECT, 0, quickSec(guardianBPM, 8)),
        new EffectRef(HEROEFFECT, quickSec(guardianBPM, 128 + 8), quickSec(guardianBPM, 128 + 56 + 16)),
        new EffectRef(BLACKFLASHEFFECT, quickSec(guardianBPM, 128 + 56 + 16), quickSec(guardianBPM, 128 + 56 + 16 + 8)),
        new EffectRef(HEROEFFECT, quickSec(guardianBPM, 128 + 8 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200)),
        new EffectRef(BLACKFLASHEFFECT, quickSec(guardianBPM, 128 + 56 + 16 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200 + 8)),
    ]
);

const needAHand = new Song("Need a hand!?",
    [GERSONMOTIF],
    "C135xMeF4jk",
    [
        
    ]
);

const catswingBPM = 130;
const catswing = new Song("Catswing",
    [MIKEMOTIF],
    "r-DvoCTarMQ",
    [
        new MotifReference(MIKEMOTIF, quickSec(catswingBPM, 15), quickSec(catswingBPM, 31)),
        new MotifReference(MIKEMOTIF, quickSec(catswingBPM, 31), quickSec(catswingBPM, 47)),

        new MotifReference(SPAMTONAMOTIF, quickSec(catswingBPM, 48), quickSec(catswingBPM, 60)),
        new MotifReference(SPAMTONAMOTIF, quickSec(catswingBPM, 64), quickSec(catswingBPM, 76)),

        new MotifReference(SPAMTONBMOTIF, quickSec(catswingBPM, 80), quickSec(catswingBPM, 96)),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 80), quickSec(catswingBPM, 82)),
        new MotifReference(SPAMTONBMOTIF, quickSec(catswingBPM, 96), quickSec(catswingBPM, 112)),
        new MotifReference(QUEENAMOTIF, quickSec(catswingBPM, 96), quickSec(catswingBPM, 101)),
        new MotifReference(SPAMTONBMOTIF, quickSec(catswingBPM, 112), quickSec(catswingBPM, 128)),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 112), quickSec(catswingBPM, 114)),
        new MotifReference(SPAMTONBMOTIF, quickSec(catswingBPM, 128), quickSec(catswingBPM, 144)),

        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 144), quickSec(catswingBPM, 144 + 6)),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 144 + 8), quickSec(catswingBPM, 144 + 8 + 6)),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 144 + 16), quickSec(catswingBPM, 144 + 16 + 6)),
        new MotifReference(TENNAMOTIF, quickSec(catswingBPM, 144 + 16.5), quickSec(catswingBPM, 144 + 16 + 7), true),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 144 + 24), quickSec(catswingBPM, 144 + 24 + 6)),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 144 + 32), quickSec(catswingBPM, 144 + 32 + 6)),
        new MotifReference(TENNAMOTIF, quickSec(catswingBPM, 144 + 32.5), quickSec(catswingBPM, 144 + 32 + 7), true),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 144 + 40), quickSec(catswingBPM, 144 + 40 + 6)),

        new MotifReference(SPAMTONBMOTIF, quickSec(catswingBPM, 80 + 112), quickSec(catswingBPM, 96 + 112)),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 80 + 112), quickSec(catswingBPM, 82 + 112)),
        new MotifReference(SPAMTONBMOTIF, quickSec(catswingBPM, 96 + 112), quickSec(catswingBPM, 112 + 112)),
        new MotifReference(QUEENAMOTIF, quickSec(catswingBPM, 96 + 112), quickSec(catswingBPM, 101 + 112)),
        new MotifReference(SPAMTONBMOTIF, quickSec(catswingBPM, 112 + 112), quickSec(catswingBPM, 128 + 112)),
        new MotifReference(TVTIMEMOTIF, quickSec(catswingBPM, 112 + 112), quickSec(catswingBPM, 114 + 112)),
        new MotifReference(SPAMTONBMOTIF, quickSec(catswingBPM, 128 + 112), quickSec(catswingBPM, 144 + 112)),
    ]
);

//#endregion

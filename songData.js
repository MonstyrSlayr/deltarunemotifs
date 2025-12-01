import { LINK, normalizeAndTrim } from "./data.js";
import { Motifs, MotifReference, getMotifsById } from "./motifData.js";
import { Contributors } from "./contribData.js";
import { Effects, EffectRef } from "./effectData.js";

export const allSongs = [];

class Song
{
    name;
    youtubeId;
    motifRefs = [];
    loopPoint = null;
    mainMotifs = null;
    effectRefs = [];
    contributors = [Contributors.MONSTYRSLAYR]; // default, you egotistic

    constructor(name, mainMotifs, youtubeId = "", motifRefs = [], id = "", loopPoint = null, effectRefs = [], contributors = [Contributors.MONSTYRSLAYR])
    {
        this.name = name;
        this.mainMotifs = mainMotifs;
        this.youtubeId = youtubeId;
        this.motifRefs = motifRefs.sort((a, b) => a.startTime - b.startTime);

        if (id == "") this.id = normalizeAndTrim(name);
        else this.id = id; // in case the name is the same in multiple albums

        this.loopPoint = loopPoint;
        this.effectRefs = effectRefs;
        this.contributors = contributors;

        allSongs.push(this);
    }
}

export function getMotifRefCount(motifId)
{
    let count = 0;
    allSongs.forEach(song =>
    {
        song.motifRefs.forEach(motifRef =>
        {
            if (motifRef.motif.id == motifId) count++;
        });
    });
    return count;
}

export function getSongById(id)
{
    return allSongs.find(song => id == song.id);
}

export function getSongsWithMotif(motif)
{
    return allSongs.filter(song => song.motifRefs.some(ref => ref.motif == motif));
}

export function getSongsWithMotifId(motifId)
{
    return allSongs.filter(song => song.motifRefs.some(ref => ref.motif.id == motifId));
}

export function getSongsWithContributor(contrib)
{
    return allSongs.filter(song => song.contributors.some(c => c == contrib));
}

export function createMotifDiv(motifId, isLink = true, isPlaying = false)
{
    const motifsWithId = getMotifsById(motifId);
    let hasSongs = false;
    motifsWithId.forEach(motif =>
    {
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
            if (isPlaying && motifsWithId[0].imagePlaying != null) notTempImg.classList.add("gone");
            leftTime.appendChild(notTempImg);

            motifMainDiv.image = notTempImg; // stupid
        }

        if (motifsWithId[0].imagePlaying != null)
        {
            const notTempImgPlaying = document.createElement("img");
            notTempImgPlaying.src = motifsWithId[0].imagePlaying;
            notTempImgPlaying.alt = motifId + " image";
            notTempImgPlaying.color = motifsWithId[0].color;
            if (!isPlaying) notTempImgPlaying.classList.add("gone");
            leftTime.appendChild(notTempImgPlaying);

            motifMainDiv.imagePlaying = notTempImgPlaying; // stupid
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

const theDoor = new Song("The Door",
    [Motifs.THEDOOR],
    "iJtIX0sQn0o",
    [

    ]
);

const theChase = new Song("The Chase",
    [Motifs.THECHASE],
    "hWWVWfQW1H4",
    [

    ]
);

const theLegendBPM = 110;
const theLegend = new Song("The Legend",
    [Motifs.THELEGENDA],
    "PibYmujLubI",
    [
        new MotifReference(Motifs.THELEGENDA, quickSec(theLegendBPM, 1), quickSec(theLegendBPM, 8)),
        new MotifReference(Motifs.THELEGENDA, quickSec(theLegendBPM, 9), quickSec(theLegendBPM, 12)),
        new MotifReference(Motifs.THELEGENDB, quickSec(theLegendBPM, 36), quickSec(theLegendBPM, 36 + 16)),
        new MotifReference(Motifs.THELEGENDB, quickSec(theLegendBPM, 36 + 16), quickSec(theLegendBPM, 36 + 32)),
        new MotifReference(Motifs.THELEGENDB, quickSec(theLegendBPM, 36 + 32), quickSec(theLegendBPM, 36 + 48)),
        new MotifReference(Motifs.THELEGENDB, quickSec(theLegendBPM, 36 + 48), quickSec(theLegendBPM, 36 + 64)),
        new MotifReference(Motifs.THELEGENDB, quickSec(theLegendBPM, 36 + 64), quickSec(theLegendBPM, 36 + 80)),
        new MotifReference(Motifs.THELEGENDB, quickSec(theLegendBPM, 36 + 80), quickSec(theLegendBPM, 36 + 96)),
        new MotifReference(Motifs.THELEGENDA, quickSec(theLegendBPM, 37 + 96), quickSec(theLegendBPM, 36 + 96 + 7)),
        new MotifReference(Motifs.THELEGENDC, quickSec(theLegendBPM, 36 + 128), quickSec(theLegendBPM, 36 + 128 + 34)),
    ],
    "", quickSec(theLegendBPM, 36 + 128 + 35)
);

const lancerBPM = 125;
const lancer = new Song("Lancer",
    [Motifs.LANCERA, Motifs.LANCERB],
    "GAhBQH0Kf1I",
    [
        new MotifReference(Motifs.LANCERA, 0, quickSec(lancerBPM, 24.66)),
        new MotifReference(Motifs.LANCERA, quickSec(lancerBPM, 24.66), quickSec(lancerBPM, 48.66)),
        new MotifReference(Motifs.LANCERB, quickSec(lancerBPM, 49), quickSec(lancerBPM, 73.33)),
        new MotifReference(Motifs.LANCERB, quickSec(lancerBPM, 73.33), quickSec(lancerBPM, 73 + 22)),
    ],
    "", quickSec(lancerBPM, 99)
);

const rudeBuster = new Song("Rude Buster",
    [Motifs.RUDEBUSTERA, Motifs.RUDEBUSTERB],
    "GPL5Hkl11IQ",
    [

    ]
);

const fieldOfHopesAndDreamsBPM = 125;
const fieldOfHopesAndDreams = new Song("Field of Hopes and Dreams",
    [Motifs.FIELDOFHOPESANDDREAMS, Motifs.DONTFORGET],
    "9oDZ2vN9XF0",
    [
        new MotifReference(Motifs.FIELDOFHOPESANDDREAMS, quickSec(fieldOfHopesAndDreamsBPM, 96), quickSec(fieldOfHopesAndDreamsBPM, 111)),
        new MotifReference(Motifs.FIELDOFHOPESANDDREAMS, quickSec(fieldOfHopesAndDreamsBPM, 270), quickSec(fieldOfHopesAndDreamsBPM, 287)),
        new MotifReference(Motifs.FIELDOFHOPESANDDREAMS, quickSec(fieldOfHopesAndDreamsBPM, 302), quickSec(fieldOfHopesAndDreamsBPM, 319)),

        new MotifReference(Motifs.DONTFORGET, quickSec(fieldOfHopesAndDreamsBPM, 111), quickSec(fieldOfHopesAndDreamsBPM, 125)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fieldOfHopesAndDreamsBPM, 127), quickSec(fieldOfHopesAndDreamsBPM, 157), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(fieldOfHopesAndDreamsBPM, 159), quickSec(fieldOfHopesAndDreamsBPM, 189.5)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fieldOfHopesAndDreamsBPM, 189.5), quickSec(fieldOfHopesAndDreamsBPM, 193.5)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fieldOfHopesAndDreamsBPM, 193.5), quickSec(fieldOfHopesAndDreamsBPM, 197.5)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fieldOfHopesAndDreamsBPM, 197.5), quickSec(fieldOfHopesAndDreamsBPM, 200), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(fieldOfHopesAndDreamsBPM, 287), quickSec(fieldOfHopesAndDreamsBPM, 301)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fieldOfHopesAndDreamsBPM, 319), quickSec(fieldOfHopesAndDreamsBPM, 336)),
    ],
    "", quickSec(fieldOfHopesAndDreamsBPM, 144 + 144 + 48),
    [],
    [Contributors.KARMA]
);

const fanfareBPM = 123;
const fanfare = new Song("Fanfare",
    [Motifs.FANFARE],
    "OmMdXpuscRY",
    [
        new MotifReference(Motifs.FANFARE, quickSec(fanfareBPM, 1), quickSec(fanfareBPM, 12))
    ]
);

const lantern = new Song("Lantern",
    [Motifs.RUDEBUSTERA, Motifs.RUDEBUSTERB],
    "5kJ4JJSsJMQ",
    [

    ]
);

const quietAutumnBPM = 135;
const quietAutumn = new Song("Quiet Autumn",
    [Motifs.QUIETAUTUMN],
    "2PkQJeH9Ers",
    [
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(quietAutumnBPM, 48), quickSec(quietAutumnBPM, 64)),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(quietAutumnBPM, 64), quickSec(quietAutumnBPM, 80), true),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(quietAutumnBPM, 80), quickSec(quietAutumnBPM, 96)),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(quietAutumnBPM, 96), quickSec(quietAutumnBPM, 112), true),
    ],
    "", quickSec(quietAutumnBPM, 112),
    [],
    [Contributors.KARMA]
);

const scarletForestBPM = 120;
const scarletForest = new Song("Scarlet Forest",
    [Motifs.QUIETAUTUMN, Motifs.DONTFORGET],
    "6P5iPI1FjO8",
    [
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(scarletForestBPM, 32), quickSec(scarletForestBPM, 40)),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(scarletForestBPM, 40), quickSec(scarletForestBPM, 48), true),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(scarletForestBPM, 64), quickSec(scarletForestBPM, 72)),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(scarletForestBPM, 72), quickSec(scarletForestBPM, 80), true),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(scarletForestBPM, 96), quickSec(scarletForestBPM, 104)),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(scarletForestBPM, 104), quickSec(scarletForestBPM, 112), true),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(scarletForestBPM, 128), quickSec(scarletForestBPM, 136)),
        new MotifReference(Motifs.QUIETAUTUMN, quickSec(scarletForestBPM, 136), quickSec(scarletForestBPM, 144), true),

        new MotifReference(Motifs.DONTFORGET, quickSec(scarletForestBPM, 185.5), quickSec(scarletForestBPM, 190), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(scarletForestBPM, 217.5), quickSec(scarletForestBPM, 222), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(scarletForestBPM, 239), quickSec(scarletForestBPM, 256)),

        new MotifReference(Motifs.FIELDOFHOPESANDDREAMS, quickSec(scarletForestBPM, 222), quickSec(scarletForestBPM, 239)),
    ],
    "", quickSec(scarletForestBPM, 144 + 112),
    [],
    [Contributors.KARMA]
);

const vsLancerBPM = 177;
const vsLancer = new Song("Vs. Lancer",
    [Motifs.LANCERA, Motifs.LANCERB],
    "Ce-gU8G6Vik",
    [
        new MotifReference(Motifs.LANCERA, quickSec(vsLancerBPM, 2.5), quickSec(vsLancerBPM, 33.5)),
        new MotifReference(Motifs.LANCERA, quickSec(vsLancerBPM, 33.5), quickSec(vsLancerBPM, 64.75)),
        new MotifReference(Motifs.LANCERB, quickSec(vsLancerBPM, 64.75), quickSec(vsLancerBPM, 64.25 + 32)),
        new MotifReference(Motifs.LANCERB, quickSec(vsLancerBPM, 64.25 + 32), quickSec(vsLancerBPM, 123)),
    ],
    "", quickSec(vsLancerBPM, 123)
);

const cardCastleBPM = 125;
const cardCastle = new Song("Card Castle",
    [Motifs.KING],
    "tvjuTn9LZwY",
    [
        new MotifReference(Motifs.KING, 0, quickSec(cardCastleBPM, 32)),
        new MotifReference(Motifs.KING, quickSec(cardCastleBPM, 32), quickSec(cardCastleBPM, 62.5)),
        new MotifReference(Motifs.LANCERA, quickSec(cardCastleBPM, 62.5), quickSec(cardCastleBPM, 96)),
        new MotifReference(Motifs.LANCERA, quickSec(cardCastleBPM, 96), quickSec(cardCastleBPM, 128)),
    ],
    "", quickSec(cardCastleBPM, 128)
);

const chaosKingBPM = 147;
const chaosKing = new Song("Chaos King",
    [Motifs.KING],
    "tPwzoZ-e664",
    [
        new MotifReference(Motifs.KING, quickSec(chaosKingBPM, 8), quickSec(chaosKingBPM, 40)),
        new MotifReference(Motifs.KING, quickSec(chaosKingBPM, 40), quickSec(chaosKingBPM, 40 + 32)),
        new MotifReference(Motifs.KING, quickSec(chaosKingBPM, 40 + 32), quickSec(chaosKingBPM, 40 + 64)),
        new MotifReference(Motifs.LANCERA, quickSec(chaosKingBPM, 38.5 + 64), quickSec(chaosKingBPM, 40 + 96)),
        new MotifReference(Motifs.LANCERA, quickSec(chaosKingBPM, 40 + 96), quickSec(chaosKingBPM, 40 + 96 + 32)),
        new MotifReference(Motifs.THELEGENDC, quickSec(chaosKingBPM, 40 + 96 + 32), quickSec(chaosKingBPM, 40 + 96 + 64)),
        new MotifReference(Motifs.THELEGENDC, quickSec(chaosKingBPM, 40 + 96 + 64), quickSec(chaosKingBPM, 40 + 96 + 92)),
        new MotifReference(Motifs.THELEGENDC, quickSec(chaosKingBPM, 40 + 96 + 92), quickSec(chaosKingBPM, 40 + 96 + 92 + 32), true),
    ],
    "", quickSec(chaosKingBPM, 40 + 96 + 92 + 32)
);

const theWorldRevolvingBPM = 190;
const theWorldRevolving = new Song("THE WORLD REVOLVING",
    [Motifs.FREEDOM],
    "Z01Tsgwe2dQ",
    [
        new MotifReference(Motifs.FREEDOM, quickSec(theWorldRevolvingBPM, 64), quickSec(theWorldRevolvingBPM, 96)), 
        new MotifReference(Motifs.FREEDOM, quickSec(theWorldRevolvingBPM, 96), quickSec(theWorldRevolvingBPM, 128)), 
        new MotifReference(Motifs.FREEDOM, quickSec(theWorldRevolvingBPM, 208), quickSec(theWorldRevolvingBPM, 220)), 
        new MotifReference(Motifs.FREEDOM, quickSec(theWorldRevolvingBPM, 208 + 32), quickSec(theWorldRevolvingBPM, 220 + 32)), 
        new MotifReference(Motifs.DONTFORGET, quickSec(theWorldRevolvingBPM, 259), quickSec(theWorldRevolvingBPM, 267)),
        new MotifReference(Motifs.DONTFORGET, quickSec(theWorldRevolvingBPM, 259 + 8), quickSec(theWorldRevolvingBPM, 267 + 8)),
        new MotifReference(Motifs.DONTFORGET, quickSec(theWorldRevolvingBPM, 259 + 16), quickSec(theWorldRevolvingBPM, 267 + 16)),
        new MotifReference(Motifs.DONTFORGET, quickSec(theWorldRevolvingBPM, 259 + 24), quickSec(theWorldRevolvingBPM, 267 + 24)),
        new MotifReference(Motifs.DONTFORGET, quickSec(theWorldRevolvingBPM, 259 + 32), quickSec(theWorldRevolvingBPM, 267 + 32)),
        new MotifReference(Motifs.DONTFORGET, quickSec(theWorldRevolvingBPM, 259 + 40), quickSec(theWorldRevolvingBPM, 267 + 40)),
        new MotifReference(Motifs.DONTFORGET, quickSec(theWorldRevolvingBPM, 259 + 48), quickSec(theWorldRevolvingBPM, 267 + 48)),
        new MotifReference(Motifs.DONTFORGET, quickSec(theWorldRevolvingBPM, 259 + 56), quickSec(theWorldRevolvingBPM, 264 + 56)),
    ],
    "", quickSec(theWorldRevolvingBPM, 264 + 56)
);

//#endregion

//#region CHAPTER 2

const queenBPM = 109;
const queen = new Song("Queen",
    [Motifs.QUEENA, Motifs.QUEENB],
    "6XQv5CHmITA",
    [
        new MotifReference(Motifs.QUEENA, 0, quickSec(queenBPM, 17.5)),
        new MotifReference(Motifs.QUEENA, quickSec(queenBPM, 17.5), quickSec(queenBPM, 42.5), true),
        new MotifReference(Motifs.QUEENB, quickSec(queenBPM, 42.5), quickSec(queenBPM, 59)),
        new MotifReference(Motifs.QUEENB, quickSec(queenBPM, 59), quickSec(queenBPM, 74.5), true),
        new MotifReference(Motifs.QUEENB, quickSec(queenBPM, 74.5), quickSec(queenBPM, 88)),
        new MotifReference(Motifs.QUEENB, quickSec(queenBPM, 88), quickSec(queenBPM, 102), true),
    ],
    "", quickSec(queenBPM, 102),
    [],
    [Contributors.KARMA]
);

const aSimpleDiversionBPM = 130;
const aSimpleDiversion = new Song("A Simple Diversion",
    [Motifs.QUEENA],
    "p1U5FjgwDhA",
    [
        new MotifReference(Motifs.QUEENA, 0, quickSec(aSimpleDiversionBPM, 16)),
        new MotifReference(Motifs.QUEENC, quickSec(aSimpleDiversionBPM, 16), quickSec(aSimpleDiversionBPM, 32)),
        new MotifReference(Motifs.QUEENA, quickSec(aSimpleDiversionBPM, 32), quickSec(aSimpleDiversionBPM, 48)),
        new MotifReference(Motifs.QUEENC, quickSec(aSimpleDiversionBPM, 48), quickSec(aSimpleDiversionBPM, 60))
    ],
    "", quickSec(aSimpleDiversionBPM, 64)
);

const berdlyBPM = 98;
const berdly = new Song("Berdly",
    [Motifs.BERDLYA, Motifs.BERDLYB],
    "2S8I1h-wNzc",
    [
        new MotifReference(Motifs.BERDLYA, 0, quickSec(berdlyBPM, 24)),
        new MotifReference(Motifs.BERDLYA, quickSec(berdlyBPM, 24), quickSec(berdlyBPM, 48.5)),
        new MotifReference(Motifs.BERDLYB, quickSec(berdlyBPM, 48.5), quickSec(berdlyBPM, 72.5)),
    ],
    "", quickSec(berdlyBPM, 72.5)
);

const smartRaceBPM = 150;
const smartRace = new Song("Smart Race",
    [Motifs.BERDLYA, Motifs.BERDLYB],
    "HZO3xw91eHw",
    [
        new MotifReference(Motifs.QUEENA, quickSec(smartRaceBPM, 4), quickSec(smartRaceBPM, 8)),
        new MotifReference(Motifs.QUEENA, quickSec(smartRaceBPM, 12), quickSec(smartRaceBPM, 16)),
        new MotifReference(Motifs.QUEENA, quickSec(smartRaceBPM, 20), quickSec(smartRaceBPM, 24)),
        new MotifReference(Motifs.QUEENA, quickSec(smartRaceBPM, 25), quickSec(smartRaceBPM, 32)),
        new MotifReference(Motifs.BERDLYA, quickSec(smartRaceBPM, 32), quickSec(smartRaceBPM, 64)),
        new MotifReference(Motifs.BERDLYA, quickSec(smartRaceBPM, 64), quickSec(smartRaceBPM, 96)),
        new MotifReference(Motifs.BERDLYB, quickSec(smartRaceBPM, 96), quickSec(smartRaceBPM, 128)),
        new MotifReference(Motifs.BERDLYB, quickSec(smartRaceBPM, 128), quickSec(smartRaceBPM, 128 + 32)),
    ],
    "", quickSec(smartRaceBPM, 128 + 32)
);

const coolMixtapeBPM = 144;
const coolMixtape = new Song("Cool Mixtape",
    [Motifs.QUEENA],
    "EeVEyBGPgLY",
    [
        new MotifReference(Motifs.QUEENA, 0, quickSec(coolMixtapeBPM, 16)),
        new MotifReference(Motifs.QUEENC, quickSec(coolMixtapeBPM, 16), quickSec(coolMixtapeBPM, 32)),
        new MotifReference(Motifs.QUEEND, quickSec(coolMixtapeBPM, 32), quickSec(coolMixtapeBPM, 64)),
    ],
    "", quickSec(coolMixtapeBPM, 64)
);

const heyEveryBPM = 101.5;
const heyEvery = new Song("HEY EVERY !",
    [Motifs.TVTIME],
    "DZKnVQL3r2I",
    [
        new MotifReference(Motifs.TVTIME, 0, quickSec(heyEveryBPM, 4)),
        new MotifReference(Motifs.TVTIME, quickSec(heyEveryBPM, 4), quickSec(heyEveryBPM, 8)),
        new MotifReference(Motifs.TVTIME, quickSec(heyEveryBPM, 8), quickSec(heyEveryBPM, 12)),
        new MotifReference(Motifs.TVTIME, quickSec(heyEveryBPM, 12), quickSec(heyEveryBPM, 16)),
        new MotifReference(Motifs.TVTIME, quickSec(heyEveryBPM, 16), quickSec(heyEveryBPM, 20)),
        new MotifReference(Motifs.TVTIME, quickSec(heyEveryBPM, 20), quickSec(heyEveryBPM, 24)),
        new MotifReference(Motifs.TVTIME, quickSec(heyEveryBPM, 24), quickSec(heyEveryBPM, 28)),
        new MotifReference(Motifs.TVTIME, quickSec(heyEveryBPM, 28), quickSec(heyEveryBPM, 32)),
    ],
    "", quickSec(heyEveryBPM, 32)
);

const spamtonBPM = 95;
const spamton = new Song("Spamton",
    [Motifs.SPAMTONA],
    "cSm5gKlmw2M",
    [
        new MotifReference(Motifs.SPAMTONA, 0, quickSec(spamtonBPM, 16)),
        new MotifReference(Motifs.SPAMTONA, quickSec(spamtonBPM, 16), quickSec(spamtonBPM, 32)),
    ],
    "", quickSec(spamtonBPM, 64)
);

const nowsYourChanceToBeABPM = 132;
const nowsYourChanceToBeA = new Song("NOW'S YOUR CHANCE TO BE A",
    [Motifs.SPAMTONA, Motifs.SPAMTONB],
    "2GbBD_7AsGA",
    [
        new MotifReference(Motifs.SPAMTONA, 0, quickSec(nowsYourChanceToBeABPM, 16)),
        new MotifReference(Motifs.SPAMTONA, quickSec(nowsYourChanceToBeABPM, 16), quickSec(nowsYourChanceToBeABPM, 32)),
        new MotifReference(Motifs.SPAMTONA, quickSec(nowsYourChanceToBeABPM, 32), quickSec(nowsYourChanceToBeABPM, 48)),
        new MotifReference(Motifs.SPAMTONB, quickSec(nowsYourChanceToBeABPM, 48), quickSec(nowsYourChanceToBeABPM, 64)),
        new MotifReference(Motifs.SPAMTONB, quickSec(nowsYourChanceToBeABPM, 64), quickSec(nowsYourChanceToBeABPM, 80)),
        new MotifReference(Motifs.SPAMTONA, quickSec(nowsYourChanceToBeABPM, 96), quickSec(nowsYourChanceToBeABPM, 112)),
        new MotifReference(Motifs.SPAMTONB, quickSec(nowsYourChanceToBeABPM, 112), quickSec(nowsYourChanceToBeABPM, 112 + 16)),
        new MotifReference(Motifs.SPAMTONB, quickSec(nowsYourChanceToBeABPM, 112 + 16), quickSec(nowsYourChanceToBeABPM, 112 + 32)),
    ],
    "", quickSec(nowsYourChanceToBeABPM, 112 + 32)
)

const elegantEntranceBPM = 100;
const elegantEntrance = new Song("Elegant Entrance",
    [Motifs.QUEENA],
    "j6baKyF2Ksc",
    [
        new MotifReference(Motifs.QUEENA, 0, quickSec(elegantEntranceBPM, 32)),
        new MotifReference(Motifs.QUEENA, quickSec(elegantEntranceBPM, 32), quickSec(elegantEntranceBPM, 64), true),
        new MotifReference(Motifs.QUEENB, quickSec(elegantEntranceBPM, 64), quickSec(elegantEntranceBPM, 96)),
        new MotifReference(Motifs.QUEENB, quickSec(elegantEntranceBPM, 96), quickSec(elegantEntranceBPM, 128), true),
    ],
    "", quickSec(elegantEntranceBPM, 128)
);

const bluebirdOfMisfortuneBPM = 120;
const bluebirdOfMisfortune = new Song("Bluebird of Misfortune",
    [Motifs.BERDLYA, Motifs.BERDLYB],
    "yud5H-vnbJw",
    [
        new MotifReference(Motifs.BERDLYA, 0, quickSec(bluebirdOfMisfortuneBPM, 49)),
        new MotifReference(Motifs.BERDLYB, quickSec(bluebirdOfMisfortuneBPM, 49), quickSec(bluebirdOfMisfortuneBPM, 97)),
    ],
    "", quickSec(bluebirdOfMisfortuneBPM, 97)
)

const pandoraPalaceBPM = 100;
const pandoraPalace = new Song("Pandora Palace",
    [Motifs.QUEENA],
    "q-5cXVcCOUs",
    [
        new MotifReference(Motifs.QUEENA, quickSec(pandoraPalaceBPM, 34), quickSec(pandoraPalaceBPM, 34 + 16)),
        new MotifReference(Motifs.QUEENA, quickSec(pandoraPalaceBPM, 34 + 16), quickSec(pandoraPalaceBPM, 34 + 32), true),
        new MotifReference(Motifs.QUEENB, quickSec(pandoraPalaceBPM, 34 + 64), quickSec(pandoraPalaceBPM, 34 + 80)),
        new MotifReference(Motifs.QUEENB, quickSec(pandoraPalaceBPM, 34 + 80), quickSec(pandoraPalaceBPM, 34 + 96), true),
        new MotifReference(Motifs.QUEENB, quickSec(pandoraPalaceBPM, 34 + 64 + 32), quickSec(pandoraPalaceBPM, 34 + 80 + 32)),
        new MotifReference(Motifs.QUEENB, quickSec(pandoraPalaceBPM, 34 + 80 + 32), quickSec(pandoraPalaceBPM, 34 + 96 + 32), true),
    ],
    "", quickSec(pandoraPalaceBPM, 34 + 96 + 32)
);

const lostGirlBPM = 75;
const lostGirl = new Song("Lost Girl",
    [Motifs.LOSTGIRLA, Motifs.LOSTGIRLB],
    "P89rxnT7lKw",
    [
        new MotifReference(Motifs.LOSTGIRLA, 0, quickSec(lostGirlBPM, 8)),
        new MotifReference(Motifs.LOSTGIRLA, quickSec(lostGirlBPM, 8), quickSec(lostGirlBPM, 16), true),
        new MotifReference(Motifs.LOSTGIRLA, quickSec(lostGirlBPM, 16), quickSec(lostGirlBPM, 24)),

        new MotifReference(Motifs.LOSTGIRLA, quickSec(lostGirlBPM, 32), quickSec(lostGirlBPM, 40)),
        new MotifReference(Motifs.LOSTGIRLA, quickSec(lostGirlBPM, 40), quickSec(lostGirlBPM, 48), true),
        new MotifReference(Motifs.LOSTGIRLA, quickSec(lostGirlBPM, 48), quickSec(lostGirlBPM, 56)),

        new MotifReference(Motifs.LOSTGIRLB, quickSec(lostGirlBPM, 64), quickSec(lostGirlBPM, 72)),
        new MotifReference(Motifs.LOSTGIRLB, quickSec(lostGirlBPM, 72), quickSec(lostGirlBPM, 80), true),
        new MotifReference(Motifs.LOSTGIRLB, quickSec(lostGirlBPM, 80), quickSec(lostGirlBPM, 88)),
    ],
    "", quickSec(lostGirlBPM, 96)
)

const attackOfTheKillerQueenBPM = 144;
const attackOfTheKillerQueen = new Song("Attack of the Killer Queen",
    [Motifs.QUEENA, Motifs.BERDLYA],
    "vBjscyFC3jo",
    [
        new MotifReference(Motifs.QUEENA, 0, quickSec(attackOfTheKillerQueenBPM, 16)),
        new MotifReference(Motifs.QUEENC, quickSec(attackOfTheKillerQueenBPM, 16), quickSec(attackOfTheKillerQueenBPM, 32), true),
        new MotifReference(Motifs.QUEENA, quickSec(attackOfTheKillerQueenBPM, 32), quickSec(attackOfTheKillerQueenBPM, 48)),
        new MotifReference(Motifs.QUEENC, quickSec(attackOfTheKillerQueenBPM, 48), quickSec(attackOfTheKillerQueenBPM, 64)),
        new MotifReference(Motifs.QUEEND, quickSec(attackOfTheKillerQueenBPM, 64), quickSec(attackOfTheKillerQueenBPM, 96)),
        new MotifReference(Motifs.BERDLYB, quickSec(attackOfTheKillerQueenBPM, 96), quickSec(attackOfTheKillerQueenBPM, 128)),
        new MotifReference(Motifs.BERDLYB, quickSec(attackOfTheKillerQueenBPM, 128), quickSec(attackOfTheKillerQueenBPM, 128 + 32)),
        new MotifReference(Motifs.BERDLYA, quickSec(attackOfTheKillerQueenBPM, 128 + 31.5), quickSec(attackOfTheKillerQueenBPM, 128 + 63.5)),
        new MotifReference(Motifs.BERDLYA, quickSec(attackOfTheKillerQueenBPM, 128 + 63.5), quickSec(attackOfTheKillerQueenBPM, 128 + 95.5)),
        new MotifReference(Motifs.BERDLYB, quickSec(attackOfTheKillerQueenBPM, 128 + 96), quickSec(attackOfTheKillerQueenBPM, 128 + 120)),
        new MotifReference(Motifs.BERDLYB, quickSec(attackOfTheKillerQueenBPM, 128 + 120), quickSec(attackOfTheKillerQueenBPM, 128 + 128 + 16), true),
        new MotifReference(Motifs.QUEENA, quickSec(attackOfTheKillerQueenBPM, 128 + 128 + 16), quickSec(attackOfTheKillerQueenBPM, 128 + 128 + 28), true),
    ],
    "", quickSec(attackOfTheKillerQueenBPM, 128 + 128 + 32)
);

const gigaSizeBPM = 125;
const gigaSize = new Song("Giga Size",
    [Motifs.QUEENA],
    "_bVl2e-Wxzg",
    [
        new MotifReference(Motifs.QUEENA, quickSec(gigaSizeBPM, 64), quickSec(gigaSizeBPM, 80)),
        new MotifReference(Motifs.QUEENA, quickSec(gigaSizeBPM, 96), quickSec(gigaSizeBPM, 112), true),
        new MotifReference(Motifs.QUEENC, quickSec(gigaSizeBPM, 112), quickSec(gigaSizeBPM, 128)),
        new MotifReference(Motifs.QUEENC, quickSec(gigaSizeBPM, 128), quickSec(gigaSizeBPM, 128 + 8), true),
        new MotifReference(Motifs.QUEENC, quickSec(gigaSizeBPM, 128 + 8), quickSec(gigaSizeBPM, 128 + 16), true),
        new MotifReference(Motifs.QUEENC, quickSec(gigaSizeBPM, 128 + 16), quickSec(gigaSizeBPM, 128 + 24), true),
        new MotifReference(Motifs.QUEENC, quickSec(gigaSizeBPM, 128 + 32), quickSec(gigaSizeBPM, 128 + 40), true),
        new MotifReference(Motifs.QUEENC, quickSec(gigaSizeBPM, 128 + 40), quickSec(gigaSizeBPM, 128 + 48), true),
        new MotifReference(Motifs.QUEENC, quickSec(gigaSizeBPM, 128 + 48), quickSec(gigaSizeBPM, 128 + 56), true),
    ],
    "", quickSec(gigaSizeBPM, 128 + 96)
);

const knockYouDownBPM = 195;
const knockYouDown = new Song("Knock You Down !!",
    [Motifs.POWERSCOMBINED],
    "L9qRYVZLets",
    [
        new MotifReference(Motifs.POWERSCOMBINED, 0, quickSec(knockYouDownBPM, 16)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 16), quickSec(knockYouDownBPM, 32)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 32), quickSec(knockYouDownBPM, 48)), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 32), quickSec(knockYouDownBPM, 48), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 48), quickSec(knockYouDownBPM, 64)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 64), quickSec(knockYouDownBPM, 80), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 68), quickSec(knockYouDownBPM, 80), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 80), quickSec(knockYouDownBPM, 96)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 96), quickSec(knockYouDownBPM, 112)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 112), quickSec(knockYouDownBPM, 128)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128), quickSec(knockYouDownBPM, 128 + 16), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 68 + 64), quickSec(knockYouDownBPM, 80 + 64), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 16), quickSec(knockYouDownBPM, 128 + 32), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 68 + 80), quickSec(knockYouDownBPM, 80 + 80), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 32), quickSec(knockYouDownBPM, 128 + 48)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 48), quickSec(knockYouDownBPM, 128 + 64)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 64), quickSec(knockYouDownBPM, 128 + 80)), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 128 + 64), quickSec(knockYouDownBPM, 128 + 80), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 80), quickSec(knockYouDownBPM, 128 + 96)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 96), quickSec(knockYouDownBPM, 128 + 112), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 128 + 100), quickSec(knockYouDownBPM, 128 + 112), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 112), quickSec(knockYouDownBPM, 128 + 128)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128), quickSec(knockYouDownBPM, 128 + 128 + 16)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 16), quickSec(knockYouDownBPM, 128 + 128 + 32)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 32), quickSec(knockYouDownBPM, 128 + 128 + 48), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 128 + 128 + 36), quickSec(knockYouDownBPM, 128 + 128 + 48), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 48), quickSec(knockYouDownBPM, 128 + 128 + 64), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 128 + 128 + 52), quickSec(knockYouDownBPM, 128 + 128 + 64), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 64), quickSec(knockYouDownBPM, 128 + 128 + 80)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 80), quickSec(knockYouDownBPM, 128 + 128 + 96)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 96), quickSec(knockYouDownBPM, 128 + 128 + 112)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 112), quickSec(knockYouDownBPM, 128 + 128 + 128)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 128), quickSec(knockYouDownBPM, 128 + 128 + 128 + 16)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 128 + 16), quickSec(knockYouDownBPM, 128 + 128 + 128 + 32)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 128 + 32), quickSec(knockYouDownBPM, 128 + 128 + 128 + 48)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 128 + 48), quickSec(knockYouDownBPM, 128 + 128 + 128 + 64)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 128 + 64), quickSec(knockYouDownBPM, 128 + 128 + 128 + 80), true),
    ],
    "", quickSec(knockYouDownBPM, 128 + 128 + 128 + 80)
);

const theDarkTruthBPM = 50;
const theDarkTruth = new Song("The Dark Truth",
    [Motifs.YOURBESTNIGHTMARE],
    "o3UNWAT81f0",
    [
        new MotifReference(Motifs.YOURBESTNIGHTMARE, 0, quickSec(theDarkTruthBPM, 12)),
        new MotifReference(Motifs.YOURBESTNIGHTMARE, quickSec(theDarkTruthBPM, 12), quickSec(theDarkTruthBPM, 24)),
        new MotifReference(Motifs.DONTFORGET, quickSec(theDarkTruthBPM, 29.5), quickSec(theDarkTruthBPM, 33), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(theDarkTruthBPM, 33), quickSec(theDarkTruthBPM, 42), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(theDarkTruthBPM, 29.5 + 16), quickSec(theDarkTruthBPM, 33 + 16), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(theDarkTruthBPM, 33 + 16), quickSec(theDarkTruthBPM, 40 + 16), true),
    ],
    "", quickSec(theDarkTruthBPM, 40 + 16)
);

const dealGoneWrongBPM = 145.5;
const dealGoneWrong = new Song("Deal Gone Wrong",
    [Motifs.SPAMTONA],
    "cfvB-bVpH7Y",
    [
        new MotifReference(Motifs.SPAMTONA, 0, quickSec(dealGoneWrongBPM, 76))
    ],
    "", quickSec(dealGoneWrongBPM, 76),
    [],
    [Contributors.KARMA]
);

const bigShotBPM = 140;
const bigShot = new Song("BIG SHOT",
    [Motifs.SPAMTONA, Motifs.FREEDOM],
    "V31PVkwzpEY",
    [
        new MotifReference(Motifs.SPAMTONB, 0, quickSec(bigShotBPM, 16)),
        new MotifReference(Motifs.SPAMTONB, quickSec(bigShotBPM, 16), quickSec(bigShotBPM, 32)),
        new MotifReference(Motifs.SPAMTONA, quickSec(bigShotBPM, 32), quickSec(bigShotBPM, 48)),
        new MotifReference(Motifs.SPAMTONA, quickSec(bigShotBPM, 48), quickSec(bigShotBPM, 64)),
        new MotifReference(Motifs.SPAMTONB, quickSec(bigShotBPM, 64), quickSec(bigShotBPM, 80)),
        new MotifReference(Motifs.SPAMTONB, quickSec(bigShotBPM, 80), quickSec(bigShotBPM, 96)),
        new MotifReference(Motifs.SPAMTONA, quickSec(bigShotBPM, 96), quickSec(bigShotBPM, 104), true),
        new MotifReference(Motifs.SPAMTONA, quickSec(bigShotBPM, 112), quickSec(bigShotBPM, 120), true),
     
        new MotifReference(Motifs.FREEDOM, quickSec(bigShotBPM, 128), quickSec(bigShotBPM, 160)),
        new MotifReference(Motifs.FREEDOM, quickSec(bigShotBPM, 160), quickSec(bigShotBPM, 192)),
        new MotifReference(Motifs.POWEROFNEO, quickSec(bigShotBPM, 128), quickSec(bigShotBPM, 144), true),
        new MotifReference(Motifs.POWEROFNEO, quickSec(bigShotBPM, 144), quickSec(bigShotBPM, 160), true),
        new MotifReference(Motifs.POWEROFNEO, quickSec(bigShotBPM, 160), quickSec(bigShotBPM, 176), true),
        new MotifReference(Motifs.POWEROFNEO, quickSec(bigShotBPM, 176), quickSec(bigShotBPM, 192), true),
        new MotifReference(Motifs.SPAMTONA, quickSec(bigShotBPM, 192), quickSec(bigShotBPM, 204)),
        new MotifReference(Motifs.SPAMTONA, quickSec(bigShotBPM, 208), quickSec(bigShotBPM, 212)),

        new MotifReference(Motifs.DUMMY, quickSec(bigShotBPM, 256 - 4), quickSec(bigShotBPM, 256)),
        new MotifReference(Motifs.SPAMTONB, quickSec(bigShotBPM, 256), quickSec(bigShotBPM, 272)),
        new MotifReference(Motifs.SPAMTONB, quickSec(bigShotBPM, 272), quickSec(bigShotBPM, 288)),
        new MotifReference(Motifs.SPAMTONB, quickSec(bigShotBPM, 288), quickSec(bigShotBPM, 300)),
        new MotifReference(Motifs.POWEROFNEO, quickSec(bigShotBPM, 300), quickSec(bigShotBPM, 304), true),
        new MotifReference(Motifs.SPAMTONB, quickSec(bigShotBPM, 304), quickSec(bigShotBPM, 320)),
        new MotifReference(Motifs.DUMMY, quickSec(bigShotBPM, 144 + 144 + 40 - 8), quickSec(bigShotBPM, 144 + 144 + 40)),
    ],
    "", quickSec(bigShotBPM, 144 + 144 + 40),
    [],
    [Contributors.MONSTYRSLAYR, Contributors.KARMA]
);

const aRealBoyBPM = 122.5;
const aRealBoy = new Song("A Real Boy!",
    [Motifs.TVTIME],
    "rSXxltE8mQE",
    [
        new MotifReference(Motifs.TVTIME, 0, quickSec(aRealBoyBPM, 4)),
        new MotifReference(Motifs.TVTIME, quickSec(aRealBoyBPM, 4), quickSec(aRealBoyBPM, 8), true),
        new MotifReference(Motifs.TVTIME, quickSec(aRealBoyBPM, 8), quickSec(aRealBoyBPM, 12), true),
        new MotifReference(Motifs.TVTIME, quickSec(aRealBoyBPM, 12), quickSec(aRealBoyBPM, 16), true),
        new MotifReference(Motifs.TVTIME, quickSec(aRealBoyBPM, 16), quickSec(aRealBoyBPM, 20)),
        new MotifReference(Motifs.TVTIME, quickSec(aRealBoyBPM, 20), quickSec(aRealBoyBPM, 24), true),
        new MotifReference(Motifs.TVTIME, quickSec(aRealBoyBPM, 24), quickSec(aRealBoyBPM, 28), true),
        new MotifReference(Motifs.TVTIME, quickSec(aRealBoyBPM, 28), quickSec(aRealBoyBPM, 32), true)
    ],
    "", quickSec(aRealBoyBPM, 32),
    [],
    [Contributors.KARMA]
);

const dialtone = new Song("Dialtone",
    [Motifs.FREEDOM],
    "Cki-mnHhNtY",
    [

    ]
);

//#endregion

//#region CHAPTER 3

const featurePresentation = new Song("Feature Presentation",
    [Motifs.FEATUREPRESENTATION, Motifs.TVTIME],
    "cUxGD-aNcsY",
    [
        
    ]
);

const ruderBuster = new Song("Ruder Buster",
    [Motifs.RUDEBUSTERA, Motifs.RUDEBUSTERB],
    "_A8SQAQ_yRo",
    [

    ]
);

const vaporBuster = new Song("Vapor Buster",
    [Motifs.RUDEBUSTERA, Motifs.RUDEBUSTERB],
    "3vh8LYSuOvA",
    [

    ]
);

const raiseUpYourBatBPM = 115;
const raiseUpYourBat = new Song("Raise Up Your Bat",
    [Motifs.LOSTGIRLA],
    "85WD93lz5GU",
    [
        new MotifReference(Motifs.LOSTGIRLA, quickSec(raiseUpYourBatBPM, 144 - 32), quickSec(raiseUpYourBatBPM, 144 - 24)),
        new MotifReference(Motifs.LOSTGIRLA, quickSec(raiseUpYourBatBPM, 144 - 16), quickSec(raiseUpYourBatBPM, 144 - 8)),
        new MotifReference(Motifs.LOSTGIRLA, quickSec(raiseUpYourBatBPM, 144), quickSec(raiseUpYourBatBPM, 144 + 8)),
        new MotifReference(Motifs.LOSTGIRLA, quickSec(raiseUpYourBatBPM, 144 + 16), quickSec(raiseUpYourBatBPM, 144 + 24)),
        
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 71), quickSec(raiseUpYourBatBPM, 144 - 68)),
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 66.5), quickSec(raiseUpYourBatBPM, 144 - 64)),
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 62.5), quickSec(raiseUpYourBatBPM, 144 - 57)),
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 57), quickSec(raiseUpYourBatBPM, 144 - 55.5)),
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 54.5), quickSec(raiseUpYourBatBPM, 144 - 52)),
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 50.5), quickSec(raiseUpYourBatBPM, 144 - 48)),
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 46.5), quickSec(raiseUpYourBatBPM, 144 - 40.75)),
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 40.75), quickSec(raiseUpYourBatBPM, 144 - 39.5)),
        new MotifReference(Motifs.MIKE, quickSec(raiseUpYourBatBPM, 144 - 38.5), quickSec(raiseUpYourBatBPM, 144 - 33.5))
    ],
    "", quickSec(raiseUpYourBatBPM, 144 + 110),
    [],
    [Contributors.MONSTYRSLAYR, Contributors.KARMA]
);

const doomBoardBPM = 129 / 2;
const doomBoard = new Song("Doom Board",
    [Motifs.DOOMBOARD, Motifs.TENNA],
    "ZQ4AZI9dirA",
    [
        new MotifReference(Motifs.DOOMBOARD, 0, quickSec(doomBoardBPM, 4)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 4), quickSec(doomBoardBPM, 8)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 8), quickSec(doomBoardBPM, 12)),
        new MotifReference(Motifs.TENNA, quickSec(doomBoardBPM, 8.25), quickSec(doomBoardBPM, 11.5)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 12), quickSec(doomBoardBPM, 16)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 16), quickSec(doomBoardBPM, 20)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 20), quickSec(doomBoardBPM, 24)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 24), quickSec(doomBoardBPM, 28)),
        new MotifReference(Motifs.TENNA, quickSec(doomBoardBPM, 24.25), quickSec(doomBoardBPM, 27.5)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 28), quickSec(doomBoardBPM, 32)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 32), quickSec(doomBoardBPM, 36)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 36), quickSec(doomBoardBPM, 40)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 40), quickSec(doomBoardBPM, 44), true),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 44), quickSec(doomBoardBPM, 48), true),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 48), quickSec(doomBoardBPM, 52)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(doomBoardBPM, 52), quickSec(doomBoardBPM, 56)),
    ],
    "", quickSec(doomBoardBPM, 56)
);

const metaphysicalChallenge = new Song("Metaphysical Challenge",
    [Motifs.DOOMBOARD, Motifs.TENNA],
    "nqxdUy5hoLc",
    doomBoard.motifRefs,
    "", doomBoard.loopPoint
);

const tvWorldBPM = 145;
const tvWorld = new Song("TV WORLD",
    [Motifs.TENNA],
    "DstO9slC_5U",
    [
        new MotifReference(Motifs.HIPSHOP, quickSec(tvWorldBPM, 148), quickSec(tvWorldBPM, 148 + 16), true),
        new MotifReference(Motifs.HIPSHOP, quickSec(tvWorldBPM, 148 + 16), quickSec(tvWorldBPM, 148 + 32), true),
        new MotifReference(Motifs.HIPSHOP, quickSec(tvWorldBPM, 148 + 32), quickSec(tvWorldBPM, 148 + 48), true),
        new MotifReference(Motifs.TENNA, quickSec(tvWorldBPM, 148 + 33), quickSec(tvWorldBPM, 148 + 42)),
        new MotifReference(Motifs.HIPSHOP, quickSec(tvWorldBPM, 148 + 48), quickSec(tvWorldBPM, 148 + 64), true),
        new MotifReference(Motifs.TENNA, quickSec(tvWorldBPM, 148 + 49), quickSec(tvWorldBPM, 148 + 58), true),
        new MotifReference(Motifs.HIPSHOP, quickSec(tvWorldBPM, 148 + 64), quickSec(tvWorldBPM, 148 + 80), true),
        new MotifReference(Motifs.TENNA, quickSec(tvWorldBPM, 148 + 65), quickSec(tvWorldBPM, 148 + 74)),
        new MotifReference(Motifs.HIPSHOP, quickSec(tvWorldBPM, 148 + 80), quickSec(tvWorldBPM, 148 + 96), true),
        new MotifReference(Motifs.TENNA, quickSec(tvWorldBPM, 148 + 81), quickSec(tvWorldBPM, 148 + 90), true),

        new MotifReference(Motifs.TVTIME, quickSec(tvWorldBPM, 148 + 96), quickSec(tvWorldBPM, 148 + 100)),
        new MotifReference(Motifs.TVTIME, quickSec(tvWorldBPM, 148 + 104), quickSec(tvWorldBPM, 148 + 108)),
        new MotifReference(Motifs.TVTIME, quickSec(tvWorldBPM, 148 + 112), quickSec(tvWorldBPM, 148 + 116)),
        new MotifReference(Motifs.TVTIME, quickSec(tvWorldBPM, 148 + 120), quickSec(tvWorldBPM, 148 + 124)),
        new MotifReference(Motifs.TVTIME, quickSec(tvWorldBPM, 148 + 128), quickSec(tvWorldBPM, 148 + 132)),
        new MotifReference(Motifs.TVTIME, quickSec(tvWorldBPM, 148 + 136), quickSec(tvWorldBPM, 148 + 140)),
        new MotifReference(Motifs.TVTIME, quickSec(tvWorldBPM, 148 + 144), quickSec(tvWorldBPM, 148 + 148)),
        new MotifReference(Motifs.TVTIME, quickSec(tvWorldBPM, 148 + 152), quickSec(tvWorldBPM, 148 + 156)),
    ],
    "", quickSec(tvWorldBPM, 156 + 156)
);

const itsTvTimeBPM = 148;
const itsTvTime = new Song("It's TV Time!",
    [Motifs.TENNA, Motifs.TVTIME],
    "F2PJbTuZlTU",
    [
        new MotifReference(Motifs.TENNA, quickSec(itsTvTimeBPM, 48.5), quickSec(itsTvTimeBPM, 52)),
        new MotifReference(Motifs.TENNA, quickSec(itsTvTimeBPM, 56.5), quickSec(itsTvTimeBPM, 60)),
        new MotifReference(Motifs.FEATUREPRESENTATION, quickSec(itsTvTimeBPM, 63.75), quickSec(itsTvTimeBPM, 72)),

        new MotifReference(Motifs.TENNA, quickSec(itsTvTimeBPM, 80.5), quickSec(itsTvTimeBPM, 84)),
        new MotifReference(Motifs.TENNA, quickSec(itsTvTimeBPM, 88.5), quickSec(itsTvTimeBPM, 92)),
        new MotifReference(Motifs.FEATUREPRESENTATION, quickSec(itsTvTimeBPM, 95.75), quickSec(itsTvTimeBPM, 104)),

        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 - 8), quickSec(itsTvTimeBPM, 128 + 64)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64), quickSec(itsTvTimeBPM, 128 + 64 + 8)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 8), quickSec(itsTvTimeBPM, 128 + 64 + 16)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 16), quickSec(itsTvTimeBPM, 128 + 64 + 24)),

        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 24), quickSec(itsTvTimeBPM, 128 + 64 + 32)),
        new MotifReference(Motifs.TVTIME, quickSec(itsTvTimeBPM, 128 + 64 + 24), quickSec(itsTvTimeBPM, 128 + 64 + 28)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 32), quickSec(itsTvTimeBPM, 128 + 64 + 40)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 40), quickSec(itsTvTimeBPM, 128 + 64 + 48)),
        new MotifReference(Motifs.TVTIME, quickSec(itsTvTimeBPM, 128 + 64 + 40), quickSec(itsTvTimeBPM, 128 + 64 + 44)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 48), quickSec(itsTvTimeBPM, 128 + 64 + 56)),

        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 56), quickSec(itsTvTimeBPM, 128 + 64 + 64)),
        new MotifReference(Motifs.TENNA, quickSec(itsTvTimeBPM, 128 + 64 + 56.5), quickSec(itsTvTimeBPM, 128 + 64 + 63)),
        new MotifReference(Motifs.TVTIME, quickSec(itsTvTimeBPM, 128 + 64 + 56), quickSec(itsTvTimeBPM, 128 + 64 + 60)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 64), quickSec(itsTvTimeBPM, 128 + 64 + 72)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 72), quickSec(itsTvTimeBPM, 128 + 64 + 80)),
        new MotifReference(Motifs.TVTIME, quickSec(itsTvTimeBPM, 128 + 64 + 72), quickSec(itsTvTimeBPM, 128 + 64 + 76)),
        new MotifReference(Motifs.DOOMBOARD, quickSec(itsTvTimeBPM, 128 + 64 + 80), quickSec(itsTvTimeBPM, 128 + 64 + 88)),

        new MotifReference(Motifs.TENNA, quickSec(itsTvTimeBPM, 128 + 64 + 89), quickSec(itsTvTimeBPM, 128 + 64 + 88 + 12)),
        new MotifReference(Motifs.TENNA, quickSec(itsTvTimeBPM, 128 + 64 + 89 + 32), quickSec(itsTvTimeBPM, 128 + 64 + 88 + 12 + 32)),
        new MotifReference(Motifs.TENNA, quickSec(itsTvTimeBPM, 128 + 64 + 89 + 64), quickSec(itsTvTimeBPM, 128 + 64 + 88 + 12 + 64)),

        new MotifReference(Motifs.FEATUREPRESENTATION, quickSec(itsTvTimeBPM, 128 + 128 + 128 - 8), quickSec(itsTvTimeBPM, 128 + 128 + 128)),
        new MotifReference(Motifs.FEATUREPRESENTATION, quickSec(itsTvTimeBPM, 128 + 128 + 128), quickSec(itsTvTimeBPM, 128 + 128 + 128 + 8), true),
    ],
    "", quickSec(itsTvTimeBPM, 128 + 64 + 88 + 16 + 112)
);

const hallOfFameBPM = 71.2;
const hallOfFame = new Song("Hall of Fame",
    [Motifs.TVTIME, Motifs.FANFARE],
    "rHUNnF0u7dg",
    [
        new MotifReference(Motifs.TVTIME, 0, quickSec(hallOfFameBPM, 4)),
        new MotifReference(Motifs.FANFARE, quickSec(hallOfFameBPM, 4.5), quickSec(hallOfFameBPM, 11)),
        new MotifReference(Motifs.TVTIME, quickSec(hallOfFameBPM, 16), quickSec(hallOfFameBPM, 16 + 4)),
        new MotifReference(Motifs.FANFARE, quickSec(hallOfFameBPM, 16 + 4.5), quickSec(hallOfFameBPM, 16 + 11)),
    ],
    "", quickSec(hallOfFameBPM, 33)
)

const blackKnifeBPM = 147.5;
const blackKnife = new Song("Black Knife",
    [Motifs.THEDOOR],
    "B8Us0DZgexw",
    [
        new MotifReference(Motifs.THEDOOR, quickSec(blackKnifeBPM, 64), quickSec(blackKnifeBPM, 96)),
        new MotifReference(Motifs.THEDOOR, quickSec(blackKnifeBPM, 96), quickSec(blackKnifeBPM, 128)),
        new MotifReference(Motifs.THECHASE, quickSec(blackKnifeBPM, 132), quickSec(blackKnifeBPM, 128 + 32)),
        new MotifReference(Motifs.THECHASE, quickSec(blackKnifeBPM, 132 + 32), quickSec(blackKnifeBPM, 128 + 64)),
    ],
    "", quickSec(blackKnifeBPM, 144 + 144)
);

//#endregion

//#region CHAPTER 4

const knockYouDownRhythmVer = new Song("Knock You Down !! (Rhythm Ver.)",
    [Motifs.POWERSCOMBINED],
    "27oficnsQPo",
    [
        new MotifReference(Motifs.POWERSCOMBINED, 0, quickSec(knockYouDownBPM, 16)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 16), quickSec(knockYouDownBPM, 32)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 32), quickSec(knockYouDownBPM, 48)), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 32), quickSec(knockYouDownBPM, 48), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 48), quickSec(knockYouDownBPM, 64)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 64), quickSec(knockYouDownBPM, 80), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 68), quickSec(knockYouDownBPM, 80), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 80), quickSec(knockYouDownBPM, 96)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 96), quickSec(knockYouDownBPM, 112)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 112), quickSec(knockYouDownBPM, 128)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128), quickSec(knockYouDownBPM, 128 + 16), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 68 + 64), quickSec(knockYouDownBPM, 80 + 64), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 16), quickSec(knockYouDownBPM, 128 + 32), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 68 + 80), quickSec(knockYouDownBPM, 80 + 80), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 32), quickSec(knockYouDownBPM, 128 + 48)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 48), quickSec(knockYouDownBPM, 128 + 64)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 64), quickSec(knockYouDownBPM, 128 + 80)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 80), quickSec(knockYouDownBPM, 128 + 96)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 96), quickSec(knockYouDownBPM, 128 + 112)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 112), quickSec(knockYouDownBPM, 128 + 128)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128), quickSec(knockYouDownBPM, 128 + 128 + 16)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 16), quickSec(knockYouDownBPM, 128 + 128 + 32)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 32), quickSec(knockYouDownBPM, 128 + 128 + 48), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 48), quickSec(knockYouDownBPM, 128 + 128 + 64)), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 128 + 128 + 48), quickSec(knockYouDownBPM, 128 + 128 + 64), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 64), quickSec(knockYouDownBPM, 128 + 128 + 80)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 80), quickSec(knockYouDownBPM, 128 + 128 + 96), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 128 + 128 + 84), quickSec(knockYouDownBPM, 128 + 128 + 96), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 96), quickSec(knockYouDownBPM, 128 + 128 + 112)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 112), quickSec(knockYouDownBPM, 128 + 128 + 128)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 128), quickSec(knockYouDownBPM, 128 + 128 + 128 + 16)),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 128 + 16), quickSec(knockYouDownBPM, 128 + 128 + 128 + 32), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 128 + 128 + 128 + 20), quickSec(knockYouDownBPM, 128 + 128 + 128 + 32), true),
        new MotifReference(Motifs.POWERSCOMBINED, quickSec(knockYouDownBPM, 128 + 128 + 128 + 32), quickSec(knockYouDownBPM, 128 + 128 + 128 + 48), true), new MotifReference(Motifs.QUEENA, quickSec(knockYouDownBPM, 128 + 128 + 128 + 36), quickSec(knockYouDownBPM, 128 + 128 + 128 + 48), true),
    ],
    "", quickSec(knockYouDownBPM, 128 + 128 + 128 + 56)
);

const darkSanctuaryBPM = 95;
const darkSanctuary = new Song("Dark Sanctuary",
    [Motifs.SANCTUARY, Motifs.THELEGENDA],
    "QQQq1T06lYg",
    [
        new MotifReference(Motifs.SANCTUARY, 0, quickSec(darkSanctuaryBPM, 6), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 6), quickSec(darkSanctuaryBPM, 12), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 12), quickSec(darkSanctuaryBPM, 18), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 18), quickSec(darkSanctuaryBPM, 24), true),

        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 24), quickSec(darkSanctuaryBPM, 30), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 30), quickSec(darkSanctuaryBPM, 36), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 36), quickSec(darkSanctuaryBPM, 42), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 42), quickSec(darkSanctuaryBPM, 48), true),
        
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 48), quickSec(darkSanctuaryBPM, 54), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 54), quickSec(darkSanctuaryBPM, 60), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 60), quickSec(darkSanctuaryBPM, 66), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 66), quickSec(darkSanctuaryBPM, 72), true),

        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 72), quickSec(darkSanctuaryBPM, 78), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 78), quickSec(darkSanctuaryBPM, 84), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 84), quickSec(darkSanctuaryBPM, 90), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 90), quickSec(darkSanctuaryBPM, 96), true),

        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 96), quickSec(darkSanctuaryBPM, 102), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 102), quickSec(darkSanctuaryBPM, 108), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 108), quickSec(darkSanctuaryBPM, 114), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 114), quickSec(darkSanctuaryBPM, 120), true),

        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 120), quickSec(darkSanctuaryBPM, 126), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 126), quickSec(darkSanctuaryBPM, 132), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 132), quickSec(darkSanctuaryBPM, 138), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 138), quickSec(darkSanctuaryBPM, 144), true),

        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 144), quickSec(darkSanctuaryBPM, 150), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 150), quickSec(darkSanctuaryBPM, 156), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 156), quickSec(darkSanctuaryBPM, 162), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(darkSanctuaryBPM, 162), quickSec(darkSanctuaryBPM, 168), true),

        new MotifReference(Motifs.THELEGENDA, quickSec(darkSanctuaryBPM, 48 + 0.5), quickSec(darkSanctuaryBPM, 48 + 2.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(darkSanctuaryBPM, 72 + 0.5), quickSec(darkSanctuaryBPM, 72 + 2.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(darkSanctuaryBPM, 96 + 0.5), quickSec(darkSanctuaryBPM, 96 + 2.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(darkSanctuaryBPM, 120 + 0.5), quickSec(darkSanctuaryBPM, 120 + 2.5)),

        new MotifReference(Motifs.THELEGENDB, quickSec(darkSanctuaryBPM, 144), quickSec(darkSanctuaryBPM, 154.5)),

        new MotifReference(Motifs.DONTFORGET, quickSec(darkSanctuaryBPM, 68.5), quickSec(darkSanctuaryBPM, 72)),
        new MotifReference(Motifs.DONTFORGET, quickSec(darkSanctuaryBPM, 92.5), quickSec(darkSanctuaryBPM, 96))
    ],
    "", quickSec(darkSanctuaryBPM, 168)
);

const fromNowOnBPM = 132.5;
const fromNowOn = new Song("From Now On",
    [Motifs.SANCTUARY, Motifs.FROMNOWON],
    "bb0felkyfWg",
    [
        new MotifReference(Motifs.SANCTUARY, 0, quickSec(fromNowOnBPM, 16)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5), quickSec(fromNowOnBPM, 16)),
        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 16), quickSec(fromNowOnBPM, 16 + 16)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 16), quickSec(fromNowOnBPM, 16 + 16)),
        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 32), quickSec(fromNowOnBPM, 16 + 32)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 32), quickSec(fromNowOnBPM, 16 + 32)),
        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 48), quickSec(fromNowOnBPM, 16 + 48)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 48), quickSec(fromNowOnBPM, 16 + 48 + 4)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 48 + 8), quickSec(fromNowOnBPM, 16 + 48 + 4 + 8)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 48 + 16), quickSec(fromNowOnBPM, 16 + 48 + 16)),

        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 80), quickSec(fromNowOnBPM, 16 + 80)),
        new MotifReference(Motifs.FROMNOWON, quickSec(fromNowOnBPM, 80 + 0.5), quickSec(fromNowOnBPM, 80 + 4)),
        new MotifReference(Motifs.FROMNOWON, quickSec(fromNowOnBPM, 80 + 0.5 + 8), quickSec(fromNowOnBPM, 80 + 4 + 8)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 80), quickSec(fromNowOnBPM, 16 + 80)),
        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 96), quickSec(fromNowOnBPM, 16 + 96)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 96), quickSec(fromNowOnBPM, 16 + 96)),
        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 112), quickSec(fromNowOnBPM, 16 + 112)),
        new MotifReference(Motifs.FROMNOWON, quickSec(fromNowOnBPM, 112 + 0.5), quickSec(fromNowOnBPM, 112 + 4)),
        new MotifReference(Motifs.FROMNOWON, quickSec(fromNowOnBPM, 112 + 0.5 + 8), quickSec(fromNowOnBPM, 112 + 4 + 8)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 112), quickSec(fromNowOnBPM, 16 + 112)),
        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 128), quickSec(fromNowOnBPM, 16 + 128)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 13.5 + 128), quickSec(fromNowOnBPM, 15.5 + 128)),

        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 15.5 + 128), quickSec(fromNowOnBPM, 15.5 + 128 + 32), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 15.5 + 128 + 32), quickSec(fromNowOnBPM, 16 + 128 + 64 + 3), true),
        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 16 + 128 + 32), quickSec(fromNowOnBPM, 32 + 128 + 32)),
        new MotifReference(Motifs.SANCTUARY, quickSec(fromNowOnBPM, 16 + 128 + 48), quickSec(fromNowOnBPM, 32 + 128 + 48)),

        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 16 + 128 + 64 + 3), quickSec(fromNowOnBPM, 16 + 128 + 64 + 3 + 8)),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 16 + 128 + 64 + 3 + 8), quickSec(fromNowOnBPM, 16 + 128 + 64 + 3 + 16), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(fromNowOnBPM, 16 + 128 + 64 + 3 + 24), quickSec(fromNowOnBPM, 16 + 128 + 64 + 8 + 24)),
    ],
    "", quickSec(fromNowOnBPM, 16 + 128 + 64 + 8 + 24)
);

const gyaaHaHaBPM = 125;
const gyaaHaHa = new Song("Gyaa Ha ha!",
    [Motifs.GERSON],
    "HeAXR0UKRxY",
    [
        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 1.66), quickSec(gyaaHaHaBPM, 5)),
        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 5.66), quickSec(gyaaHaHaBPM, 9)),
        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 9.66), quickSec(gyaaHaHaBPM, 13)),

        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 17.66), quickSec(gyaaHaHaBPM, 21)),
        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 21.66), quickSec(gyaaHaHaBPM, 25)),
        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 25.66), quickSec(gyaaHaHaBPM, 29)),

        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 33.66), quickSec(gyaaHaHaBPM, 37)),
        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 37.66), quickSec(gyaaHaHaBPM, 41)),
        new MotifReference(Motifs.UNDYNE, quickSec(gyaaHaHaBPM, 41.66), quickSec(gyaaHaHaBPM, 45)),

        new MotifReference(Motifs.RUINS, quickSec(gyaaHaHaBPM, 57), quickSec(gyaaHaHaBPM, 57 + 16)),
        new MotifReference(Motifs.RUINS, quickSec(gyaaHaHaBPM, 57 + 16), quickSec(gyaaHaHaBPM, 57 + 32)),
        new MotifReference(Motifs.RUINS, quickSec(gyaaHaHaBPM, 57 + 32), quickSec(gyaaHaHaBPM, 57 + 48)),
        new MotifReference(Motifs.RUINS, quickSec(gyaaHaHaBPM, 57 + 48), quickSec(gyaaHaHaBPM, 57 + 63)),

        new MotifReference(Motifs.GERSON, quickSec(gyaaHaHaBPM, 57 + 63), quickSec(gyaaHaHaBPM, 57 + 63 + 8)),
        new MotifReference(Motifs.GERSON, quickSec(gyaaHaHaBPM, 57 + 63 + 8), quickSec(gyaaHaHaBPM, 57 + 63 + 16), true),
        new MotifReference(Motifs.GERSON, quickSec(gyaaHaHaBPM, 57 + 63 + 16), quickSec(gyaaHaHaBPM, 57 + 63 + 24)),
        new MotifReference(Motifs.GERSON, quickSec(gyaaHaHaBPM, 57 + 63 + 24), quickSec(gyaaHaHaBPM, 57 + 63 + 33), true),
    ],
    "", quickSec(gyaaHaHaBPM, 57 + 63 + 33 + 4)
);

const everHigherBPM = 110;
const everHigher = new Song("Ever Higher",
    [Motifs.SANCTUARY, Motifs.EVERHIGHER],
    "DxPHMcpuYeA",
    [
        new MotifReference(Motifs.SANCTUARY, quickSec(everHigherBPM, 8), quickSec(everHigherBPM, 10)),
        new MotifReference(Motifs.SANCTUARY, quickSec(everHigherBPM, 16), quickSec(everHigherBPM, 18)),
        
        new MotifReference(Motifs.SANCTUARY, quickSec(everHigherBPM, 24), quickSec(everHigherBPM, 24 + 16)),
        new MotifReference(Motifs.DONTFORGET, quickSec(everHigherBPM, 24 + 13.5), quickSec(everHigherBPM, 24 + 16)),
        new MotifReference(Motifs.SANCTUARY, quickSec(everHigherBPM, 24 + 16), quickSec(everHigherBPM, 24 + 19.5), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(everHigherBPM, 24 + 24), quickSec(everHigherBPM, 24 + 24 + 4)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(everHigherBPM, 24 + 24 + 4), quickSec(everHigherBPM, 24 + 24 + 8), true),

        new MotifReference(Motifs.SANCTUARY, quickSec(everHigherBPM, 24 + 32), quickSec(everHigherBPM, 24 + 16 + 32)),
        new MotifReference(Motifs.DONTFORGET, quickSec(everHigherBPM, 24 + 13.5 + 32), quickSec(everHigherBPM, 24 + 16 + 32)),
        new MotifReference(Motifs.SANCTUARY, quickSec(everHigherBPM, 24 + 16 + 32), quickSec(everHigherBPM, 24 + 19.5 + 32), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(everHigherBPM, 24 + 24 + 32), quickSec(everHigherBPM, 24 + 24 + 4 + 32)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(everHigherBPM, 24 + 24 + 4 + 32), quickSec(everHigherBPM, 24 + 24 + 8 + 32), true),

        new MotifReference(Motifs.SANCTUARY, quickSec(everHigherBPM, 24 + 64), quickSec(everHigherBPM, 24 + 16 + 64)),
        new MotifReference(Motifs.DONTFORGET, quickSec(everHigherBPM, 24 + 13.5 + 64), quickSec(everHigherBPM, 24 + 16 + 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(everHigherBPM, 24 + 16 + 64), quickSec(everHigherBPM, 24 + 19.5 + 64), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(everHigherBPM, 24 + 24 + 64), quickSec(everHigherBPM, 24 + 24 + 4 + 64)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(everHigherBPM, 24 + 24 + 4 + 64), quickSec(everHigherBPM, 24 + 24 + 8 + 64), true),

        new MotifReference(Motifs.THEHOLY, quickSec(everHigherBPM, 24 + 24 + 8 + 64), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4)),
        new MotifReference(Motifs.THEHOLY, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 4)),
        new MotifReference(Motifs.THEHOLY, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 8), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 8), true),
        new MotifReference(Motifs.THEHOLY, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 12), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 12), true),
        new MotifReference(Motifs.THEHOLY, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 16), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 16)),
        new MotifReference(Motifs.THEHOLY, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 20), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 20)),
        new MotifReference(Motifs.THEHOLY, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 24), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 24)),
        new MotifReference(Motifs.THEHOLY, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 28), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 28), true),

        new MotifReference(Motifs.EVERHIGHER, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 28), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 28 + 4)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 28 + 4), quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 28 + 8), true),
    ],
    "", quickSec(everHigherBPM, 24 + 24 + 8 + 64 + 4 + 28 + 8)
);

const wiseWordsBPM = 90;
const wiseWords = new Song("Wise words",
    [Motifs.GERSON],
    "YYl_CuHvVRs",
    [
        new MotifReference(Motifs.GERSON, 0, quickSec(wiseWordsBPM, 8)),
        new MotifReference(Motifs.UNDYNE, quickSec(wiseWordsBPM, 8), quickSec(wiseWordsBPM, 14)),
        new MotifReference(Motifs.GERSON, quickSec(wiseWordsBPM, 14), quickSec(wiseWordsBPM, 24)),
        new MotifReference(Motifs.GERSON, quickSec(wiseWordsBPM, 14 + 16), quickSec(wiseWordsBPM, 8 + 32)),
        new MotifReference(Motifs.UNDYNE, quickSec(wiseWordsBPM, 8 + 32), quickSec(wiseWordsBPM, 14 + 32)),
        new MotifReference(Motifs.GERSON, quickSec(wiseWordsBPM, 14 + 32), quickSec(wiseWordsBPM, 24 + 32)),
        new MotifReference(Motifs.GERSON, quickSec(wiseWordsBPM, 14 + 48), quickSec(wiseWordsBPM, 14 + 48 + 2)),
    ],
    "", quickSec(wiseWordsBPM, 14 + 48 + 2)
);

const hammerOfJusticeBPM = 160;
const hojOffset = -0.12; // for the after tempo change
const hammerOfJustice = new Song("Hammer of Justice",
    [Motifs.GERSON, Motifs.FREEDOM],
    "tBdLO8u-0L8",
    [
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 0.5), quickSec(hammerOfJusticeBPM, 4)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 4.5), quickSec(hammerOfJusticeBPM, 8)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 8.5), quickSec(hammerOfJusticeBPM, 12)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 16.5), quickSec(hammerOfJusticeBPM, 20)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 20.5), quickSec(hammerOfJusticeBPM, 24)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 24.5), quickSec(hammerOfJusticeBPM, 28)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 32.5), quickSec(hammerOfJusticeBPM, 36)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 36.5), quickSec(hammerOfJusticeBPM, 40)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 40.5), quickSec(hammerOfJusticeBPM, 44)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 48.5), quickSec(hammerOfJusticeBPM, 52)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 52.5), quickSec(hammerOfJusticeBPM, 56)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 56.5), quickSec(hammerOfJusticeBPM, 60)),

        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 0.5 + 64), quickSec(hammerOfJusticeBPM, 4 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 4.5 + 64), quickSec(hammerOfJusticeBPM, 8 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 8.5 + 64), quickSec(hammerOfJusticeBPM, 12 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 16.5 + 64), quickSec(hammerOfJusticeBPM, 20 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 20.5 + 64), quickSec(hammerOfJusticeBPM, 24 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 24.5 + 64), quickSec(hammerOfJusticeBPM, 28 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 32.5 + 64), quickSec(hammerOfJusticeBPM, 36 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 36.5 + 64), quickSec(hammerOfJusticeBPM, 40 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 40.5 + 64), quickSec(hammerOfJusticeBPM, 44 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 48.5 + 64), quickSec(hammerOfJusticeBPM, 52 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 52.5 + 64), quickSec(hammerOfJusticeBPM, 56 + 64)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 56.5 + 64), quickSec(hammerOfJusticeBPM, 60 + 64)),

        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 0.5 + 128), quickSec(hammerOfJusticeBPM, 4 + 128)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 4.5 + 128), quickSec(hammerOfJusticeBPM, 8 + 128)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 8.5 + 128), quickSec(hammerOfJusticeBPM, 12 + 128)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 16.5 + 128), quickSec(hammerOfJusticeBPM, 20 + 128)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 20.5 + 128), quickSec(hammerOfJusticeBPM, 24 + 128)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 24.5 + 128), quickSec(hammerOfJusticeBPM, 28 + 128)),

        new MotifReference(Motifs.RUINS, quickSec(hammerOfJusticeBPM, 64), quickSec(hammerOfJusticeBPM, 64 + 10)),
        new MotifReference(Motifs.RUINS, quickSec(hammerOfJusticeBPM, 64 + 32), quickSec(hammerOfJusticeBPM, 64 + 10 + 32)),
        new MotifReference(Motifs.RUINS, quickSec(hammerOfJusticeBPM, 64 + 64), quickSec(hammerOfJusticeBPM, 64 + 10 + 64)),

        new MotifReference(Motifs.GERSON, quickSec(hammerOfJusticeBPM, 64 + 96 - 2), quickSec(hammerOfJusticeBPM, 64 + 96 + 8.35)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 64 + 96 + 8.35), quickSec(hammerOfJusticeBPM, 64 + 96 + 14.35), true),
        new MotifReference(Motifs.GERSON, quickSec(hammerOfJusticeBPM, 64 + 96 - 2 + 16.35), quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 16.5)),
        new MotifReference(Motifs.GERSON, quickSec(hammerOfJusticeBPM, 64 + 96 - 2 + 32 + 1), quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 32 + 1.55)),
        new MotifReference(Motifs.UNDYNE, quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 32 + 1.55), quickSec(hammerOfJusticeBPM, 64 + 96 + 14 + 32 + 1.6), true),
        new MotifReference(Motifs.GERSON, quickSec(hammerOfJusticeBPM, 64 + 96 - 2 + 48 + 1.6), quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 48 + 2)),

        new MotifReference(Motifs.GERSON, quickSec(hammerOfJusticeBPM, 64 + 96 + 64 + 4 - 3), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4)),
        new MotifReference(Motifs.UNDYNE, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 6), true),
        new MotifReference(Motifs.GERSON, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 6), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16)),
        new MotifReference(Motifs.GERSON, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 22), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 32)),
        new MotifReference(Motifs.UNDYNE, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 32), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 6 + 32), true),
        new MotifReference(Motifs.GERSON, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 6 + 32), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32)),

        new MotifReference(Motifs.FREEDOM, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 15.5), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 24)),
        new MotifReference(Motifs.FREEDOM, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 32), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 40)),
        new MotifReference(Motifs.FREEDOM, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 15.5 + 32), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 24 + 32)),
        new MotifReference(Motifs.FREEDOM, hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 32 + 32), hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 40 + 32)),
    ],
    "", hojOffset + quickSec(hammerOfJusticeBPM, 64 + 96 + 8 + 64 + 4 + 16 + 32 + 40 + 32)
);

const secondSanctuaryBPM = 170;
const secondSanctuary = new Song("The Second Sanctuary",
    [Motifs.SUBSANC, Motifs.THELEGENDA],
    "Jp7kfYH4VaE",
    [
        new MotifReference(Motifs.SUBSANC, 0, quickSec(secondSanctuaryBPM, 9)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 9), quickSec(secondSanctuaryBPM, 18)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 18), quickSec(secondSanctuaryBPM, 27)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 27), quickSec(secondSanctuaryBPM, 36)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 36), quickSec(secondSanctuaryBPM, 45)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 45), quickSec(secondSanctuaryBPM, 54)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 54), quickSec(secondSanctuaryBPM, 63)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 63), quickSec(secondSanctuaryBPM, 72)),

        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5), quickSec(secondSanctuaryBPM, 72 + 5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 6), quickSec(secondSanctuaryBPM, 72 + 5 + 6)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 12), quickSec(secondSanctuaryBPM, 72 + 5 + 12)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 18), quickSec(secondSanctuaryBPM, 72 + 5 + 18)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 24), quickSec(secondSanctuaryBPM, 72 + 5 + 24)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 1 + 24), quickSec(secondSanctuaryBPM, 72 + 12 + 24)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 30), quickSec(secondSanctuaryBPM, 72 + 5 + 30)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 36), quickSec(secondSanctuaryBPM, 72 + 5 + 36)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 1 + 36), quickSec(secondSanctuaryBPM, 72 + 9 + 36)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 42), quickSec(secondSanctuaryBPM, 72 + 5 + 42)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 48), quickSec(secondSanctuaryBPM, 72 + 5 + 48)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 54), quickSec(secondSanctuaryBPM, 72 + 5 + 54)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 60), quickSec(secondSanctuaryBPM, 72 + 5 + 60)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 66), quickSec(secondSanctuaryBPM, 72 + 5 + 66)),
        new MotifReference(Motifs.DONTFORGET, quickSec(secondSanctuaryBPM, 72 - 1.5 + 66), quickSec(secondSanctuaryBPM, 72 + 12 + 66), true),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 72), quickSec(secondSanctuaryBPM, 72 + 5 + 72)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 1 + 72), quickSec(secondSanctuaryBPM, 72 + 12 + 72)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 78), quickSec(secondSanctuaryBPM, 72 + 5 + 78)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 84), quickSec(secondSanctuaryBPM, 72 + 5 + 84)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 1 + 84), quickSec(secondSanctuaryBPM, 72 + 9 + 84)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 90), quickSec(secondSanctuaryBPM, 72 + 5 + 90)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 96), quickSec(secondSanctuaryBPM, 72 + 5 + 96)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 102), quickSec(secondSanctuaryBPM, 72 + 5 + 102)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 108), quickSec(secondSanctuaryBPM, 72 + 5 + 108)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114), quickSec(secondSanctuaryBPM, 72 + 5 + 114)),

        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120), quickSec(secondSanctuaryBPM, 72 + 120 + 2.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 2.5), quickSec(secondSanctuaryBPM, 72 + 120 + 5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 5), quickSec(secondSanctuaryBPM, 72 + 120 + 7.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 7.5), quickSec(secondSanctuaryBPM, 72 + 120 + 10)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 10), quickSec(secondSanctuaryBPM, 72 + 120 + 12.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 12.5), quickSec(secondSanctuaryBPM, 72 + 120 + 15)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 15), quickSec(secondSanctuaryBPM, 72 + 120 + 17.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 17.5), quickSec(secondSanctuaryBPM, 72 + 120 + 20), true),

        new MotifReference(Motifs.THELEGENDB, quickSec(secondSanctuaryBPM, 72 + 120 + 20), quickSec(secondSanctuaryBPM, 72 + 120 + 39)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 20), quickSec(secondSanctuaryBPM, 72 + 120 + 22.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 22.5), quickSec(secondSanctuaryBPM, 72 + 120 + 25)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 25), quickSec(secondSanctuaryBPM, 72 + 120 + 27.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 27.5), quickSec(secondSanctuaryBPM, 72 + 120 + 30)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 30), quickSec(secondSanctuaryBPM, 72 + 120 + 32.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 32.5), quickSec(secondSanctuaryBPM, 72 + 120 + 35)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 35), quickSec(secondSanctuaryBPM, 72 + 120 + 37.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 37.5), quickSec(secondSanctuaryBPM, 72 + 120 + 40), true),

        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 42.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 42.5), quickSec(secondSanctuaryBPM, 72 + 120 + 45)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 45), quickSec(secondSanctuaryBPM, 72 + 120 + 47.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 47.5), quickSec(secondSanctuaryBPM, 72 + 120 + 50)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 50), quickSec(secondSanctuaryBPM, 72 + 120 + 52.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 52.5), quickSec(secondSanctuaryBPM, 72 + 120 + 55)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 55), quickSec(secondSanctuaryBPM, 72 + 120 + 57.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 57.5), quickSec(secondSanctuaryBPM, 72 + 120 + 60), true),

        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 66), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 66)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 72), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 72)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 78), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 78)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 84), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 84)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 90), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 90)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 1 + 114 + 90), quickSec(secondSanctuaryBPM, 72 + 12 + 114 + 90)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 96), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 96)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 102), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 102)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 1 + 114 + 102), quickSec(secondSanctuaryBPM, 72 + 9 + 114 + 102)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 108), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 108)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 114), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 114)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 120), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 120)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 126), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 126)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 132), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 132)),
        new MotifReference(Motifs.DONTFORGET, quickSec(secondSanctuaryBPM, 72 - 1.5 + 114 + 132), quickSec(secondSanctuaryBPM, 72 + 12 + 114 + 132), true),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 138), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 138)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 1 + 114 + 138), quickSec(secondSanctuaryBPM, 72 + 12 + 114 + 138)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 144), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 144)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 150), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 150)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 1 + 114 + 150), quickSec(secondSanctuaryBPM, 72 + 9 + 114 + 150)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 156), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 156)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 162), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 162)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 168), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 168)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 174), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 174)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 0.5 + 114 + 180), quickSec(secondSanctuaryBPM, 72 + 5 + 114 + 180)),

        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 2.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 2.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 7.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 7.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 10 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 10 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 12.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 12.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 15 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 15 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 17.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 17.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 20 + 180), true),

        new MotifReference(Motifs.THELEGENDB, quickSec(secondSanctuaryBPM, 72 + 120 + 20 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 39 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 20 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 22.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 22.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 25 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 25 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 27.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 27.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 30 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 30 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 32.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 32.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 35 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 35 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 37.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 37.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 40 + 180), true),

        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 40 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 42.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 42.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 45 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 45 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 47.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 47.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 50 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 50 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 52.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 52.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 55 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 55 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 57.5 + 180)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 57.5 + 180), quickSec(secondSanctuaryBPM, 72 + 120 + 60 + 180), true),

        new MotifReference(Motifs.THELEGENDB, quickSec(secondSanctuaryBPM, 72 + 120 + 20 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 39 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 20 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 22.5 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 22.5 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 25 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 25 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 27.5 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 27.5 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 30 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 30 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 32.5 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 32.5 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 35 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 35 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 37.5 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 37.5 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 40 + 180 + 40), true),

        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 40 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 42.5 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 42.5 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 45 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 45 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 47.5 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 47.5 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 50 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 50 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 52.5 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 52.5 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 55 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 55 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 57.5 + 180 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 120 + 57.5 + 180 + 40), quickSec(secondSanctuaryBPM, 72 + 120 + 60 + 180 + 40), true),
    ],
    "", quickSec(secondSanctuaryBPM, 72 + 120 + 60 + 180 + 40)
);

const thirdSanctuary = new Song("The Third Sanctuary",
    [Motifs.SUBSANC, Motifs.THELEGENDA],
    "7f1RK1m7qvc",
    [
        new MotifReference(Motifs.SUBSANC, 0, quickSec(secondSanctuaryBPM, 9)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 9), quickSec(secondSanctuaryBPM, 18)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 18), quickSec(secondSanctuaryBPM, 27)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 27), quickSec(secondSanctuaryBPM, 36)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 36), quickSec(secondSanctuaryBPM, 45)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 45), quickSec(secondSanctuaryBPM, 54)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 54), quickSec(secondSanctuaryBPM, 63)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 63), quickSec(secondSanctuaryBPM, 72)),

        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72), quickSec(secondSanctuaryBPM, 72 + 5.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 5.5), quickSec(secondSanctuaryBPM, 72 + 11)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 11), quickSec(secondSanctuaryBPM, 72 + 16.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 16.5), quickSec(secondSanctuaryBPM, 72 + 22)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 24), quickSec(secondSanctuaryBPM, 72 + 5.5 + 24)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 5.5 + 24), quickSec(secondSanctuaryBPM, 72 + 11 + 24)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 11 + 24), quickSec(secondSanctuaryBPM, 72 + 16.5 + 24)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 16.5 + 24), quickSec(secondSanctuaryBPM, 72 + 22 + 24)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 46), quickSec(secondSanctuaryBPM, 72 + 5.5 + 46)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 5.5 + 46), quickSec(secondSanctuaryBPM, 72 + 11 + 46)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 11 + 46), quickSec(secondSanctuaryBPM, 72 + 16.5 + 46)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 16.5 + 46), quickSec(secondSanctuaryBPM, 72 + 22 + 46)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 68), quickSec(secondSanctuaryBPM, 72 + 5.5 + 68)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 5.5 + 68), quickSec(secondSanctuaryBPM, 72 + 11 + 68)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 11 + 68), quickSec(secondSanctuaryBPM, 72 + 16.5 + 68)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 16.5 + 68), quickSec(secondSanctuaryBPM, 72 + 22 + 68)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 90), quickSec(secondSanctuaryBPM, 72 + 5.5 + 90)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 5.5 + 90), quickSec(secondSanctuaryBPM, 72 + 11 + 90)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 11 + 90), quickSec(secondSanctuaryBPM, 72 + 16.5 + 90)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 16.5 + 90), quickSec(secondSanctuaryBPM, 72 + 22 + 90)),

        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 2.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 2.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 7.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 7.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 10)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 10), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 12.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 12.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 15)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 15), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 17.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 17.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 20)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 20), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 22.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 22.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 25)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 25), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 27.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 27.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 30)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 30), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 32.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 32.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 35)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 35), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 37.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 37.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40)),
        
        new MotifReference(Motifs.THELEGENDB, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 20), true),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 2.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 2.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 7.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 7.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 10 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 10 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 12.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 12.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 15 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 15 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 17.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 17.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 20 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 20 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 22.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 22.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 25 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 25 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 27.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 27.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 30 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 30 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 32.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 32.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 35 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 35 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 37.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 37.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 40)),
        
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 2.5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 2.5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 7.5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 7.5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 10 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 10 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 12.5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 12.5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 15 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 15 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 17.5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 17.5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 20 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 20 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 22.5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 22.5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 25 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 25 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 27.5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 27.5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 30 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 30 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 32.5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 32.5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 35 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 35 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 37.5 + 80)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 37.5 + 80), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80)),

        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 0.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 6)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 6), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 11.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 11.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 16.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 16.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 21.5), true),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 22.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 28)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 28), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 33)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 33.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38)),

        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 5.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 5.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 11)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 11), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 16.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 16.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 5.5 + 22)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 5.5 + 22), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 11 + 22)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 11 + 22), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 16.5 + 22)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 16.5 + 22), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 22)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 44), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 5.5 + 44)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 5.5 + 44), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 11 + 44)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 11 + 44), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 16.5 + 44)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 16.5 + 44), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 44)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 66), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 5.5 + 66)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 5.5 + 66), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 11 + 66)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 11 + 66), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 16.5 + 66)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 16.5 + 66), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66)),

        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 2.5 + 40 + 80 + 38 + 7 + 22 + 66)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 2.5 + 40 + 80 + 38 + 7 + 22 + 66), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 5 + 40 + 80 + 38 + 7 + 22 + 66)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 7.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 7.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 10)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 10), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 12.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 12.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 15)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 15), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 17.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 17.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 20)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 20), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 22.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 22.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 25)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 25), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 27.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 27.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 30)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 30), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 32.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 32.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 35)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 35), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 37.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 37.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40)),
        
        new MotifReference(Motifs.THELEGENDB, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 20), true),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 2.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 2.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 7.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 7.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 10 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 10 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 12.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 12.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 15 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 15 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 17.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 17.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 20 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 20 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 22.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 22.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 25 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 25 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 27.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 27.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 30 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 30 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 32.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 32.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 35 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 35 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 37.5 + 40)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 37.5 + 40), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40)),

        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 0.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 6), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 10.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 12), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 16.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 23.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 28)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 29), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 33.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 35), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 39.5)),

        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 46.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 51)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 46.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 49 + 3)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 52), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 56.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 58), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 62.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 58), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 60.5 + 3)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 63.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 68)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 69.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 74)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 69.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 72 + 3)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 75), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 79.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 81), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 85.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 81), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 83.5 + 3)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 86.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 91)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 92.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 97)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 92.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 95 + 3)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 98), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 102.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 104), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 108.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 104), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 106.5 + 3)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 109.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 114)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 115.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 120)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 115.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 118 + 3)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 121), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 125.5)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 127), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 131.5)),
        new MotifReference(Motifs.THELEGENDA, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 127), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 129.5 + 3)),
        new MotifReference(Motifs.SUBSANC, quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 132.5), quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 137)),
    ],
    "", quickSec(secondSanctuaryBPM, 72 + 22 + 90 + 40 + 80 + 38 + 7 + 22 + 66 + 40 + 40 + 40 + 137 + 5)
);

const heavyFootstepsBPM = 100;
const heavyFootsteps = new Song("Heavy Footsteps",
    [Motifs.TITAN],
    "4f5XPpd3oiU",
    [
        new MotifReference(Motifs.TITAN, 0, quickSec(heavyFootstepsBPM, 16)),
        new MotifReference(Motifs.TITAN, quickSec(heavyFootstepsBPM, 16), quickSec(heavyFootstepsBPM, 32)),
        new MotifReference(Motifs.TITAN, quickSec(heavyFootstepsBPM, 32), quickSec(heavyFootstepsBPM, 48)),
        new MotifReference(Motifs.TITAN, quickSec(heavyFootstepsBPM, 48), quickSec(heavyFootstepsBPM, 64)),
    ],
    "", quickSec(heavyFootstepsBPM, 64)
);

const crumblingTowerBPM = 115;
const crumblingTower = new Song("Crumbling Tower",
    [Motifs.TITAN, Motifs.SANCTUARY],
    "z2IT2YzscSE",
    [
        new MotifReference(Motifs.TITAN, 0, quickSec(crumblingTowerBPM, 16)),
        new MotifReference(Motifs.TITAN, quickSec(crumblingTowerBPM, 16), quickSec(crumblingTowerBPM, 32)),
        new MotifReference(Motifs.TITAN, quickSec(crumblingTowerBPM, 32), quickSec(crumblingTowerBPM, 48)),
        new MotifReference(Motifs.TITAN, quickSec(crumblingTowerBPM, 48), quickSec(crumblingTowerBPM, 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 64), quickSec(crumblingTowerBPM, 72)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 72), quickSec(crumblingTowerBPM, 80)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 80), quickSec(crumblingTowerBPM, 88)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 88), quickSec(crumblingTowerBPM, 96)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 96), quickSec(crumblingTowerBPM, 104)),
        new MotifReference(Motifs.TITAN, quickSec(crumblingTowerBPM, 96), quickSec(crumblingTowerBPM, 112)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 112), quickSec(crumblingTowerBPM, 120)),
        new MotifReference(Motifs.TITAN, quickSec(crumblingTowerBPM, 112), quickSec(crumblingTowerBPM, 128)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 64 + 64), quickSec(crumblingTowerBPM, 72 + 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 72 + 64), quickSec(crumblingTowerBPM, 80 + 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 80 + 64), quickSec(crumblingTowerBPM, 88 + 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 88 + 64), quickSec(crumblingTowerBPM, 96 + 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 96 + 64), quickSec(crumblingTowerBPM, 104 + 64)),
        new MotifReference(Motifs.TITAN, quickSec(crumblingTowerBPM, 96 + 64), quickSec(crumblingTowerBPM, 112 + 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 112 + 64), quickSec(crumblingTowerBPM, 120 + 64)),
        new MotifReference(Motifs.TITAN, quickSec(crumblingTowerBPM, 112 + 64), quickSec(crumblingTowerBPM, 128 + 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 64 + 128), quickSec(crumblingTowerBPM, 80 + 128)),
        new MotifReference(Motifs.DONTFORGET, quickSec(crumblingTowerBPM, 64 + 13 + 128), quickSec(crumblingTowerBPM, 80 + 128)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 80 + 128), quickSec(crumblingTowerBPM, 96 + 128)),
        new MotifReference(Motifs.DONTFORGET, quickSec(crumblingTowerBPM, 80 + 13 + 128), quickSec(crumblingTowerBPM, 96 + 128)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 96 + 128), quickSec(crumblingTowerBPM, 112 + 128)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 96 + 128), quickSec(crumblingTowerBPM, 99.5 + 128)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 99.5 + 128), quickSec(crumblingTowerBPM, 104 + 128), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 96 + 128 + 8), quickSec(crumblingTowerBPM, 99.5 + 128 + 8)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 99.5 + 128 + 8), quickSec(crumblingTowerBPM, 104 + 128 + 8), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(crumblingTowerBPM, 96 + 13 + 128), quickSec(crumblingTowerBPM, 112 + 128)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 112 + 128), quickSec(crumblingTowerBPM, 128 + 128)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 96 + 128 + 16), quickSec(crumblingTowerBPM, 99.5 + 128 + 16)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 99.5 + 128 + 16), quickSec(crumblingTowerBPM, 104 + 128 + 16), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 96 + 128 + 24), quickSec(crumblingTowerBPM, 99.5 + 128 + 24)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 99.5 + 128 + 24), quickSec(crumblingTowerBPM, 104 + 128 + 24), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(crumblingTowerBPM, 112 + 13 + 128), quickSec(crumblingTowerBPM, 128 + 128)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 112 + 128 + 48), quickSec(crumblingTowerBPM, 128 + 128 + 48), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 96 + 128 + 16 + 48), quickSec(crumblingTowerBPM, 99.5 + 128 + 16 + 48)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 99.5 + 128 + 16 + 48), quickSec(crumblingTowerBPM, 104 + 128 + 16 + 48), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 96 + 128 + 24 + 48), quickSec(crumblingTowerBPM, 99.5 + 128 + 24 + 48)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 99.5 + 128 + 24 + 48), quickSec(crumblingTowerBPM, 104 + 128 + 24 + 48), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(crumblingTowerBPM, 112 + 13 + 128 + 48), quickSec(crumblingTowerBPM, 128 + 128 + 48)),
        new MotifReference(Motifs.SANCTUARY, quickSec(crumblingTowerBPM, 112 + 128 + 64), quickSec(crumblingTowerBPM, 128 + 128 + 64), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 96 + 128 + 16 + 64), quickSec(crumblingTowerBPM, 99.5 + 128 + 16 + 64)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 99.5 + 128 + 16 + 64), quickSec(crumblingTowerBPM, 104 + 128 + 16 + 64), true),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 96 + 128 + 24 + 64), quickSec(crumblingTowerBPM, 99.5 + 128 + 24 + 64)),
        new MotifReference(Motifs.EVERHIGHER, quickSec(crumblingTowerBPM, 99.5 + 128 + 24 + 64), quickSec(crumblingTowerBPM, 104 + 128 + 24 + 64), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(crumblingTowerBPM, 112 + 13 + 128 + 64), quickSec(crumblingTowerBPM, 128 + 128 + 64)),
    ],
    "", quickSec(crumblingTowerBPM, 128 + 128 + 64 + 4),
    [
        new EffectRef(Effects.STATIC, quickSec(crumblingTowerBPM, 128 + 128 + 11), quickSec(crumblingTowerBPM, 128 + 128 + 11 + 1.5))
    ]
);

const spawnBPM = 135;
const spawn = new Song("SPAWN",
    [Motifs.TITAN],
    "oZywM_ZwvJQ",
    [
        new MotifReference(Motifs.TITAN, 0, quickSec(spawnBPM, 16)),
        new MotifReference(Motifs.TITAN, quickSec(spawnBPM, 16), quickSec(spawnBPM, 32)),
        new MotifReference(Motifs.SANCTUARY, quickSec(spawnBPM, 32), quickSec(spawnBPM, 40)), new MotifReference(Motifs.SANCTUARY, quickSec(spawnBPM, 40), quickSec(spawnBPM, 48)),
        new MotifReference(Motifs.SANCTUARY, quickSec(spawnBPM, 48), quickSec(spawnBPM, 56)), new MotifReference(Motifs.SANCTUARY, quickSec(spawnBPM, 56), quickSec(spawnBPM, 64)),
        new MotifReference(Motifs.TITAN, quickSec(spawnBPM, 64), quickSec(spawnBPM, 80)), new MotifReference(Motifs.SANCTUARY, quickSec(spawnBPM, 64), quickSec(spawnBPM, 72)),
        new MotifReference(Motifs.TITAN, quickSec(spawnBPM, 80), quickSec(spawnBPM, 96)), new MotifReference(Motifs.SANCTUARY, quickSec(spawnBPM, 80), quickSec(spawnBPM, 88)),
    ],
    "", quickSec(spawnBPM, 128 + 32)
);

const guardianBPM = 140;
const guardian = new Song("GUARDIAN",
    [Motifs.TITAN, Motifs.SANCTUARY],
    "nP9mB1sVJz4",
    [
        new MotifReference(Motifs.TITAN, 0, quickSec(guardianBPM, 16)),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 16), quickSec(guardianBPM, 32)),

        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 32), quickSec(guardianBPM, 48)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 32), quickSec(guardianBPM, 48), true),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 48), quickSec(guardianBPM, 64)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 48), quickSec(guardianBPM, 64), true),

        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 64), quickSec(guardianBPM, 80)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 64.5), quickSec(guardianBPM, 72)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 72.5), quickSec(guardianBPM, 77)),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 80), quickSec(guardianBPM, 96)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 80.5), quickSec(guardianBPM, 86)),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 96), quickSec(guardianBPM, 96 + 16)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 96.5), quickSec(guardianBPM, 104)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 104.5), quickSec(guardianBPM, 109)),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 96 + 16), quickSec(guardianBPM, 96 + 32)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 96 + 16.5), quickSec(guardianBPM, 96 + 16 + 6)),

        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 8), quickSec(guardianBPM, 128 + 8 + 16)),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 8 + 13), quickSec(guardianBPM, 128 + 8 + 16)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 24), quickSec(guardianBPM, 128 + 24 + 16)),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 24 + 13), quickSec(guardianBPM, 128 + 24 + 16)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 40), quickSec(guardianBPM, 128 + 40 + 16)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 128 + 40.5), quickSec(guardianBPM, 128 + 40 + 8)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 128 + 40.5 + 8), quickSec(guardianBPM, 128 + 40 + 12.5)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 56), quickSec(guardianBPM, 128 + 56 + 16)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 128 + 56.5), quickSec(guardianBPM, 128 + 56 + 6)),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 56 + 7), quickSec(guardianBPM, 128 + 56 + 16)),

        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 128 + 56 + 16), quickSec(guardianBPM, 128 + 56 + 32)),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 128 + 56 + 32), quickSec(guardianBPM, 128 + 56 + 48)),

        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 32 + 200), quickSec(guardianBPM, 48 + 200)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 32 + 200), quickSec(guardianBPM, 48 + 200), true),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 48 + 200), quickSec(guardianBPM, 64 + 200)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 48 + 200), quickSec(guardianBPM, 64 + 200), true),

        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 64 + 200), quickSec(guardianBPM, 64 + 200 + 16)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 64.5 + 200), quickSec(guardianBPM, 72 + 200)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 72.5 + 200), quickSec(guardianBPM, 77 + 200)),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 64 + 200 + 16), quickSec(guardianBPM, 64 + 200 + 32)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 80.5 + 200), quickSec(guardianBPM, 86 + 200)),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 64 + 200 + 32), quickSec(guardianBPM, 64 + 200 + 48)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 96.5 + 200), quickSec(guardianBPM, 104 + 200)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 104.5 + 200), quickSec(guardianBPM, 109 + 200)),
        new MotifReference(Motifs.TITAN, quickSec(guardianBPM, 64 + 200 + 48), quickSec(guardianBPM, 64 + 200 + 64)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 96 + 16.5 + 200), quickSec(guardianBPM, 96 + 16 + 6 + 200)),

        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 8 + 200), quickSec(guardianBPM, 128 + 8 + 16 + 200)),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 8 + 13 + 200), quickSec(guardianBPM, 128 + 8 + 16 + 200)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 24 + 200), quickSec(guardianBPM, 128 + 24 + 16 + 200)),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 24 + 13 + 200), quickSec(guardianBPM, 128 + 24 + 16 + 200)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 40 + 200), quickSec(guardianBPM, 128 + 40 + 16 + 200)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 128 + 40.5 + 200), quickSec(guardianBPM, 128 + 40 + 8 + 200)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 128 + 40.5 + 8 + 200), quickSec(guardianBPM, 128 + 40 + 12.5 + 200)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 56 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200)),
        new MotifReference(Motifs.FROMNOWON, quickSec(guardianBPM, 128 + 56.5 + 200), quickSec(guardianBPM, 128 + 56 + 6 + 200)),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 56 + 7 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200)),

        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 72 + 200), quickSec(guardianBPM, 128 + 72 + 16 + 200), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 72 + 13 + 200), quickSec(guardianBPM, 128 + 72 + 16 + 200)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 88 + 200), quickSec(guardianBPM, 128 + 88 + 16 + 200), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 88 + 13 + 200), quickSec(guardianBPM, 128 + 88 + 16 + 200)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 104 + 200), quickSec(guardianBPM, 128 + 104 + 16 + 200), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 104 + 13 + 200), quickSec(guardianBPM, 128 + 104 + 16 + 200)),
        new MotifReference(Motifs.SANCTUARY, quickSec(guardianBPM, 128 + 120 + 200), quickSec(guardianBPM, 128 + 120 + 16 + 200), true),
        new MotifReference(Motifs.DONTFORGET, quickSec(guardianBPM, 128 + 120 + 13 + 200), quickSec(guardianBPM, 128 + 120 + 16 + 200)),
    ],
    "", quickSec(guardianBPM, 128 + 120 + 16 + 200 + 64),
    [
        new EffectRef(Effects.BLACKSCREEN, quickSec(guardianBPM, 96 + 32), quickSec(guardianBPM, 96 + 32 + 8)),
        new EffectRef(Effects.FLASH, quickSec(guardianBPM, 96 + 32 + 8), quickSec(guardianBPM, 96 + 32 + 8 + 4)),
        new EffectRef(Effects.BLACKSCREEN, quickSec(guardianBPM, 64 + 200 + 64), quickSec(guardianBPM, 64 + 200 + 64 + 8)),
        new EffectRef(Effects.FLASH, quickSec(guardianBPM, 64 + 200 + 64 + 8), quickSec(guardianBPM, 64 + 200 + 64 + 8 + 4)),

        new EffectRef(Effects.BLACKFLASH, 0, quickSec(guardianBPM, 8)),
        new EffectRef(Effects.HERO, quickSec(guardianBPM, 128 + 8), quickSec(guardianBPM, 128 + 56 + 16)),
        new EffectRef(Effects.BLACKFLASH, quickSec(guardianBPM, 128 + 56 + 16), quickSec(guardianBPM, 128 + 56 + 16 + 8)),
        new EffectRef(Effects.HERO, quickSec(guardianBPM, 128 + 8 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200)),
        new EffectRef(Effects.BLACKFLASH, quickSec(guardianBPM, 128 + 56 + 16 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200 + 8)),
    ]
);

const needAHandBPM = 165;
const needAHand = new Song("Need a hand!?",
    [Motifs.GERSON],
    "C135xMeF4jk",
    [
        new MotifReference(Motifs.GERSON, 0, quickSec(needAHandBPM, 14)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 8), quickSec(needAHandBPM, 14)),
        new MotifReference(Motifs.GERSON, quickSec(needAHandBPM, 14), quickSec(needAHandBPM, 14 + 16)),
        new MotifReference(Motifs.GERSON, quickSec(needAHandBPM, 14 + 16), quickSec(needAHandBPM, 14 + 32)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 8 + 32), quickSec(needAHandBPM, 14 + 32)),
        new MotifReference(Motifs.GERSON, quickSec(needAHandBPM, 14 + 32), quickSec(needAHandBPM, 14 + 48)),

        new MotifReference(Motifs.RUINS, quickSec(needAHandBPM, 64), quickSec(needAHandBPM, 83)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 64.5), quickSec(needAHandBPM, 64.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 68.5), quickSec(needAHandBPM, 68.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 72.5), quickSec(needAHandBPM, 72.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 80.5), quickSec(needAHandBPM, 80.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 84.5), quickSec(needAHandBPM, 84.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 88.5), quickSec(needAHandBPM, 88.5 + 3.5)),
        new MotifReference(Motifs.RUINS, quickSec(needAHandBPM, 64 + 32), quickSec(needAHandBPM, 83 + 32)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 96.5), quickSec(needAHandBPM, 96.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 100.5), quickSec(needAHandBPM, 100.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 104.5), quickSec(needAHandBPM, 104.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 112.5), quickSec(needAHandBPM, 112.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 116.5), quickSec(needAHandBPM, 116.5 + 3.5)),
        new MotifReference(Motifs.UNDYNE, quickSec(needAHandBPM, 120.5), quickSec(needAHandBPM, 120.5 + 3.5)),

        new MotifReference(Motifs.GERSON, quickSec(needAHandBPM, 64 + 62), quickSec(needAHandBPM, 64 + 64)),
    ],
    "", quickSec(needAHandBPM, 64 + 64)
);

const catswingBPM = 130;
const catswing = new Song("Catswing",
    [Motifs.MIKE],
    "r-DvoCTarMQ",
    [
        new MotifReference(Motifs.MIKE, quickSec(catswingBPM, 15), quickSec(catswingBPM, 31)),
        new MotifReference(Motifs.MIKE, quickSec(catswingBPM, 31), quickSec(catswingBPM, 47)),

        new MotifReference(Motifs.SPAMTONA, quickSec(catswingBPM, 48), quickSec(catswingBPM, 60)),
        new MotifReference(Motifs.SPAMTONA, quickSec(catswingBPM, 64), quickSec(catswingBPM, 76)),

        new MotifReference(Motifs.SPAMTONB, quickSec(catswingBPM, 80), quickSec(catswingBPM, 96)),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 80), quickSec(catswingBPM, 82)),
        new MotifReference(Motifs.SPAMTONB, quickSec(catswingBPM, 96), quickSec(catswingBPM, 112)),
        new MotifReference(Motifs.QUEENA, quickSec(catswingBPM, 96), quickSec(catswingBPM, 101)),
        new MotifReference(Motifs.SPAMTONB, quickSec(catswingBPM, 112), quickSec(catswingBPM, 128)),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 112), quickSec(catswingBPM, 114)),
        new MotifReference(Motifs.SPAMTONB, quickSec(catswingBPM, 128), quickSec(catswingBPM, 144)),

        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 144), quickSec(catswingBPM, 144 + 6)),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 144 + 8), quickSec(catswingBPM, 144 + 8 + 6)),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 144 + 16), quickSec(catswingBPM, 144 + 16 + 6)),
        new MotifReference(Motifs.TENNA, quickSec(catswingBPM, 144 + 16.5), quickSec(catswingBPM, 144 + 16 + 7), true),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 144 + 24), quickSec(catswingBPM, 144 + 24 + 6)),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 144 + 32), quickSec(catswingBPM, 144 + 32 + 6)),
        new MotifReference(Motifs.TENNA, quickSec(catswingBPM, 144 + 32.5), quickSec(catswingBPM, 144 + 32 + 7), true),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 144 + 40), quickSec(catswingBPM, 144 + 40 + 6)),

        new MotifReference(Motifs.SPAMTONB, quickSec(catswingBPM, 80 + 112), quickSec(catswingBPM, 96 + 112)),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 80 + 112), quickSec(catswingBPM, 82 + 112)),
        new MotifReference(Motifs.SPAMTONB, quickSec(catswingBPM, 96 + 112), quickSec(catswingBPM, 112 + 112)),
        new MotifReference(Motifs.QUEENA, quickSec(catswingBPM, 96 + 112), quickSec(catswingBPM, 101 + 112)),
        new MotifReference(Motifs.SPAMTONB, quickSec(catswingBPM, 112 + 112), quickSec(catswingBPM, 128 + 112)),
        new MotifReference(Motifs.TVTIME, quickSec(catswingBPM, 112 + 112), quickSec(catswingBPM, 114 + 112)),
        new MotifReference(Motifs.SPAMTONB, quickSec(catswingBPM, 128 + 112), quickSec(catswingBPM, 144 + 112)),
    ],
    "", quickSec(catswingBPM, 144 + 112)
);

//#endregion

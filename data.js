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
    color;
    color2; // ideally transparent
    id;
    letter = "";

    soul = null; // element
    variation = null; // element

    constructor(name, letter = "", color = "#ffffff", color2 = "#ffffff33")
    {
        this.name = name;
        this.color = color;
        this.color2 = color2;
        this.letter = letter;

        this.id = normalizeAndTrim(name);
        allMotifs.push(this);
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

class Song
{
    name;
    youtubeId;
    motifRefs = [];

    constructor(name, youtubeId, motifRefs = [], id = "")
    {
        this.name = name;
        this.youtubeId = youtubeId;
        this.motifRefs = motifRefs.sort((a, b) => a.startTime - b.startTime);

        if (id == "") this.id = normalizeAndTrim(name);
        else this.id = id; // in case the name is the same in multiple albums

        allSongs.push(this);
    }
}

const DONTFORGETMOTIF = new Motif("Don't Forget");
const THELEGENDAMOTIF = new Motif("The Legend", "A");
const THELEGENDBMOTIF = new Motif("The Legend", "B");
const THELEGENDCMOTIF = new Motif("The Legend", "C");
const LANCERMOTIF = new Motif("Lancer", "");
const KINGMOTIF = new Motif("King", "");
const FREEDOMMOTIF = new Motif("Freedom Motif", "");
const LOSTGIRLMOTIF = new Motif("Lost Girl", "");
const QUEENAMOTIF = new Motif("Queen", "A", "#6fd1ff", "#6d86e733");
const SPAMTONAMOTIF = new Motif("Spamton", "A", "#ffffff", "#ffaec933");
const SPAMTONBMOTIF = new Motif("Spamton", "B", "#ffffff", "#fff30133");
const TVTIMEMOTIF = new Motif("TV Time!", "", "#fbe63b", "#ff342b33");
const TENNAMOTIF = new Motif("Tenna", "", "#db1f53", "#fffb5b33");
const MIKEMOTIF = new Motif("Mike", "", "#69be60");
const SANCTUARYMOTIF = new Motif("Dark Sanctuary");
const TITANMOTIF = new Motif("Titan");

export function getMotifById(id)
{
    return allMotifs.find(motif => id == motif.id);
}

export function getSongById(id)
{
    return allSongs.find(song => id == song.id);
}

export function getSongsWithMotif(motif)
{
    return allSongs.filter(song => song.motifRefs.some(ref => ref.motif.id == motif.id));
}

function exportIdsToTxt(data, filename = "ids.txt")
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

const theLegendBPM = 110;
const theLegend = new Song("The Legend",
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
    ]
);

const lancerBPM = 125;
const lancer = new Song("Lancer",
    "GAhBQH0Kf1I",
    [
        new MotifReference(LANCERMOTIF, 0, quickSec(lancerBPM, 24.66)),
        new MotifReference(LANCERMOTIF, quickSec(lancerBPM, 24.66), quickSec(lancerBPM, 48.66)),
    ]
);

const vsLancerBPM = 177;
const vsLancer = new Song("Vs. Lancer",
    "Ce-gU8G6Vik",
    [
        new MotifReference(LANCERMOTIF, 0, quickSec(vsLancerBPM, 33.5)),
        new MotifReference(LANCERMOTIF, quickSec(vsLancerBPM, 33.5), quickSec(vsLancerBPM, 64.5)),
    ]
);

const cardCastleBPM = 125;
const cardCastle = new Song("Card Castle",
    "tvjuTn9LZwY",
    [
        new MotifReference(KINGMOTIF, 0, quickSec(cardCastleBPM, 32)),
        new MotifReference(KINGMOTIF, quickSec(cardCastleBPM, 32), quickSec(cardCastleBPM, 62.5)),
        new MotifReference(LANCERMOTIF, quickSec(cardCastleBPM, 62.5), quickSec(cardCastleBPM, 96)),
        new MotifReference(LANCERMOTIF, quickSec(cardCastleBPM, 96), quickSec(cardCastleBPM, 128)),
    ]
);

const chaosKingBPM = 147;
const chaosKing = new Song("Chaos King",
    "tPwzoZ-e664",
    [
        new MotifReference(KINGMOTIF, quickSec(chaosKingBPM, 8), quickSec(chaosKingBPM, 40)),
        new MotifReference(KINGMOTIF, quickSec(chaosKingBPM, 40), quickSec(chaosKingBPM, 40 + 32)),
        new MotifReference(KINGMOTIF, quickSec(chaosKingBPM, 40 + 32), quickSec(chaosKingBPM, 40 + 64)),
        new MotifReference(LANCERMOTIF, quickSec(chaosKingBPM, 38.5 + 64), quickSec(chaosKingBPM, 40 + 96)),
        new MotifReference(LANCERMOTIF, quickSec(chaosKingBPM, 40 + 96), quickSec(chaosKingBPM, 40 + 96 + 32)),
        new MotifReference(THELEGENDCMOTIF, quickSec(chaosKingBPM, 40 + 96 + 32), quickSec(chaosKingBPM, 40 + 96 + 64)),
        new MotifReference(THELEGENDCMOTIF, quickSec(chaosKingBPM, 40 + 96 + 64), quickSec(chaosKingBPM, 40 + 96 + 92)),
        new MotifReference(THELEGENDCMOTIF, quickSec(chaosKingBPM, 40 + 96 + 92), quickSec(chaosKingBPM, 40 + 96 + 92 + 32), true),
    ]
);

const theWorldRevolvingBPM = 190.1;
const theWorldRevolving = new Song("THE WORLD REVOLVING",
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
    ]
);

// TODO: fix with new bpm method
const catswing = new Song("Catswing",
    "r-DvoCTarMQ",
    [
        new MotifReference(MIKEMOTIF, 7.12, 9.67), new MotifReference(MIKEMOTIF, 10.81, 17.02), new MotifReference(MIKEMOTIF, 18.14, 22.16),
        new MotifReference(SPAMTONAMOTIF, 22.16, 27.70), new MotifReference(SPAMTONAMOTIF, 29.59, 35.09),

        new MotifReference(SPAMTONBMOTIF, 36.92, 66.47),
        new MotifReference(TVTIMEMOTIF, 36.92, 37.85), new MotifReference(TVTIMEMOTIF, 51.70, 52.64),
        new MotifReference(QUEENAMOTIF, 44.56, 46.50),

        new MotifReference(TVTIMEMOTIF, 66.48, 69.24), new MotifReference(TVTIMEMOTIF, 70.17, 72.92),
        new MotifReference(TVTIMEMOTIF, 73.85, 76.61), new MotifReference(TVTIMEMOTIF, 77.53, 80.28),
        new MotifReference(TENNAMOTIF, 74.08, 77.23),
        new MotifReference(TVTIMEMOTIF, 81.21, 83.98), new MotifReference(TVTIMEMOTIF, 84.89, 87.66),
        new MotifReference(TENNAMOTIF, 81.45, 84.61),

        new MotifReference(SPAMTONBMOTIF, 88.63, 66.47 - 36.92 + 88.63),
        new MotifReference(TVTIMEMOTIF, 88.63, 89.57), new MotifReference(TVTIMEMOTIF, 103.40, 104.34),
        new MotifReference(QUEENAMOTIF, 96.23, 98.19),
    ]
);

const spawnBPM = 135;
const spawn = new Song("SPAWN",
    "oZywM_ZwvJQ",
    [
        new MotifReference(TITANMOTIF, 0, quickSec(spawnBPM, 16)),
        new MotifReference(TITANMOTIF, quickSec(spawnBPM, 16), quickSec(spawnBPM, 32)),
        new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 32), quickSec(spawnBPM, 40)), new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 40), quickSec(spawnBPM, 48)),
        new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 48), quickSec(spawnBPM, 56)), new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 56), quickSec(spawnBPM, 64)),
        new MotifReference(TITANMOTIF, quickSec(spawnBPM, 64), quickSec(spawnBPM, 80)), new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 64), quickSec(spawnBPM, 72)),
        new MotifReference(TITANMOTIF, quickSec(spawnBPM, 80), quickSec(spawnBPM, 96)), new MotifReference(SANCTUARYMOTIF, quickSec(spawnBPM, 80), quickSec(spawnBPM, 88)),
    ]
);

const guardianBPM = 140;
const guardian = new Song("GUARDIAN",
    "nP9mB1sVJz4",
    [
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 32), quickSec(guardianBPM, 48)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 48), quickSec(guardianBPM, 64)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 8), quickSec(guardianBPM, 128 + 8 + 16)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 8 + 13), quickSec(guardianBPM, 128 + 8 + 16)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 24), quickSec(guardianBPM, 128 + 24 + 16)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 24 + 13), quickSec(guardianBPM, 128 + 24 + 16)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 40), quickSec(guardianBPM, 128 + 40 + 16)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 56), quickSec(guardianBPM, 128 + 56 + 16)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 56 + 7), quickSec(guardianBPM, 128 + 56 + 16)),

        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 32 + 200), quickSec(guardianBPM, 48 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 48 + 200), quickSec(guardianBPM, 64 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 8 + 200), quickSec(guardianBPM, 128 + 8 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 8 + 13 + 200), quickSec(guardianBPM, 128 + 8 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 24 + 200), quickSec(guardianBPM, 128 + 24 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 24 + 13 + 200), quickSec(guardianBPM, 128 + 24 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 40 + 200), quickSec(guardianBPM, 128 + 40 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 56 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200)),
        new MotifReference(DONTFORGETMOTIF, quickSec(guardianBPM, 128 + 56 + 7 + 200), quickSec(guardianBPM, 128 + 56 + 16 + 200)),

        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 72 + 200), quickSec(guardianBPM, 128 + 72 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 88 + 200), quickSec(guardianBPM, 128 + 88 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 104 + 200), quickSec(guardianBPM, 128 + 104 + 16 + 200)),
        new MotifReference(SANCTUARYMOTIF, quickSec(guardianBPM, 128 + 120 + 200), quickSec(guardianBPM, 128 + 120 + 16 + 200)),
    ]
);

// please don't run twice
// exportIdsToTxt(allMotifs, "motifids.txt");
// exportIdsToTxt(allSongs, "songids.txt");

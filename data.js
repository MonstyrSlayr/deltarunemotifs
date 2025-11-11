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

class Song
{
    name;
    youtubeId;
    motifRefs = [];
    loopPoint = null;

    constructor(name, youtubeId = "", motifRefs = [], id = "", loopPoint = null)
    {
        this.name = name;
        this.youtubeId = youtubeId;
        this.motifRefs = motifRefs.sort((a, b) => a.startTime - b.startTime);

        if (id == "") this.id = normalizeAndTrim(name);
        else this.id = id; // in case the name is the same in multiple albums

        this.loopPoint = loopPoint;

        allSongs.push(this);
    }
}

const LINK = "https://monstyrslayr.github.io/deltarunemotifs/img/";

const RUINSMOTIF = new Motif("The Ruins");
const UNDYNEMOTIF = new Motif("Undyne", "", "#6299c1", "#c9473e", LINK + "undyne.png");
const NIGHTMAREMOTIF = new Motif("Your Best Nightmare");
NIGHTMAREMOTIF.toString = function() { return "Your Best Nightmare / The Dark Truth"; }

const SUSIEMOTIF = new Motif("Susie", "", "#ae67af", "#54468f33", LINK + "susiegaster.webp");
const DONTFORGETMOTIF = new Motif("Don't Forget", "", "#4dcc8e", "#f60e9733", LINK + "ralsei.png");
const THEDOORMOTIF = new Motif("The Door", "", "#ffffff", "#00000033", LINK + "thedoor.png");
const THELEGENDAMOTIF = new Motif("The Legend", "A");
const THELEGENDBMOTIF = new Motif("The Legend", "B");
const THELEGENDCMOTIF = new Motif("The Legend", "C");
const LANCERMOTIF = new Motif("Lancer", "");
const KINGMOTIF = new Motif("King", "");
const HIPSHOPMOTIF = new Motif("Hip Shop", "");
const FREEDOMMOTIF = new Motif("Freedom", "");

const QUEENAMOTIF = new Motif("Queen", "A", "#6fd1ff", "#6d86e733", LINK + "queen.webp");
const QUEENBMOTIF = new Motif("Queen", "B", "#6fd1ff", "#6d86e733");
const QUEENCMOTIF = new Motif("Queen", "C", "#6fd1ff", "#6d86e733");
const QUEENDMOTIF = new Motif("Queen", "D", "#6fd1ff", "#6d86e733");
const SWEETCAPNCAKESA = new Motif("Sweet Cap'n Cakes", "A");
const SWEETCAPNCAKESB = new Motif("Sweet Cap'n Cakes", "B");
const BERDLYAMOTIF = new Motif("Berdly", "A", "#46b3fc", "#30b18133", LINK + "berdly.webp");
const BERDLYBMOTIF = new Motif("Berdly", "B", "#46b3fc", "#30b18133");
const SPAMTONAMOTIF = new Motif("Spamton", "A", "#ffffff", "#ffaec933", LINK + "spamton.webp");
const SPAMTONBMOTIF = new Motif("Spamton", "B", "#ffffff", "#fff30133");
const LOSTGIRLMOTIF = new Motif("Lost Girl", "", "#331d0a", "#332a3b33", LINK + "lostgirl.png");
const POWERSCOMBINEDMOTIF = new Motif("Knock You Down !!", "");

const TVTIMEMOTIF = new Motif("TV Time!", "", "#fbe63b", "#ff342b33", LINK + "tvtime.webp");
const TENNAMOTIF = new Motif("Tenna", "", "#db1f53", "#fffb5b33");
const DOOMBOARDMOTIF = new Motif("Doom Board", "");

const MIKEMOTIF = new Motif("Mike", "", "#69be60");
const SANCTUARYMOTIF = new Motif("Dark Sanctuary");
const SUBSANCMOTIF = new Motif("Subsequent Sanctuary");
const GERSONMOTIF = new Motif("Gerson");
const TITANMOTIF = new Motif("Titan");

export function getMotifById(id)
{
    return allMotifs.find(motif => id == motif.id);
}

export function getMotifsById(id)
{
    return allMotifs.filter(motif => id == motif.id);
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

//#region CHAPTER 1

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
    ],
    "", quickSec(theLegendBPM, 36 + 128 + 35)
);

const lancerBPM = 125;
const lancer = new Song("Lancer",
    "GAhBQH0Kf1I",
    [
        new MotifReference(LANCERMOTIF, 0, quickSec(lancerBPM, 24.66)),
        new MotifReference(LANCERMOTIF, quickSec(lancerBPM, 24.66), quickSec(lancerBPM, 48.66)),
    ],
    "", quickSec(lancerBPM, 99)
);

const vsLancerBPM = 177;
const vsLancer = new Song("Vs. Lancer",
    "Ce-gU8G6Vik",
    [
        new MotifReference(LANCERMOTIF, quickSec(vsLancerBPM, 2.5), quickSec(vsLancerBPM, 33.5)),
        new MotifReference(LANCERMOTIF, quickSec(vsLancerBPM, 33.5), quickSec(vsLancerBPM, 64.5)),
    ],
    "", quickSec(vsLancerBPM, 123)
);

const cardCastleBPM = 125;
const cardCastle = new Song("Card Castle",
    "tvjuTn9LZwY",
    [
        new MotifReference(KINGMOTIF, 0, quickSec(cardCastleBPM, 32)),
        new MotifReference(KINGMOTIF, quickSec(cardCastleBPM, 32), quickSec(cardCastleBPM, 62.5)),
        new MotifReference(LANCERMOTIF, quickSec(cardCastleBPM, 62.5), quickSec(cardCastleBPM, 96)),
        new MotifReference(LANCERMOTIF, quickSec(cardCastleBPM, 96), quickSec(cardCastleBPM, 128)),
    ],
    "", quickSec(cardCastleBPM, 128)
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
    ],
    "", quickSec(chaosKingBPM, 40 + 96 + 92 + 32)
);

const theWorldRevolvingBPM = 190;
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
    ],
    "", quickSec(theWorldRevolvingBPM, 264 + 56)
);

//#endregion

//#region CHAPTER 2

const queen = new Song("Queen",
    "6XQv5CHmITA",
    [

    ]
);

const aSimpleDiversionBPM = 130;
const aSimpleDiversion = new Song("A Simple Diversion",
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
    "yud5H-vnbJw",
    [
        new MotifReference(BERDLYAMOTIF, 0, quickSec(bluebirdOfMisfortuneBPM, 49)),
        new MotifReference(BERDLYBMOTIF, quickSec(bluebirdOfMisfortuneBPM, 49), quickSec(bluebirdOfMisfortuneBPM, 97)),
    ],
    "", quickSec(bluebirdOfMisfortuneBPM, 97)
)

const pandoraPalaceBPM = 100;
const pandoraPalace = new Song("Pandora Palace",
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

//#endregion

//#region CHAPTER 4

// TODO: fix with new bpm method

const knockYouDownRhythmVer = new Song("Knock You Down!! (Rhythm Ver.)",
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

const gyaaHaHa = new Song("Gyaa Ha ha!",
    "HeAXR0UKRxY",
    [

    ]
);

const wiseWords = new Song("Wise words",
    "YYl_CuHvVRs",
    [
        
    ]
);

const hammerOfJustice = new Song("Hammer of Justice",
    "tBdLO8u-0L8",
    [
        
    ]
);

const heavyFootsteps = new Song("Heavy Footsteps",
    "4f5XPpd3oiU",
    [

    ]
);

const crumblingTower = new Song("Crumbling Tower",
    "z2IT2YzscSE",
    [
        
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
    ],
    "", quickSec(spawnBPM, 128 + 32)
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
    ],
    "", quickSec(guardianBPM, 128 + 120 + 16 + 200 + 64)
);

const needAHand = new Song("Need a hand!?",
    "C135xMeF4jk",
    [
        
    ]
);

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

//#endregion

// please don't run twice
// exportIdsToTxt(allMotifs, "motifids.txt");
// exportIdsToTxt(allSongs, "songids.txt");

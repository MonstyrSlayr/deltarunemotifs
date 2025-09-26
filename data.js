class Motif
{
    name;
    image;
    color;
    color2; // ideally transparent

    soul = null; // element

    constructor(name, color = "#ffffff", color2 = "#ffffff33")
    {
        this.name = name;
        this.color = color;
        this.color2 = color2;
    }
}

class MotifReference
{
    motif;
    isVariation = false;
    startTime = 0; // seconds
    endTime = 0; // seconds

    constructor(motif, startTime, endTime)
    {
        this.motif = motif;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class Song
{
    name;
    youtubeId;
    motifs = []; // actually motif references

    constructor(name, youtubeId, motifs = [])
    {
        this.name = name;
        this.youtubeId = youtubeId;
        this.motifs = motifs.sort((a, b) => a.startTime - b.startTime);
    }
}

const DONTFORGETMOTIF = new Motif("Don't Forget");
const FREEDOMMOTIF = new Motif("Freedom Motif");
const QUEENAMOTIF = new Motif("Queen (A)", "#6fd1ff", "#6d86e733");
const SPAMTONAMOTIF = new Motif("Spamton (A)", "#ffffff", "#ffaec933");
const SPAMTONBMOTIF = new Motif("Spamton (B)", "#ffffff", "#fff30133");
const TVTIMEMOTIF = new Motif("TV Time!", "#fbe63b", "#ff342b33");
const TENNAMOTIF = new Motif("Tenna", "#db1f53", "#fffb5b33");
const MIKEMOTIF = new Motif("Mike", "#69be60");

const allSongs = [];
const theWorldRevolving = new Song("THE WORLD REVOLVING",
    "Z01Tsgwe2dQ",
    [
        new MotifReference(FREEDOMMOTIF, 20.25, 40.25), 
        new MotifReference(DONTFORGETMOTIF, 80.9, "end")
    ]
);

export const catswing = new Song("Catswing",
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

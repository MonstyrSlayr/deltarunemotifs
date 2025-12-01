import { IMGLINK, normalizeAndTrim } from "./data.js";

export const allMotifs = [];

const MOTIFIMGLINK = IMGLINK + "motifs/";

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
        this.image = image;
        
        allMotifs.push(this);
    }

    toString()
    {
        if (this.letter.length == 0) return this.name;
        return this.name + " (" + this.letter + ")";
    }
}

export class MotifReference
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

export const Motifs = {};

Motifs.ONCEUPONATIME = new Motif("Once Upon a Time");
Motifs.RUINS = new Motif("The Ruins", "", "#815a98", "#42498833", MOTIFIMGLINK + "ruins.png");
Motifs.UWAA = new Motif("Uwa!!");
Motifs.HOME = new Motif("Home");
Motifs.ENEMYAPPROACHING = new Motif("Enemy Approaching", "A");
Motifs.DOGSONG = new Motif("Enemy Approaching", "D");
Motifs.GHOSTFIGHTA = new Motif("Ghost Fight", "A");
Motifs.GHOSTFIGHTB = new Motif("Ghost Fight", "B");
Motifs.DETERMINATION = new Motif("Determination");
Motifs.HEARTACHE = new Motif("Heartache");
Motifs.SNOWDINA = new Motif("Snowdin", "A");
Motifs.SNOWDINB = new Motif("Snowdin", "B");
Motifs.ANOTHERMEDIUM = new Motif("Another Medium");
Motifs.SHOWTIME = new Motif("Showtime!");
Motifs.HOTEL = new Motif("Hotel");
Motifs.OH = new Motif("Oh!");
Motifs.SPOOKTUNE = new Motif("Spooktune");
Motifs.JINGLEBELLS = new Motif("Jingle Bells");
Motifs.YOURBESTNIGHTMARE = new Motif("Your Best Nightmare", "", "#ffffff", "#2c180833", MOTIFIMGLINK + "yourBestNightmare.png");
Motifs.YOURBESTNIGHTMARE.toString = function() { return "Your Best Nightmare / The Dark Truth"; }
Motifs.POWEROFNEO = new Motif("Power of NEO", "", "#fa0ef3", "#fef10033", MOTIFIMGLINK + "mettatonNeo.png");
Motifs.MEGALOVANIA = new Motif("MEGALOVANIA");

Motifs.FLOWEY = new Motif("Flowey");
Motifs.TORIEL = new Motif("Toriel");
Motifs.SANS = new Motif("Sans");
Motifs.PAPYRUS = new Motif("Papyrus");
Motifs.UNDYNE = new Motif("Undyne", "", "#6299c1", "#c9473e33", MOTIFIMGLINK + "undyne.png");
Motifs.DUMMY = new Motif("Dummy!", "", "#ffbc3a", "#00000033", MOTIFIMGLINK + "madDummy.png");
Motifs.ALPHYS = new Motif("Alphys");
Motifs.METTATON = new Motif("Mettaton");
Motifs.ASRIEL = new Motif("Asriel");
Motifs.ASGORE = new Motif("Asgore");
Motifs.GASTER = new Motif("Gaster");

Motifs.DONTFORGET = new Motif("Don't Forget", "", "#4dcc8e", "#f60e9733", MOTIFIMGLINK + "ralsei.png");
Motifs.HOMETOWN = new Motif("Hometown", "");
Motifs.THELEGENDA = new Motif("The Legend", "A", "#c08226", "#00000033", MOTIFIMGLINK + "thelegend.png");
Motifs.THELEGENDB = new Motif("The Legend", "B", "#c08226", "#00000033");
Motifs.THELEGENDC = new Motif("The Legend", "C", "#c08226", "#00000033");
Motifs.THEDOOR = new Motif("The Door", "", "#ffffff", "#00000033", MOTIFIMGLINK + "thedoor.png");
Motifs.THECHASE = new Motif("The Chase", "", "#4a2430", "#00000033", MOTIFIMGLINK + "rudinnranger.webp");
Motifs.RUDEBUSTERA = new Motif("Rude Buster", "A", "#3ee9c2", "#e24dfd33", MOTIFIMGLINK + "rudeBuster.png");
Motifs.RUDEBUSTERB = new Motif("Rude Buster", "B", "#e24dfd", "#3ee9c233");
Motifs.FIELDOFHOPESANDDREAMS = new Motif("Field of Hopes and Dreams", "", "#ffffff", "#234a3d33", MOTIFIMGLINK + "rudinn.webp");
Motifs.FANFARE = new Motif("Fanfare", "", "#fadf39", "#4de3e333", MOTIFIMGLINK + "torielDarkWorld.png");
Motifs.QUIETAUTUMN = new Motif("Quiet Autumn", "", "#f055c0", "#22b14c33", MOTIFIMGLINK + "hathyBakeSale.webp");
Motifs.DARKNESSFALLS = new Motif("Darkness Falls", "");
Motifs.HIPSHOP = new Motif("Hip Shop", "", "#ffffff", "#b6497233", MOTIFIMGLINK + "hipshop.png");
Motifs.FREEDOM = new Motif("Freedom", "", "#6d6ebf", "#fbfd0133", MOTIFIMGLINK + "jevil.webp");
Motifs.THEHOLY = new Motif("THE HOLY", "", "#5496cd", "#00000033", MOTIFIMGLINK + "theholy.webp");

Motifs.SUSIE = new Motif("Susie", "", "#ae67af", "#54468f33", MOTIFIMGLINK + "susiegaster.webp");
Motifs.LANCERA = new Motif("Lancer", "A", "#5585bd", "#32323233", MOTIFIMGLINK + "lancer.png");
Motifs.LANCERB = new Motif("Lancer", "B", "#5585bd", "#ffffff33");
Motifs.ROUXLSKAARD = new Motif("Rouxls Kaard", "");
Motifs.KING = new Motif("King", "", "#004876", "#32323233", MOTIFIMGLINK + "king.png");
Motifs.KING.imagePlaying = MOTIFIMGLINK + "kingIdle.gif";
Motifs.MAN = new Motif("man", "");

Motifs.CYBERWORLD = new Motif("Cyber World", "");
Motifs.ROOTS = new Motif("Roots", "");
Motifs.POWERSCOMBINED = new Motif("Knock You Down !!", "", "#99e550", "#8eaaea33", MOTIFIMGLINK + "gigaQueen.png");

Motifs.GIRLNEXTDOOR = new Motif("Girl Next Door", "");
Motifs.QUEENA = new Motif("Queen", "A", "#6fd1ff", "#6d86e733", MOTIFIMGLINK + "queen.webp");
Motifs.QUEENB = new Motif("Queen", "B", "#6fd1ff", "#6d86e733");
Motifs.QUEENC = new Motif("Queen", "C", "#6fd1ff", "#6d86e733");
Motifs.QUEEND = new Motif("Queen", "D", "#6fd1ff", "#6d86e733");
Motifs.SWEETCAPNCAKESA = new Motif("Sweet Cap'n Cakes", "A");
Motifs.SWEETCAPNCAKESB = new Motif("Sweet Cap'n Cakes", "B");
Motifs.BERDLYA = new Motif("Berdly", "A", "#46b3fc", "#30b18133", MOTIFIMGLINK + "berdly.webp");
Motifs.BERDLYB = new Motif("Berdly", "B", "#46b3fc", "#30b18133");
Motifs.SPAMTONA = new Motif("Spamton", "A", "#ffffff", "#ffaec933", MOTIFIMGLINK + "spamton.webp");
Motifs.SPAMTONB = new Motif("Spamton", "B", "#ffffff", "#fff30133");
Motifs.LOSTGIRLA = new Motif("Lost Girl", "A", "#331d0a", "#332a3b33", MOTIFIMGLINK + "lostgirl.png");
Motifs.LOSTGIRLB = new Motif("Lost Girl", "B", "#331d0a", "#332a3b33");

Motifs.FEATUREPRESENTATION = new Motif("Feature Presentation", "", "#500d52", "#cac2b533", MOTIFIMGLINK + "featurePresentation.png");
Motifs.TVTIME = new Motif("TV Time!", "", "#fbe63b", "#ff342b33", MOTIFIMGLINK + "tvtime.webp");
Motifs.DOOMBOARD = new Motif("Doom Board", "", "#d02d86", "#511a8633", MOTIFIMGLINK + "doomboard.png");

Motifs.TENNA = new Motif("Tenna", "", "#db1f53", "#fffb5b33", MOTIFIMGLINK + "tenna.webp");

Motifs.SANCTUARY = new Motif("Dark Sanctuary", "", "#1c5ba4", "#93599833", MOTIFIMGLINK + "darksanctuary.png");
Motifs.FROMNOWON = new Motif("From Now On", "", "#6ad4f5", "#ffffff33", MOTIFIMGLINK + "mizzleTired.gif");
Motifs.FROMNOWON.imagePlaying = MOTIFIMGLINK + "mizzleIdle.gif";
Motifs.EVERHIGHER = new Motif("Ever Higher", "", "#ff3651", "#f8c85133", MOTIFIMGLINK + "cuptain.png");
Motifs.SUBSANC = new Motif("Second Sanctuary", "", "#4f378f", "#2d193e33", MOTIFIMGLINK + "subsequentsanctuary.jpg");

Motifs.MIKE = new Motif("Mike", "", "#69be60", "#ff0e0033", MOTIFIMGLINK + "mike.webp");
Motifs.GERSON = new Motif("Gerson", "", "#64a926", "#fe73fe33", MOTIFIMGLINK + "gerson.png");
Motifs.TITAN = new Motif("Titan", "", "#ffffff", "#00000033", MOTIFIMGLINK + "titan.png");
Motifs.TITAN.imagePlaying = MOTIFIMGLINK + "titan.gif";

export function getMotifById(id)
{
    return allMotifs.find(motif => id == motif.id);
}

export function getMotifsById(id)
{
    return allMotifs.filter(motif => id == motif.id);
}

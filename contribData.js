import { IMGLINK } from "./data.js";

export const allContributors = [];

const CONTRIBIMGLINK = IMGLINK + "contributors/";
export const ICONSIMGLINK = IMGLINK + "icons/";

class Contributor
{
    name;
    image;
    credit;
    showSongs = true;
    youtube = null;
    github = null;
    discord = null;

    constructor(name, image, credit)
    {
        this.name = name;
        this.image = image;
        this.credit = credit;
        allContributors.push(this);
    }
}

export const Contributors = {};

Contributors.MONSTYRSLAYR = new Contributor("MonstyrSlayr", CONTRIBIMGLINK + "monstyrslayr.jpg", "Created the website and implemented most of the songs and motifs.");
Contributors.MONSTYRSLAYR.youtube = "https://youtube.com/@MonstyrSlayr";
Contributors.MONSTYRSLAYR.github = "https://github.com/MonstyrSlayr";
Contributors.MONSTYRSLAYR.discord = "https://discord.com/users/434840883637125121";
Contributors.MONSTYRSLAYR.showSongs = false;

Contributors.KARMA = new Contributor("Karma", CONTRIBIMGLINK + "karma.jpg", "Made and contributed to motif guides for many songs.");
Contributors.KARMA.github = "https://github.com/KarmFF";
Contributors.KARMA.discord = "https://discord.com/users/315969740419891200";
Contributors.KARMA.youtube = "https://www.youtube.com/@thatkarmaguy5356";

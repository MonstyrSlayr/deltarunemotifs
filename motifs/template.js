import { getMotifById, getSongsWithMotif } from "../data.js";

function getLastFolder(url, num)
{
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(part => part !== '').filter(part => part !== 'index.html'); // Split and remove empty elements and index.html
    return parts[parts.length - num]; // Return the last part
}

const daId = getLastFolder(window.location.href, 1);
const daMotif = getMotifById(daId);
if (!daMotif) /* cry */ ;

const header = document.getElementById("motifName");
header.textContent = daMotif.name;

const daSoul = document.getElementById("soul");
daSoul.style.backgroundColor = daMotif.color;

const daSongsDiv = document.getElementById("songsDiv");
getSongsWithMotif(daMotif).forEach(song => {
    
    const anchor = document.createElement("a");
    anchor.classList.add("bigLink");
    anchor.href = "../../songs/" + song.id;
    daSongsDiv.appendChild(anchor);

        const songName = document.createElement("h2");
        songName.textContent = song.name;
        anchor.appendChild(songName);
});

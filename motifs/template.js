import { createMotifDiv, createSongDiv, getMotifById, getSongsWithMotif } from "../data.js";

function getLastFolder(url, num)
{
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(part => part !== '').filter(part => part !== 'index.html'); // Split and remove empty elements and index.html
    return parts[parts.length - num]; // Return the last part
}

const daId = getLastFolder(window.location.href, 1);
const daMotif = getMotifById(daId);
if (!daMotif) /* cry */;

const header = document.getElementById("motifName");
header.textContent = daMotif.name;

const motifList = document.getElementById("motifList");
const motifDiv = createMotifDiv(daId, false, true);
motifList.appendChild(motifDiv);

const daSongsDiv = document.getElementById("songList");
getSongsWithMotif(daMotif).forEach(song => {
    
    const songDiv = createSongDiv(song, true);
    daSongsDiv.appendChild(songDiv);
});

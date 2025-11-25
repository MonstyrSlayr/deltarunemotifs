import { createMotifDiv, createSongDiv, getMotifById, getMotifsById, getSongsWithMotif } from "../data.js";

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
const offMotifDiv = createMotifDiv(daId, false, false);
motifList.appendChild(offMotifDiv);
const onMotifDiv = createMotifDiv(daId, false, true);
motifList.appendChild(onMotifDiv);

const daMotifSep = document.getElementById("motifSep");

getMotifsById(daMotif.id).forEach(motif =>
{
    const personalDiv = document.createElement("div");
    daMotifSep.appendChild(personalDiv);

        const daHead = document.createElement("h2");
        daHead.textContent = `Songs with ${motif.toString()}`;
        personalDiv.appendChild(daHead);

        const daSongsDiv = document.createElement("div");
        daSongsDiv.classList.add("songList");
        personalDiv.appendChild(daSongsDiv);

            getSongsWithMotif(motif).forEach(song => {
                const songDiv = createSongDiv(song, true);
                daSongsDiv.appendChild(songDiv);
            });
});

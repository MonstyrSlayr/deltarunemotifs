import { allSongs, createSongDiv } from "../data.js";

const allSongsDiv = document.getElementById("songList");
const sortInput = document.getElementById("sortInput");
const sortDesc = document.getElementById("isDescending");

function sortBySoundtrack(desc = false)
{
    const daArr = desc ? [...allSongs].reverse() : allSongs;
    daArr.forEach(song =>
    {
        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortAlphabetically(desc = false)
{
    [...allSongs].sort((a, b) =>
    {
        if (a.name > b.name) return desc ? -1 : 1;
        if (a.name < b.name) return desc ? 1 : -1;
        return 0;
    }).forEach(song =>
    {
        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortMotifCount(desc = false)
{
    [...allSongs].sort((a, b) =>
    {
        const aMotifs = new Set();
        a.motifRefs.forEach(motifRef =>
        {
            aMotifs.add(motifRef.motif);
        });
        const bMotifs = new Set();
        b.motifRefs.forEach(motifRef =>
        {
            bMotifs.add(motifRef.motif);
        });
        if (aMotifs.size == bMotifs.size) return (a.motifRefs.length - b.motifRefs.length) * (desc ? -1 : 1);
        return (aMotifs.size - bMotifs.size) * (desc ? -1 : 1);
    }).forEach(song =>
    {
        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortMotifIdCount(desc = false)
{
    [...allSongs].sort((a, b) =>
    {
        const aMotifs = new Set();
        a.motifRefs.forEach(motifRef =>
        {
            aMotifs.add(motifRef.motif.id);
        });
        const bMotifs = new Set();
        b.motifRefs.forEach(motifRef =>
        {
            bMotifs.add(motifRef.motif.id);
        });
        if (aMotifs.size == bMotifs.size) return (a.motifRefs.length - b.motifRefs.length) * (desc ? -1 : 1);
        return (aMotifs.size - bMotifs.size) * (desc ? -1 : 1);
    }).forEach(song =>
    {
        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortMotifRefCount(desc = false)
{
    [...allSongs].sort((a, b) =>
    {
        return (a.motifRefs.length - b.motifRefs.length) * (desc ? -1 : 1);
    }).forEach(song =>
    {
        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortSongs()
{
    allSongsDiv.innerHTML = "";

    switch (sortInput.value)
    {
        case "soundtrack": default:
            sortBySoundtrack(sortDesc.checked);
            break;

        case "alphabetical":
            sortAlphabetically(sortDesc.checked);
            break;
        
        case "motif":
            sortMotifCount(sortDesc.checked);
            break;
        
        case "motifId":
            sortMotifIdCount(sortDesc.checked);
            break;
        
        case "motifRef":
            sortMotifRefCount(sortDesc.checked);
            break;
    }
}

sortInput.addEventListener("change", sortSongs);
sortDesc.addEventListener("change", sortSongs);

sortInput.value = "soundtrack";
sortDesc.checked = false;
sortBySoundtrack();

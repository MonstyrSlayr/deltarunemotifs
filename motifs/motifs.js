import { allMotifs, allSongs, createMotifDiv, getMotifRefCount, getSongsWithMotif, getSongsWithMotifId } from "../data.js";

const allMotifsDiv = document.getElementById("motifList");
const sortInput = document.getElementById("sortInput");
const sortDesc = document.getElementById("isDescending");

function sortBySoundtrack(desc = false)
{
    const allMotifIds = new Set();
    for (const motif of allMotifs)
    {
        allMotifIds.add(motif.id);
    }

    [...allMotifIds].sort((a, b) =>
    {
        if (getSongsWithMotifId(a).length == 0 && getSongsWithMotifId(b).length == 0) return 0;
        if (getSongsWithMotifId(a).length == 0) return 1;
        if (getSongsWithMotifId(b).length == 0) return -1;

        // stupid
        for (const song of allSongs)
        {
            for (const motifRef of song.motifRefs)
            {
                if (motifRef.motif.id == a) return desc ? 1 : -1;
                if (motifRef.motif.id == b) return desc ? -1 : 1;
            }
        }

        return 0;
    }).forEach(motifId =>
    {
        const motifDiv = createMotifDiv(motifId, true, true);
        allMotifsDiv.appendChild(motifDiv);
    });
}

function sortAlphabetically(desc = false)
{
    const motifArr = [...allMotifs].sort((a, b) =>
    {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return desc ? -1 : 1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return desc ? 1 : -1;
        return 0;
    })
    
    const allMotifIds = new Set();
    for (const motif of motifArr)
    {
        allMotifIds.add(motif.id);
    }
    
    allMotifIds.forEach(motifId =>
    {
        const motifDiv = createMotifDiv(motifId, true, true);
        allMotifsDiv.appendChild(motifDiv);
    });
}

function sortSong(desc = false)
{
    const allMotifIds = new Set();
    for (const motif of allMotifs)
    {
        allMotifIds.add(motif.id);
    }
    
    [...allMotifIds].sort((a, b) =>
    {
        if (getSongsWithMotifId(a).length == 0 && getSongsWithMotifId(b).length == 0) return 0;
        if (getSongsWithMotifId(a).length == 0) return 1;
        if (getSongsWithMotifId(b).length == 0) return -1;

        if (getSongsWithMotifId(a).length == getSongsWithMotifId(b).length)
        {
            for (const song of allSongs)
            {
                for (const motifRef of song.motifRefs)
                {
                    if (motifRef.motif.id == a) return desc ? 1 : -1;
                    if (motifRef.motif.id == b) return desc ? -1 : 1;
                }
            }
        }

        return (getSongsWithMotifId(a).length - getSongsWithMotifId(b).length) * (desc ? -1 : 1);
    }).forEach(motifId =>
    {
        const motifDiv = createMotifDiv(motifId, true, true);
        allMotifsDiv.appendChild(motifDiv);
    });
}

function sortRef(desc = false)
{
    const allMotifIds = new Set();
    for (const motif of allMotifs)
    {
        allMotifIds.add(motif.id);
    }
    
    [...allMotifIds].sort((a, b) =>
    {
        if (getSongsWithMotifId(a).length == 0 && getSongsWithMotifId(b).length == 0) return 0;
        if (getSongsWithMotifId(a).length == 0) return 1;
        if (getSongsWithMotifId(b).length == 0) return -1;
        
        return (getMotifRefCount(a) - getMotifRefCount(b)) * (desc ? -1 : 1);
    }).forEach(motifId =>
    {
        const motifDiv = createMotifDiv(motifId, true, true);
        allMotifsDiv.appendChild(motifDiv);
    });
}

function sortMotifs()
{
    allMotifsDiv.innerHTML = "";

    switch (sortInput.value)
    {
        case "soundtrack": default:
            sortBySoundtrack(sortDesc.checked);
            break;

        case "alphabetical":
            sortAlphabetically(sortDesc.checked);
            break;
        
        case "song":
            sortSong(sortDesc.checked);
            break;
        
        case "ref":
            sortRef(sortDesc.checked);
            break;
    }
}

sortBySoundtrack();
sortInput.addEventListener("change", sortMotifs);
sortDesc.addEventListener("change", sortMotifs);

sortInput.value = "soundtrack";
sortDesc.checked = false;

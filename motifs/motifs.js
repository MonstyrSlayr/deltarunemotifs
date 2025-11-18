import { allMotifs, allSongs, createMotifDiv, getSongsWithMotif } from "../data.js";

const allMotifsDiv = document.getElementById("motifList");

// sort motif by order they appear in the song list
// if they don't appear, kill self
allMotifs.sort((a, b) =>
{
    if (!getSongsWithMotif(a) && !getSongsWithMotif(b)) return 0;
    if (!getSongsWithMotif(a)) return 1;
    if (!getSongsWithMotif(b)) return -1;

    // stupid
    for (const song of allSongs)
    {
        for (const motifRef of song.motifRefs)
        {
            if (motifRef.motif == a) return -1;
            if (motifRef.motif == b) return 1;
        }
    }

    return 0;
})

const allMotifIds = new Set();
for (const motif of allMotifs)
{
    allMotifIds.add(motif.id);
}

allMotifIds.forEach(motifId =>
{
    const motifDiv = createMotifDiv(motifId, true, true);
    allMotifsDiv.appendChild(motifDiv);
});

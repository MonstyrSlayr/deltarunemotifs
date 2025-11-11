import { allMotifs, createMotifDiv } from "../data.js";

const allMotifsDiv = document.getElementById("motifList");

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

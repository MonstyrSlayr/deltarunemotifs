import { allMotifs } from "../data.js";

const allMotifsDiv = document.getElementById("motifsDiv");

const uniqueMotifs = [];

allMotifs.forEach(motif =>
{
    let isUnique = true;
    uniqueMotifs.forEach(uMotif =>
    {
        if (uMotif.id == motif.id)
        {
            isUnique = false;
        }
    });

    if (isUnique)
    {
        uniqueMotifs.push(motif);
    }
});

uniqueMotifs.forEach(motif =>
{
    const anchor = document.createElement("a");
    anchor.classList.add("bigLink");
    anchor.href = "./" + motif.id;
    allMotifsDiv.appendChild(anchor);

        const motifName = document.createElement("h2");
        motifName.textContent = motif.name;
        anchor.appendChild(motifName);
});

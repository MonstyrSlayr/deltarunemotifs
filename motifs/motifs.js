import { allMotifs } from "../data.js";

const allMotifsDiv = document.getElementById("motifsDiv");

allMotifs.forEach(motif =>
{
    const anchor = document.createElement("a");
    anchor.classList.add("bigLink");
    anchor.href = "./" + motif.id;
    allMotifsDiv.appendChild(anchor);

        const motifName = document.createElement("h2");
        motifName.textContent = motif.name;
        anchor.appendChild(motifName);
});

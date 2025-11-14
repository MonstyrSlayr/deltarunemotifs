import { exportIdsToTxt, isLiveServer, allMotifs, allSongs } from "../data.js";

if (isLiveServer())
{
    document.getElementById("liveServerStuff").classList.remove("gone");
}

document.getElementById("downloadIds").addEventListener("click", () =>
{
    exportIdsToTxt(allMotifs, "motifids.txt");
    exportIdsToTxt(allSongs, "songids.txt");
});

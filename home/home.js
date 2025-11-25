import { exportIdsToJson, isLiveServer, allMotifs, allSongs } from "../data.js";

if (isLiveServer())
{
    document.getElementById("liveServerStuff").classList.remove("gone");
}

document.getElementById("downloadIds").addEventListener("click", () =>
{
    exportIdsToJson(allMotifs, "motifs.json");
    exportIdsToJson(allSongs, "songs.json");
});

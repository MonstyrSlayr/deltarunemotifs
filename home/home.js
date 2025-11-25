import { exportObjectsToJson, isLiveServer, allMotifs, allSongs } from "../data.js";

if (isLiveServer())
{
    document.getElementById("liveServerStuff").classList.remove("gone");
}

document.getElementById("downloadIds").addEventListener("click", () =>
{
    exportObjectsToJson(allMotifs, "motifs.json");
    exportObjectsToJson(allSongs, "songs.json");
});

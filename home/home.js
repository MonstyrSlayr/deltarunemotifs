import { exportObjectsToJson, isLiveServer } from "../data.js";
import { allMotifs } from "../motifData.js";
import { allSongs } from "../songData.js";

if (isLiveServer())
{
    document.getElementById("liveServerStuff").classList.remove("gone");
}

document.getElementById("downloadIds").addEventListener("click", () =>
{
    exportObjectsToJson(allMotifs, "motifs.json");
    exportObjectsToJson(allSongs, "songs.json");
});

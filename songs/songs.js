import { allSongs } from "../data.js";

const allSongsDiv = document.getElementById("songsDiv");

allSongs.forEach(song =>
{
    const anchor = document.createElement("a");
    anchor.classList.add("bigLink");
    anchor.href = "./" + song.id;
    allSongsDiv.appendChild(anchor);

        const songName = document.createElement("h2");
        songName.textContent = song.name;
        anchor.appendChild(songName);
});

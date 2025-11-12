import { allSongs, createSongDiv } from "../data.js";

const allSongsDiv = document.getElementById("songList");

allSongs.forEach(song =>
{
    const songDiv = createSongDiv(song, true);
    allSongsDiv.appendChild(songDiv);
});

import { allAlbums, allSongs, createSongDiv } from "../songData.js";

const allSongsDiv = document.getElementById("songList");
const sortInput = document.getElementById("sortInput");
const sortDesc = document.getElementById("isDescending");

function getSiblingsAfter(element)
{
    const siblingsAfter = [];
    let current = element.nextElementSibling;
    
    while (current)
    {
        siblingsAfter.push(current);
        current = current.nextElementSibling;
    }
    
    return siblingsAfter;
}

function createAlbumTitleDiv(albumTitle)
{
    const albumTitleDiv = document.createElement("div");
    albumTitleDiv.classList.add("albumTitleDiv");
    allSongsDiv.appendChild(albumTitleDiv);

        const albumTitleHeading = document.createElement("h2");
        albumTitleHeading.textContent = albumTitle;
        albumTitleDiv.appendChild(albumTitleHeading);

        const albumTitleArrow = document.createElement("span");
        albumTitleArrow.textContent = "⌄";
        albumTitleDiv.appendChild(albumTitleArrow);
    
    albumTitleDiv.addEventListener("click", () =>
    {
        let daAfterSib = albumTitleDiv.nextElementSibling;
        if (daAfterSib == null) return;

        const goneMode = !daAfterSib.classList.contains("gone");

        if (goneMode)
        {
            albumTitleDiv.classList.add("collapsed");
        }
        else
        {
            albumTitleDiv.classList.remove("collapsed");
        }

        while (daAfterSib != null && !daAfterSib.classList.contains("albumTitleDiv"))
        {
            if (goneMode)
            {
                daAfterSib.classList.add("gone");
            }
            else
            {
                daAfterSib.classList.remove("gone");
            }

            daAfterSib = daAfterSib.nextElementSibling;
        }
    })
    
    return albumTitleDiv;
}

function sortBySoundtrack(desc = false)
{
    const daAlbums = desc ? [...allAlbums].reverse() : allAlbums;

    daAlbums.forEach(album =>
    {
        const albumTitleDiv = createAlbumTitleDiv(album.name);
        allSongsDiv.appendChild(albumTitleDiv);

        const daArr = desc ? [...album.songs].reverse() : album.songs;

        daArr.forEach(song =>
        {
            const songDiv = createSongDiv(song, true);
            allSongsDiv.appendChild(songDiv);
        });
    });
}

function sortAlphabetically(desc = false)
{
    [...allSongs].sort((a, b) =>
    {
        if (a.name > b.name) return desc ? -1 : 1;
        if (a.name < b.name) return desc ? 1 : -1;
        return 0;
    }).forEach(song =>
    {
        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortMotifCount(desc = false)
{
    let currentCount = null;

    [...allSongs].sort((a, b) =>
    {
        const aMotifs = new Set();
        a.motifRefs.forEach(motifRef =>
        {
            aMotifs.add(motifRef.motif);
        });
        const bMotifs = new Set();
        b.motifRefs.forEach(motifRef =>
        {
            bMotifs.add(motifRef.motif);
        });
        if (aMotifs.size == bMotifs.size) return (a.motifRefs.length - b.motifRefs.length) * (desc ? -1 : 1);
        return (aMotifs.size - bMotifs.size) * (desc ? -1 : 1);
    }).forEach(song =>
    {
        const daMotifs = new Set();
        song.motifRefs.forEach(motifRef =>
        {
            daMotifs.add(motifRef.motif);
        });

        if (daMotifs.size != currentCount)
        {
            currentCount = daMotifs.size;

            const albumTitleDiv = createAlbumTitleDiv("Individual Motif Count: " + currentCount);
            allSongsDiv.appendChild(albumTitleDiv);
        }

        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortMotifIdCount(desc = false)
{
    let currentCount = null;

    [...allSongs].sort((a, b) =>
    {
        const aMotifs = new Set();
        a.motifRefs.forEach(motifRef =>
        {
            aMotifs.add(motifRef.motif.id);
        });
        const bMotifs = new Set();
        b.motifRefs.forEach(motifRef =>
        {
            bMotifs.add(motifRef.motif.id);
        });
        if (aMotifs.size == bMotifs.size) return (a.motifRefs.length - b.motifRefs.length) * (desc ? -1 : 1);
        return (aMotifs.size - bMotifs.size) * (desc ? -1 : 1);
    }).forEach(song =>
    {
        const daMotifs = new Set();
        song.motifRefs.forEach(motifRef =>
        {
            daMotifs.add(motifRef.motif.id);
        });

        if (daMotifs.size != currentCount)
        {
            currentCount = daMotifs.size;

            const albumTitleDiv = createAlbumTitleDiv("Encompassing Motif Count: " + currentCount);
            allSongsDiv.appendChild(albumTitleDiv);
        }

        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortMotifRefCount(desc = false)
{
    [...allSongs].sort((a, b) =>
    {
        return (a.motifRefs.length - b.motifRefs.length) * (desc ? -1 : 1);
    }).forEach(song =>
    {
        const songDiv = createSongDiv(song, true);
        allSongsDiv.appendChild(songDiv);
    });
}

function sortSongs()
{
    allSongsDiv.innerHTML = "";

    switch (sortInput.value)
    {
        case "soundtrack": default:
            sortBySoundtrack(sortDesc.checked);
            break;

        case "alphabetical":
            sortAlphabetically(sortDesc.checked);
            break;
        
        case "motif":
            sortMotifCount(sortDesc.checked);
            break;
        
        case "motifId":
            sortMotifIdCount(sortDesc.checked);
            break;
        
        case "motifRef":
            sortMotifRefCount(sortDesc.checked);
            break;
    }
}

sortInput.addEventListener("change", sortSongs);
sortDesc.addEventListener("change", sortSongs);

sortInput.value = "soundtrack";
sortDesc.checked = false;
sortBySoundtrack();

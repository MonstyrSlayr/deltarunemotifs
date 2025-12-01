import { allContributors, ICONSIMGLINK } from "../contribData.js";
import { createSongDiv, getSongsWithContributor } from "../songData.js";

const contribDiv = document.getElementById("contribList");

function createImgLink(link, svg)
{
    const daLink = document.createElement("a");
    daLink.href = link;
    daLink.target = "_blank";

        const daImg = document.createElement("img");
        daImg.src = svg;
        daLink.appendChild(daImg);

    return daLink;
}

for (const contrib of allContributors)
{
    const daDiv = document.createElement("div");
    daDiv.classList.add("contribDiv");
    contribDiv.appendChild(daDiv);

        if (contrib.image != null)
        {
            const contribImg = document.createElement("img");
            contribImg.src = contrib.image;
            contribImg.classList.add("contribImg");
            daDiv.appendChild(contribImg);
        }

        const contribName = document.createElement("h2");
        contribName.textContent = contrib.name;
        daDiv.appendChild(contribName);

        const linksDiv = document.createElement("div");
        linksDiv.classList.add("linksDiv");
        daDiv.appendChild(linksDiv);

        if (contrib.youtube)
        {
            const youtubeLink = createImgLink(contrib.youtube, ICONSIMGLINK + "youtube.svg");
            linksDiv.appendChild(youtubeLink);
        }

        if (contrib.discord)
        {
            const discordLink = createImgLink(contrib.discord, ICONSIMGLINK + "discord.svg");
            linksDiv.appendChild(discordLink);
        }

        if (contrib.github)
        {
            const githubLink = createImgLink(contrib.github, ICONSIMGLINK + "github.svg");
            linksDiv.appendChild(githubLink);
        }

        const contribDesc = document.createElement("p");
        contribDesc.textContent = contrib.credit;
        daDiv.appendChild(contribDesc);

        if (contrib.showSongs)
        {
            const songList = document.createElement("div");
            songList.classList.add("songList");
            daDiv.appendChild(songList);

            for (const song of getSongsWithContributor(contrib))
            {
                const songDiv = createSongDiv(song);
                songList.appendChild(songDiv);
            }
        }
}

const footers = document.getElementsByTagName("footer");

if (footers)
{
    const footer = footers[0];

    const infoStuff = document.createElement("h3");
    infoStuff.innerHTML = `
        <p>This website is not officially associated with UNDERTALE, DELTARUNE, or Toby Fox.</p>
        <p>Any issues, inquiries, and feedback can go to <a href="https://discord.com/channels/@me/434840883637125121" target="_blank">@MonstyrSlayr on Discord</a></p>
        <p><a href="https://github.com/MonstyrSlayr/deltarunemotifs" target="_blank">Source Code</a></p>
    `
    footer.appendChild(infoStuff);
}

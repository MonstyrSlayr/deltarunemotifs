export function normalizeAndTrim(str)
{
    return str
        .normalize("NFD")                  // decompose accented characters
        .replace(/[\u0300-\u036f]/g, "")   // remove diacritical marks
        .replace(/[^a-z0-9]/gi, "")        // remove non alphanumeric characters
        .toLowerCase();                    // take a wild guess
}

export function formatTime(seconds)
{
    seconds = Math.floor(seconds);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ":" + (s < 10 ? "0" + s : s);
}

export const LINK = isLiveServer() ? "http://127.0.0.1:5500/" : "https://monstyrslayr.github.io/deltarunemotifs/";
export const IMGLINK = LINK + "img/";

export function isLiveServer()
{
    return location.hostname === "127.0.0.1" || location.hostname === "localhost";
}

export function exportObjectsToJson(data, filename = "data.json")
{
    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

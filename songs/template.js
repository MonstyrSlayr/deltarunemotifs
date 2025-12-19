import { isLiveServer, formatTime } from "../data.js";
import { getMotifsById } from "../motifData.js";
import { createMotifDiv, createSongDiv, getSongById } from "../songData.js";

let isDragging = false; // maus

let players = {}; // store players by videoId
let updateIntervals = {};

let prev = null;
let trueSeek = 0;

let osciPlayerCount = 3;
let activePlayer = 0; // dumb

const SONG_OFFSET = 0.15; // account for css bullshit

function getLastFolder(url, num)
{
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(part => part !== '').filter(part => part !== 'index.html'); // Split and remove empty elements and index.html
    return parts[parts.length - num];
}

const daId = getLastFolder(window.location.href, 1);
const daSong = getSongById(daId);
if (!daSong) { console.error("error: song not found"); };

const videoId = daSong.youtubeId;

const header = document.getElementById("songName");
header.textContent = daSong.name;

const songList = document.getElementById("songList");
const songDiv = createSongDiv(daSong, false);
songList.appendChild(songDiv);

const container = document.getElementById("mainMusicContainer");

// create card
const card = document.createElement("div");
card.classList.add("audioCard");
container.appendChild(card);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("imageContainer");
    card.appendChild(imageContainer);

        // cover art
        const cover = document.createElement("img");
        cover.classList.add("coverArt");
        cover.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        imageContainer.appendChild(cover);

        // controls
        const controls = document.createElement("div");
        controls.classList.add("controls");
        imageContainer.appendChild(controls);

            const playBtn = document.createElement("button");
            playBtn.textContent = "▶";
            const pauseBtn = document.createElement("button");
            pauseBtn.classList.add("gone");
            pauseBtn.textContent = "⏸";

            controls.appendChild(playBtn);
            controls.appendChild(pauseBtn);
    
    // timebar
    const timebarContainer = document.createElement("div");
    timebarContainer.classList.add("timebarContainer");
    timebarContainer.classList.add("mainTime");
    card.appendChild(timebarContainer);

    const timebarProgress = document.createElement("div");
    timebarProgress.classList.add("timebarProgress");
    timebarContainer.appendChild(timebarProgress);

    switch (daSong.mainMotifs.length)
    {
        case 0: default:
            break;

        case 1:
            cover.style.borderColor = daSong.mainMotifs[0].color;
            cover.style.backgroundColor = daSong.mainMotifs[0].color2;
            playBtn.style.backgroundColor = daSong.mainMotifs[0].color;
            pauseBtn.style.backgroundColor = daSong.mainMotifs[0].color;
            break;

        case 2:
            cover.style.borderTopColor = daSong.mainMotifs[0].color;
            cover.style.borderLeftColor = daSong.mainMotifs[0].color;
            cover.style.borderBottomColor = daSong.mainMotifs[1].color;
            cover.style.borderRightColor = daSong.mainMotifs[1].color;

            cover.style.background = `
                linear-gradient(
                    to bottom right,
                    ${daSong.mainMotifs[0].color2},
                    ${daSong.mainMotifs[1].color2}
                )
            `;
            playBtn.style.backgroundColor = daSong.mainMotifs[0].color;
            pauseBtn.style.backgroundColor = daSong.mainMotifs[0].color;
            break;
    }

    // time labels
    const timeLabels = document.createElement("div");
    timeLabels.classList.add("timeLabels");
    card.appendChild(timeLabels);
    
        const currentTimeLabel = document.createElement("span");
        const durationLabel = document.createElement("span");
        currentTimeLabel.textContent = "0:00";
        durationLabel.textContent = "0:00";
        timeLabels.appendChild(currentTimeLabel);
        timeLabels.appendChild(durationLabel);

    const allMotifs = new Set();
    const allMotifIds = new Set();
    for (const motifRef of daSong.motifRefs)
    {
        allMotifs.add(motifRef.motif);
        allMotifIds.add(motifRef.motif.id);
    }

    const allEffectsSet = new Set();
    for (const effect of daSong.effectRefs)
    {
        allEffectsSet.add(effect.type);
    }

    const allEffects = [...allEffectsSet];

// initialize YouTube player
function onReady()
{
    for (let i = 0; i < osciPlayerCount; i++)
    {
        // hidden YouTube iframe
        const playerDiv = document.createElement("div");
        playerDiv.id = "yt" + videoId + i;
        playerDiv.style.display = "none";
        card.appendChild(playerDiv);

        const playerNum = i;
        const playerId = videoId + playerNum;

        players[playerId] = new YT.Player(playerDiv.id,
        {
            videoId: videoId,
            height: '0',
            width: '0',
            playerVars: {
                'playsinline': 1,
            },
            events:
            {
                'onReady': (event) =>
                {
                    if (activePlayer == playerNum)
                    {
                        const duration = daSong.loopPoint == null ? event.target.getDuration() : daSong.loopPoint;
                        durationLabel.textContent = formatTime(duration);

                        const motifList = document.getElementById("motifList");

                        allMotifIds.forEach(motifId =>
                        {
                            const motifDiv = createMotifDiv(motifId);
                            motifList.appendChild(motifDiv);
                        });

                        allMotifs.forEach(motif =>
                        {
                            // add motif to bars

                            const motifbarContainer = document.createElement("div");
                            motifbarContainer.classList.add("timebarContainer");
                            motifbarContainer.classList.add("motifTime");
                            motifbarContainer.style.backgroundColor = motif.color2;
                            card.appendChild(motifbarContainer);

                            let previousMotifEndTime = 0;

                            for (const motifRef of daSong.motifRefs.filter(ref => ref.motif == motif))
                            {
                                // each individual reference

                                if (motifRef.endTime == "end") motifRef.endTime = duration;

                                const gapDuration = motifRef.startTime - previousMotifEndTime;

                                if (gapDuration > 0)
                                {
                                    const barGap = document.createElement("div");
                                    barGap.classList.add("timebarGap");
                                    motifbarContainer.appendChild(barGap);

                                    const gapPercent = (gapDuration / duration) * 100;
                                    barGap.style.width = gapPercent + "%";
                                }

                                const motifDuration = motifRef.endTime - motifRef.startTime;

                                const motifRefBar = document.createElement("div");
                                motifRefBar.classList.add("timebarProgress");
                                if (motifRef.isVariation) motifRefBar.classList.add("variation");
                                motifRefBar.style.backgroundColor = motif.color;
                                motifbarContainer.appendChild(motifRefBar);
                                
                                const motifPercent = (motifDuration / duration) * 100;
                                motifRefBar.style.width = motifPercent + "%";
                                previousMotifEndTime = motifRef.endTime;

                                motifRefBar.addEventListener("click", () =>
                                {
                                    const activePlayerId = videoId + activePlayer;
                                    players[activePlayerId].seekTo(motifRef.startTime, true);
                                    players[activePlayerId].playVideo();
                                    trueSeek = motifRef.startTime;
                                });
                            }

                            const motifLabel = document.createElement("div");
                            motifLabel.textContent = motif.toString();
                            motifLabel.classList.add("timeLabels");
                            card.appendChild(motifLabel);
                        });

                        allEffects.forEach(effect =>
                        {
                            effect.onLoad();
                        });
                    }
                },
                'onStateChange': (event) =>
                {
                    if (activePlayer == playerNum)
                    {
                        if (event.data === YT.PlayerState.PLAYING)
                        {
                            playBtn.classList.add("gone");
                            pauseBtn.classList.remove("gone");

                            updateIntervals[playerId] = setInterval(() =>
                            {
                                const current = players[playerId].getCurrentTime();
                                const duration = daSong.loopPoint == null ? players[playerId].getDuration() : daSong.loopPoint;

                                if (daSong.loopPoint != null)
                                {
                                    const nextPlayer = (activePlayer + 1) % osciPlayerCount;
                                    const nextPlayerId = videoId + nextPlayer;

                                    // REALLY stupid
                                    players[nextPlayerId].seekTo(0, true);
                                    players[nextPlayerId].mute();

                                    if (current >= daSong.loopPoint)
                                    {
                                        activePlayer = nextPlayer;

                                        players[nextPlayerId].unMute();
                                        players[nextPlayerId].playVideo();

                                        clearInterval(updateIntervals[playerId]);
                                    }
                                }

                                if (!isDragging)
                                {
                                    const percent = (current / duration) * 100;
                                    timebarProgress.style.width = percent + "%";
                                }
                                currentTimeLabel.textContent = formatTime(current);

                                allMotifIds.forEach(motifId =>
                                {
                                    let bigPlaying = false;

                                    const motifsWithId = getMotifsById(motifId);

                                    motifsWithId.forEach(motif =>
                                    {
                                        let playing = false;
                                        let variation = false;

                                        for (const motifRef of daSong.motifRefs.filter(ref => ref.motif == motif))
                                        {
                                            if (current >= motifRef.startTime - SONG_OFFSET && current < motifRef.endTime - SONG_OFFSET)
                                            {
                                                bigPlaying = true;
                                                playing = true;
                                                variation = motifRef.isVariation;
                                                break;
                                            }
                                        }

                                        if (motif.letterDiv)
                                        {
                                            if (playing)
                                            {
                                                motif.letterDiv.classList.add("playing");
                                            }
                                            else
                                            {
                                                motif.letterDiv.classList.remove("playing");
                                            }
                                        }

                                        if (variation)
                                        {
                                            motif.variationDiv.classList.add("playing");
                                        }
                                        else
                                        {
                                            motif.variationDiv.classList.remove("playing");
                                        }
                                    });

                                    if (bigPlaying)
                                    {
                                        motifsWithId[0].mainDiv.classList.add("playing");

                                        if (motifsWithId[0].imagePlaying != null && motifsWithId[0].mainDiv.image != null)
                                        {
                                            motifsWithId[0].mainDiv.image.classList.add("gone");
                                            motifsWithId[0].mainDiv.imagePlaying.classList.remove("gone");
                                        }
                                    }
                                    else
                                    {
                                        motifsWithId[0].mainDiv.classList.remove("playing");

                                        if (motifsWithId[0].imagePlaying != null && motifsWithId[0].mainDiv.image != null)
                                        {
                                            motifsWithId[0].mainDiv.image.classList.remove("gone");
                                            motifsWithId[0].mainDiv.imagePlaying.classList.add("gone");
                                        }
                                    }
                                });

                                [...allEffects].filter(effect => !effect.isOneshot).forEach(effect =>
                                {
                                    let playing = false;

                                    for (const effectRef of daSong.effectRefs.filter(ref => ref.type == effect))
                                    {
                                        if (current >= effectRef.startTime && current < effectRef.endTime)
                                        {
                                            playing = true;

                                            if (effect.onIntermediate != null)
                                            {
                                                effect.onIntermediate((current - effectRef.startTime) / (effectRef.endTime - effectRef.startTime));
                                            }
                                        }
                                    }

                                    if (playing)
                                    {
                                        effect.onActive();
                                    }
                                    else
                                    {
                                        effect.onDeactive();
                                    }
                                });

                                [...allEffects].filter(effect => effect.isOneshot).forEach(effect =>
                                {
                                    for (const effectRef of daSong.effectRefs.filter(ref => ref.type == effect))
                                    {
                                        if ((trueSeek == null && prev!= null && current > effectRef.startTime && prev <= effectRef.startTime)
                                        || trueSeek == effectRef.startTime)
                                        {
                                            effect.onDeactive();
                                            effect.onActive();
                                        }
                                    }
                                });

                                trueSeek = null;
                                prev = current;
                            }, 15);
                        }
                        else
                        {
                            pauseBtn.classList.add("gone");
                            playBtn.classList.remove("gone");

                            clearInterval(updateIntervals[playerId]);
                            prev = null;
                        }
                    }
                    else
                    {
                        clearInterval(updateIntervals[playerId]);
                    }
                }
            }
        });
    }
}

// If API ready, init now, else defer
if (window.YT && window.YT.Player)
{
    onReady();
}
else
{
    window.onYouTubeIframeAPIReady = onReady;
}

function playOrPause()
{
    const activePlayerId = videoId + activePlayer;
    const playerState = players[activePlayerId].getPlayerState();
            
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (playerState === 1)
    {
        players[activePlayerId].pauseVideo();

        allEffects.filter(effect => effect.isOneshot).forEach(effect =>
        {
            if (effect.deactivateOnPause)
            {
                setTimeout(() =>
                {
                    effect.onDeactive();
                }, 20);
            }
        });
    }
    else if (playerState === 2 || playerState === 5)
    {
        players[activePlayerId].playVideo();
    }
}

cover.addEventListener("click", function()
{
    playOrPause();
});

window.addEventListener('keydown', function(keyevent)
{
    const activePlayerId = videoId + activePlayer;

    if (['Space', 'ArrowLeft', 'ArrowRight'].includes(keyevent.code))
    {
        keyevent.preventDefault();
    }

    switch (keyevent.code)
    {
        case 'Space': case 'KeyK':
            playOrPause();
            break;
        
        case 'ArrowLeft':
            players[activePlayerId].seekTo(players[activePlayerId].getCurrentTime() - 5, true);
            break;

        case 'ArrowRight':
            players[activePlayerId].seekTo(players[activePlayerId].getCurrentTime() + 5, true);
            break;
        
        case 'KeyJ':
            players[activePlayerId].seekTo(players[activePlayerId].getCurrentTime() - 10, true);
            break;

        case 'KeyL':    
            players[activePlayerId].seekTo(players[activePlayerId].getCurrentTime() + 10, true);
            break;
    }
});

// Button actions
playBtn.onclick = () =>
{
    const activePlayerId = videoId + activePlayer;
    players[activePlayerId].playVideo()
};
pauseBtn.onclick = () =>
{
    const activePlayerId = videoId + activePlayer;
    players[activePlayerId].pauseVideo();
}

// Seek when clicking timebar
timebarContainer.addEventListener("click", (e) =>
{
    seekVideo(e);
});

// Seek when clicking or dragging timebar
timebarContainer.addEventListener("mousedown", (e) =>
{
    isDragging = true;
    updateProgress(e); // update immediately when click starts
});

window.addEventListener("mousemove", (e) =>
{
    if (isDragging)
    {
        updateProgress(e); // show preview while dragging
    }
});

window.addEventListener("mouseup", (e) =>
{
    if (isDragging)
    {
        isDragging = false;
        seekVideo(e); // finalize seek
    }
});

function updateProgress(e)
{
    const rect = timebarContainer.getBoundingClientRect();
    const clickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const percent = clickX / rect.width;
    timebarProgress.style.width = (percent * 100) + "%"; // show fill as preview
}

function seekVideo(e)
{
    const activePlayerId = videoId + activePlayer;
    const rect = timebarContainer.getBoundingClientRect();
    const clickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const percent = clickX / rect.width;
    const duration = daSong.loopPoint == null ? players[activePlayerId].getDuration() : daSong.loopPoint;
    players[activePlayerId].seekTo(duration * percent, true);
    trueSeek = duration * percent;
    players[activePlayerId].playVideo();
}

// for recording
if (isLiveServer())
{
    document.getElementsByTagName("footer")[0].classList.add("gone");
    const spaceDiv = document.createElement("div");
    spaceDiv.style.margin = "5em";
    document.body.appendChild(spaceDiv);
}

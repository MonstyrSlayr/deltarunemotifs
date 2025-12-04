import { formatTime } from "../data.js";
import { getMotifById, getMotifsById } from "../motifData.js";
import { createMotifDiv, createSongDiv, getSongsWithMotif } from "../songData.js";

function getLastFolder(url, num)
{
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(part => part !== '').filter(part => part !== 'index.html'); // Split and remove empty elements and index.html
    return parts[parts.length - num]; // Return the last part
}

const daId = getLastFolder(window.location.href, 1);
const daMotif = getMotifById(daId);
if (!daMotif) /* cry */;

const header = document.getElementById("motifName");
header.textContent = daMotif.name;

const motifList = document.getElementById("motifList");
const offMotifDiv = createMotifDiv(daId, false, false);
motifList.appendChild(offMotifDiv);
const onMotifDiv = createMotifDiv(daId, false, true);
motifList.appendChild(onMotifDiv);

let players = {}; // store players by videoId
let updateIntervals = {};
const SONG_OFFSET = 0.15;
const readyCallbacks = [];
let isDragging = null;
let activePlayer = null;

function addYouTubeReadyCallback(fn)
{
    readyCallbacks.push(fn);
}

function createMotifRefDiv(daSong, daMotifs)
{
    const daId = daSong.id + daMotifs.toString();

    const bigDiv = document.createElement("div");
    bigDiv.classList.add("motifRefDiv");

        const someDiv = document.createElement("div");
        someDiv.classList.add("motifRefPlayDiv");
        bigDiv.appendChild(someDiv);

            const daSongDiv = createSongDiv(daSong, true);
            someDiv.appendChild(daSongDiv);

            const controls = document.createElement("div");
            controls.classList.add("controlsSmall");
            someDiv.appendChild(controls);

                const playBtn = document.createElement("button");
                playBtn.textContent = "▶";
                const pauseBtn = document.createElement("button");
                pauseBtn.classList.add("gone");
                pauseBtn.textContent = "⏸";

                controls.appendChild(playBtn);
                controls.appendChild(pauseBtn);

        const card = document.createElement("div");
        card.classList.add("cardSmall");
        bigDiv.appendChild(card);
            
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
                    playBtn.style.backgroundColor = daSong.mainMotifs[0].color;
                    pauseBtn.style.backgroundColor = daSong.mainMotifs[0].color;
                    break;

                case 2:
                    playBtn.style.backgroundColor = daSong.mainMotifs[0].color;
                    pauseBtn.style.backgroundColor = daSong.mainMotifs[0].color;
                    break;
            }
        
        const timeLabels = document.createElement("div");
        timeLabels.classList.add("timeLabels");
        card.appendChild(timeLabels);
        
            const currentTimeLabel = document.createElement("span");
            const durationLabel = document.createElement("span");
            currentTimeLabel.textContent = "0:00";
            durationLabel.textContent = "0:00";
            timeLabels.appendChild(currentTimeLabel);
            timeLabels.appendChild(durationLabel);
        
        const playerDiv = document.createElement("div");
        playerDiv.id = "yt" + daId;
        playerDiv.style.display = "none";
        card.appendChild(playerDiv);
    
        function onReady()
        {
            players[daId] = new YT.Player(playerDiv.id,
            {
                videoId: daSong.youtubeId,
                height: '0',
                width: '0',
                playerVars: {
                    'playsinline': 1,
                    'loop': 1,
                    'playlist': daSong.youtubeId, // why youtube why
                },
                events:
                {
                    'onReady': (event) =>
                    {
                        const duration = daSong.loopPoint == null ? event.target.getDuration() : daSong.loopPoint;
                        durationLabel.textContent = formatTime(duration);

                        daMotifs.forEach(motif =>
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
                                    players[daId].seekTo(motifRef.startTime, true);
                                    players[daId].playVideo();
                                    activePlayer = daId;
                                    pauseAllExcept(daId);
                                });
                            }

                            const motifLabel = document.createElement("div");
                            motifLabel.textContent = motif.toString();
                            motifLabel.classList.add("timeLabels");
                            card.appendChild(motifLabel);
                        });
                    },
                    'onStateChange': (event) =>
                    {
                        if (event.data === YT.PlayerState.PLAYING)
                        {
                            playBtn.classList.add("gone");
                            pauseBtn.classList.remove("gone");

                            updateIntervals[daId] = setInterval(() =>
                            {
                                const current = players[daId].getCurrentTime();
                                const duration = daSong.loopPoint == null ? players[daId].getDuration() : daSong.loopPoint;

                                if (daSong.loopPoint != null)
                                {
                                    if (current >= daSong.loopPoint)
                                    {
                                        players[daId].seekTo(0, true);
                                        players[daId].playVideo();
                                        pauseAllExcept(daId);
                                    }
                                }

                                if (!isDragging)
                                {
                                    const percent = (current / duration) * 100;
                                    timebarProgress.style.width = percent + "%";
                                }
                                currentTimeLabel.textContent = formatTime(current);

                                daMotifs.forEach(motif =>
                                {
                                    let playing = false;
                                    let variation = false;

                                    for (const motifRef of daSong.motifRefs.filter(ref => ref.motif == motif))
                                    {
                                        if (current >= motifRef.startTime - SONG_OFFSET && current < motifRef.endTime - SONG_OFFSET)
                                        {
                                            playing = true;
                                            variation = motifRef.isVariation;
                                            break;
                                        }
                                    }

                                    if (playing)
                                    {
                                        // motif.letterDiv.classList.add("playing");
                                    }
                                    else
                                    {
                                        // motif.letterDiv.classList.remove("playing");
                                    }

                                    if (variation)
                                    {
                                        // motif.variationDiv.classList.add("playing");
                                    }
                                    else
                                    {
                                        // motif.variationDiv.classList.remove("playing");
                                    }
                                });
                            }, 15);
                        }
                        else
                        {
                            pauseBtn.classList.add("gone");
                            playBtn.classList.remove("gone");

                            clearInterval(updateIntervals[daId]);
                        }
                    }
                }
            });
        }

        addYouTubeReadyCallback(onReady);

        // Button actions
        playBtn.onclick = () => {players[daId].playVideo(); pauseAllExcept(daId); activePlayer = daId;};
        pauseBtn.onclick = () => {players[daId].pauseVideo(); activePlayer = daId;};

        // Seek when clicking timebar
        timebarContainer.addEventListener("click", (e) =>
        {
            seekVideo(e);
            pauseAllExcept(daId);
        });

        // Seek when clicking or dragging timebar
        timebarContainer.addEventListener("mousedown", (e) =>
        {
            isDragging = daId;
            updateProgress(e); // update immediately when click starts
        });

        window.addEventListener("mousemove", (e) =>
        {
            if (isDragging == daId)
            {
                updateProgress(e); // show preview while dragging
            }
        });

        window.addEventListener("mouseup", (e) =>
        {
            if (isDragging == daId)
            {
                isDragging = null;
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
            const rect = timebarContainer.getBoundingClientRect();
            const clickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
            const percent = clickX / rect.width;
            const duration = daSong.loopPoint == null ? players[daId].getDuration() : daSong.loopPoint;
            players[daId].seekTo(duration * percent, true);
            players[daId].playVideo();
            pauseAllExcept(daId);
            activePlayer = daId;
        }
    
    return bigDiv;
}

function pauseAllExcept(daPlayerId)
{
    for (const playerId of Object.keys(players))
    {
        if (playerId == daPlayerId) continue;
        players[playerId].pauseVideo();
    }
}

function playOrPause(playerId)
{
    const playerState = players[playerId].getPlayerState();
            
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (playerState === 1)
    {
        players[playerId].pauseVideo();
    }
    else if (playerState === 2 || playerState === 5)
    {
        players[playerId].playVideo();
    }
}

window.addEventListener('keydown', function(keyevent)
{
    if (['Space', 'ArrowLeft', 'ArrowRight'].includes(keyevent.code))
    {
        keyevent.preventDefault();
    }

    switch (keyevent.code)
    {
        case 'Space': case 'KeyK':
            playOrPause(activePlayer);
            break;
        
        case 'ArrowLeft':
            players[activePlayer].seekTo(players[activePlayer].getCurrentTime() - 5, true);
            break;

        case 'ArrowRight':
            players[activePlayer].seekTo(players[activePlayer].getCurrentTime() + 5, true);
            break;
        
        case 'KeyJ':
            players[activePlayer].seekTo(players[activePlayer].getCurrentTime() - 10, true);
            break;

        case 'KeyL':    
            players[activePlayer].seekTo(players[activePlayer].getCurrentTime() + 10, true);
            break;
    }
});

function onYouTubeIframeAPIReady()
{
    readyCallbacks.forEach(fn => fn());
}

if (window.YT && window.YT.Player)
{
    onYouTubeIframeAPIReady();
}
else
{
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
}

const daMotifSep = document.getElementById("motifSep");

getMotifsById(daMotif.id).forEach(motif =>
{
    const personalDiv = document.createElement("div");
    daMotifSep.appendChild(personalDiv);

        const daHead = document.createElement("h2");
        daHead.textContent = `Songs with ${motif.toString()}`;
        personalDiv.appendChild(daHead);

        if (motif.aliases.length > 0)
        {
            const daAliases = document.createElement("h3");
            daAliases.textContent = "Also Known As:";
            personalDiv.appendChild(daAliases);

            for (const alias of motif.aliases)
            {
                const heyEveryPacifier = document.createElement("h3");
                heyEveryPacifier.textContent = alias;
                personalDiv.appendChild(heyEveryPacifier);
            }
        }

        const daSongsDiv = document.createElement("div");
        daSongsDiv.classList.add("songList");
        personalDiv.appendChild(daSongsDiv);

            getSongsWithMotif(motif).forEach(song => {
                const songDiv = createMotifRefDiv(song, [motif]);
                daSongsDiv.appendChild(songDiv);
            });
});

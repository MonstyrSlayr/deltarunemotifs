import { catswing } from "./data.js";

let players = {}; // store players by videoId
let updateIntervals = {};

function formatPageForSong(daSong)
{
    const videoId = daSong.youtubeId;

    const header = document.getElementById("songName");
    header.textContent = daSong.name;

    const container = document.getElementById("musicContainer");

    // Create card
    const card = document.createElement("div");
    card.className = "audioCard";
    container.appendChild(card);

        const imageContainer = document.createElement("div");
        imageContainer.className = "imageContainer";
        card.appendChild(imageContainer);

            // Cover art
            const img = document.createElement("img");
            img.className = "coverArt";
            img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            imageContainer.appendChild(img);

            // Controls
            const controls = document.createElement("div");
            controls.className = "controls";
            imageContainer.appendChild(controls);

                const playBtn = document.createElement("button");
                playBtn.textContent = "▶";
                const pauseBtn = document.createElement("button");
                pauseBtn.textContent = "⏸";

                controls.appendChild(playBtn);
                controls.appendChild(pauseBtn);

        // Timebar
        const timebarContainer = document.createElement("div");
        timebarContainer.classList.add("timebarContainer");
        timebarContainer.classList.add("mainTime");
        card.appendChild(timebarContainer);

        const timebarProgress = document.createElement("div");
        timebarProgress.className = "timebarProgress";
        timebarContainer.appendChild(timebarProgress);

        // Time labels
        const timeLabels = document.createElement("div");
        timeLabels.className = "timeLabels";
        card.appendChild(timeLabels);
        
            const currentTimeLabel = document.createElement("span");
            const durationLabel = document.createElement("span");
            currentTimeLabel.textContent = "0:00";
            durationLabel.textContent = "0:00";
            timeLabels.appendChild(currentTimeLabel);
            timeLabels.appendChild(durationLabel);

        const allMotifs = new Set();
        for (const motifRef of daSong.motifs)
        {
            allMotifs.add(motifRef.motif);
        }

        // Hidden YouTube iframe
        const playerDiv = document.createElement("div");
        playerDiv.id = "yt" + videoId;
        playerDiv.style.display = "none";
        card.appendChild(playerDiv);

    // Helper: format seconds -> M:SS
    function formatTime(seconds)
    {
        seconds = Math.floor(seconds);
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + ":" + (s < 10 ? "0" + s : s);
    }

    // Initialize YouTube player
    function onReady()
    {
        players[videoId] = new YT.Player(playerDiv.id,
        {
            videoId: videoId,
            height: '0',
            width: '0',
            playerVars: {
                'playsinline': 1,
                'loop': 1,
                'playlist': videoId, // why youtube why
            },
            events:
            {
                'onReady': (event) =>
                {
                    const duration = event.target.getDuration();
                    durationLabel.textContent = formatTime(duration);

                    const motifList = document.getElementById("motifList");

                    allMotifs.forEach(motif =>
                    {
                        // add motif to list

                        const daLi = document.createElement("li");
                        motifList.appendChild(daLi);

                            const liName = document.createElement("h3");
                            liName.textContent = motif.name;
                            daLi.appendChild(liName);

                            const liSoul = document.createElement("img");
                            liSoul.src = "./img/soul.png";
                            motif.soul = liSoul;
                            daLi.appendChild(liSoul);

                        // add motif to bars

                        const motifbarContainer = document.createElement("div");
                        motifbarContainer.classList.add("timebarContainer");
                        motifbarContainer.classList.add("motifTime");
                        card.appendChild(motifbarContainer);

                        let previousMotifEndTime = 0;

                        for (const motifRef of daSong.motifs.filter(ref => ref.motif == motif))
                        {
                            // each individual reference

                            if (motifRef.endTime == "end") motifRef.endTime = duration;

                            const gapDuration = motifRef.startTime - previousMotifEndTime;

                            if (gapDuration > 0)
                            {
                                const barGap = document.createElement("div");
                                barGap.className = "timebarGap";
                                motifbarContainer.appendChild(barGap);

                                const gapPercent = (gapDuration / duration) * 100;
                                barGap.style.width = gapPercent + "%";
                            }

                            const motifDuration = motifRef.endTime - motifRef.startTime;

                            const motifRefBar = document.createElement("div");
                            motifRefBar.className = "timebarProgress";
                            motifbarContainer.appendChild(motifRefBar);
                            
                            const motifPercent = (motifDuration / duration) * 100;
                            motifRefBar.style.width = motifPercent + "%";
                            previousMotifEndTime = motifRef.endTime;

                            motifRefBar.addEventListener("click", () =>
                            {
                                players[videoId].seekTo(motifRef.startTime, true);
                                players[videoId].playVideo();
                            });
                        }

                        const motifLabel = document.createElement("div");
                        motifLabel.textContent = motif.name;
                        motifLabel.className = "timeLabels";
                        card.appendChild(motifLabel);
                    });
                },
                'onStateChange': (event) =>
                {
                    if (event.data === YT.PlayerState.PLAYING)
                    {
                        updateIntervals[videoId] = setInterval(() =>
                        {
                            const current = players[videoId].getCurrentTime();
                            const duration = players[videoId].getDuration();
                            const percent = (current / duration) * 100;
                            timebarProgress.style.width = percent + "%";
                            currentTimeLabel.textContent = formatTime(current);

                            allMotifs.forEach(motif =>
                            {
                                if (motif.soul != null)
                                {
                                    let playing = false;

                                    for (const motifRef of daSong.motifs.filter(ref => ref.motif == motif))
                                    {
                                        if (current >= motifRef.startTime && current < motifRef.endTime)
                                        {
                                            playing = true;
                                            break;
                                        }
                                    }

                                    if (playing)
                                    {
                                        motif.soul.classList.add("playing");
                                    }
                                    else
                                    {
                                        motif.soul.classList.remove("playing");
                                    }
                                }
                            });
                        }, 15);
                    }
                    else
                    {
                        clearInterval(updateIntervals[videoId]);
                    }
                }
            }
        });
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

    // Button actions
    playBtn.onclick = () => players[videoId].playVideo();
    pauseBtn.onclick = () => players[videoId].pauseVideo();

    // Seek when clicking timebar
    timebarContainer.addEventListener("click", (e) =>
    {
        const rect = timebarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        const duration = players[videoId].getDuration();
        players[videoId].seekTo(duration * percent, true);
    });
}

function createAudioCard(videoId, containerId="musicContainer")
{
    const container = document.getElementById(containerId);

    // Create card
    const card = document.createElement("div");
    card.className = "audioCard";

    const imageContainer = document.createElement("div");
    imageContainer.className = "imageContainer";
    card.appendChild(imageContainer);

    // Cover art
    const img = document.createElement("img");
    img.className = "coverArt";
    img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    imageContainer.appendChild(img);

    // Controls
    const controls = document.createElement("div");
    controls.className = "controls";

    const playBtn = document.createElement("button");
    playBtn.textContent = "▶";
    const pauseBtn = document.createElement("button");
    pauseBtn.textContent = "⏸";

    controls.appendChild(playBtn);
    controls.appendChild(pauseBtn);
    imageContainer.appendChild(controls);

    // Timebar
    const timebarContainer = document.createElement("div");
    timebarContainer.className = "timebarContainer";

    const timebarProgress = document.createElement("div");
    timebarProgress.className = "timebarProgress";
    timebarContainer.appendChild(timebarProgress);
    card.appendChild(timebarContainer);

    // Time labels
    const timeLabels = document.createElement("div");
    timeLabels.className = "timeLabels";
    const currentTimeLabel = document.createElement("span");
    const durationLabel = document.createElement("span");
    currentTimeLabel.textContent = "0:00";
    durationLabel.textContent = "0:00";
    timeLabels.appendChild(currentTimeLabel);
    timeLabels.appendChild(durationLabel);
    card.appendChild(timeLabels);

    // Hidden YouTube iframe
    const playerDiv = document.createElement("div");
    playerDiv.id = "yt" + videoId;
    playerDiv.style.display = "none";
    card.appendChild(playerDiv);

    container.appendChild(card);

    // Helper: format seconds -> M:SS
    function formatTime(seconds)
    {
        seconds = Math.floor(seconds);
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + ":" + (s < 10 ? "0" + s : s);
    }

    // Initialize YouTube player
    function onReady()
    {
        players[videoId] = new YT.Player(playerDiv.id,
        {
            videoId: videoId,
            height: '0',
            width: '0',
            playerVars: { 'playsinline': 1 },
            events:
            {
                'onReady': (event) =>
                {
                    const duration = event.target.getDuration();
                    durationLabel.textContent = formatTime(duration);
                },
                'onStateChange': (event) =>
                {
                    if (event.data === YT.PlayerState.PLAYING)
                    {
                        updateIntervals[videoId] = setInterval(() =>
                        {
                            const current = players[videoId].getCurrentTime();
                            const duration = players[videoId].getDuration();
                            const percent = (current / duration) * 100;
                            timebarProgress.style.width = percent + "%";
                            currentTimeLabel.textContent = formatTime(current);
                        }, 500);
                    }
                    else
                    {
                        clearInterval(updateIntervals[videoId]);
                    }
                }
            }
        });
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

    // Button actions
    playBtn.onclick = () => players[videoId].playVideo();
    pauseBtn.onclick = () => players[videoId].pauseVideo();

    // Seek when clicking timebar
    timebarContainer.addEventListener("click", (e) =>
    {
        const rect = timebarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        const duration = players[videoId].getDuration();
        players[videoId].seekTo(duration * percent, true);
    });
}

formatPageForSong(catswing);

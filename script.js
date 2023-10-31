const apiKey = 'API_KEY'; // Replace with your actual API key

// Function to fetch YouTube video data
function fetchYouTubeVideos() {
    const query = 'Software Quality Assurance';
    const maxResults = 12;

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&type=video&maxResults=${maxResults}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data and populate your UI with video thumbnails and titles
            const videoList = document.getElementById('video-list');
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const thumbnailUrl = item.snippet.thumbnails.default.url;

                const videoThumbnail = document.createElement('div');
                videoThumbnail.innerHTML = `
                    <img src="${thumbnailUrl}" alt="${title}" onclick="loadVideo('${videoId}', '${title}')">
                    <p>${title}</p>
                `;
                videoList.appendChild(videoThumbnail);
            });
        })
        .catch(error => console.error(error));
}

// Function to load and play a video
function loadVideo(videoId, title) {
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.innerHTML = `
        <h2>${title}</h2>
        <iframe width="640" height="360" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
}

// Calling fetchYouTubeVideos() function to display initial 12 videos onto the screen
fetchYouTubeVideos();
//api key
const apiKey = 'AIzaSyBF11-Jj-AixsdM8bPsj5JK8MqSy9hIyug'; 
// Function to fetch YouTube video data
function fetchYouTubeVideos(query) {
    const maxResults = 12;

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&type=video&maxResults=${maxResults}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const videoList = document.getElementById('video-list');
            videoList.innerHTML = ''; // Clear the existing video list

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

// function for keywords..
// Function to update the query based on selected and custom keywords.
function updateQuery() {
    const selectedKeywords = Array.from(document.querySelectorAll('input[name="keyword"]:checked'))
        .map(checkbox => checkbox.value); //select all the checkboxes that are currently checked on the page, then convert to array
    const customKeywords = Array.from(document.querySelectorAll('#custom-keywords-list input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const customKeywordInput = document.getElementById('custom-keyword');
    const customKeyword = customKeywordInput.value.trim(); //trim any whitespace

    //combine selected, custom and predefined keywords into single array
    //.filter(Boolean) to remove any empty string from the array
    const keywords = [...selectedKeywords, ...customKeywords, customKeyword].filter(Boolean);

    //if no keywords selected, default videos = software quality assurance
    const query = keywords.length > 0 ? keywords.join(' ') : 'Software Quality Assurance';

    //fetch videos based on the updated query
    fetchYouTubeVideos(query);
}

// Function for adding custom keyword to the list
document.getElementById('keyword-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const customKeywordInput = document.getElementById('custom-keyword');
    const customKeyword = customKeywordInput.value.trim();

    if (customKeyword) {
        const customKeywordsList = document.getElementById('custom-keywords-list');
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" value="${customKeyword}" checked> ${customKeyword}`; //html list and checkbox checked
        customKeywordsList.appendChild(li); //append item to list
        customKeywordInput.value = ''; // Clear the input field
        updateQuery(); // update the query when a new keyword is added
    }
});

// Handle changes in selected keywords and custom keywords
document.getElementById('keyword-section').addEventListener('change', updateQuery);

// Fetch videos when the page loads
fetchYouTubeVideos('Software Quality Assurance');
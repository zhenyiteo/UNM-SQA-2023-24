
//api key here
const apiKey = 'AIzaSyARBhDYIuCIFzuhotN3xXH4YV1s8QchKv8';

//checks to see if a video has already been loaded
iframe_active = 0;

// Function to fetch YouTube video data
function fetchYouTubeVideos(query) {
    const maxResults = 12;

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&type=video&maxResults=${maxResults}`;

    // var player;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const videoList = document.getElementById('video-list');
            videoList.innerHTML = ''; // Clear the existing video list

            data.items.forEach(item => {

                const videoID = item.id.videoId;
                const title = item.snippet.title;
                const thumbnailUrl = item.snippet.thumbnails.default.url;

                // console.log("video id:" + videoID + "video title:" + title);

                const videoThumbnail = document.createElement('div');
                videoThumbnail.innerHTML = `
                    <img src="${thumbnailUrl}" alt="${title}" onclick="loadVideo('${videoID}', '${title}')">
                    <p>${title}</p>
                `;
                videoThumbnail.classList.add("video-box")
                videoList.appendChild(videoThumbnail);
            });
        })
        .catch(error => console.error(error));
}

// Function to load and play a video
function loadVideo(videoID, title) {

    const videoPlayer = document.getElementById('video-title');

    videoPlayer.innerHTML = `<h2>${title}</h2>`;

    //if a video has been loaded, update videoID
    if(iframe_active){

        clearNotes();
        player.loadVideoById(videoID);
        showNotes(videoID);
    }
    else{
  
        //create a new youtube player 
        player = new YT.Player('video-player', {
            height: '260',
            width: '240',
            videoId: videoID,
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerState

            }
          });

    }

    showNotes(videoID);

    }

function onPlayerReady(event) {

    iframe_active = 1; //indicate that a video has been loaded

}

//FUNCTION IN PROGRESS
function onPlayerState(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      trackVideoTime();
    }
  }

//*****KEYWORD SEARCH FUNCTIONS******

// Function to update the query based on selected and custom keywords
function updateQuery() {
    const selectedKeywords = Array.from(document.querySelectorAll('input[name="keyword"]:checked'))
        .map(checkbox => checkbox.value); //select all the checkboxes that are currently checked on the page, then convert to array
    const customKeywords = Array.from(document.querySelectorAll('#checkbox-list input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const customKeywordInput = document.getElementById('custom-keyword');
    const customKeyword = customKeywordInput.value.trim(); //trim any whitespace

    //combine selected, custom and predefined keywords into single array called "keywords"
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
        const customKeywordsList = document.getElementById('checkbox-list');
        const li = document.createElement('li');
        li.classList.add("checkbox-item")
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

// fetchYouTubeVideos();

//*****NOTES FUNCTIONS******

// Function to add notes
const addNote = document.querySelector(".add-notes"), 
popupNotes = document.querySelector(".popup-notes"),
closeContent = popupNotes.querySelector("header i");
saveBtn  = popupNotes.querySelector("button")
contentTag = popupNotes.querySelector("textarea");

//saving notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");


//showing and removing add note 
addNote.addEventListener("click", () => {

    popupNotes.classList.add("show");

});

closeContent.addEventListener("click", () => {

    contentTag.value = "";
    popupNotes.classList.remove("show");

});


function showNotes(v){

    //clear exisiting notes
    clearNotes();

    notes.forEach((note) => {

        //if youtube note == youtube video id , display note
        if(note.id == v)
        {
            
        let liTag = `<li class="note">
                        <div class="timestamp">
                            <span>[${note.time}]</span>
                        </div>
                        <div class="content">
                            <span>${note.description}</span>
                        </div>
                     </li>`;

         addNote.insertAdjacentHTML("afterend", liTag);

        }

    });
}


//save a note if there is content
saveBtn.addEventListener("click", e => {

    e.preventDefault();
    let noteContent = contentTag.value;
    
    if(noteContent){

        //take time video 
        var currentTime = player.getCurrentTime();
        var noteID = player.getVideoData().video_id;
        console.log("TIME NOTE WAS ADDED:" + secondsToMinutesAndSeconds(currentTime));

        let noteInfo ={
            description: noteContent,
            time: secondsToMinutesAndSeconds(currentTime),
            id: noteID
        }

        notes.push(noteInfo); //add a new note
    
        localStorage.setItem("notes", JSON.stringify(notes));
        closeContent.click();
        clearNotes();
        showNotes(noteID);

    }
});

//function to display note timestamp in an appropriate format
function secondsToMinutesAndSeconds(seconds) {

    var minutes = Math.floor(seconds / 60);
    var remSec = seconds % 60;
    return minutes + ":" + Math.round(remSec);

    //TODO:  make a '0' infront if the remaining seconds is <10

  }
  
  //function for removing all existing notes
  function clearNotes() {

        const noteList = document.querySelectorAll('.note');

        noteList.forEach((noteElement) => {
            noteElement.remove(); // Remove each note individually
          });

  }

//IN PROGRESS
function trackVideoTime() {

    var noteToStyle = document.getElementById('timestamp');
    var Child = noteToStyle.children[0]; // Index starts at 0

    var currentTime = player.getCurrentTime();

    setInterval(function(){


    notes.forEach((note) => {


        if(note.time == currentTime){
    
            Child.classList.add("highlight");
    
        }
        else{
    
            Child.classList.remove("highlight"); 
        }
        
        });

    }, 100)

}

// Function to generate a shareable link
function shareVideo() {
    const videoID = player.getVideoData().video_id; // Get the current video ID
    const notesForVideo = getNotesForVideo(videoID); // Get notes for the current video ID

    // Pause the video
    player.pauseVideo();

    // Create a shareable link with video ID and notes
    const shareableLink = `http://127.0.0.1:5500/UNM-SQA-2023-24/index.html?v=${videoID}&notes=${encodeURIComponent(JSON.stringify(notesForVideo))}`;

    // Display the modal
    const modal = document.getElementById('shareModal');
    const modalText = document.getElementById('modalText');

    // Update modal content with icons and links and css
    modalText.innerHTML = `
                <h3>Share Link: </h3>
                <div style="word-wrap: break-word;">
                    ${shareableLink}
                </div>
                <button onclick="copyToClipboard('${shareableLink}')" style="margin-top: 5px;">Copy Link</button>
            </div>
            <div style="display: flex; cursor: pointer;margin-top: 5px;justify-content: center">
            <h3>Share On: </h3>
            <i class="fab fa-facebook fa-3x" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}', '_blank')"></i>
            <i class="fab fa-whatsapp fa-3x" onclick="window.open('https://api.whatsapp.com/send?text=${encodeURIComponent(shareableLink)}', '_blank')"></i>
            <i class="fas fa-envelope-open fa-3x" onclick="window.open('mailto:?body=${encodeURIComponent(shareableLink)}', '_blank')"></i>
            </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
    }).catch((err) => {
        console.error('Unable to copy to clipboard', err);
    });
}

function closeModal() {
    const modal = document.getElementById('shareModal');
    modal.style.display = 'none';
}


// Function to get notes for a specific video ID
function getNotesForVideo(videoID) {
    return notes.filter(note => note.id === videoID);
}

// Function to get video ID and notes from the URL
function getVideoAndNotesFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoID = urlParams.get('v');
    const notes = urlParams.get('notes');

    // Use videoID and notes as needed
    console.log('Video ID:', videoID);
    console.log('Notes:', decodeURIComponent(notes));

    // Load the video and show notes based on the parameters
    if (videoID) {
        loadVideo(videoID, "Video Title"); // You might want to fetch the actual video title here
        showNotes(videoID);
    }
}


// Call the function when the page loads
window.onload = getVideoAndNotesFromURL;

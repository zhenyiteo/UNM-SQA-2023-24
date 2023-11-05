const apiKey = 'AIzaSyArKELmVQhg1L9MaQ7LLmEIk_4UQCTlvks'; // Replace with your actual API key

//checks to see if a video has already been loaded
iframe_active = 0;


// Function to fetch YouTube video data
function fetchYouTubeVideos() {
    const query = 'Software Quality Assurance';
    const maxResults = 12;

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&type=video&maxResults=${maxResults}`;

    var player;


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data and populate your UI with video thumbnails and titles
            const videoList = document.getElementById('video-list');
            data.items.forEach(item => {
                const videoID = item.id.videoId;
                const title = item.snippet.title;
                const thumbnailUrl = item.snippet.thumbnails.default.url;

                const videoThumbnail = document.createElement('div');
                videoThumbnail.innerHTML = `
                    <img src="${thumbnailUrl}" alt="${title}" onclick="loadVideo('${videoID}', '${title}')">
                    <p>${title}</p>
                `;
                videoList.appendChild(videoThumbnail);
            });
        })
        .catch(error => console.error(error));
}

// Function to load and play a video
function loadVideo(videoID, title) {

    const videoPlayer = document.getElementById('video-title');
    // const iframeID = "youtube"

    videoPlayer.innerHTML = `<h2>${title}</h2>`;

    //if a video has been loaded, update videoID
    if(iframe_active){

        player.loadVideoById(videoID);

    }
    else{
  
        //create a new youtube player 
        player = new YT.Player('video-player', {
            height: '260',
            width: '240',
            videoId: videoID,
            events: {
              'onReady': onPlayerReady,
            }
          });

    }

    }

function onPlayerReady(event) {

    iframe_active = 1; //indicate that a video has been loaded

}


fetchYouTubeVideos();

//****NOTES FUNCTIONS******

// Function to add notes
const addNote = document.querySelector(".add-notes"), 
popupNotes = document.querySelector(".popup-notes"),
closeContent = popupNotes.querySelector("header i");
saveBtn  = popupNotes.querySelector("button")
contentTag = popupNotes.querySelector("textarea");

const notes = JSON.parse(localStorage.getItem("notes") || "[]");

addNote.addEventListener("click", () => {

    popupNotes.classList.add("show");


});

closeContent.addEventListener("click", () => {

    contentTag.value = "";
    popupNotes.classList.remove("show");

});


function showNotes(){

    //need to create, if youtbe id matches note

    //if youtube note == timestamp , 
    notes.forEach((note) => {

        let liTag = `<li class="note">
                        <div class="timestamp">
                            <span>[${note.time}]</span>
                        </div>
                        <div class="content">
                            <span>${note.description}</span>
                        </div>
                    </li>`;

         addNote.insertAdjacentHTML("afterend", liTag);
    });
}

showNotes();


saveBtn.addEventListener("click", e => {

    e.preventDefault();
    let noteContent = contentTag.value;
    
    if(noteContent){
        //take time video 

        var currentTime = player.getCurrentTime();
        console.log("TIME NOTE WAS ADDED:" + secondsToMinutesAndSeconds(currentTime));

        let noteInfo ={
            description: noteContent,
            time: secondsToMinutesAndSeconds(currentTime)
        }

        notes.push(noteInfo); //add a new note

      
    
        localStorage.setItem("notes", JSON.stringify(notes));
        closeContent.click();
        showNotes();


    }

});

function secondsToMinutesAndSeconds(seconds) {

    var minutes = Math.floor(seconds / 60);
    var remSec = seconds % 60;
    return minutes + ":" + Math.round(remSec);
  }
  


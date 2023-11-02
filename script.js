const apiKey = 'AIzaSyArKELmVQhg1L9MaQ7LLmEIk_4UQCTlvks'; // Replace with your actual API key

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

    const videoPlayer = document.getElementById('video-player');
    // const iframeID = "youtube"

    videoPlayer.innerHTML = `<h2>${title}</h2>`;

    // var tag = document.createElement('script');
    // tag.src = "https://www.youtube.com/iframe_api";
    
    // var firstScriptTag = document.getElementsByTagName('script')[0];
    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;

    player = new YT.Player('player', {
        // height: '390',
        // width: '640',
        videoId: videoID,
        // playerVars: {
        //   'playsinline': 1
  
        // },
        events: {
          'onReady': onPlayerReady,
        }
      });
    }

    // 4. The API will call this function when the video player is ready.
    // function onPlayerReady(event) {
    //   event.target.playVideo();
    // }

    // <iframe id="${iframeID}" width="640" height="360" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allowfullscreen></iframe>

    //Initialising YT player API
    // let player;
    // player = new YT.Player(iframeID, {
    //     videoId: `${vidI}`,
    //     events: {
    //         'onReady' : onPlayerReady,
    //     },
    // });


function onPlayerReady(event) {
    // Add a function to retrieve the current time
    const player = event.target;
    const currentTime = player.getCurrentTime();
    console.log('Current Time: ' + currentTime);
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
                            <span>[12:45]</span>
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

        let noteInfo ={

            description: noteContent

        }

        notes.push(noteInfo); //add a new note

        localStorage.setItem("notes", JSON.stringify(notes));
        closeContent.click();
        showNotes();


    }

});


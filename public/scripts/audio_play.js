var ohbaraks = [];
const ohbaraksUrls = {};
const ohbaraksAudios = {};
const all_ohbaraks = [];
var current_ohbarak = null;

const storageRef = firebase.storage().ref();


nsfw_checkbox = document.getElementById("nsfw");



function filter_ohbaraks(){
    if (nsfw_checkbox.checked) {
        ohbaraks = all_ohbaraks;
    } else {
        ohbaraks = all_ohbaraks.filter(name => !name.includes("nsfw"));
    }
}


function getApprovedTracks() {
    const starCountRef = firebase.database().ref('approved');



    starCountRef.on('value', function (audio_files) {

        audio_files.forEach(async function (file) {
            const file_name = file.val();
            const path = "approved/" + file_name;

            var url = await getDownloadURL(storageRef, path);
            ohbaraksUrls[file_name] = url;
            ohbaraks.push(file_name);
            all_ohbaraks.push(file_name)
        });

        filter_ohbaraks();
    });
}

document.getElementById("ohbarak").addEventListener("click", function () {
    const ohbarak = ohbaraks[Math.floor(Math.random() * ohbaraks.length)];

    if (current_ohbarak) {
        current_ohbarak.pause();
        current_ohbarak.currentTime = 0;
    }

    if (ohbaraksAudios[ohbarak]) {
        ohbaraksAudios[ohbarak].currentTime = 0;
        ohbaraksAudios[ohbarak].play();
    } else {
        ohbaraksAudios[ohbarak] = new Audio(ohbaraksUrls[ohbarak]["i"]);
        current_ohbarak = ohbaraksAudios[ohbarak];
        ohbaraksAudios[ohbarak].play();
    }
});


nsfw_checkbox.addEventListener("change", filter_ohbaraks);


getApprovedTracks();

function getDownloadURL(storageRef, path){
    return new Promise(function(resolve, reject) {
        storageRef.child(path).getDownloadURL().then(function(url){
            resolve(url);
        }).catch(function (error) {
            reject(error);
        })
    });

}

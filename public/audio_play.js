

var ohbaraks = [];
const ohbaraksUrls = {};
const ohbaraksAudios = {};

const storageRef = firebase.storage().ref();





function getApprovedTracks(){
    const starCountRef = firebase.database().ref('approved');

    starCountRef.on('value', function(audio_files) {

        audio_files.forEach(function (file) {
            const file_name = file.val();
            const path = "approved/" + file_name;

            storageRef.child(path).getDownloadURL().then(function(url){
                ohbaraksUrls[file_name] = url;
                ohbaraks.push(file_name);
            }).catch(function(error) {
                console.error(error);
            });

        });
    });
}

getApprovedTracks();








const all_ohbaraks = ohbaraks;
let current_ohbarak;



document.getElementById("ohbarak").addEventListener("click", function() {
    const ohbarak = ohbaraks[Math.floor(Math.random()*ohbaraks.length)];

    if(current_ohbarak){
        current_ohbarak.pause();
        current_ohbarak.currentTime = 0;
    }

    if(ohbaraksAudios[ohbarak]){
        ohbaraksAudios[ohbarak].currentTime = 0;
        ohbaraksAudios[ohbarak].play();
    }else {
        ohbaraksAudios[ohbarak] = new Audio(ohbaraksUrls[ohbarak]);
        current_ohbarak = ohbaraksAudios[ohbarak];
        ohbaraksAudios[ohbarak].play();
    }
});

document.getElementById("nsfw").addEventListener("change", function() {
    if (this.checked)
        ohbaraks = all_ohbaraks;
    else
        ohbaraks = all_ohbaraks.filter(name => !name.includes("nsfw"));

    console.log(ohbaraks);
});
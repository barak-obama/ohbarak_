let ohbaraks = [];
const all_ohbaraks = [];
let current_ohbarak = null;

const storageRef = firebase.storage().ref();


nsfw_checkbox = document.getElementById("nsfw");


function filter_ohbaraks(allohbaraks, nsfw){
    if (nsfw) {
        return allohbaraks;
    } else {
        return allohbaraks.filter(ohbarak => !ohbarak.nsfw);
    }
}


function getApprovedTracks() {
    const starCountRef = firebase.database().ref('approved');



    starCountRef.on('value', async function (audio_files) {
        audio_files = audio_files.val();

        for(let i = 0; i < audio_files.length; i++){
            const file_name = audio_files[i];
            const path = "approved/" + file_name;

            let url = await getDownloadURL(storageRef, path);

            let new_ohbarak = {
                name: file_name,
                audio: new Audio(url),
                url: url,
                nsfw: file_name.includes("nsfw")
            };

            if(!new_ohbarak.nsfw){
                ohbaraks.push(new_ohbarak)
            }

            all_ohbaraks.push(new_ohbarak);
        }

        ohbaraks = filter_ohbaraks(all_ohbaraks, nsfw_checkbox.checked);
    });
}


function play_ohbarak() {
    if(ohbaraks.length === 0){
        setTimeout(play_ohbarak, 300);
        return;
    }
    const ohbarak = ohbaraks[Math.floor(Math.random() * ohbaraks.length)];

    if (current_ohbarak) {
        current_ohbarak.audio.pause();
        current_ohbarak.audio.currentTime = 0;
    }

    ohbarak.audio.currentTime = 0;
    ohbarak.audio.play();
    current_ohbarak = ohbarak;
}

document.getElementById("ohbarak").addEventListener("click", play_ohbarak);


nsfw_checkbox.addEventListener("change", function () {
    ohbaraks = filter_ohbaraks(all_ohbaraks, nsfw_checkbox.checked);
});


function getDownloadURL(storageRef, path){
    return new Promise(function(resolve, reject) {
        storageRef.child(path).getDownloadURL().then(function(url){
            resolve(url);
        }).catch(function (error) {
            reject(error);
        })
    });

}


getApprovedTracks();

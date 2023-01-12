const musicPlayer = document.querySelector(".music__player");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const audio = document.querySelector("#audio");

const audioTitle = document.querySelector(".music__title");
const audioImage = document.querySelector(".music__img");

const progressContainer = document.querySelector(".music__player--progress");
const progress = document.querySelector(".progress");

const speedIndicator = document.querySelector(".speed");
const speedNumber = document.querySelector(".speed p");
const speedOptions = [1.0, 1.5, 2.0, 0.75];
let speedIndex = 0;

let songs;
let songIndex = 0;

function loadSong(song) {
  audioTitle.innerText = song.title;
  audio.src = song.audio;
  audioImage.style.backgroundImage = `url('${song.cover}')`;
}

function isAudioPlaying() {
  return musicPlayer.classList.contains("playing");
}

function playAudio() {
  musicPlayer.classList.add("playing");
  playBtn.querySelector("i").classList.remove("ph-play-circle");
  playBtn.querySelector("i").classList.add("ph-pause-circle");
  audio.playbackRate = `${speedOptions[speedIndex]}`;
  audio.play();
}

function pauseAudio() {
  musicPlayer.classList.remove("playing");
  playBtn.querySelector("i").classList.add("ph-play-circle");
  playBtn.querySelector("i").classList.remove("ph-pause-circle");
  audio.pause();
}

const retrieveSongs = async () => {
  try {
    const url = "./audio.json";
    const response = await fetch(url);
    const data = await response.json();
    songs = data.songs;
    loadSong(songs[songIndex]);
  } catch (error) {
    console.log(error);
  }
};

retrieveSongs();

function prevSong() {
  songIndex -= 1;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  progress.style.width = "0%";
  isAudioPlaying() === true ? playAudio() : pauseAudio();
}

function nextSong() {
  songIndex += 1;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  progress.style.width = "0%";
  isAudioPlaying() === true ? playAudio() : pauseAudio();
}

function updateProgressBar(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercentage = (currentTime / duration) * 100;
  progress.style.width = `${progressPercentage}%`;
}

function updateProgressBarPlayPosition(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = audio;
  audio.currentTime = (clickX / width) * duration;
}

function updateSpeedIndicator() {
  speedIndex += 1;
  if (speedIndex > speedIndex.length - 1) {
    speedIndex = 0;
  }
  speedNumber.textContent = `${speedOptions[speedIndex]}x`;
  playAudio();
}

playBtn.addEventListener("click", () => {
  isAudioPlaying() ? pauseAudio() : playAudio();
});
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

speedIndicator.addEventListener("click", updateSpeedIndicator);

audio.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", updateProgressBarPlayPosition);

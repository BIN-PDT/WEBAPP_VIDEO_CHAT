const APP_ID = "ad8ffeb7867249ec846df7e987dd4807";
const CHANNEL = sessionStorage.getItem("room");
const TOKEN = sessionStorage.getItem("token");
let UID = Number(sessionStorage.getItem("UID"));

let localTracks = [];
let remoteUsers = {};

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let joinAndDisplayLocalStream = async () => {
	document.getElementById("room-name").innerText = CHANNEL;

	client.on("user-published", handleUserJoined);
	client.on("user-left", handleUserLeft);

	try {
		await client.join(APP_ID, CHANNEL, TOKEN, UID);
	} catch (error) {
		window.open("/", "_self");
	}

	localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

	let player = `
                <div id="user-container-${UID}" class="video-container">
                    <div class="username-wrapper"><span class="user-name"></span></div>
                    <div id="user-${UID}" class="video-player"></div>
                </div>`;
	document
		.getElementById("video-streams")
		.insertAdjacentHTML("beforeend", player);

	localTracks[1].play(`user-${UID}`);

	await client.publish([localTracks[0], localTracks[1]]);
};

let handleUserJoined = async (user, mediaType) => {
	remoteUsers[user.uid] = user;
	await client.subscribe(user, mediaType);

	if (mediaType === "video") {
		let player = document.getElementById(`user-container-${user.uid}`);
		if (player != null) {
			player.remove();
		}

		player = `
            <div id="user-container-${user.uid}" class="video-container">
                <div class="username-wrapper"><span class="user-name"></span></div>
                <div id="user-${user.uid}" class="video-player"></div>
            </div>`;
		document
			.getElementById("video-streams")
			.insertAdjacentHTML("beforeend", player);

		user.videoTrack.play(`user-${user.uid}`);
	}

	if (mediaType === "audio") {
		user.audioTrack.play();
	}
};

let handleUserLeft = async (user) => {
	delete remoteUsers[user.uid];
	document.getElementById(`user-container-${user.uid}`).remove();
};

joinAndDisplayLocalStream();

// CONTROL BUTTONS.
let leaveAndRemoveLocalStream = async () => {
	for (let i = 0; localTracks.length > i; i++) {
		localTracks[i].stop();
		localTracks[i].close();
	}

	await client.leave();
	window.open("/", "_self");
};

let toggleMicrophone = async (e) => {
	if (localTracks[0].muted) {
		await localTracks[0].setMuted(false);
		e.target.style.backgroundColor = "#fff";
	} else {
		await localTracks[0].setMuted(true);
		e.target.style.backgroundColor = "rgb(255, 80, 80, 1)";
	}
};

let toggleCamera = async (e) => {
	if (localTracks[1].muted) {
		await localTracks[1].setMuted(false);
		e.target.style.backgroundColor = "#fff";
	} else {
		await localTracks[1].setMuted(true);
		e.target.style.backgroundColor = "rgb(255, 80, 80, 1)";
	}
};

document
	.getElementById("button-leave")
	.addEventListener("click", leaveAndRemoveLocalStream);
document
	.getElementById("button-microphone")
	.addEventListener("click", toggleMicrophone);
document
	.getElementById("button-camera")
	.addEventListener("click", toggleCamera);

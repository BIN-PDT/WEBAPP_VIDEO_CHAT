const APP_ID = "ad8ffeb7867249ec846df7e987dd4807";
const TOKEN = sessionStorage.getItem("token");
const CHANNEL = sessionStorage.getItem("room");
const NAME = sessionStorage.getItem("name");
const UID = sessionStorage.getItem("uid");
// CAMERA & MICROPHONE TRACKING.
let localTracks = [];
// OTHER USERS TRACKING.
let remoteUsers = {};
// AGORA CLIENT INSTANCE.
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let joinAndDisplayLocalStream = async () => {
	// JOIN CHANNEL.
	try {
		await client.join(APP_ID, CHANNEL, TOKEN, UID);
	} catch (error) {
		window.open("/", "_self");
	}
	// JOINED & LEFT ROOM EVENT HANDLER.
	client.on("user-published", handleUserJoined);
	client.on("user-left", handleUserLeft);
	// LOAD ROOM NAME.
	document.getElementById("room-name").innerText = CHANNEL;
	// TRACK CAMERA & MICROPHONE.
	localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
	// CREATE MEMBER DATA ON DATABASE.
	let member = await createMember();
	// LOAD VIDEO HTML TO BROWSER.
	let player = `
                <div id="user-container-${UID}" class="video-container">
                    <div class="username-wrapper">
						<span class="user-name">${member.name || UID}</span>
					</div>
                    <div id="user-${UID}" class="video-player"></div>
                </div>`;
	document
		.getElementById("video-streams")
		.insertAdjacentHTML("beforeend", player);
	// LOAD CAMERA DATA TO VIDEO HTML.
	localTracks[1].play(`user-${UID}`);
	// PUBLISH DATA TO OTHER MEMBERS IN CHANNEL.
	await client.publish([localTracks[0], localTracks[1]]);
};

let handleUserJoined = async (user, mediaType) => {
	// TRACK JOINED USER.
	remoteUsers[user.uid] = user;
	await client.subscribe(user, mediaType);

	if (mediaType === "video") {
		let player = document.getElementById(`user-container-${user.uid}`);
		if (player != null) {
			player.remove();
		}
		// GET MEMBER DATA ON DATABASE.
		let member = await getMember(user);
		// LOAD VIDEO HTML TO BROWSER.
		player = `
            <div id="user-container-${user.uid}" class="video-container">
                <div class="username-wrapper">
					<span class="user-name">${member.name || user.uid}</span>
				</div>
                <div id="user-${user.uid}" class="video-player"></div>
            </div>`;
		document
			.getElementById("video-streams")
			.insertAdjacentHTML("beforeend", player);
		// LOAD CAMERA DATA TO VIDEO HTML.
		user.videoTrack.play(`user-${user.uid}`);
	}

	if (mediaType === "audio") {
		user.audioTrack.play();
	}
};

let handleUserLeft = async (user) => {
	// UNTRACK USER.
	delete remoteUsers[user.uid];
	// REMOVE VIDEO HTML.
	document.getElementById(`user-container-${user.uid}`).remove();
};

joinAndDisplayLocalStream();

// CONTROL BUTTONS.
let leaveAndRemoveLocalStream = async () => {
	// UNTRACK CAMERA & MICROPHONE.
	for (let i = 0; localTracks.length > i; i++) {
		localTracks[i].stop();
		localTracks[i].close();
	}
	// BROADCAST USER LEFT EVENT.
	await client.leave();
	// DELETE MEMBER DATA ON DATABASE.
	await deleteMember();
	// REDIRECT TO LOBBY PAGE.
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

// AJAX.
let createMember = async () => {
	let response = await fetch("/create_member/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: NAME, room_name: CHANNEL, uid: UID }),
	});
	let member = await response.json();
	return member;
};

let getMember = async (user) => {
	let response = await fetch(
		`/get_member/?uid=${user.uid}&room_name=${CHANNEL}`
	);
	let member = await response.json();
	return member;
};

let deleteMember = async () => {
	let response = await fetch("/delete_member/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: NAME, room_name: CHANNEL, uid: UID }),
	});
	await response.json();
};

// CLOSED WINDOW EVENT HANDLER.
window.addEventListener("beforeunload", deleteMember);

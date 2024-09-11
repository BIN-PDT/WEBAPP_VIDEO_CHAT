const APP_ID = "ad8ffeb7867249ec846df7e987dd4807";
const CHANNEL = "main";
const TOKEN =
	"007eJxTYJh6fre5buyjOd0zdh77IFO1/v6nB2s07s82ONZhLrJJbpOLAkNiikVaWmqSuYWZuZGJZWqyhYlZSpp5qqWFeUqKiYWBuQjDw7SGQEaG36dcWBgZIBDEZ2HITczMY2AAACDKIds=";
let UID;

let localTracks = [];
let remoteUsers = {};

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let joinAndDisplayLocalStream = async () => {
	UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

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

joinAndDisplayLocalStream();

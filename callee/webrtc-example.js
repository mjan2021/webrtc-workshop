
var websocketConnection = new WebSocket("wss://guident.bluepepper.us:8848");

websocketConnection.onopen = function(evt) {
  console.log("JsFiddleWssCallingExample::_onWssConnectionOpen(): CONNECTED!");
  /* var msg = "This is the calling side." */
  /* console.log("JsFiddleWssCallingExample::_onWssConnectionOpen(): Sending this to the callee side: " + msg + ".") */
  /* websocketConnection.send(msg) */
}


websocketConnection.onmessage = function(evt) {
	onOfferReceived(evt.data);
}

websocketConnection.onclose = function(evt) {
  console.log("JsFiddleWssCallingExample::_onWssConnectionClose(): Code: " + evt.code + " Reason: " + evt.reason + " Clean?: " + evt.wasClean);
}

websocketConnection.onerror = function(evt) {
  console.log("JsFiddleWssCallingExample::_onWssConnectionError(): " + evt);
}



var pc = null;
var localMediaStreams = null;

var remoteVideoStream = null;

async function getLocalMediaStreams() {
        localMediaStreams = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
}


getLocalMediaStreams();





function onOfferReceived(offer) {

	var constraints = {
                video: true,
                audio: true,
	};

	const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

	pc = new RTCPeerConnection(configuration);

	pc.ontrack = function(ev) {

		console.log("pc.ontrack(): Got a track! Id: <<" + ev.track.id + ">> Kind: <<" + ev.track.kind + ">> Mid: <<" + ev.transceiver.mid + ">> Label: <<" + ev.track.label + ">> Streams length: <<" + ev.streams.length + ">> Stream Id: <<" + ev.streams[0].id + ">> #Tracks in stream: <<" + ev.streams[0].getTracks().length + ">>" );

		if ( ev.transceiver.mid == "1" ) {
                        remoteVideoStream = new MediaStream([ev.streams[0].getAudioTracks()[0], ev.track]);
                        console.log("New stream id: <<" + remoteVideoStream.id + ">> " + remoteVideoStream.getTracks().length);
                        document.getElementById("videoStream").srcObject = remoteVideoStream;
                } 
		/*
		else if ( ev.transceiver.mid == "2" ) {
                        this.secondVideoMediaStream = new MediaStream([ ev.track ]);
                        console.log("New stream id: <<" + this.secondVideoMediaStream.id + ">> " + this.secondVideoMediaStream.getTracks().length);
                        document.getElementById(this.remoteVideoId[1]).srcObject = this.secondVideoMediaStream;
		}
		*/
	}


	localMediaStreams.getTracks().forEach(track => pc.addTransceiver(track, { direction: "sendrecv" }));
        //pc.addTransceiver("video", { direction: "recvonly" } );

	pc.onicecandidate = function(iceevt) {
		if ( iceevt.candidate == null ) {
			console.log("pc.onicecandidate(): Completed!");
			sendAnswerToCaller();
		} else {
			console.log("pc.onicecandidate(): Got an ice candidate: <<" + iceevt.candidate.candidate + ">>");
		}
	};

	console.log("onOfferReceived(): Setting received offer as remote description.");
	pc.setRemoteDescription(offer).then(function() {
		console.log("onOfferReceived(): Creating local answe SDP.");
		pc.createAnswer().then(function(description) {
			console.log("onStartPressed(): Answer SDP has been created. Setting it as local descript tio the PC.");
			pc.setLocalDescription(description);
		});
	});

}




function sendAnswerToCaller() {

	var msg = { sdp: pc.localDescription };

	websocketConnection.send(JSON.stringify(msg));

}







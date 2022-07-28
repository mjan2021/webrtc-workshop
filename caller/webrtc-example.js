// Caller
var websocketConnection = new WebSocket("wss://guident.bluepepper.us:8848");

websocketConnection.onopen = function(evt) {
  console.log("JsFiddleWssCallingExample::_onWssConnectionOpen(): CONNECTED!");
  /* var msg = "This is the calling side." */
  /* console.log("JsFiddleWssCallingExample::_onWssConnectionOpen(): Sending this to the callee side: " + msg + ".") */
  /* websocketConnection.send(msg) */
}


websocketConnection.onmessage = function(evt) {
	
	var obj = JSON.parse(evt.data);
	onAnswerReceived(obj.sdp);
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





function onStartPressed() {


	const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}], 'bundlePolicy': 'max-bundle' };

	pc = new RTCPeerConnection(configuration);

	pc.ontrack = function(ev) {

		console.log("onStartPressed(): Got a track! Id: <<" + ev.track.id + ">> Kind: <<" + ev.track.kind + ">> Mid: <<" + ev.transceiver.mid + ">> Label: <<" + ev.track.label + ">> " );
		//console.log("onStartPressed(): Got a track! Id: <<" + ev.track.id + ">> Kind: <<" + ev.track.kind + ">> Mid: <<" + ev.transceiver.mid + ">> Label: <<" + ev.track.label + ">> Streams length: <<" + ev.streams.length + ">> Stream Id: <<" + ev.streams[0].id + ">> #Tracks in stream: <<" + ev.streams[0].getTracks().length + ">>" );
/*
		if ( ev.transceiver.mid == "1" ) {
                        //remoteVideoStream = new MediaStream([ev.streams[0].getAudioTracks()[0], ev.track]);
                        remoteVideoStream = new MediaStream([ev.track]);
                        console.log("New stream id: <<" + remoteVideoStream.id + ">> " + remoteVideoStream.getTracks().length);
                        document.getElementById("videoStream").srcObject = remoteVideoStream;
                } 

		
		else if ( ev.transceiver.mid == "2" ) {
                        this.secondVideoMediaStream = new MediaStream([ ev.track ]);
                        console.log("New stream id: <<" + this.secondVideoMediaStream.id + ">> " + this.secondVideoMediaStream.getTracks().length);
                        document.getElementById(this.remoteVideoId[1]).srcObject = this.secondVideoMediaStream;
		}
		*/
		
		if ( ev.transceiver.mid == "0" ) {
			if ( remoteVideoStream == null ) {
				remoteVideoStream = new MediaStream([ ev.track ]);
                        	console.log("New stream id: <<" + remoteVideoStream.id + ">> # tracks: " + remoteVideoStream.getTracks().length + " New stream.");
			} else {
				pc.addTrack(ev.track, remoteMediaStream);
                        	console.log("New stream id: <<" + remoteVideoStream.id + ">> # tracks: " + remoteVideoStream.getTracks().length);
			}
		}

		if ( ev.transceiver.mid == "1" ) {
			if ( remoteVideoStream == null ) {
				remoteVideoStream = new MediaStream([ ev.track ]);
                        	console.log("New stream id: <<" + remoteVideoStream.id + ">> # tracks: " + remoteVideoStream.getTracks().length + " New stream.");
			} else {
				remoteVideoStream.addTrack(ev.track);
                        	console.log("New stream id: <<" + remoteVideoStream.id + ">> # tracks: " + remoteVideoStream.getTracks().length);
			}
                        document.getElementById("videoStream").srcObject = remoteVideoStream;
                } 
	
	}


	localMediaStreams.getAudioTracks().forEach(track => pc.addTransceiver(track, { direction: "sendrecv" }));
        pc.addTransceiver("video", { direction: "recvonly" } );


	pc.onicecandidate = function(iceevt) {
		if ( iceevt.candidate == null ) {
			console.log("onStartPressed():pc.onicecandidate(): Completed!");
			sendOfferToCallee();
		} else {
			console.log("onStartPressed():pc.onicecandidate(): Got an ice candidate: <<" + iceevt.candidate.candidate + ">>");
		}
	};


	pc.createOffer().then(function(description) {
		console.log("onStartPressed(): Offer SDP has been created. Setting it as local descript tio the PC.");
		pc.setLocalDescription(description);
	})

}




function sendOfferToCallee() {

	console.log("sendOfferToCallee(): OFFER: <<" + JSON.stringify(pc.localDescription) + ">>");

	var msg = { sdp: pc.localDescription };

	websocketConnection.send(JSON.stringify(msg));

}



function onAnswerReceived(answer) {

	console.log("onAnswerRecieved(): Setting the received answer toremote description.");

	console.log("onAnswerReceived(): <<" + JSON.stringify(answer) + ">>.");
	pc.setRemoteDescription(answer).then(function() {
		console.log("OK, done!");
	});

}




let dastuff = `<rect fill="black" height="336" id="background" stroke="none" width="588"/>
<rect fill="white" x="80" y="8" width="88" height="48" stroke="none"/>
<rect fill="white" x="419" y="8" width="88" height="48" stroke="none"/>
<rect fill="white" x="82" y="10" width="84" height="22" id="hb" stroke="none" />
<rect fill="white" x="82" y="32" width="84" height="22" id="ho" stroke="none"/>
<rect fill="white" x="421" y="10" width="84" height="22" id="ub" stroke="none"/>
<rect fill="white" x="421" y="32" width="84" height="22" id="uo" stroke="none"/>
<text id="timer" x="294" y="55" font-family="DSEG7 Classic" font-size="40" text-anchor="middle" fill="white">00:00</text>
<text id="t1" x="72" y="55" font-family="DSEG7 Classic" font-size="40" text-anchor="end" fill="white">0</text>
<text id="t2" x="515" y="55" font-family="DSEG7 Classic" font-size="40" text-anchor="start" fill="white">0</text>
<text id="message" x="294" y="327" font-family="Raleway" font-size="51" text-anchor="left" fill="white">DLC Sportsystems</text>
<image id="sponsorimgsmall" x="0" y="64" width="588" height="208" xlink:href=""  />
<rect fill="black" width="588" height="336" id="sponsorbackground" stroke="none"/>
<image id="sponsorimg" x="0" y="0" width="588" height="336" xlink:href=""  />`;

let daScript = `
//Quinten Muyllaert 30-05-2022
		//$("#background").attr("style","fill: #444444");
		var len = 16;

		
		socket.on("data",function (element,thing,type,value){
			//$("#wauw").attr('style',dat[0]+": "+dat[1]); // update data
			if(value){
				$(element)[thing](type,value);
			}else{
				$(element)[thing](type); 
			}

			if(element == "#message" && thing == "text"){
				len = type.length;
			}
		});

		var clockData = {
			realTime: false,
			paused: false,
			startTime: Date.now(),
			startPauseTime: 0,
			pauseTime: 0,
		};
 
		function to2digits(num){
			if(num < 10){
				return "0" + num;
			}
			return num;
		}

		function clockify(time) {
			var totalSeconds = time / 1000;
			var minutes = Math.floor(totalSeconds / 60);
			var seconds = Math.floor(totalSeconds % 60);
			return to2digits(minutes) + ":" + to2digits(seconds);
		}

		socket.on("clockData",function(data){
			clockData = data;
		});

		$("#sponsorbackground").attr("style","opacity: 0");
		var sponsors = [];
		var sponsorIndex = 0;
		socket.on("sponsors",function(data){
			sponsors = data;
			cycleSponsor();
		});

		function cycleSponsor(){
			sponsorIndex++;
			var data = sponsors[sponsorIndex % sponsors.length];

			$("#sponsorimg").attr("xlink:href",data);
			$("#sponsorimgsmall").attr("xlink:href",data);
		}

		setInterval(cycleSponsor,5000);

		socket.on("fullscreen",function(data){
			if(data){
				$("#sponsorbackground").attr("style","opacity: 1");
				$("#sponsorimg").attr("style","opacity: 1");
				$("#sponsorimgsmall").attr("style","opacity: 0");
			}else{
				$("#sponsorbackground").attr("style","opacity: 0");
				$("#sponsorimg").attr("style","opacity: 0");
				$("#sponsorimgsmall").attr("style","opacity: 1");
			}
		});

		setInterval(function(){
			var display = "00:00";
			var now = Date.now();

			if (clockData.paused) {
				var  delta = clockData.startPauseTime - clockData.startTime - clockData.pauseTime;
				display = clockify(delta);
			} else {
				var  delta = now - clockData.startTime - clockData.pauseTime;
				display = clockify(delta);
			}

			if (clockData.realTime) {
				//get clock as 24hour 00:00
				var seconds = 60 * new Date(now).getHours() + new Date(now).getMinutes();

				display = clockify(1000 * seconds);
			}

			$("#timer").text(display);
		},50);

		socket.on("sponsor",function (uri) { 
			$("#img").attr("xlink:href",uri);
		})

		socket.on("invokeuri",function (uri){
			$.get(uri);
		});

		var pos = 588;
		setInterval(function(){
			$("#message").attr("x",pos);
			pos = pos - 2;//0.2;
			if(pos < -len * 16 * 2){
				pos = 588;
			}
		},16);
`;

export const Generate = () => {
	const width = 558; //1920;
	const height = 336; //1080;
	let txt = `$("#root").empty();`;
	txt += `$("#root").append('<rect fill="black" height="${height}" id="background" stroke="none" width="${width}"/>');`;
	txt += `$("#root").append('${dastuff.replace(/\n/g, "")}');`;
	txt += `setTimeout(function(){
        ${daScript}
    });`;
	return txt;
};

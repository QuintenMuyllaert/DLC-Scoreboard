import { HMP } from "../../Interfaces/Interfaces";

const version = Date.now().toString();

const width = 1920; //588
const height = 1080; //336

const thickness = 0.005 * width;
const fontSize = 0.06875 * width; //132;
const fontSizeMessage = 0.0864 * width; //166;

const svgElement = `<rect fill="black" height="${height}" id="background" stroke="none" width="${width}"/>

<g transform="translate(${0.145 * width} ${0.023 * height})">
	<rect x="0" y="0" width="${0.15 * width}" height="${0.5 * 0.15 * height}" id="hb" stroke="none" />
	<rect x="0" y="${0.5 * 0.15 * height}" width="${0.15 * width}" height="${0.5 * 0.15 * height}" id="ho" stroke="none"/>	
	<rect x="0" y="0" width="${0.15 * width}" height="${0.15 * height}" fill="none" stroke="white" stroke-width="${thickness}"/>
</g>

<g transform="translate(${width - 0.15 * width - 0.145 * width} ${0.023 * height})">
	<rect x="0" y="0" width="${0.15 * width}" height="${0.5 * 0.15 * height}" id="ub" stroke="none" />
	<rect x="0" y="${0.5 * 0.15 * height}" width="${0.15 * width}" height="${0.5 * 0.15 * height}" id="uo" stroke="none"/>	
	<rect x="0" y="0" width="${0.15 * width}" height="${0.15 * height}" fill="none" stroke="white" stroke-width="${thickness}"/>
</g>

<text id="timer" x="${width / 2}" y="${
	0.023 * height + fontSize * 1.1
}" font-family="DSEG7 Classic" font-size="${fontSize}" text-anchor="middle" fill="white">00:00</text>

<text id="t1" x="${0.135 * width}" y="${
	0.023 * height + fontSize * 1.1
}" font-family="DSEG7 Classic" font-size="${fontSize}" text-anchor="end" fill="white">0</text>

<text id="t2" x="${width - 0.135 * width}" y="${
	0.023 * height + fontSize * 1.1
}" font-family="DSEG7 Classic" font-size="${fontSize}" text-anchor="start" fill="white">0</text>

<text id="message" x="${width}" y="${
	height - 0.3 * fontSizeMessage
}" font-family="Raleway" font-size="${fontSizeMessage}" text-anchor="left" fill="white">DLC Sportsystems</text>

<image id="sponsorimgsmall" x="0" y="${0.2 * height}" width="${width}" height="${0.63 * height}" xlink:href=""  />
<rect fill="black" width="${width}" height="${height}" id="sponsorbackground" stroke="none"/>
<image id="sponsorimg" x="0" y="0" width="${width}" height="${height}" xlink:href=""  />`;

const scriptSVG = `
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
		if(!data){
			socket.emit("echo",data,"no data");
			return;
		}
		sponsors = data;
	});

	setInterval(function(){
		sponsorIndex++;
		var data = sponsors[sponsorIndex % sponsors.length];
		$("#sponsorimg").attr("xlink:href",data);
		$("#sponsorimgsmall").attr("xlink:href",data);
	},5000);

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
			var delta = clockData.startPauseTime - clockData.startTime - clockData.pauseTime;
			display = clockify(delta);
		} else {
			var delta = now - clockData.startTime - clockData.pauseTime;
			display = clockify(delta);
		}

		if (clockData.realTime) {
			//get clock as 24hour 00:00
			var seconds = 60 * new Date(now).getHours() + new Date(now).getMinutes();

			display = clockify(1000 * seconds);
		}

		$("#timer").text(display);
	},50);

	var pos = ${width};
	setInterval(function(){
		$("#message").attr("x",pos);
		pos = pos - 0.0034 * ${width};
		if(pos < -len * ${fontSizeMessage}){
			pos = ${width};
		}
	},16);

	$("svg").attr("viewBox","0 0 ${width} ${height}");
`;

const scriptHTML = `
	var root = [
		{
			args: {
				height: ${height},
				id: "YBkasrcXK8",
				left: 0,
				repeatDur: "indefinite",
				src: "https://dlcscoreboard.computernetwork.be/scoreboard?serial=" + deviceInfo.serialNumber,
				top: 0,
				width: ${width},
			},
			changeNumber: "1.67",
			ctor: "iframe",
		},
	];	
	
	var layers = [

	];

	$('#root').add( $.uncan( root ) );	
	$('#layers').add( $.uncan( layers ) );	
`;

const HTMLSupport = ["inanis", "windows", "fukiran"];
const noHTMLSupport = ["bonsai", "sakura", "ikebana"];

export const Generate = (hmp: HMP, id: string) => {
	let txt = `
		if(store.version == "${version}"){
			return;
		}
		store.version = "${version}";
		$("#root").empty();$("#layers").empty();`;

	if (noHTMLSupport.includes(hmp.deviceType)) {
		txt += `$("#root").append('<rect fill="black" height="${height}" id="background" stroke="none" width="${width}"/>');`;
		txt += `$("#root").append('${svgElement.replace(/\n/g, "")}');`;
		txt += `(function(){
				${scriptSVG};
			})();`;

		txt += `socket.emit("DOMContentLoaded");`;
	} else {
		txt += `(function(){
			${scriptHTML};
		})();`;
	}

	return `(function(){${txt};})();`;
};

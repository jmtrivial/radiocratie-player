			   
			   
			   
function cleanName(showname) {
		sn = showname.toLowerCase();
		if (sn == "nuit")
			return "nuit";
		else if (sn == "journee" || sn == "journée")
			return "journee";
		else if (sn == "soiree" || sn == "soirée")
			return "soiree";
		else
			return "defaut";
	
}


function getImage(showname) {
	var cleanshowname = cleanName(showname);
	
	nbmax = images[cleanshowname].length;
	if (nbmax == 1)
		return images[cleanshowname][0];
	else {
		id = Math.floor(Math.random() * nbmax);
		return images[cleanshowname][id];
	}
}

function getCurrentImage() {
	if (window.currentshow != null && window.currentshow != "")
		return getImage(window.currentshow);
	else
		return getImage("defaut");
}

function updateBackground() {
	var image = getCurrentImage();
	var nbSecTransition = 1.;
	if (image != null && image != "") {
		$("#background").fadeTo( nbSecTransition * 1000, 0, function() {
			$("#background").css("background", "url(" + image + ") no-repeat center center fixed");
			$("#background").css("-webkit-background-size", "cover");
			$("#background").css("-moz-background-size", "cover");
			$("#background").css("-o-background-size", "cover");
			$("#background").css("background-size", "cover");
			$("#background").fadeTo(nbSecTransition * 1000, 0.4); 
		});
	}

}

function updateTitle() {
	$(".jp-title").html("<p>" + window.currenttrack + "</p>");
	$(".jp-title").tooltip({destroy: true});
}



function loadInfos() {
	console.log("on charge les infos");
	$.ajax({
		url: 'http://admin.radiocratie.com/api/live-info?type=show_content',
		dataType: 'jsonp',
		success: function(data){
			currenttime = Date.parse(data.schedulerTime);
			
			var shift = data.timezoneOffset * 1000;
			nexttracktime = Date.parse(data.next.starts) + shift; 
			nextshowtime = Date.parse(data.nextShow[0].starts);

			window.currenttrack = data.current.name;
			window.currentshow = data.currentShow[0].name;
			window.endofcurrenttrack = Date.now() + (nexttracktime - currenttime);

			updateTitle();
			
			setTimeout("loadInfos()", nexttracktime - currenttime);
			
			if (window.nextShow != nextshowtime) {
				window.nextShow = nextshowtime;
				updateBackground();
				console.log("timeout: " + (nextshowtime - currenttime));
				setTimeout("loadInfos()", nextshowtime - currenttime);
			}
			
		}
	});
	
}

function updateTimeEndOfTrack() {
	if(window.endofcurrenttrack != null && window.endofcurrenttrack >= 0) {
		remainTime = "";
		time = new Date(window.endofcurrenttrack - Date.now() - (3600000)); // 1er sept à 1h
		if (time.getUTCMilliseconds() <= 0)
			msg = "titre en cours";
		else {
			hours = time.getHours();
			if (hours != 0)
				remainTime = remainTime + hours + "h";
			mins = time.getMinutes();
			if (mins != 0)
				if (mins >= 10)
					remainTime = remainTime + mins + "mn";
				else
					remainTime = remainTime + "0" + mins + "mn";
			secs = time.getSeconds();
			if (secs != 0)
				if (secs >= 10)
					remainTime = remainTime + secs + "s";
				else
					remainTime = remainTime + "0" + secs + "s";
			msg = "titre en cours (reste " + remainTime + ")";	
		 }
		if ($(".jp-title").data("tooltip"))
			$(".jp-title").tooltip({content : msg, show : {delay: 400}});
	}
}

$(document).ready(function(){
	
	$( document ).tooltip({ show: {delay: 700}});
	
	window.currentshow = null;
	window.nextShow = -1;
	loadInfos();
	
	bgUpdateDelay = 5;
	setInterval("updateBackground()", 1000 * 60 * bgUpdateDelay); // mise à jour toutes les n minutes
	
	setInterval("updateTimeEndOfTrack()", 1000);
	
	$(".jp-title").on("tooltipopen", function(event, ui) {
		$(this).data("tooltip", true);
		updateTimeEndOfTrack();
	});
	$(".jp-title").on("tooltipclose", function(event, ui) {
		$(this).data("tooltip", false);
	});
	
   }
);

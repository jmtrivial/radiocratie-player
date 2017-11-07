var images = { "nuit" : [ "images/bg/radio-urbex.jpg" ],
			   "journee" : [ "images/bg/radio-urbex.jpg" ],
			   "soiree" : [ "images/bg/radio-urbex.jpg", "images/bg/frequence.jpg" ],
			   "defaut" : [ "images/bg/radio-urbex.jpg" ] };
			   
			   
			   
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
	if (image != null && image != "") {
		$("#background").fadeOut( 500, function() {
			$("#background").css("background", "url(" + image + ") no-repeat center center fixed");
			$("#background").css("-webkit-background-size", "cover");
			$("#background").css("-moz-background-size", "cover");
			$("#background").css("-o-background-size", "cover");
			$("#background").css("background-size", "cover");
			$("#background").fadeIn(500); 
		});
	}

}

function updateTitle() {
	$(".jp-title").html("<p>" + window.currenttrack + "</p>");
}

function loadInfos() {
	$.ajax({
		url: 'http://admin.radiocratie.com/api/live-info?type=show_content',
		dataType: 'jsonp',
		success: function(data){
			currenttime = Date.parse(data.schedulerTime);
			nexttracktime = Date.parse(data.next.starts) + 7200000; // 2 heures (GMT + 2)
			nextshowtime = Date.parse(data.nextShow[0].starts);

			window.currenttrack = data.current.name;
			window.currentshow = data.currentShow[0].name;

			if (window.firstLoad) {
					updateBackground();
					window.firstLoad = false;
			}

			updateTitle();
			
			setTimeout("loadInfos()", nexttracktime - currenttime);
			
			if (window.nextShow != nextshowtime) {
				window.nextShow = nextshowtime;
				setTimeout("updateBackground()", nextshowtime - currenttime);
			}
			
		}
	});
	
}

$(document).ready(function(){
	
	window.firstLoad = true;
	window.currentshow = null;
	window.nextShow = -1;
	loadInfos();
	
	bgUpdateDelay = 5;
	setInterval("updateBackground()", 1000 * 60 * bgUpdateDelay); // mise à jour toutes les n minutes
	
   }
);

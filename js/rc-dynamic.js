

function updatePageTitle() {
  msg = "Radiocratie";
  if (window.playStatus) {
      msg += " ♪ " + window.currenttrack;
  }
  window.document.title = msg;
}

function simplifyDateTime(datetime) {
    time = datetime.split(" ")[1];
    basictime = time.split(".")[0];
    return basictime;
}

function preparePopup() {
  
  $( "#dialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "drop",
        direction: "up",
        duration: 200
      },
      hide: {
        effect: "drop",
        direction: "up",
        duration: 200
      },
      width: 'auto'
    });
 
    $( ".jp-title" ).on( "click", function() {
      $( "#dialog" ).dialog( "open" );
    });
}
			   
			   
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
  /** le titre affiché */
	$(".jp-title").html("<p>" + window.currenttrack + "</p>");
	$(".jp-title").tooltip({destroy: true});
  
  /** les titres du popup */
  content = "<table><tr><th>Début</th><th>Fin</th><th>Titre - Artiste</th></tr>";
  if (window.currenttrack) {
      content += "<tr class=\"encours\"><td>" + window.currenttrackstarts + "</td><td>" + window.currenttrackends + "</td><td>" + window.currenttrack + "</td></tr>";    
  }
  if (window.previoustrack) {
      content += "<tr class=\"prev\"><td>" + window.previoustrackstarts + "</td><td>" + window.previoustrackends + "</td><td>" + window.previoustrack + "</td></tr>";    
  }
  if (window.previoustrack2) {
      content += "<tr class=\"prev2\"><td>" + window.previoustrack2starts + "</td><td>" + window.previoustrack2ends + "</td><td>" + window.previoustrack2 + "</td></tr>";    
  }
  content += "</table>";
  $("#dialog").html(content);
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


      if (window.previoustrack && data.previous.name != window.previoustrack) {
        window.previoustrack2 = window.previoustrack;
        window.previoustrack2starts = window.previoustrackstarts;
        window.previoustrack2ends = window.previoustrackends;
      }
      
      window.previoustrack = data.previous.name;
      window.previoustrackstarts = simplifyDateTime(data.previous.starts);
      window.previoustrackends = simplifyDateTime(data.previous.ends);
      
			window.currenttrack = data.current.name;
      window.currenttrackstarts = simplifyDateTime(data.current.starts);
      window.currenttrackends = simplifyDateTime(data.current.ends);
      
			window.currentshow = data.currentShow[0].name;
			window.endofcurrenttrack = Date.now() + (nexttracktime - currenttime);

			updateTitle();
      updatePageTitle();
			
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

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

$(document).ready(function(){
	
  
  
  preparePopup();
  if (!window.mobilecheck()) {
    $( document ).tooltip({ show: {delay: 700}});
  }
	
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
  $('#side-note-button').click(function() {
    $('#side-note').toggleClass("visible");
    $('#side-note-button').toggleClass("visible");
    if ($('#side-note').hasClass("visible")) {
      $('#side-note-button button').text("-");
    }
    else {
      $('#side-note-button button').text("+");
    }

  });
	
   }
   
);

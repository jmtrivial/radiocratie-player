
function updatePageTitle() {
  msg = "Radiocratie";
  if (window.playStatus) {
	msg = window.currenttrack.replace("&amp;", "&") + " ♪ " + msg + " 📾";
  }
  else {
      msg = "📾 " + msg;
  }
  window.document.title = msg;
}

function updateUrl(playing) {
	window.localupdate = true;
	if (window.bitrate != null) {
		if (playing)
			window.location = "/#p" + window.bitrate;
		else
			window.location = "/#" + window.bitrate;
	}
}

function selectBitrate(value, log = true) {
	window.bitrate = value;
	if (value == 128) {
		window.selectedFlux = "http://flux.radiocratie.com/flux-128";
		$('span.hd').removeClass("active");
	}
	else /*if (value == 192) */ {
		value = 192;
		window.selectedFlux = "http://flux.radiocratie.com/flux";
		$('span.hd').addClass("active");
	}
	
	if (log) {
		if (window.playStatus)
			window.history.pushState(null, document.title + " " + value, "/#p" + value);
		else
			window.history.pushState(null, document.title + " " + value, "/#" + value);
	}
	
	if (window.playStatus) {
		$("#jquery_jplayer").jPlayer('setMedia', { mp3: window.selectedFlux });
		$("#jquery_jplayer").jPlayer("play");
	}
}
$(document).ready(function(){
	
	/** display player */
	$(".jp-controls").css("display", "block");
	$(".jp-volume-controls").css("display", "block");
	$("#nojs").css("display", "none");


	ready = false;
	window.playStatus = false;
	window.localupdate = false;

	if (window.location.hash == "#p128" || window.location.hash == "#p192" ) {
		window.playStatus = true;
	}
	
	// Instance jPlayer
	$("#jquery_jplayer").jPlayer({
		ready: function () {
			ready = true;
			$(this).jPlayer("setMedia", {
					mp3: window.selectedFlux });
			
			if (window.location.hash == "#128" || window.location.hash == "#p128" ) {
				selectBitrate(128);
				$('#rc-checkbox').prop('checked', false);
			}
			else {
				selectBitrate(192);
				$('#rc-checkbox').prop('checked', true);
			}
			$("#rc-checkbox").rcCheckbox();
		},
		play: function() {
				window.playStatus = true;
				updateUrl(true);
        updatePageTitle();
		},
		pause: function() {
			$(this).jPlayer("clearMedia");
			window.playStatus = false;
			updateUrl(false);
      updatePageTitle();
		},
		error: function(event) {
			if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
				// Setup the media stream again and play it.
				$("#jquery_jplayer").jPlayer("setMedia", {mp3: window.selectedFlux} );
				$("#jquery_jplayer").jPlayer("play");
			}
		},
		volume: 1.0,
		preload: 'none',
		cssSelectorAncestor: "#jp_container",
		supplied: "mp3",
		cssSelector: {
			play: ".jp-play",
			pause: ".jp-pause",
			mute: ".jp-mute",
			unmute: ".jp-unmute"
		},
		autoBlur: false,
		keyEnabled: true
	});
	
  $(window).bind("beforeunload",function(event) {
    if (window.playStatus)
          return "Vous écoutez Radiocratie. En fermant la page, vous coupez le robinet à musique. Êtes-vous sûr·e ?";
  });

	

	$("#rc-checkbox").change(function(){
		if($("#rc-checkbox").next().hasClass('checked')){
			selectBitrate(192);
		} else {
			selectBitrate(128);
		}
	});
	
	window.addEventListener("popstate", function() {
	  if (window.localupdate) {
		  window.localupdate = false;
	  }
	  else {
		if(location.hash === "#128" || location.hash === "#p128") {
			selectBitrate(128, false);
			$('.rc-ui-select').removeClass('checked');
		}
		else {
			selectBitrate(192, false);
			$('.rc-ui-select').addClass('checked');

		}
	  }
    }, false);

	
});

 $(document).keypress(function(evt) {
	var keyCode = 0; 
        if (evt)  { 
        	keyCode = evt.keyCode || evt.which; 
        } 
        else { 
              // For IE 
              keyCode = window.event.keyCode; 
        }
	switch (keyCode) { 
		case 32:
			if (!window.playStatus)
				$("#jquery_jplayer").jPlayer("play");
			else
				$("#jquery_jplayer").jPlayer("pause");	
	};
});


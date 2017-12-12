$(document).ready(function(){
	
	for(var periode in images) {
		console.log(periode);
		$("#liste-images").append("<h2>Émission « " + periode + " »</h2>");
		for(var image in images[periode]) {
			img = images[periode][image];
			$("#liste-images").append("<div class=\"img\"><a style=\"float: left\" href=\"" + img + "\"><img src=\"" + img + "\" /></a> <span style=\"float: left; clear: both\">"+ img + "</span></div>");
		}
		
	}
});

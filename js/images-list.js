$(document).ready(function(){
	
	for(var periode in images) {
		console.log(periode);
		$("#liste-images").append("<h2>Émission « " + periode + " »</h2>");
		for(var image in images[periode]) {
			img = images[periode][image];
			$("#liste-images").append("<div class=\"img\"><a href=\"" + img + "\"><img src=\"" + img + "\" /></a></div>");
		}
		
	}
});

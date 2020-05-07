$(document).ready(function(){
	$("#nextButton").click(function() {
		window.location.href="{{ url_for('vca') }}"
	});
})
$(document).ready(function(){
	$("#nextButton").click(function() {
		window.location.href="{{ url_for('quiz') }}"
	});
	$("#backButton").click(function() {
		window.location.href="{{ url_for('vca') }}"
	});
})
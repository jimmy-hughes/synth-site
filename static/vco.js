// Nexus colors
let accent = "#0057ffff";
let fill = "#fff8e4ff";
// Cable colors
let red = "#ff5542"

let step = 1;
var line = null;

// Patching
let firstPoint = "";
let connections = {
  "mSinPoint": "",
  "mCVPoint": "",
  "cSinPoint": "",
  "cCVPoint": "",
  "inPoint": ""
};
let cables = {};

let car = new p5.Oscillator('sine');
cstate = {
  freq: 300,
  amp: 0.8,
  mute: true,
  minf: 100,
  maxf: 1000,
  mina: 0,
  maxa: 1
}
car.freq(cstate.freq);
car.amp(cstate.amp);

var displayDials = function(){
	// Carrier Osc Dials
	var cfreq = Nexus.Add.Dial('#cfreq',{
		'size': [80,80],
		'min': cstate.minf,
		'max': cstate.maxf,
		'value': cstate.freq
	});
	cfreq.on('change',function(v) {
		cstate.freq = v;
		car.freq(v);
		if (step == 4) {
			line.remove();
			$("#nextButton").show();
			step = 5;
		}
	});
	cfreq.colorize("accent",accent)
	cfreq.colorize("fill",fill)

	var ccv = Nexus.Add.Dial('#ccv',{
		'size': [40,40],
		'min': 0,
		'max': 100,
		'value': 20
	});
	ccv.colorize("accent",accent)
	ccv.colorize("fill",fill)

	// VCA Dials
	var cvatt = Nexus.Add.Dial('#cvAttDial',{
		'size': [50,50],
	});
	cvatt.colorize("accent",accent)
	cvatt.colorize("fill",fill)

	var base = Nexus.Add.Dial('#baseDial',{
		'size': [50,50],
	});
	base.colorize("accent",accent)
	base.colorize("fill",fill)

	var vol = Nexus.Add.Dial('#volDial',{
		'size': [50,50],
		'min': cstate.mina,
		'max': cstate.maxa,
		'value': cstate.amp
	});
	vol.on('change',function(v) {
		cstate.amp = v;
		car.amp(v);
	});
	vol.colorize("accent",accent)
	vol.colorize("fill",fill)
}
  
var connectCar = function(){
car.start();
}

var disconnectCar = function(){
car.stop();
}

var connectP5 = function(pt1, pt2){
	if ((pt1=="cSinPoint" && pt2=="inPoint") || (pt2=="cSinPoint" && pt1=="inPoint"))
		connectCar();
}

var disconnectP5 = function(pt1, pt2){
	if ((pt1=="cSinPoint" && pt2=="inPoint") || (pt2=="cSinPoint" && pt1=="inPoint"))
		disconnectCar();
}

var removeCable = function(pt1, pt2) {
	if ((pt1+pt2) in cables){
	  cables[pt1+pt2].remove();
	  delete cables[pt1+pt2];
	}  
	else if ((pt2+pt1) in cables){
	  cables[pt2+pt1].remove();
	  delete cables[pt2+pt1];
	}
}

var drawCable = function(pt1, pt2) {
  var startElement = document.getElementById(pt1),
  endElement = document.getElementById(pt2);
  var line = new LeaderLine(startElement, endElement, {color: red, size: 6, endPlug: 'behind'});
}

var drawCircle = function(point){
	$("#"+point).css({"border":"solid","border-color":red});
  }

var removeCircle = function(point){
	$("#"+point).css("border","none");
  }

  var connect = function(pt1, pt2){
	if (pt1 != pt2) {
	  connectP5(pt1,pt2);
	  drawCable(pt1, pt2);
	  connections[pt1] = pt2;
	  connections[pt2] = pt1;
	}  
	firstPoint = "";
	removeCircle(pt1);
  }

  var disconnect = function(pt1, pt2){
	disconnectP5(pt1,pt2);
	removeCable(pt1,pt2);
	connections[pt1] = "";
	connections[pt2] = "";
  }

  var handlePatch = function(point){
	// if user clicks on patched point remove patch
	if (connections[point] != "") {
	  disconnect(point, connections[point])
	}
  
	if (firstPoint == ""){
	  firstPoint = point;
	  drawCircle(point);
	}
	else {
	  connect(firstPoint, point)
	}
  }

// Master Oscilloscope
let c = function(p){
  p.setup = function(){
    p.createCanvas(200, 150);
    p.noFill();
    p.frameRate(12);
    analyzer = new p5.FFT();
  };
  p.draw = function(){
    p.background(255);
    waveform = analyzer.waveform();
    // draw the shape of the waveform
    p.stroke(red);
    p.strokeWeight(5);
    p.beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = p.map(i, 0, waveform.length, 0, p.width);
      let y = p.map(waveform[i], -1, 1, -p.height / 2, p.height / 2);
      p.vertex(x, y + p.height / 2);
    }
    p.endShape();
  };
};
new p5(c, 'masteroscil');


$(document).ready(function(){
	
	displayDials();

	var startElement = document.getElementById("s1"),
	endElement = document.getElementById("cSinPoint");
	line = new LeaderLine(startElement, endElement, {color: red, size: 6});
	// let s2line = new LeaderLine(startElement, endElement, {color: red, size: 6});
	// s2line.remove();

	// Patching 	
	  $("#cSinPoint").click(function() {
		handlePatch("cSinPoint");
		if (step < 2){
			line.remove();
			$("#s2").show();
			var startElement = document.getElementById("s2"),
			endElement = document.getElementById("inPoint");
			line = new LeaderLine(startElement, endElement, {color: red, size: 6});
			step = 2;
		}
	  });
	
	  $("#cCVPoint").click(function() {
		handlePatch("cCVPoint");
	  });
	
	  $("#inPoint").click(function() {
		handlePatch("inPoint");
		if (step < 3){
			line.remove();
			$("#pt2").show();
			var startElement = document.getElementById("pt2"),
			endElement = document.getElementById("cfreq");
			line = new LeaderLine(startElement, endElement, {color: red, size: 6});
			step = 4;
		}
	  });

	$("#nextButton").click(function() {
		window.location.href="fm";
	});
	$("#nextButton").hide();

	$("#backButton").click(function() {
		window.location.href="vca";
	});

	$("#s2").hide();
	$("#pt2").hide();
})
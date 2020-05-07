// Nexus colors
let accent = "#0057ffff";
let fill = "#fff8e4ff";
// Cable colors
let red = "#ff5542"

let car = new p5.Oscillator('sine');
cstate = {
  freq: 300,
  amp: 0,
  mute: true,
  minf: 100,
  maxf: 1000,
  mina: 0,
  maxa: 1
}
car.freq(cstate.freq);
car.amp(cstate.amp);
car.start();

var displayDials = function(){
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

var drawCable = function(pt1, pt2) {
  var startElement = document.getElementById(pt1),
  endElement = document.getElementById(pt2);
  var line = new LeaderLine(startElement, endElement, {color: red, size: 6, endPlug: 'behind'});
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
	drawCable("pt1","inPoint");
	var startElement = document.getElementById("pt2"),
	endElement = document.getElementById("volDial");
	var line = new LeaderLine(startElement, endElement, {color: red, size: 6});

	$("#nextButton").click(function() {
    window.location.href="vco";
	});

	$("#backButton").click(function() {
    window.location.href="mod";
	});
})
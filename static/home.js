let red = "#ff5542"

let mod = new p5.Oscillator('sine');
mstate = {
  freq: 20,
  amp: 115,
  mute: true,
  minf: 1,
  maxf: 100,
  mina: 0,
  maxa: 200
}
mod.freq(mstate.freq);
mod.amp(mstate.amp);

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

car.start();
mod.start();
mod.disconnect();
car.freq(mod);
car.amp(0);

$(document).ready(function(){
	$("#masteroscil").mousedown(function() {
		car.amp(0.8, 0.1);
		$("#tutorialButton").show(100000000);
	});

	$("#masteroscil").mouseup(function() {
		car.amp(0, 0.5);
	});

	$("#tutorialButton").click(function() {
    window.location.href="mod";
	});

	$("#tutorialButton").hide();
})

// Oscilloscope
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
	p.rect(0,0,p.width,p.height,10);
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
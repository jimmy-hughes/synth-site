// todo: 
//       change to noLoop() and redraw() only when freq or modulation changes?
//       display output (use fft or math?)

// Nexus colors
let accent = "#0057ffff";
let fill = "#fff8e4ff";

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

$(document).ready(function(){
  // Modulator Osc Dials
  $("#mmute").click(function(){
    mstate.mute = !mstate.mute;
    if (!mstate.mute) {
      mod.start();
      mod.disconnect();
      car.freq(mod);
      $("#mmute").css("background-color","white")
    }
    else {
      mod.stop();
      $("#mmute").css("background-color","red")
    }
  })

  var mfreq = Nexus.Add.Dial('#mfreq',{
    'size': [80,80],
    'min': mstate.minf,
    'max': mstate.maxf,
    'value': mstate.freq,
  });
  mfreq.on('change',function(v) {
    mstate.freq = v;
    mod.freq(v);
  });
  mfreq.colorize("accent",accent)
  mfreq.colorize("fill",fill)

  var mcv = Nexus.Add.Dial('#mcv',{
    'size': [40,40],
  });
  mcv.colorize("accent",accent)
  mcv.colorize("fill",fill)

  // Carrier Osc Dials
  $("#cmute").click(function(){
    cstate.mute = !cstate.mute;
    if (!cstate.mute) {
      car.start();
      $("#cmute").css("background-color","white")
    }
    else {
      car.stop();
      $("#cmute").css("background-color","red")
    }
  })

  var cfreq = Nexus.Add.Dial('#cfreq',{
    'size': [80,80],
    'min': cstate.minf,
    'max': cstate.maxf,
    'value': cstate.freq
  });
  cfreq.on('change',function(v) {
    cstate.freq = v;
    car.freq(v);
  });
  cfreq.colorize("accent",accent)
  cfreq.colorize("fill",fill)

  var ccv = Nexus.Add.Dial('#ccv',{
    'size': [40,40],
    'min': mstate.mina,
    'max': mstate.maxa,
    'value': mstate.amp
  });
  ccv.on('change',function(v) {
    mstate.amp = v;
    mod.amp(v);
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

  // Patch Cables
  var startElement = document.getElementById('mSinPoint'),
  endElement = document.getElementById('cCVPoint');
  new LeaderLine(startElement, endElement, {color: 'red', size: 8});
  var startElement = document.getElementById('cSinPoint'),
  endElement = document.getElementById('inPoint');
  new LeaderLine(startElement, endElement, {color: 'red', size: 8});
})

// Modulator Oscilloscope
let a = function(p){
  p.setup = function(){
    p.createCanvas(300, 200);
    p.noFill();
    p.frameRate(24);
  };
  p.draw = function(){
    freq = mstate.freq;
    amp = mstate.amp;
    xspacing = Math.floor(freq*20);
    wave = new Array(xspacing+1);
    p.background(30);
    // calculate sine wave points
    for (let i=0; i<wave.length; i++) {
      wave[i] = amp*p.sin(i*p.TWO_PI/(10*xspacing)*freq);
    }
    // draw the wave
    p.stroke(255);
    p.strokeWeight(5);
    p.beginShape();
    for (let i = 0; i < wave.length; i++) {
      let x = p.map(i*p.TWO_PI/(10*xspacing), 0, p.TWO_PI/10, 0, p.width);
      let y = p.map(wave[i], -200, 200, -p.height / 2, p.height / 2);
      p.vertex(x, y + p.height / 2);
    }
    p.endShape();
  };
};
new p5(a, 'moscil');

// Carrier Oscilloscope
let b = function(p){
  p.setup = function(){
    p.createCanvas(300, 200);
    p.noFill();
    p.frameRate(24);
  };
  p.draw = function(){
    freq = cstate.freq;
    amp = cstate.amp;
    xspacing = Math.floor(freq/2);
    wave = new Array(xspacing+1);
    p.background(30);
    // calculate sine wave points
    for (let i=0; i<wave.length; i++) {
      wave[i] = amp*p.sin(i*p.TWO_PI/(100*xspacing)*freq);
    }
    // draw the wave
    p.stroke(255);
    p.strokeWeight(5);
    p.beginShape();
    for (let i = 0; i < wave.length; i++) {
      let x = p.map(i*p.TWO_PI/(100*xspacing), 0, p.TWO_PI/100, 0, p.width);
      let y = p.map(wave[i], -1, 1, -p.height / 2, p.height / 2);
      p.vertex(x, y + p.height / 2);
    }
    p.endShape();
  };
};
new p5(b, 'coscil');

// Original Carrier Oscilloscope
let c = function(p){
  p.setup = function(){
    p.createCanvas(400, 200);
    p.noFill();
    p.frameRate(12);
    analyzer = new p5.FFT();
  };
  p.draw = function(){
    p.background(30);
    waveform = analyzer.waveform();
    // draw the shape of the waveform
    p.stroke(255);
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
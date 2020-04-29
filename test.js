// todo: 
//       change to noLoop() and redraw() only when freq or modulation changes?
//       display output using math instead of fft?

// Nexus colors
let accent = "#0057ffff";
let fill = "#fff8e4ff";

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

var displayDials = function(){
  // Modulator Osc Dials
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
}

var connectMod = function(){
  mod.start();
  mod.disconnect();
  car.freq(mod);
}

var disconnectMod = function(){
  mod.stop();
}

var connectCar = function(){
  car.start();
}

var disconnectCar = function(){
  car.stop();
}

var connectP5 = function(pt1, pt2){
  if ((pt1=="mSinPoint" && pt2=="cCVPoint") || (pt2=="mSinPoint" && pt1=="cCVPoint"))
    connectMod();
  else if ((pt1=="cSinPoint" && pt2=="inPoint") || (pt2=="cSinPoint" && pt1=="inPoint"))
    connectCar();
}

var disconnectP5 = function(pt1, pt2){
  if ((pt1=="mSinPoint" && pt2=="cCVPoint") || (pt2=="mSinPoint" && pt1=="cCVPoint"))
    disconnectMod();
  else if ((pt1=="cSinPoint" && pt2=="inPoint") || (pt2=="cSinPoint" && pt1=="inPoint"))
    disconnectCar();
}

var drawCable = function(pt1, pt2) {
  var startElement = document.getElementById(pt1),
  endElement = document.getElementById(pt2);
  var line = new LeaderLine(startElement, endElement, {color: 'red', size: 8});
  cables[pt1+pt2] = line;
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

var drawCircle = function(point){
  $("#"+point).css({"border":"solid","border-color":"red"});
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

$(document).ready(function(){
  displayDials();

  // Patching 
  $("#mSinPoint").click(function() {
    handlePatch("mSinPoint");
  });

  $("#mCVPoint").click(function() {
    handlePatch("mCVPoint");
  });

  $("#cSinPoint").click(function() {
    handlePatch("cSinPoint");
  });

  $("#cCVPoint").click(function() {
    handlePatch("cCVPoint");
  });

  $("#inPoint").click(function() {
    handlePatch("inPoint");
  });


  // Maunally Draw Patch Cables
  // drawCable('mSinPoint','cCVPoint');
  // drawCable('cSinPoint','inPoint');
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
let points = [];
let fixedPoints = [];
let oversampledPoints = [];
let tableStartPosition = 100;
let tableH = 0;
let freq = 0;
let freqMin = 1;
let freqMax = 256;
let sampleRate = 128;
let sampleMin = 1;
let sampleMax = 256;
let phase = 0.0;
let phaseMin = 0.0;
let phaseMax = 6.28318530717958647693; //TAU is not defined before setup

let firstWave = 0;
let secondWave = 0;
let combinedWave = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);
  tableH = (windowHeight - tableStartPosition) / 4;
  firstWave = tableStartPosition;
  secondWave = tableH + tableStartPosition;
  combinedWave = (tableH * 2) + tableStartPosition;
  oversampledWave = (tableH * 3) + tableStartPosition;
  
  freqSlider = createSlider(freqMin, freqMax, 1, 1);
  freqSlider.position(16,0);
  freqSlider.size(windowWidth - 32);
  
  sampleSlider = createSlider(sampleMin, sampleMax, sampleRate, 1);
  sampleSlider.position(16,32);
  sampleSlider.size(windowWidth - 32);
  
  phaseSlider = createSlider(phaseMin, phaseMax, 0.0, TAU / 100);
  phaseSlider.position((windowWidth / 4) * 3, 64);
  phaseSlider.size((windowWidth / 4) - 16);
  
  frameRate(5);
}

function draw() {
  background(255);
  stroke('black');
  strokeWeight(1);
  rect(0,firstWave,windowWidth,tableH);
  rect(0,secondWave,windowWidth,tableH);
  rect(0,combinedWave,windowWidth,tableH);
  rect(0,oversampledWave,windowWidth,tableH);
  if(freq != freqSlider.value()){
    freq = freqSlider.value();
    generateSin();
  }
  if(sampleRate != sampleSlider.value()){
    sampleRate = sampleSlider.value();
    generateSin();
  }
  if(phase != phaseSlider.value()){
    phase = phaseSlider.value();
    generateSin();
  }
  drawArray(points);
  printTexts();
  /*let fps = frameRate();
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);*/
}

function drawArray(array){
  let a = windowWidth / (sampleRate * 4);
  strokeWeight(2);
  stroke('purple');
  for(let i = 1; i < (sampleRate * 4); i++){
    line((i - 1) * a, oversampledPoints[i-1] + oversampledWave, i * a, oversampledPoints[i] + oversampledWave);
    //point(i * a, oversampledPoints[i] + oversampledWave);
  }
  a = windowWidth / (sampleRate * 2);
  stroke('red');
  for(let i = 1; i < (sampleRate * 2); i++){
    line((i - 1) * a, fixedPoints[i-1] + secondWave, i * a, fixedPoints[i] + secondWave);
    line((i - 1) * a, fixedPoints[i-1] + combinedWave, i * a, fixedPoints[i] + combinedWave);
    //point(i * a, fixedPoints[i] + secondWave);
    //point(i * a, fixedPoints[i] + combinedWave);
  }
  a = windowWidth / points.length;
  stroke('blue');
  for(let i = 1; i < points.length; i++){
    line((i - 1) * a, points[i-1] + firstWave, i * a, points[i] + firstWave);
    //line((i - 1) * a, points[i-1] + combinedWave, i * a, points[i] + combinedWave);
    //point(i * a, points[i] + firstWave);
    //point(i * a, points[i] + combinedWave);
  }
  strokeWeight(4);
  for(let i = 1; i < points.length; i++){
    //line((i - 1) * a, points[i-1] + firstWave, i * a, points[i] + firstWave);
    //line((i - 1) * a, points[i-1] + combinedWave, i * a, points[i] + combinedWave);
    //point(i * a, points[i] + firstWave);
    point(i * a, points[i] + combinedWave);
  }
}

function generateSin(){
  points = [];
  fixedPoints = [];
  oversampledPoints = [];
  // Adjustable undersampled sine wave
  for(let i = 0; i < sampleRate; i++){
    points[i] = (Math.sin((TAU * freq * (i / sampleRate)) + phase) + 1) * (tableH / 2);
  }
  // 1024 sample sine wave (max frequency * 2)
  for(let i = 0; i < (sampleRate * 2); i++){
    fixedPoints[i] = (Math.sin((TAU * freq * (i / (sampleRate * 2))) + phase) + 1) * (tableH / 2);
  }
  // Oversampled (2048 sample) sine wave (max frequency * 4)
  for(let i = 0; i < (sampleRate * 4); i++){
    oversampledPoints[i] = (Math.sin((TAU * freq * (i / (sampleRate * 4))) + phase) + 1) * (tableH / 2);
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  tableH = (windowHeight - tableStartPosition) / 4;
  firstWave = tableStartPosition;
  secondWave = tableH + tableStartPosition;
  combinedWave = (tableH * 2) + tableStartPosition;
  oversampledWave = (tableH * 3) + tableStartPosition;
  generateSin();
  freqSlider.size(windowWidth - 32);
  sampleSlider.size(windowWidth - 32);
  phaseSlider.position((windowWidth / 4) * 3, 64);
  phaseSlider.size((windowWidth / 4) - 32);
}

function printTexts(){
  strokeWeight(1);
  stroke('black');
  text('Adjustable Undersampled (1-256) Sine Wave', 0, firstWave + 16);
  text('Nyquist Rate Sine Wave (Nyquist Frequency * 2)', 0, secondWave + 16);
  text('Undersampled-Nyquist Rate Sine Wave Combined', 0, combinedWave + 16);
  text('Oversampled Sine Wave (Nyquist Frequency * 4)', 0, oversampledWave + 16);
  let Text = ['Frequency:', nfs(freq, 3, 0), 'Sample Rate:', nfs(sampleRate, 3, 0), 'Phase:', nfs(phase, 1, 6)];
  text(join(Text, ' '), 16, 80);
}

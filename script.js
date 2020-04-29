let peachTouched = false;
let theyCame = false;
let theyCameTime = -1;
let cumVolume = 1;
let cumPos = {x: 200, y: -5};
let accel = {x: 0, y: 0, z: 0};
let progress = 0;
let pts = [];
let flying = 0;

function preload() {
  tfont = loadFont('assets/font/Mabry Pro.otf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  fill(0);
  stroke(0);
  frameRate(60);
  textAlign(CENTER);
  textSize(20);
  pts = [
    [{x: 140, y: 359}, {x: 188, y: 257}, {x: 267, y: 178}, {x: 358, y:197}],
    [{x: 98, y: 300}, {x: 172, y: 214}, {x: 249, y: 192}, {x: 358, y:197}],
    [{x: 73, y: 242}, {x: 173, y: 192}, {x: 274, y: 184}, {x: 358, y:200}],
    [{x: 70, y: 134}, {x: 136, y: 177}, {x: 250, y: 188}, {x: 358, y:197}],
    [{x: 121, y: 50}, {x: 177, y: 136}, {x: 256, y: 183}, {x: 358, y:197}]
  ];
  cumPos = {x:width/2, y:-20};
}

function draw() {
  background(255);
  if(!peachTouched) {
    text("🍑",width/2,height/2);
  } else if (peachTouched){
    noFill();
    let ax = abs(precise(accel.x,3));
    let ay = abs(precise(accel.y,3));
    let az = abs(precise(accel.z,3));
    if((ax+ay) > 10) {
      progress += 0.05;
    }
    let newpt = lerpPenis(progress);
    translate(0, 202);
    bezier(newpt[0].x, newpt[0].y,
         newpt[1].x, newpt[1].y,
         newpt[2].x, newpt[2].y,
         newpt[3].x, newpt[3].y);
    if(theyCame) {
      if(millis()-theyCameTime < 2000) {
        if((ax+ay) > 10) {
          cumVolume+=0.5;
        }
      } else {
        translate(0, -202);
        cumPos.x += map(noise(frameCount*0.01), 0, 1, -0.5, 0.5);
        cumPos.y += ay*0.2;
        for(let i = 0; i < floor(cumVolume); i++) {
          let cumposx = map(noise(i*0.05,flying), 0, 1, 0, width-100);
          text("💦", cumposx, cumPos.y-i*20);
        }
      }

    }
  }
  flying-=0.001;
}

function touchEnded() {
  if(!peachTouched) {
    requestDeviceMotion();
    peachTouched = true;
  }
}

function lerpPenis(hardness) {
  hardness = constrain(hardness, 0, pts.length+2);
  if(hardness == pts.length+2 && !theyCame) {
    theyCame = true;
    theyCameTime = millis();
  }
  let lowidx = constrain(floor(hardness),0,pts.length-2);
  let highidx = lowidx+1;
  let lowpt = pts[lowidx];
  let highpt = pts[highidx];
  let newpt = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
  let fract = hardness - lowidx;
  for(let i = 0; i < 4; i++) {
    let newptx = lerp(lowpt[i].x,highpt[i].x,fract);
    let newpty = lerp(lowpt[i].y,highpt[i].y,fract);
    newpt[i].x = newptx;
    newpt[i].y = newpty;
  }
  return newpt;
}

// returns true if device motion is supported on device
function supportsDeviceMotion () {
  return window.DeviceMotionEvent;
}

// request device motion from user
function requestDeviceMotion() {
  // feature detect
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', deviceMotionHandler, false);
        }
      })
      .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
  }
}

function deviceMotionHandler(eventData) {
  var info, xyz = "[X, Y, Z]";

  // Grab the acceleration from the results
  // var acceleration = eventData.acceleration;
  // if(acceleration.hasOwnProperty('x')) {
  //   info = xyz.replace("X", acceleration.x);
  //   info = info.replace("Y", acceleration.y);
  //   info = info.replace("Z", acceleration.z);
  //   // document.getElementById("moAccel").innerHTML = info;
  // }

  // Grab the acceleration including gravity from the results
  var acceleration_gravity = eventData.accelerationIncludingGravity;
  if(acceleration_gravity) {
    accel.x = acceleration_gravity.x;
    accel.y = acceleration_gravity.y;
    accel.z = acceleration_gravity.z;
  }

  // // Grab the refresh interval from the results
  info = eventData.interval;
  // document.getElementById("moInterval").innerHTML = info;
}

function precise(x,sigfig) {
  return Number.parseFloat(x).toPrecision(sigfig);
}

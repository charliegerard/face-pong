let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;
let positionX = 140;

let trained = false;

function setup() {
  createCanvas(340, 280);
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.hide();
  // Extract the features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  // Create a new regressor using those features and give the video we want to use
  regressor = featureExtractor.regression(video, videoReady);
  // Create the UI buttons
  setupButtons();
}

function draw() {
  image(video, 0, 0, 340, 280);
  // noStroke();
  // fill(255, 0, 0);
  // rect(positionX, 120, 50, 50);

  if(trained){
    document.getElementsByClassName('prediction-section')[0].classList.add('no-display');
    document.getElementsByTagName('canvas')[0].classList.add('no-display');
  }

  if(player2 && player2.windowY){
    // console.log(player2.windowY.target);
    player2.windowY.target = positionX * 2.5;
  }

}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Model loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
  select('#videoStatus').html('Video ready!');
}

// Classify the current frame.
function predict() {
  regressor.predict(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  slider = select('#slider');
  // Add sample button
  select('#addSample').mousePressed(function() {
    regressor.addImage(slider.value());
    select('#amountOfSamples').html(samples++);
  });

  // Train Button
  select('#train').mousePressed(function() {
    regressor.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  select('#buttonPredict').mousePressed(predict);
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  trained = true;
  positionX = map(result, 0, 1, 0, width);
  // console.log(positionX)
  slider.value(result);
  predict();
}

// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads.
$(document).ready(function () {
  render($("#display"), image);
  $("#apply").on("click", applyAndRender);
  $("#reset").on("click", resetAndRender);
});

/////////////////////////////////////////////////////////
//////// event handler functions are below here /////////
/////////////////////////////////////////////////////////

// this function resets the image to its original value; do not change this function
function resetAndRender() {
  reset();
  render($("#display"), image);
}

// this function applies the filters to the image and is where you should call
// all of your apply functions
function applyAndRender() {
  // Multiple TODOs: Call your apply function(s) here
  applyFilterNoBackground(reddify);
  applyFilterNoBackground(decreaseBlue);
  applyFilterNoBackground(increaseGreenByBlue);
  applyFilter(increaseGreenByBlue);
  applyFilter(decreaseBlue);
  applyFilter(invert);
  

  // do not change the below line of code
  render($("#display"), image);
}

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO 1, 2, 3 & 5: Create the applyFilter function here
function applyFilter(filterFunction) {
  for (var r = 0; r < image.length; r++) {
    var row = image[r];
    for (var c = 0; c < row.length; c++) {
      var pixel = row[c];
      var pixelArray = rgbStringToArray(pixel);
      // this'll be where I will modify color values later
      filterFunction(pixelArray);
      var updatedPixel = rgbArrayToString(pixelArray);
      image[r][c] = updatedPixel;
    }
  }
}

// TODO 9 Create the applyFilterNoBackground function
function applyFilterNoBackground(filterFunction) {
  var backgroundColor = image[0][0];
  for (var r = 0; r < image.length; r++) {
    for (var c = 0; c < image[r].length; c++) {
      var pixel = image[r][c];
      if (image[r][c] !== backgroundColor) {
        var pixelArr = rgbStringToArray(pixel);
        filterFunction(pixelArr);
        var updatedPixel = rgbArrayToString(pixelArr);
        image[r][c] = updatedPixel;
      }
    }
  }
}

// TODO 6: Create the keepInBounds function
function keepInBounds(number) {
  return (number < 0) ? 0 : (number > 255) ? 255 : number;
}

// TODO 4: Create reddify filter function
function reddify(pixelArr) {
  pixelArr[RED] = 200;
}

// TODO 7 & 8: Create more filter functions
function decreaseBlue(pixelArr) {
  pixelArr[BLUE] -= 50;
  pixelArr[BLUE] = keepInBounds(pixelArr[BLUE]);
}
function increaseGreenByBlue(pixelArr) {
  pixelArr[GREEN] += pixelArr[BLUE];
  pixelArr[GREEN] = keepInBounds(pixelArr[GREEN]);
}

function invert(pixelArr) {
  pixelArr[RED] = 255 - pixelArr[RED];
  pixelArr[RED] = keepInBounds(pixelArr[RED]);
  pixelArr[BLUE] = 255 - pixelArr[BLUE];
  pixelArr[BLUE] = keepInBounds(pixelArr[BLUE]);
  pixelArr[GREEN] = 255 - pixelArr[GREEN];
  pixelArr[GREEN] = keepInBounds(pixelArr[GREEN]);
}
// CHALLENGE code goes below here

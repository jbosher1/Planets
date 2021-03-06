

/**
Create a GLSL program object and make it the current GLSL program using
HTML <script> elements with Element ID 'vshaderID' and 'fshaderID'

@param {Object} gl GL context

@param {String} vshaderID - HTML Element ID of <script> element containing a
vertex shader program

@param {String} fshaderID - HTML Elemend ID of <script> element containing
fragment shader program

 @return true, if the program object was created and successfully made current
**/
function initShadersFromID(gl, vshaderID, fshaderID) {
  var vertElem = document.getElementById(vshaderID);
  if (!vertElem) {
        alert("Unable to load vertex shader " + vshaderID);
        return false;
  }

  var fragElem = document.getElementById(fshaderID);
  console.log("Running");
  if ( !fragElem ) {
        alert("Unable to load vertex shader " + fshaderID);
        return false;
  }

  var program = createProgram(gl, vertElem.text, fragElem.text);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

/**
 * @author Zachary Wartell using Code Listing 10.1 from Matsuda, Kouichi; Lea, Rodger (see REFERENCE)
 *
 * This functions initializes and several event handler that implement a simple mouse user interface for 3D object rotation.
 *
 * The event handlers detect mouse motion when the left-button is held down.   The xy cursor
 * motion is used to compute and update two rotation angles stored in Array "currentAngle"  as values:
 *
 *      [x-axis rotation angle, y-axis rotation angle]
 *
 * After mouseRotation_initEventHandlers is called the rotation angles stored in "currentAngle" will be continuously updated.
 * x-axis rotation is kept in range [-90,90] degrees
 * y-axis rotation is allow to have arbitrary value.
 *
 *      @param {Object} canvas - HTML 5 Canvas
 *      @param {Number[]} currentAngle - Array of 2 numbers contain x-axis and y-axis rotation angles
 *
 * REFERENCE:
 * -[Modified] Used without permission.  Code Listing 10.1 from Matsuda, Kouichi; Lea, Rodger.
 *
 * WebGL Programming Guide: Interactive 3D Graphics Programming with WebGL (OpenGL) (Kindle Location 7678).
 * Pearson Education. Kindle Edition.
**/
function mouseRotation_initEventHandlers(canvas, currentAngle) {
    var dragging = false;         // Dragging or not
    var lastX = -1, lastY = -1;   // Last position of the mouse

    canvas.onmousedown = function (ev) {   // Mouse is pressed
        var x = ev.clientX, y = ev.clientY;
        // Start dragging if a moue is in <canvas>
        var rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            lastX = x;
            lastY = y;
            dragging = true;
        }
    };

    canvas.onmouseup = function (ev) {
        dragging = false;
    }; // Mouse is releaseds

    canvas.onmousemove = function (ev) { // Mouse is moved
        var x = ev.clientX, y = ev.clientY;
        if (dragging) {
            var factor = 100 / canvas.height; // The rotation ratio
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            // Limit x-axis rotation angle to -90 to 90 degrees
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
            currentAngle[1] = currentAngle[1] + dx;
        }
        lastX = x, lastY = y;
    };
}

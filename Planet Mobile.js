/**
 * @author Zachary Wartell, Jialei Li, K.R. Subrmanian
 *
 */




/*****
 *
 * GLOBALS
 *
 *****/

var lastTimestamp=null;

var debug = {showDelta : false};
var repaint;
var rootCS;
var paused = false;
var selectables = new Array();



/*****
 *
 * MAIN
 *
 *****/
function main() {

    /* uncomment to just run unit tests */
    var unitTest=false;
    unitTest=false;
    if (unitTest)
    {
          Mat2_test();
          Mat3_test();
          //return;
    }

    /**
     **      Initialize WebGL Components
     **/

    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    /**
     **    Initialize some test Drawable's
     **/
    var shader = new Shader(gl, "vertex-shader", "fragment-shader");
    var renderables = new Array();

    modelViewStack = new Mat3Stack(gl);

    /*
     * Student Note: the conditionally executed calls below enable calls to various
     * testing functions in Tests.js.   See each function's description for details.
     * You can enable and disable calls to these functions to test various parts of your implementation
     * of math2D.js, Mat3Stack.js and the classes in Renderable.js
     * In your final version of Planet Mobile, these test code calls would be replaced by code that creates
     * and initializes all the planet objects in their CoordinateSystem tree.
     */
    {// begin test code
    if (0)
        SimpleRenderable_test1(renderables,shader);
    if (0)
        TestStack_test1(renderables,shader);
    if (0)
        CoordinateSystem_test1(renderables,shader,gl);
    if (0)
        CoordinateSystem_test2(renderables,shader,gl);

    }// end test code


    var skeleton=false;
    if(skeleton)
    {
        document.getElementById("App_Title").innerHTML += "-Skeleton";
    }

    /**
     **    Initialize Misc. OpenGL state
     **/

    create_universe(gl, shader, renderables);
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    /**
     **      Set Event Handlers
     **
     **  Student Note: the WebGL book uses an older syntax. The newer syntax, explicitly calling addEventListener, is preferred.
     **  See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     **/
    // set event handlers buttons
    document.getElementById("PauseButton").addEventListener(
            "click",
            function () {
                if (paused){
                  paused = false;
                  lastTimestamp = null;
                  document.getElementById("PauseButton").innerHTML = "Pause";
                  requestAnimationFrame(repaint);
                } else{
                  paused = true;
                  document.getElementById("PauseButton").innerHTML = "Play";
                }
            });

    // Register function (event handler) to be called on a mouse press
    canvas.addEventListener(
            "mousedown",
            function (ev) {
                handleMouseDown(ev, gl, canvas, renderables);
                });


    /**
     **   Initiate Animation Loop
     **/
    // define repaint function
    repaint = function(timestamp)
    {
        // draw and animate all objects for this frame
        if (lastTimestamp !== null)
        {
            // update time info
            var delta = timestamp-lastTimestamp; // 'delta' = time that has past between this call and previous call to this repaint function
            lastTimestamp = timestamp;

            // animate everything (i.e. update geometry, positions, colors, etc. of all Renderable objects
            animateFrame(renderables,delta);

            // draw everything
            rootCS.update(delta, 3.0);
            drawFrame(gl,renderables);
            // some debug output
            if (debug.showDelta)
                console.log("Delta: "+delta);
        }
        if (paused == false) {
          lastTimestamp = timestamp;
          requestAnimationFrame(repaint);
        } else {
          lastTimestamp = null;
        }

        // request another call to repaint function to render next frame
    };
    // make first call to repaint function
    requestAnimationFrame(repaint);
}



/*****
 *
 * FUNCTIONS
 *
 *****/


/* @author Zachary Wartell && ..
 * This function should update all geometry, positions, transforms, colors, etc. of all Renderable objects
 *
 * @param {renderables} - array of all created ShaderRenderable objects
 * @param {delta} - time that has past since last rendered frame
 */
function animateFrame(renderables,delta)
{
    for (i=0;i<renderables.length;i++)
        if (renderables[i] instanceof ShaderRenderable)
            {
                renderables[i].color[0] += delta * 0.001;
                //clle.log(renderables[i].color[0]);
                if (renderables[i].color[0] > 1.0)
                    renderables[i].color[0] = 0.1;
            }
}

/*
 * Handle mouse button press event.
 *
 * @param {MouseEvent} ev - event that triggered event handler
 * @param {Object} gl - gl context
 * @param {HTMLCanvasElement} canvas - canvas
 * @param {Array} renderables - Array of Drawable objects
 * @returns {undefined}
 */
function handleMouseDown(ev, gl, canvas, renderables) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    // Student Note: 'ev' is a MouseEvent (see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)

    // convert from canvas mouse coordinates to GL normalized device coordinates
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    var selected = false;
    console.log(selectables);
    for (var i = 0; i < selectables.length; i++){
      if (selectables[i].point_inside(new Vec2([x,y]))){
        selected = selectables[i];
      }
    }

    if (selected){
      document.getElementById("Selected").innerHTML = "Selected: " + selected.name;
    }else{
      document.getElementById("Selected").innerHTML = "Selected: None";
    }

   // \todo test all Shape objects for selection using their point_inside method's

   //requestAnimationFrame(repaint);
}

/* @author Zachary Wartell
 * Draw all Renderable objects
 * @param {Object} gl - WebGL context
 * @param {Array} renderables - Array of Renderable objects
 * @returns {undefined}
 */
function drawFrame(gl, renderables) {

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // init model view stack
    modelViewStack.loadIdentity();

    // draw all Renderable objects
    for(var i=0;i<renderables.length;i++)
        renderables[i].render();
}

/**
 * Converts 1D or 2D array of Number's 'v' into a 1D Float32Array.
 * @param {Number[] | Number[][]} v
 * @returns {Float32Array}
 */
function flatten(v)
{
    var n = v.length;
    var elemsAreArrays = false;

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array(n);

    if (elemsAreArrays) {
        var idx = 0;
        for (var i = 0; i < v.length; ++i) {
            for (var j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for (var i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }

    return floats;
}

function create_universe(gl,shader, renderables){
  document.getElementById("Selected").style.color = "white";
  rootCS = new CoordinateSystem();
  rootCS.origin.x = 0.0; rootCS.origin.y = 0.0;

  universe = new CoordinateSystem();
  universe.scale.x = 1.3; universe.scale.y = 1.3;
  universe.velocity = 15.0;
  rootCS.add_child(universe);

  sunCS = new CoordinateSystem();
  sunCS.origin.x = 0.0; sunCS.origin.y = 0.0;
  universe.add_child(sunCS);

  sun = new UnitDisc(gl,shader, {
    name: "STAR",
    center: new Vec2([0.0,0.0]),
    radius: 0.08,
    numVertices : 30,
    color: [1.0, 1.0, 0.0, 1.0],
    selectable: true
  });
  sunCS.add_shape(sun);
  selectables.push(sun);

  planet1CS = new CoordinateSystem();
  planet1CS.origin.x = 0.15; planet1CS.origin.y = 0;
  planet1CS.scale.x = 0.1; planet1CS.scale.y = 0.1;
  universe.add_child(planet1CS);

  planet1 = new UnitDisc(gl, shader, {
    name : "planet_1",
    center : new Vec2([0.0,0.0]),
    radius: 0.1,
    numVertices: 15,
    color : [1.0, 0.0, 1.0, 1.0],
    selectable: true,
    velocity: 15.0
  });
  planet1CS.add_shape(planet1);
  selectables.push(planet1);

  planet2CS_orbit = new CoordinateSystem();
  planet2CS_orbit.origin.x = 0.0; planet2CS_orbit.origin.y = .0;
  planet2CS_orbit.scale.x = 1.0; planet2CS_orbit.scale.y = 1.0;
  planet2CS_orbit.velocity = 4;
  universe.add_child(planet2CS_orbit);

  planet2CS = new CoordinateSystem();
  planet2CS.origin.x = 0.2; planet2CS.origin.y = .2;
  planet2CS.scale.x = 0.1; planet2CS.scale.y = 0.1;
  planet2CS.velocity = 35;
  planet2CS_orbit.add_child(planet2CS);

  planet2 = new UnitDisc(gl, shader, {
    name : "planet_2",
    center: new Vec2([0.0,0.0]),
    radius: 0.3,
    numVertices: 30,
    color : [1.0,0.0,0.0,1.0],
    selectable : true,
    velocity : 15
  });
  planet2CS.add_shape(planet2);
  selectables.push(planet2);

  p2_moonCS = new CoordinateSystem();
  p2_moonCS.origin.x = 0.5; p2_moonCS.origin.y = 0.0;
  p2_moonCS.scale.x = 0.1; p2_moonCS.scale.y = 0.1;
  planet2CS.add_child(p2_moonCS);

  p2_moon = new UnitDisc(gl, shader, {
    name : "p2_moon1",
    center : new Vec2([0.0,0.0]),
    radius : 0.8,
    numVertices: 15,
    color : [1.0,1.0,1.0,1.0],
    selectable : true,
    velocity : 15
  });
  p2_moonCS.add_shape(p2_moon);
  selectables.push(p2_moon)


  planet3CS_orbit = new CoordinateSystem();
  planet3CS_orbit.origin.x = 0.0; planet3CS_orbit.origin.y = .0;
  planet3CS_orbit.scale.x = 1.0; planet3CS_orbit.scale.y = 1.0;
  planet3CS_orbit.velocity = 9;
  universe.add_child(planet3CS_orbit);

  planet3CS = new CoordinateSystem();
  planet3CS.origin.x = 0.4; planet3CS.origin.y = 0.4;
  planet3CS.scale.x = 0.1; planet3CS.scale.y = 0.1;
  planet3CS.velocity = 35;
  planet3CS_orbit.add_child(planet3CS);

  planet3 = new UnitDisc(gl, shader, {
    name : "planet_2",
    center: new Vec2([0.0,0.0]),
    radius: 0.3,
    numVertices: 30,
    color : [0.0,0.0,1.0,1.0],
    selectable : true,
    velocity : 20
  });
  planet3CS.add_shape(planet3);
  selectables.push(planet3);

  p3_moonCS = new CoordinateSystem();
  p3_moonCS.origin.x = 0.5; p3_moonCS.origin.y = 0.5;
  p3_moonCS.scale.x = 0.1; p3_moonCS.scale.y = 0.1;
  planet3CS.add_child(p3_moonCS);

  p3_moon = new UnitDisc(gl, shader, {
    name : "p3_moon1",
    center : new Vec2([0.0,0.0]),
    radius : 0.8,
    numVertices: 15,
    color : [1.0,1.0,1.0,1.0],
    selectable : true,
    velocity : 15
  });
  p3_moonCS.add_shape(p3_moon);
  selectables.push(p3_moon);

  p3_satCS = new CoordinateSystem();
  p3_satCS.origin.x = 0.5; p3_satCS.origin.y = 0;
  p3_satCS.scale.x = 0.08; p3_satCS.scale.y = 0.08;
  p3_satCS.velocity = 5;
  planet3CS.add_child(p3_satCS);

  p3_sat = new UnitDisc(gl, shader, {
    name : "p3_Satellite",
    center : new Vec2([0.0,0.0]),
    radius : 0.5,
    numVertices: 15,
    color : [0.0,1.0,0.0,1.0],
    selectable : true,
    velocity : 15
  });
  p3_satCS.add_shape(p3_sat);
  selectables.push(p3_sat);







  renderables.push(rootCS);
}

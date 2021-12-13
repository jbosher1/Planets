<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>Planet Mobile</title>
    <!-- Student Note: The WebGL book places the shader code inside strings in the JavaScript .js file.
             That strategy makes sense for very simple examples, but it does not work well for 'real' programs.             Henceforth, you should put your Shader scripts in the HTML file, each with a unique id string value.
             This is also the strategy your textbook uses.          -->
    <script id="vertex-shader" type="x-shader/x-vertex">
            #line 14   // set GLSL error messages line # to HTML file line #
            precision mediump float;
            attribute vec4 a_Position;
            uniform mat3 u_modelView;

            void main()
                {
                mat4 modelView = mat4 (
                        u_modelView[0][0], u_modelView[0][1], 0.0, u_modelView[0][2],
                        u_modelView[1][0], u_modelView[1][1], 0.0, u_modelView[1][2],
                               0.0,             0.0,          1.0,   0.0,
                        u_modelView[2][0], u_modelView[2][1], 0.0, u_modelView[2][2]
                        );
                gl_Position = modelView * a_Position;
                }
        </script>
    <script id="fragment-shader" type="x-shader/x-fragment">
            #line 32   // set GLSL error messages line # to HTML file line #
            precision mediump float;

            uniform vec4 u_FragColor;
            void main()
                {
                gl_FragColor = u_FragColor;
                }
        </script>
  </head>
  <body style="background-color:black;" onload="main()"> <!-- create canvas -->
    <h1 style="color:white;"id="App_Title">Planet Mobile</h1>
    <table>
      <tbody>
        <tr>
          <th> <canvas id="webgl" width="800" height="800"> Please use a
              browser that supports "canvas" </canvas> </th>
          <!-- buttons
                 Student Note: See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button               -->
          <th>
            <table>

              <tbody>
                <tr>
                  <td> <button id="PauseButton" style="margin-bottom:10px;margin-top:10px;height:40px; width:100px">Pause</button><br>
                </tr>
                <tr>
                  <td><button onclick="window.open('./help.html');" style="margin-bottom:10px;margin-top:10px;height:40px; width:100px">Help</button></td>
                </tr>
              </tbody>
            </table>
          </th>
        </tr>
      </tbody>
    </table>
    <h2 id="Selected">Selected: None</h2>
    <br>
    <!-- load JS scripts -->
    <script src="lib/webgl-utils.js"></script>
    <script src="lib/webgl-debug.js"></script>
    <script src="lib/cuon-utils.js"></script>
    <script src="lib/uncc_webgl_utils/uncc_webgl_utils.js"></script>
    <script src="Mat2.js"></script>
    <script src="Mat3.js"></script>
    <script src="MatStack.js"></script>
    <script src="Renderable.js"></script>
    <script src="Planet%20Mobile.js"></script>
    <script src="Tests.js"></script>
  </body>
</html>

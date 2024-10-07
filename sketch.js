let looping = false;
let keysActive = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/sketch";
let maxFrames = 20;
let gl, currentProgram;
let vertices = [];
let colors = [];
let indices = [];
let amountOfLines = 0;
let drawCount = 0;
let vertex_buffer, indices2_buffer, Index_Buffer, color_buffer, width_buffer, uv_buffer, dots_buffer;
let vbuffer;
let field = [];
let makeField;
let reached, unreached;
let tree;
let objMax = Infinity;
let gathered = false;
let growth = true;
let spawnFreq = 30 * 4;
let walking = true;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    // cnvs = createCanvas(windowWidth, windowWidth / 16 * 9, WEBGL);
    noCanvas();
    cnvs = document.getElementById('my_Canvas');
    // gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    gl = cnvs.getContext('webgl', {antialias: false, depth: false});
    // canvasDOM = document.getElementById('my_Canvas');
    // canvasDOM = document.getElementById('defaultCanvas0');
    // gl = canvasDOM.getContext('webgl');
    // gl = cnvs.drawingContext;

    // gl = canvasDOM.getContext('webgl', { premultipliedAlpha: false });

    vertex_buffer = gl.createBuffer();
    indices2_buffer = gl.createBuffer();
    Index_Buffer = gl.createBuffer();
    color_buffer = gl.createBuffer();
    width_buffer = gl.createBuffer();
    uv_buffer = gl.createBuffer();
    dots_buffer = gl.createBuffer();

    vbuffer = gl.createBuffer();
    
    shadersReadyToInitiate = true;
    initializeShaders();
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);

    // gl.colorMask(false, false, false, true);
    // gl.colorMask(false, false, false, true);

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(true, true, true, true);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

    // Set the view port
    gl.viewport(0, 0, cnvs.width, cnvs.height);


    frameRate(30);
    background(0);
    fill(255, 50);
    noStroke();
    if (!looping) {
        noLoop();
    }
    // setTimeout(function() {
    //     scdConsoleArea.setAttribute("style", "display:block;");
    //     scdArea.style.display = "none";
    //     scdConsoleArea.setAttribute("style", "display:none;");
    //     jsCmArea.style.height = "685px";
    //     jsArea.style.display = "block";
    //     displayMode = "js";
    //     javaScriptEditor.cm.refresh();
    // }, 1);
    setTimeout( function() {
        keysControl.addEventListener("mouseenter", function(event) {
            document.body.style.cursor = "none";
            document.body.style.backgroundColor = "#000000";
            appControl.setAttribute("style", "display:none;");
            let tabs = document.querySelector("#file-tabs");
            tabs.setAttribute("style", "display:none;");
            cinemaMode = true;
            scdArea.style.display = "none";
            scdConsoleArea.style.display = "none";
            jsArea.style.display = "none";
            jsConsoleArea.style.display = "none";
        }, false);
        keysControl.addEventListener("mouseleave", function(event) {
            if (!grimoire) {
                document.body.style.cursor = "default";
                document.body.style.backgroundColor = "#1C1C1C";
                appControl.setAttribute("style", "display:block;");
                let tabs = document.querySelector("#file-tabs");
                tabs.setAttribute("style", "display:block;");
                // let slider = document.querySelector("#timeline-slider");
                // slider.setAttribute("style", "display:block;");
                // slider.style.display = "block";
                // canvasDOM.style.bottom = null;
                if (displayMode === "both") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                } else if (displayMode == "scd") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                } else if (displayMode == "js") {
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                }
                cinemaMode = false;
                clearSelection();
            }   
        }, false);
    }, 1);
    // let dna = new DNA();
    // tree  = new Tree(0, 0, dna);
    newGeneration();
}

singCount = 0;
flakes = [];
maps = function(n,sa1,so1,sa2,so2) {
    return (n-sa1)/(so1-sa1)*(so2-sa2)+sa2;
};
for (let i = 0; i < 5500; i++) {
    let x = Math.random() * 2 - 1;
    // do {x = Math.random() * 2 - 1} while (Math.abs(x) < 0.1);
    let y = maps(Math.random(), 0, 1, -1, 1);
    let z = (Math.random() * 2 - 1) * 2 - 1;
    flakes.push([x, y, z, i])
}
flakes.sort((a, b) => b[2] - a[2]);

draw = function() {
    // for (let i = 0; i < 5; i++) {
    //     makeTree();  
    // }
        gl.clear(gl.COLOR_BUFFER_BIT);
    resetLines();
    dotPositions = [];
    singCount = 0;
    objAmount = 0;
    scene.update();
    if (drawCount % spawnFreq == 0) {
        // let walker = new Walker(random(scene.trees).root, 0.5);
    }
    if (walking) {
        for (let i = 0; i < walkers.length; i++) {
            walkers[i].walk();
            walkers[i].show();
        }
    }
    // for (let i = 0; i < pairs.length; i++) {
    //     addLine(
    //         pairs[i][0][0], 
    //         pairs[i][0][1], 
    //         pairs[i][1][0], 
    //         pairs[i][1][1], 
    //         1/5,
    //         1, 0, 0, 1
    //     );
    // }
    // addLine(0.9, 0.9, 0.9, -0.9, 1/15);
        currentProgram = getProgram("misty-river");
    gl.useProgram(currentProgram);
    drawRectangle(currentProgram, 0, 0, 1, 1);
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
    drawLines();
        vertices = [];
    for (let i = 0; i < flakes.length; i++) {
        flakes[i][0] += 0.0025 * 0.5;
        flakes[i][1] -= 0.005 * 0.5;
        flakes[i][0] += Math.sin(flakes[i][3]*1e1)*2e-3;
        if (flakes[i][0] > 2 || flakes[i][1] < -1) {
            let y = 1;
            flakes[i][1] = y;
            let z =( Math.random() * 2 - 1) * 2 - 1;
            flakes[i][2] = z;
            let x = Math.random() * 2 - 1;
            flakes[i][0] = x/z;            
        }
    }
    // flakes.sort((a, b) => b[2] - a[2]);
    for (let i = 0; i < flakes.length; i++) {
        vertices.push(flakes[i][0], flakes[i][1], flakes[i][2]);
    }
        // currentProgram = getProgram("smooth-dots-3D");
    // gl.useProgram(currentProgram);
    // draw3DDots(currentProgram);
    // currentProgram = getProgram("smooth-dots");
    // gl.useProgram(currentProgram);
    // drawSmoothDots(currentProgram);
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
    drawCount++;
}


resetLines = function() {
    indices = [];
    indices2 = [];
    vertices = [];
    colors = [];
    widths = [];
    uvs = [];
    lineAmount = 0;
};

addLine = function(x0, y0, x1, y1, w, r, g, b, a) {
    let ii = [0, 1, 2, 0, 2, 3];
    let iii = [0, 1, 2, 3];
    for (let k = 0; k < ii.length; k++) {
        indices.push(ii[k] + (lineAmount*4));
    }        
    for (let k = 0; k < iii.length; k++) {
        indices2.push(iii[k]);
    }
    let vv = [
        x0, y0, x1, y1,
        x0, y0, x1, y1,
        x0, y0, x1, y1,
        x0, y0, x1, y1
    ];
    for (let k = 0; k < vv.length; k++) {
        vertices.push(vv[k]);
    }
    let cc = [
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a
    ];
    for (let k = 0; k < cc.length; k++) {
        colors.push(cc[k]);
    }
    widths.push(w, w, w, w);
    let uv = [
        0, 0, 
        1, 0, 
        1, 1, 
        0, 1
    ];
    for (let k = 0; k < uv.length; k++) {
        uvs.push(uv[k]);
    }
    lineAmount++;
};


drawLines = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices2), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW); 
    // setShaders();
    /* ======== Associating shaders to buffer objects =======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(currentProgram, "coordinates");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    // bind the indices2 buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    // get the attribute location
    var indices2AttribLocation = gl.getAttribLocation(currentProgram, "index");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(indices2AttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(indices2AttribLocation);
    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(currentProgram, "color");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(color);
    // bind the width buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    // get the attribute location
    var widthAttribLocation = gl.getAttribLocation(currentProgram, "width");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(widthAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(widthAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    var uvAttribLocation = gl.getAttribLocation(currentProgram, "uv");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(uvAttribLocation);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);    
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};


let rotate = function(p, a) {
    return [
        p.x * a.y + p.y * a.x,
        p.y * a.y - p.x * a.x
    ];
};

let makeLine2 = function(x0, y0, x1, y1, w) {
    let a0 = Math.atan2(y1 - y0, x1 - x0);
    let halfPI = Math.PI * 0.5;
    let c0 = Math.cos(a0 + halfPI) * w;
    let c1 = Math.cos(a0 - halfPI) * w;
    let s0 = Math.sin(a0 + halfPI) * w;
    let s1 = Math.sin(a0 - halfPI) * w;
    let xA = x0 + c0;
    let yA = y0 + s0;
    let xB = x0 + c1;
    let yB = y0 + s1;
    let xC = x1 + c0;
    let yC = y1 + s0;
    let xD = x1 + c1;
    let yD = y1 + s1;
    return [xA, yA, xB, yB, xC, yC, xD, yD];
};

function keyPressed() {
    if (keysActive) {
        if (keyCode === 32) {
            if (looping) {
                noLoop();
                looping = false;
            } else {
                loop();
                looping = true;
            }
        }
        if (key == 'g' || key == 'G') {
            growth = !growth;
        }
        if (key == 'w' || key == 'W') {
            walking = !walking;
        }
        // if (key == 'r' || key == 'R') {
        //     window.location.reload();
        // }
        if (key == 'n' || key == 'N') {
            newGeneration();
        }
    }
}

makeFireflies = function() {
    fireflies = [];
    let n = 400;
    num = n;
    for (let i = 0; i < n; i++) {
        let x = (Math.random() * 2 - 1) * (16/9);
        let y = Math.random() * 2 - 1;
        fireflies.push(x, y);
    }
};
makeFireflies();

drawSmoothDots = function(selectedProgram) {
    // vertices = [];
    // num=0;
    // for (let i = 0; i < reached.length; i++) {
    //     vertices.push(reached[i][0], reached[i][1]);
    //     num++;
    // }
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotPositions), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, dotPositions.length / 3);
};

drawRectangle = function(selectedProgram, x0, y0, x1, y1) {
    let triangleVertices = new Float32Array([
        x0, y0, x1, y0, x1, y1, // Triangle 1
        x0, y0, x1, y1, x0, y1  // Triangle 2
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
    let positionLocation = gl.getAttribLocation(selectedProgram, "position");
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // console.log(cnvs.width, cnvs.height);
};

clearSelection = function() {};

draw3DDots = function(selectedProgram) {
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, vertices.length/3);
};
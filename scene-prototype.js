let Scene = function() {
    this.fileName = "./frames/branching-005/botany";
    this.maxFrames = 250;
    this.frameCount = 0;
    this.shapes = [];
    this.shapesPerFrame = 50000;
    this.framePrinted = true;
    this.trees = [];
};

Scene.prototype.addShape = function(s) {
    this.shapes.push(s);
};

Scene.prototype.registerLine = function(x1, y1, x2, y2, id, alpha, width) {
    // this.shapes.push({
    //     type: "line",
    //     x1: x1,
    //     y1: y1,
    //     x2: x2,
    //     y2: y2,
    //     id: id,
    //     alpha: alpha,
    //     width: width
    // });
    this.shapes.push([
        x1,
        y1,
        x2,
        y2,
        id,
        alpha,
        width
    ]);
};

Scene.prototype.update = function() {
    if (growth && scene.frameCount < growthMax) {
        for (let i = 0; i <  this.trees.length; i++) {
            this.trees[i].grow();
        }
        this.frameCount++;
    }
    for (let i = 0; i <  this.trees.length; i++) {
        
        this.trees[i].sway();
        this.trees[i].gatherShapes();
    }
    this.print();
   // for (let i = 10; i < staticTree.length - 160; i++) {
   //      this.printObject(staticTree[i]);
   //  }
};

Scene.prototype.saveShapes = function() {
    let s = "[";
    for (let i = 0; i < this.shapes.length; i++) {
        let sh = this.shapes[i];
        let str = `{id: ${sh.id}, x1: ${sh.x1}, x2: ${sh.x2}, y1: ${sh.y1}, y2: ${sh.y2}, alpha: ${sh.alpha}, width: ${sh.width}},\n`;
        s = s + str;
    }
    s = s + "]";
    console.log(s);
};
// scene.saveShapes();

Scene.prototype.print = function() {
    if (this.shapes.length <= this.shapesPerFrame) {
        // sketch.background(200);
        // sketch.translate(sketch.width / 2, sketch.height - 100);
        // sketch.scale(0.6, 0.6);
        // tree.grow();
        // tree.gatherShapes();
        for (let i = 0; i < this.shapes.length; i++) {
            this.printObject(this.shapes[i]);
        }
        this.shapes = [];
    } else {
        // if ()
    }
};

Scene.prototype.printObject = function(obj) {
    if (objAmount < objMax && obj.id < 35) {
        objAmount++;
        // console.log(obj);
        // sketch.line(obj.x1, obj.y1, obj.x2, obj.y2);
        let osc = Math.sin(obj.id*0.5-drawCount*1e-1);
        // addLine(
        //     obj.x1 * 0.008, 
        //     obj.y1 * -0.008 - 2, 
        //     obj.x2 * 0.008, 
        //     obj.y2 * -0.008 - 2, 
        //     (1/3+(map(osc,-1., 1., 0., 0.4))) *( obj.width+0.2),
        //     1, 0, 0, map(osc, -1., 1., 0.4, 1)*Math.pow(obj.alpha,4)
        // );
        addLine(
            obj.x1 * 0.008, 
            obj.y1 * -0.008 - 2, 
            obj.x2 * 0.008, 
            obj.y2 * -0.008 - 2, 
            obj.width*1.5+map(osc,-1., 1., 0., 0.2),
            1, 0, 0, map(osc, -1., 1., 0.4, 1)*Math.pow(obj.alpha,2)+0
        );
        // osc = Math.sin((obj.x1+obj.y1)*0.005-drawCount*0.5e-1);
        // addLine(
        //     obj.x1 * 0.008, 
        //     obj.y1 * -0.008 - 2, 
        //     obj.x2 * 0.008, 
        //     obj.y2 * -0.008 - 2, 
        //     obj.width*2+map(osc,-1., 1., 0., 0.2),
        //     1, 0, 0, map(osc, -1., 1., 0.4, 1)*Math.pow(obj.alpha,2)+0
        // );
        // addLine(
        //     obj.x1 * 0.008, 
        //     obj.y1 * -0.008 - 2, 
        //     obj.x2 * 0.008, 
        //     obj.y2 * -0.008 - 2, 
        //     1/50,
        //     1, 0, 0, 1
        // );
    }
};

Scene.prototype.printObject = function(obj) {
    if (objAmount < objMax && obj[4] < 26) {
        objAmount++;
        // console.log(obj);
        // sketch.line(obj.x1, obj.y1, obj.x2, obj.y2);
        let osc = Math.sin(obj[4]*0.5-drawCount*1e-1);
        // addLine(
        //     obj.x1 * 0.008, 
        //     obj.y1 * -0.008 - 2, 
        //     obj.x2 * 0.008, 
        //     obj.y2 * -0.008 - 2, 
        //     (1/3+(map(osc,-1., 1., 0., 0.4))) *( obj.width+0.2),
        //     1, 0, 0, map(osc, -1., 1., 0.4, 1)*Math.pow(obj.alpha,4)
        // );
        // addLine(
        //     obj[0] * 0.008, 
        //     obj[1] * -0.008 - 2, 
        //     obj[2] * 0.008, 
        //     obj[3] * -0.008 - 2, 
        //     Math.min(1, (obj[6])/obj[5]),
        //     1, 0, 0, obj[5]
        // );
                addLine(
            obj[0] * 0.008, 
            obj[1] * -0.008 - 2, 
            obj[2] * 0.008, 
            obj[3] * -0.008 - 2, 
            1/1,
            1, 0, 0, obj[5]
        );
        //                 addLine(
        //     obj[0] * 0.008, 
        //     obj[1] * -0.008 - 2, 
        //     obj[2] * 0.008, 
        //     obj[3] * -0.008 - 2, 
        //     1/2,
        //     1, 0, 0, 1
        // );
        // osc = Math.sin((obj.x1+obj.y1)*0.005-drawCount*0.5e-1);
        // addLine(
        //     obj.x1 * 0.008, 
        //     obj.y1 * -0.008 - 2, 
        //     obj.x2 * 0.008, 
        //     obj.y2 * -0.008 - 2, 
        //     obj.width*2+map(osc,-1., 1., 0., 0.2),
        //     1, 0, 0, map(osc, -1., 1., 0.4, 1)*Math.pow(obj.alpha,2)+0
        // );
        // addLine(
        //     obj.x1 * 0.008, 
        //     obj.y1 * -0.008 - 2, 
        //     obj.x2 * 0.008, 
        //     obj.y2 * -0.008 - 2, 
        //     1/50,
        //     1, 0, 0, 1
        // );
    }
};

let scene = new Scene({
    name: "demo",
    type: "line",
    frameRate: 24
});
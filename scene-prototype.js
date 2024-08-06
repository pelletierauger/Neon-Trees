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

Scene.prototype.registerLine = function(x1, y1, x2, y2, id) {
    this.shapes.push({
        type: "line",
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        id: id
    });
};

Scene.prototype.update = function() {
    // if (gathered == false) {
    //     for (let i = 0; i <  this.trees.length; i++) {
    //         this.trees[i].gatherShapes();
    //     }
    //     gathered = true;
    // }
   for (let i = 10; i < staticTree.length - 160; i++) {
        this.printObject(staticTree[i]);
    }
};

Scene.prototype.saveShapes = function() {
    let s = "[";
    for (let i = 0; i < this.shapes.length; i++) {
        let sh = this.shapes[i];
        let str = `{id: ${sh.id}, x1: ${sh.x1}, x2: ${sh.x2}, y1: ${sh.y1}, y2: ${sh.y2}},\n`;
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
        tree.grow();
        tree.gatherShapes();
        for (let i = 0; i < this.shapes.length; i++) {
            this.printObject(this.shapes[i]);
        }
        this.shapes = [];
        this.frameCount++;
    } else {
        // if ()
    }
};

Scene.prototype.printObject = function(obj) {
    if (objAmount < objMax && obj.id > 15) {
        objAmount++;
        // console.log(obj);
        // sketch.line(obj.x1, obj.y1, obj.x2, obj.y2);
        let osc = Math.sin(obj.id*0.5-drawCount*1e-1);
        addLine(
            obj.x1 * 0.008, 
            obj.y1 * -0.008 - 2, 
            obj.x2 * 0.008, 
            obj.y2 * -0.008 - 2, 
            1/20+(map(osc,-1., 1., 0., 0.1)),
            1, 0, 0, map(osc, -1., 1., 0.4, 1)
        );
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
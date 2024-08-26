let walkers = [];

let Walker = function(parent, speed) {
    this.parent = parent;

    if (speed !== null) {
        this.speed = speed;
    } else {
        this.speed = 0.05;
    }
    this.segmentCompletion = 0;
    this.arrayPosition = walkers.length;
    this.active = true;
    walkers.push(this);
};

Walker.prototype.sing = function() {
    // let osc = song.getFrequency(this.v.freq);
    // let octave = sketch.random(octaves);
    // let note = sketch.random(notes);
    // let frequency = Tonal.Note.freq(note + "" + octave);
    //     socket.emit('note', sketch.random([110, 220, 440, 660, 880]));
    singCount++;
    if (singCount < 2) {
        socket.emit('note', 1);
    }
    this.hasSung = true;
};

Walker.prototype.walk = function() {
    this.hasSung = false;
    let d = dist(this.parent.x0, this.parent.y0, this.parent.x1, this.parent.y1);
    let m = map(d, 0, 100, 60, 10);
    m = constrain(m, 10, 60);
    let m2 = map(this.parent.segmentID, 0, 100, 1, 50);
    let s = this.speed * m * m2;
    s = this.speed;
    this.parent.alphaScalar += 0.5;
    this.segmentCompletion = Math.min(this.segmentCompletion + s, 1);
    if (this.segmentCompletion == 1 && this.parent.children.length >= 1) {
        if (this.parent.children.length > 1) {
            this.sing();
            for (let i = 1; i < this.parent.children.length; i++) {
                let w = new Walker(this.parent.children[i], this.speed);
            }
        }
        this.parent = this.parent.children[0];
        this.segmentCompletion = 0;
    } else if (this.segmentCompletion == 1 && this.parent.leaf) {
        this.parent = this.parent.leaf.root;
        this.sing();
        this.segmentCompletion = 0;
    } else if (this.segmentCompletion == 1) {
        // this.active = false;
        this.sing();
        this.active = false;
    }
};

Walker.prototype.show = function() {
    // if (this.active) {
    let x = lerp(this.parent.x0, this.parent.x1, this.segmentCompletion);
    let y = lerp(this.parent.y0, this.parent.y1, this.segmentCompletion);
    let size = (this.hasSung) ? 120 : 40;
    // sketch.fill(255);
    // sketch.ellipse(x, y, size);
    dotPositions.push(x * 0.008, y * -0.008 - 2, size);
    if (!this.active) {
        for (let i = 0; i < walkers.length; i++) {
            if (walkers[i] === this) {
                walkers.splice(i, 1);
            }
        }
    }
};
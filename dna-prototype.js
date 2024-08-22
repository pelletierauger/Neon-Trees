let DNA = function() {
    this.initialEnergy = 30;
    this.energyLoss = 0.9;
    this.branchGrowth = 0.1;
    this.branchGrowthCost = 0.01;
    this.branchingAngle = Math.PI * 0.25;
    this.branchingCost = 0.02;
    this.branchingProbability = 0.06;
    this.branchingFrequencyLeft = 12;
    this.branchingFrequencyRight = 6;
    this.branchingOffsetLeft = 3;
    this.branchingOffsetRight = 0;
};

newGeneration = function() {
    scene.trees = [];
    map = function(n, start1, stop1, start2, stop2) {
        return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    };
    for (let i = 0; i < 6; i++) {
        let dna = new DNA();
        dna.branchingFrequencyLeft = Math.floor(Math.random()*12+6);
        dna.branchingFrequencyRight = Math.floor(Math.random()*12+6);
        dna.branchingCost = Math.random()*0.04;
        let width = Math.random();
        let alpha = 1.0 - width;
        let x = map(i, 0, 5, -720/2, 720/2);
        let y = map(Math.random(),0,1,0,75);
        tree = new Tree(x, y, dna, alpha, width);
    }
    growth = true;
}
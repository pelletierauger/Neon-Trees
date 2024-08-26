(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.1,0.3,3]),
    doneAction:2);
    shift = round(Rand(1,2))*12;
    sig = MiBraids.ar(
    Demand.kr(Impulse.kr(1/64),0,
    Drand([0,2,3,5,7,8,10],inf))
    +~toMidi.("C#1"), 
    timbre: 0.59, color: 0.69, 
    model:44, resamp:0, 
    decim:[32,31]-24, bits:1,ws:0);
    sig = VadimFilter.ar(
    sig,Line.kr(10000,4000,3),0,1);
    sig = sig * 0.5 * env;
    Out.ar(0, sig);
}).add;
)
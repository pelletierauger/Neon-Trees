let mistyRiver = new ShaderProgram("misty-river");

mistyRiver.vertText = `
// beginGLSL
attribute vec2 position;
void main() {
    vec2 pos = position;
    pos.xy = pos.xy * 2.0 - 1.0;
    gl_Position = vec4(pos, 0.0, 1.0);
}
// endGLSL
`;
mistyRiver.fragText = `
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n) * 43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);  
        float n = p.x + p.y * 57.0;
        float res = mix(
              mix(hash(n +  0.0), hash(n +  1.0), f.x),
              mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000 * noise(p); p = mr * p * 2.02;
        f += 0.2500 * noise(p); p = mr * p * 2.33;
        f += 0.1250 * noise(p); p = mr * p * 2.01;
        f += 0.0625 * noise(p); p = mr * p * 5.21;
        return f / (0.9375) * smoothstep(260., 768., p.y); // flat at beginning
    }
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    float noise = rand(uv + sin(time)) * 0.025;
    // uv.x = 0.0;
    float c = length(uv + vec2(0.0, 0.5)) * 0.75;
    c = uv.y * 0.5 + 0.45;
    c = smoothstep(0., 1., c);
    gl_FragColor = vec4(vec3(c, pow(c,9.), pow(c,9.)*0.75)*1.5*1., 1.0-noise);
    // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 3.9) * 1.;
    // gl_FragColor.rgb += vec3(fbm((uv + vec2(1.)) * 22.5 * vec2(0.0625, 0.5)) * 0.25);
    // gl_FragColor.rgb -= vec3(fbm((uv - vec2(0.5)) * -22.5 * vec2(0.0625, 1.)) * 0.125);
}
// endGLSL
`;
mistyRiver.vertText = mistyRiver.vertText.replace(/[^\x00-\x7F]/g, "");
mistyRiver.fragText = mistyRiver.fragText.replace(/[^\x00-\x7F]/g, "");
mistyRiver.init();

let smoothDots3D = new ShaderProgram("smooth-dots-3D");


// A version of smoothDots3D that adjusts the dot size according to its Z value
smoothDots3D.vertText = `
    // beginGLSL
    attribute vec3 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        vec4 pos = vec4(coordinates * 1.05, 1.);
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        // pos.xyz *= map(sin(time *1e-1+pos.y*2.), -1., 1., 0.95, 1.0);
        // pos.xyz *= 1.25;
        // pos.xyz *= map(sin(pos.y*5.-time*0.5e-1)*0.5+0.5, 0., 1., 1.0, 0.95);
        // pos = yRotate(-time*0.25e-2) * pos;
        // pos = xRotate(time*0.25e-2) * pos;
        // pos = xRotate(-time*0.5e-2) * pos;
        // pos = translate(0.0, 0.0, 1.5) * pos;
        // pos = rotate()
        // pos = translate(0.0, 0.9, 1.5) * pos;
        
        posUnit = pos.xyz;
        // pos.x *= ratio;
        gl_Position = vec4(pos.x * ratio, pos.y, 0.0, pos.z);
        gl_PointSize = 4./pow(pos.z, 3.);
        t = time;
        
        pos = translate(0.0, 0.0, -0.5) * pos;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
        posUnit2 = pos.xyz;
        if (length(posUnit2.xz) > 0.4) {
            // gl_PointSize = 0.0;
        }
        if ((posUnit.z) > 0.72) {
            // gl_PointSize = 0.0;
        }
    }
    // endGLSL
`;
smoothDots3D.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 0.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.25;
        halo = smoothstep(0., 1., halo);
        l = smoothstep(0., 1., l);
        l = pow(l, 3.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.02;
        gl_FragColor = vec4(vec3(1.0, 0.25, 0.25)-(0.25-posUnit.y*2.), 0.5*(l+halo-noise)/(posUnit.z+1.));
        // gl_FragColor.rgb = gl_FragColor.bgr;
                vec3 light = posUnit - vec3(0.0, 0., 0.);
        float distSquared2 = 1.0 - dot(light, light) * 1.5;
        // gl_FragColor.rgb *= 1.0 - posUnit.z;
        // distSquared2 = mix(distSquared, pow(max(0.0, distSquared2), 4.0) * 12., 0.5);
        // gl_FragColor.a *= max(0.0,distSquared2) * 1.;
        // gl_FragColor.a *= max(0.,1.0-pow(distance(vec3(0.0,0.0,-1.5), vec3(posUnit.x, posUnit.y, posUnit.z)),5.) * 0.05);
        // gl_FragColor.a *= max(0.0,distSquared2) * 1.;
        // gl_FragColor.a *= max(0., 1.0-pow(length(posUnit2.xz), 2.)*10.);
        // gl_FragColor.rgb *= max(0., 1.0-pow(length(posUnit2.xz), 2.)*10.);
        // gl_FragColor.a *= max(0.,1.0-pow(abs(gl_FragCoord.x)/1280.-0.5,3.)*160.);
    }
    // endGLSL
`;
smoothDots3D.vertText = smoothDots3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.fragText = smoothDots3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.init();
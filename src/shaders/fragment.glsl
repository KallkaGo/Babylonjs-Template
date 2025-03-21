precision highp float;

uniform sampler2D uDiffuse;

varying vec2 vUv;

void main() {

    vec4 diffuse = texture(uDiffuse, vUv);

    gl_FragColor = vec4(pow(diffuse.rgb, vec3(1. / 2.2)), 1.);

}
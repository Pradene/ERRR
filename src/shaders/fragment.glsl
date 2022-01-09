precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vUv;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    gl_FragColor = textureColor * vec4(1.0, 1.0, 1.0, uAlpha);
}
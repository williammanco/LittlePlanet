uniform vec3 color;
uniform sampler2D texture;
varying float displacement;
varying float noise;

void main() {

  vec3 color = vec3(1.0,1.0,1.0);

  //
  // if(pixelref.a<0.5) /*change threshold to desired output*/
  // discard;

  gl_FragColor = vec4( color, 0.2  );// * pixelref;

}

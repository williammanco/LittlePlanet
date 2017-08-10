uniform vec3 color;
uniform sampler2D texture;

void main() {
  vec4 pixelref = texture2D( texture, gl_PointCoord );
  //
  // if(pixelref.a<0.5) /*change threshold to desired output*/
  // discard;

  gl_FragColor = vec4( pixelref.rgb, 1.0  );// * pixelref;

}

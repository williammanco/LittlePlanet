uniform vec3 color;
uniform sampler2D texture;
varying float vAlpha;
varying vec3 vColor;
varying float displacement;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform bool noSolarize;
uniform bool noForcedAlpha;


void main() {
  vec4 pixelref = texture2D( texture, gl_PointCoord );

  if(displacement < -1.5){
    pixelref = vec4(0.0,0.0,0.0,0.0);
  }
  if(pixelref.a<0.5) /*change threshold to desired output*/
  discard;




  // if(vColor)
  //  color = vColor.xyz;

  /**
   * Remove alpha forced
   * @type {bool} noForcedAlpha
   */
  float alpha = clamp(vAlpha, 0.0, 1.0);
  if(noForcedAlpha)
    alpha = 1.0;

  gl_FragColor = vec4( clamp(vColor.xyz,0.0,1.0), alpha  ) * pixelref;

  #ifdef USE_FOG
    #ifdef USE_LOGDEPTHBUF_EXT
      float depth = gl_FragDepthEXT / gl_FragCoord.w;
    #else
      float depth = gl_FragCoord.z / gl_FragCoord.w;
    #endif
    float fogFactor = smoothstep( fogNear, fogFar, depth );
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    float alphaColor = 1.0;

    if(depth > 50.0 && noSolarize != true){
      alphaColor = smoothstep( 1.0, 0.0, (depth-50.0)*0.1 );
    }
    gl_FragColor.a += smoothstep( 1.0, 0.0, alphaColor );
  #endif
}

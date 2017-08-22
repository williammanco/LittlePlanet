
import { Object3D, SphereBufferGeometry, ShaderMaterial, Mesh } from 'three'
import settings from 'shared_path/settings'
import utils from 'shared_path/utils'
import state from 'shared_path/state'

const frag = require('./main.frag')
const vert = require('./main.vert')

export default class Sun extends Object3D {
  constructor(props) {
    super()
    const self = this
    this.uniforms = {
      time: { type: 'f', value: 1.0 },
      speed: { type: "f", value: 0.007 },
      amplitude: { type: "f", value: 0.04 },
      elevation: { type: "f", value: 7.0 },
    }
    this.geometry = new SphereBufferGeometry( 20, 100, 100 )
    // this.material = new MeshBasicMaterial( { color: 0xfff2e0 } )
    this.material = new ShaderMaterial({
      fragmentShader: frag,
      vertexShader: vert,
      uniforms: this.uniforms,
      fog: false,
      transparent: true,
    })
    this.mesh = new Mesh( this.geometry, this.material )
    this.mesh.position.y = 0
    this.add( this.mesh )
  }
  update(delta){
    this.material.uniforms.time.value += 1
  }
}

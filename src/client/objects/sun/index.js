
import { Object3D, CircleBufferGeometry, MeshBasicMaterial, Mesh } from 'three'
import settings from 'shared_path/settings'
import utils from 'shared_path/utils'
import state from 'shared_path/state'

export default class Sun extends Object3D {
  constructor(props) {
    super()
    const self = this
    this.geometry = new CircleBufferGeometry( 20, 32 )
    this.material = new MeshBasicMaterial( { color: 0xfffff00 } )
    this.mesh = new Mesh( this.geometry, this.material )
    this.mesh.position.y = 20
    this.add( this.mesh )
  }
  update(delta){
  }
}

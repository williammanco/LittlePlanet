
import { Object3D, BoxBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three'
import settings from 'shared_path/settings'
import utils from 'shared_path/utils'
import state from 'shared_path/state'

export default class Sky extends Object3D {
  constructor(props) {
    super()
    const self = this
    this.geometry = new BoxBufferGeometry( 300, 300, 200 )
    this.material = new MeshBasicMaterial( { color: 0x000000, side: DoubleSide } )
    this.sky = new Mesh( this.geometry, this.material )
    this.sky.position.z = -2
    this.add( this.sky )
  }
  update(delta){
  }
}

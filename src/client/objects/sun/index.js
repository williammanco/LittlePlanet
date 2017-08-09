
import { Object3D, CircleGeometry, MeshBasicMaterial, Mesh } from 'three'
import settings from 'shared_path/settings'
import utils from 'shared_path/utils'
import state from 'shared_path/state'

export default class Sun extends Object3D {
  constructor(props) {
    super()
    const self = this
    this.geometry = new CircleGeometry( 10, 32 )
    this.material = new MeshBasicMaterial( { color: 0xfffff00 } )
    this.circle = new Mesh( this.geometry, this.material )
    this.add( this.circle )
  }
  update(delta){
  }
}

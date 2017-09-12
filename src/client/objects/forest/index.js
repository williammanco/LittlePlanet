
import { Object3D, CylinderBufferGeometry, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Color, ShaderMaterial } from 'three'
import settings from 'shared_path/settings'
import utils from 'shared_path/utils'
import state from 'shared_path/state'


export default class Forest extends Object3D {
  constructor(props) {
    super()
    const self = this
    this.props = props

    this.geometryTree = new PlaneBufferGeometry(10, 9, 1 )
    this.geometryTree.translate( 0, 18, 0 )
    this.materialTree = new MeshBasicMaterial({
      map: this.props.texture,
      color: 0x000000,
      fog: true,
      transparent: true,
    } )

    // let uniforms = {
    //     color: { type: 'c', value: new Color(0xffffff) },
    //     texture: { type: 't', value: self.props.texture }
    //   }
    //
    // this.materialTree = new ShaderMaterial({
    //   fragmentShader: frag,
    //   uniforms: uniforms,
    //   fog: true,
    //   transparent: true,
    // })
    this.treeMesh = []
    this.circleMesh = new Mesh(new CylinderBufferGeometry( 15, 15, 150, 100, 1 ), new MeshBasicMaterial({ color: 0x000000 }))
    for( let i = 0; i < 300; i += 1){
      this.treeMesh.push(new Mesh(this.geometryTree, this.materialTree ))
      this.add(this.treeMesh[i])
      this.treeMesh[i].rotation.z = (Math.random()) * i
      this.treeMesh[i].position.z = 20 + Math.random() * 70
      this.treeMesh[i].scale.y = 1 + Math.random() * .1
      this.treeMesh[i].scale.x = 1 + Math.random() * .5

      // this.treeMesh[i].position.y = i * 3.1
    }

    this.circleMesh.position.z = 0
    this.circleMesh.rotation.x = Math.PI / 2
    this.circleMesh.position.y = 0
    this.add(this.circleMesh)

  }
  update(){
  }
}

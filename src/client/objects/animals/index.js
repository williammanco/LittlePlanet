
import { Object3D, JSONLoader, FaceColors, MeshLambertMaterial } from 'three'
import settings from 'shared_path/settings'
import utils from 'shared_path/utils'
import state from 'shared_path/state'

THREE.MorphAnimMesh = require('imports-loader?THREE=three!exports-loader?THREE.MorphAnimMesh!three/examples/js/MorphAnimMesh')
const parrot = require('assets_path/js/parrot.json')
const flamingo = require('assets_path/js/flamingo.json')
const stork = require('assets_path/js/stork.json')

export default class Animals extends Object3D {
  constructor(props) {
    super()
    const self = this
    let loader = new JSONLoader()
    self.props = props
    self.animals = [parrot, flamingo, stork]
    loader.load(self.animals[self.props.index], function( geometry ) {
      self.mesh = new THREE.Mesh( geometry, new MeshLambertMaterial( {
            vertexColors: FaceColors,
            morphTargets: true
          })
      );
      self.mesh.castShadow = true
      self.mesh.receiveShadow = false
      self.mesh.position.set( self.props.x, self.props.y, self.props.z )
      self.mesh.rotation.y = Math.PI
      self.mesh.scale.x = self.mesh.scale.y = self.mesh.scale.z = .03
      self.animation = new THREE.AnimationMixer( self.mesh )
      self.clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', geometry.morphTargets, 30 )
      self.animation.clipAction( self.clip ).setDuration( 1 ).play()
      console.log(self.mesh)
      self.add( self.mesh )

      //
      // self.morphColorsToFaceColors( geometry )
      // self.addMorph( geometry, 250, 500, 0, 0, -20, self )
      // self.addMorph( geometry, 250, 500, startX - Math.random() * 500, 10, -200 )
      // self.addMorph( geometry, 250, 500, startX - Math.random() * 500, 10, 200 )
      // self.addMorph( geometry, 250, 500, startX - Math.random() * 500, 10, 1000 )
    })

		// loader.load( flamingo, function( geometry ) {
    //   self.morphColorsToFaceColors( geometry )
		// 	self.addMorph( geometry, 500, 1000, startX - Math.random() * 500, 350, 40 )
    // })
    //
    // loader.load( stork, function( geometry ) {
    //   self.morphColorsToFaceColors( geometry )
    //   self.addMorph( geometry, 350, 1000, startX - Math.random() * 500, 350, 340 )
    // })
  }
  update(delta){
    const self = this
    if(self.mesh){
      if ( self.animation ) {
        self.animation.update( delta )
      }
      self.mesh.position.z -= delta * self.props.limitSpeed
      if ( self.mesh.position.z  < -30 )  {
        self.mesh.position.z = 50 + Math.random() * 100
      }
    }

  }
}

// @flow
/* eslint no-console: "error" */

import React from 'react'
import { Scene, Math, PointLight, WebGLRenderer, Clock, PerspectiveCamera, Fog, LoadingManager, TextureLoader } from 'three/src/Three'
import { TweenMax, Power4 } from 'gsap'
import settings from '../shared/settings.js'
import utils from '../shared/utils.js'
import state from '../shared/state.js'
import Forest from './objects/forest/'
import Animals from './objects/animals/'
import Sun from './objects/sun/'

THREE.EffectComposer = require('imports-loader?THREE=three!exports-loader?THREE.EffectComposer!three/examples/js/postprocessing/EffectComposer')
THREE.RenderPass = require('imports-loader?THREE=three!exports-loader?THREE.RenderPass!three/examples/js/postprocessing/RenderPass');
THREE.CopyShader = require('imports-loader?THREE=three!exports-loader?THREE.CopyShader!three/examples/js/shaders/CopyShader');
THREE.ConvolutionShader = require('imports-loader?THREE=three!exports-loader?THREE.ConvolutionShader!three/examples/js/shaders/ConvolutionShader')
THREE.ShaderExtras = require('imports-loader?THREE=three!exports-loader?THREE.ShaderExtras!assets_path/js/ShaderExtrasTerrain')
THREE.ShaderPass = require('imports-loader?THREE=three!exports-loader?THREE.ShaderPass!three/examples/js/postprocessing/ShaderPass');
THREE.BloomPass = require('imports-loader?THREE=three!exports-loader?THREE.BloomPass!three/examples/js/postprocessing/BloomPass')

const particleTree = require('assets_path/img/tree.png')

export default class Canvas extends React.Component {
  constructor(props) {
    super()
    this.props = props
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer = new WebGLRenderer({ antialising: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.5, 30000 )
    this.camera.position.x = settings.camera.position.x
    this.camera.position.y = settings.camera.position.y
    this.camera.position.z = settings.camera.position.z

    this.clock = new Clock()
    this.scene = new Scene()
    this.time = 0

    this.scene.fog = new Fog( 0xefd1b5, 10.25, 70 )



    // COMPOSER
    this.renderer.autoClear = false
    let renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBufer: false }
    let renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters )
    let effectBloom = new THREE.BloomPass( 0.6 )
    let effectBleach = new THREE.ShaderPass( THREE.ShaderExtras[ "bleachbypass" ] )
    let hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalTiltShift" ] )
    let vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalTiltShift" ] )
    let bluriness = 3
    hblur.uniforms[ 'h' ].value = bluriness / window.innerWidth
    vblur.uniforms[ 'v' ].value = bluriness / window.innerHeight
    hblur.uniforms[ 'r' ].value = vblur.uniforms[ 'r' ].value = 0.5
    effectBleach.uniforms[ 'opacity' ].value = 0.65
    this.composer = new THREE.EffectComposer( this.renderer, renderTarget )
    var renderModel = new THREE.RenderPass( this.scene, this.camera )
    vblur.renderToScreen = true
    this.composer = new THREE.EffectComposer( this.renderer, renderTarget )
    this.composer.addPass( renderModel )
    this.composer.addPass( effectBloom )
    this.composer.addPass( hblur )
    this.composer.addPass( vblur )

    return false
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  componentDidMount(){
    this.props.onRef(this)
    const self = this
    document.body.appendChild(this.renderer.domElement)

    this.loaderManager = new LoadingManager()
    this.textureParticleTree = new TextureLoader( this.loaderManager ).load( particleTree )

    this.events()
    this.loader()
  }
  loader(){
    const self = this

    this.loaderManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
    }
    this.loaderManager.onLoad = function ( ) {
    	self.ready()
    }
    this.loaderManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
    }
    this.loaderManager.onError = function ( url ) {
    	console.log( 'There was an error loading ' + url )
    }
  }
  ready(){
    const self = this

    /**
     * Tree particles (point)
     * @type {Object3D}
     */
    this.forest = new Forest({
      texture: this.textureParticleTree,
    })
    this.scene.add(this.forest)
this.forest.position.y = -8

    /**
     * Animals
     * @type {animals}
     */
     self.animals = new Animals({
       limitSpeed: 1 * window.Math.random() * 5,
       x: 0,
       y: 14,
       z: 50
     })
     self.scene.add(self.animals)

    /**
     * Sun
     * @type {sun}
     */
    this.sun = new Sun()
    this.scene.add(this.sun)



    this.isReady = true
  }
  init(){
  }
  events(){
    const self = this
    $(window).on('mousemove mousedown mouseup', (e) => {
       self.cameraTilt(e.pageX, e.pageY, e.type)
    })
    $(window).on('resize', (e) => {
       self.resize()
    })
  }
  cameraTilt(x, y, type) {
    const cameraPanRange = settings.cameraTilt.cameraPanRange
    const cameraYawRange = settings.cameraTilt.cameraYawRange
    let nx = 0
    let ny = 0
    let ry = 0
    let rx = 0
    let rz = 0
    if (type === 'mousemove') {
      nx = x / window.innerWidth * 2 - 1
      ny = -y / window.innerHeight * 2 + 1
      ry = -Math.mapLinear(nx, -1, 1, cameraPanRange * -0.5, cameraPanRange * 0.5)
      rx = Math.mapLinear(ny, -1, 1, cameraYawRange * -0.5, cameraYawRange * 0.5)
    } else {
      rx = 0
      ry = 0
    }
    TweenMax.to(this.camera.rotation, 2, {
      x: rx*0.5,
      y: ry*0.5,
      ease: Power4.easeOut
    })
    TweenMax.to(this.camera.position, 4, {
      x: settings.camera.position.x + nx*10,
      y: settings.camera.position.y + ny*7,
      ease: Power4.easeOut
    })
  }
  update() {
    if (!this.isReady) { return false }
    let delta = this.clock.getDelta()
    this.time += 1/60

    this.animals.update(delta)
    this.forest.rotation.z += .007

    if(!this.composer){
      this.renderer.render(this.scene, this.camera)
    }else{
      this.composer.render( 0.5 )
    }

  }
  resize(){
  }
  render() {
    return false
  }
}

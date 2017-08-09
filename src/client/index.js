// @flow

import React from 'react'
import { render } from 'react-dom'
import Canvas from './canvas'

require('./assets/sass/main.sass')

export default class App extends React.Component {
  constructor(){
    super()
    this.events()
  }
  componentWillMount(){
    console.log('%c |||| ', 'background: #222; color: #fff; padding: 10px 0px; font-weight: bold; line-height: 50px');
  }
  componentDidMount(){
    this.canvas.init()
    this.update()
  }
  events(){
    let self = this
    $(window).on({
      'resize' : function(){
        self.canvas.resize()
      }
    })
  }
  update() {
    this.canvas.update()
    requestAnimationFrame( this.update.bind(this) )
  }
  render() {
    return (
      <div>
        <Canvas onRef={ref => (this.canvas = ref)}/>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))


/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from 'react'
import _ from 'lodash'
import { Stage, Layer, Rect } from 'react-konva'

import './lib/require'

const methods = {
  bubble: require('./lib/sorts/bubble').default,
  selection: require('./lib/sorts/selection').default,
  insertion: require('./lib/sorts/insertion').default,

  merge: require('./lib/sorts/merge').default,
}
const DELAY = 50
const COUNT = 81

export default class extends Component {
  constructor(props) {
    super(props)
    const count = COUNT

    this.state = {
      color: '#444',
      haystack: Array.init([...Array(count).keys()].map(t => t + 1)).shuffle(),
      count,
      replaceCount: 0,
      swapCount: 0,
      compareCount: 0,
      compareL: undefined,
      compareR: undefined,

      stageWidth: 0,
      stageHeight: 0,

      disabledExceptStop: false,
      method: 'bubble',
      message: 'ready',
    }
    this.start = this.start.bind(this)
    this.handleMethodChange = this.handleMethodChange.bind(this)
  }

  componentDidMount() {
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      stageWidth: window.innerWidth,
      stageHeight: window.innerHeight,
    })
  }

  render() {
    const gap = 7
    const width = 4
    const heightRule = 2

    const {
      color,
      haystack,
      count,
      replaceCount,
      swapCount,
      compareCount,
      compareL,
      compareR,
      stageWidth,
      stageHeight,
      disabledExceptStop,
    } = this.state

    if (haystack.length === 0) {
      return <div />
    }
    return (
      <div>
        <h1>Sort Visualization</h1>
        <style jsx>{`
    `}</style>
        <div style={{ marginBottom: 10 }}>
          <button
            disabled={this.state.disabledExceptStop}
            onClick={() => { this.start() }}
          >Start</button>
          <button
            disabled={this.state.disabledExceptStop}
            onClick={() => { this.shuffle() }}
          >Shuffle</button>
        </div>
        <p>
          <label>Sort method</label>&nbsp;&nbsp;&nbsp;&nbsp;
          {Object.keys(methods).map(method =>
            <label key={method}>
              <input
                type="radio"
                name="method"
                value={method}
                disabled={disabledExceptStop}
                checked={method === this.state.method}
                onChange={this.handleMethodChange}
              />
              {method} &nbsp;
            </label>,
          )}
        </p>
        <div style={{ marginBottom: 10 }}>
          <p>{this.state.message}</p>
          <div><small>number of elements: {count}</small></div>
          <div><small>replace count: {replaceCount}</small></div>
          <div><small>swap count: {swapCount}</small></div>
          <div><small>compare count: {compareCount}</small></div>
        </div>
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {haystack.map((element, index) => {
              let fill = color
              if (compareL === index) {
                fill = 'magenta'
              } else if (compareR === index) {
                fill = 'magenta'
              }
              return (
                <Rect
                  key={element.value}
                  x={0 + (index * gap)}
                  y={0}
                  width={width}
                  height={heightRule * element.value}
                  fill={fill}
                  shadowBlur={0}
                />
              )
            })}
          </Layer>
        </Stage>
      </div>
    )
  }

  shuffle() {
    this.setState({
      haystack: this.state.haystack.shuffle(),
    })
  }

  handleMethodChange(changeEvent) {
    this.setState({
      method: changeEvent.target.value,
    })
  }

  start() {
    this.setState({
      disabledExceptStop: true,
      swapCount: 0,
      compareCount: 0,
    })
    const tempHaystack = _.cloneDeep(this.state.haystack)
    const { haystack } = this.state

    // sort!
    const b = window.performance.now()
    methods[this.state.method].sort(tempHaystack)
    this.setState({
      message: `the sorting takes ${window.performance.now() - b} miliseconds`,
    })

    // draw!
    haystack.playbook.forEach((p, index) => {
      setTimeout(() => {
        if (p.type === 'compare') {
          this.setState({
            compareCount: this.state.compareCount + 1,
            compareL: p.x,
            compareR: p.y,
          })
        } else if (p.type === 'swap') {
          this.setState({
            swapCount: this.state.swapCount + 1,
          })
          const o = haystack[p.x]
          haystack[p.x] = haystack[p.y]
          haystack[p.y] = o
        } else if (p.type === 'replace') {
          this.setState({
            replaceCount: this.state.replaceCount + p.target.length,
          })
          haystack.splice(p.on, p.target.length, ...p.target)
        }
      }, index * DELAY)
    })

    setTimeout(() => {
      this.setState({
        compareL: undefined,
        compareR: undefined,
        disabledExceptStop: false,
      })
    }, haystack.playbook.length * DELAY)
  }
}


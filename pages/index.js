import React from 'react'
import { render } from 'react-dom';
import _ from 'lodash'

import { Component } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva';

const delay = 100

Array.prototype.shuffle = function () {
  const input = this;
  for (let i = input.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const itemAtIndex = input[randomIndex]
    input[randomIndex] = input[i]
    input[i] = itemAtIndex
  }
  return input
}

const selection = async (haystack) => {
  const count = haystack.length
  for (let i = 0; i < count; i += 1) {
    let current = i
    for (let j = i + 1; j < count; j += 1) {
      if (haystack.compare(current, j)) {
        current = j
      }
    }
    if (haystack.compare(i, current))
      haystack.swap(i, current)
  }
}

const bubble = async (haystack) => {
  for (let j = haystack.length; j >= 0; j -= 1)
    for (let i = 0; i < j - 1; i += 1)
      if (haystack.compare(i, i + 1)) {
        haystack.swap(i, i + 1)
      }
}

export default class extends Component {
  constructor(props) {
    super(props)
    const count = 150

    this.state = {
      color: 'black',
      stageWidth: 0,
      stageWeight: 0,
      haystack: [...Array(count).keys()].map(t => t + 1).shuffle(),
      count,
      swapCount: 0,
      compareCount: 0,
      compareL: undefined,
      compareR: undefined,

      shuffleDisabled: false,
    }
    this.start = this.start.bind(this)
  }

  componentDidMount() {
    this.w = window
    this.setState({
      stageWidth: this.w.innerWidth,
      stageHeight: this.w.innerHeight,
    })
  }

  render() {
    const gap = 7
    const width = 4
    const heightRule = 2

    const {
      color,
      stageWidth,
      stageHeight,
      haystack,
      count,
      swapCount,
      compareCount,
      compareL,
      compareR,
    } = this.state

    if (haystack.length === 0) {
      return <div />
    }
    return (
      <div>
        <h1>Sort Visualization</h1>
        <style jsx>{`
.button {
  cursor: pointer;
  display: inline-block;
  font-family: 'Gotham SSm',sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .091em;
  line-height: 1em;
  border-style: solid;
  border-width: 1.1px;
  border-radius: 0;
  padding: 1.8em 3.6em;
  text-align: center;
  text-rendering: optimizeLegibility;
  text-transform: uppercase;
  -webkit-font-smoothing: antialiased;
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-transition: opacity 300ms cubic-bezier(.694,0,.335,1),background-color 300ms cubic-bezier(.694,0,.335,1),color 300ms cubic-bezier(.694,0,.335,1);
  -o-transition: opacity 300ms cubic-bezier(.694,0,.335,1),background-color 300ms cubic-bezier(.694,0,.335,1),color 300ms cubic-bezier(.694,0,.335,1);
  transition: opacity 300ms cubic-bezier(.694,0,.335,1),background-color 300ms cubic-bezier(.694,0,.335,1),color 300ms cubic-bezier(.694,0,.335,1);
  color: #fff;
  background-color: #000;
  border-color: #000;
}
    `}</style>
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => { this.start() }} className="button">Start</button>
          <button disabled={this.state.shuffleDisabled} onClick={() => { this.shuffle() }} className="button">Shuffle</button>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div>number of elements: {count}</div>
          <div>swap count: {swapCount}</div>
          <div>compare count: {compareCount}</div>
        </div>
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {haystack.map((number, index) => {
              let fill = color
              if (compareL === index) {
                fill = 'red'
              } else if (compareR === index) {
                fill = 'red'
              }
              return (
                <Rect
                  key={number}
                  x={0 + index * gap}
                  y={0}
                  width={width}
                  height={heightRule * number}
                  fill={fill}
                  shadowBlur={0}
                  onClick={this.handleClick}
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

  start() {
    this.setState({
      shuffleDisabled: true,
    })
    const tempHaystack = _.cloneDeep(this.state.haystack)
    const { haystack } = this.state
    const playbook = []

    Array.prototype.swap = function (x, y) {
      var b = this[x];
      this[x] = this[y];
      this[y] = b;
      playbook.push({ type: 'swap', x, y })
      return this;
    }

    Array.prototype.compare = function (x, y) {
      playbook.push({ type: 'compare', x, y })
      return this[x] > this[y]
    }

    // bubble(tempHaystack)
    console.time()
    selection(tempHaystack)
    console.timeEnd()


    // draw
    playbook.forEach((p, index) => {
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
          const b = haystack[p.x]
          haystack[p.x] = haystack[p.y]
          haystack[p.y] = b
        }
      }, index * delay)
    })

    setTimeout(() => {
      this.setState({
        compareL: undefined,
        compareR: undefined,
      })
    }, playbook.length * delay)
  }
  handleClick() {
    console.log('handleclick')
  }
}
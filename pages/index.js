
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from 'react'
import _ from 'lodash'
import { Stage, Layer, Rect } from 'react-konva'
import Head from 'next/head'

import './lib/require'

const methods = {
  bubble: require('./lib/sorts/bubble').default,
  selection: require('./lib/sorts/selection').default,
  insertion: require('./lib/sorts/insertion').default,

  merge: require('./lib/sorts/merge').default,
}
const COUNT = 80

export default class extends Component {
  constructor(props) {
    super(props)
    const count = COUNT

    this.state = {
      color: '#555',
      haystack: Array.init([...Array(count).keys()].map(t => t + 1)).shuffle(),
      count,
      replaceCount: 0,
      swapCount: 0,
      compareCount: 0,
      compareL: undefined,
      compareR: undefined,
      swapL: undefined,
      swapR: undefined,
      replaces: [],
      complete: false,

      stageWidth: 0,
      stageHeight: 200,

      disabledExceptStop: false,
      method: 'bubble',
      delay: 100,
      message: 'ready',
    }
    this.start = this.start.bind(this)
    this.handleMethodChange = this.handleMethodChange.bind(this)
    this.handleDelayChange = this.handleDelayChange.bind(this)
  }

  componentDidMount() {
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      stageWidth: window.innerWidth,
    })
  }

  render() {
    const gap = 6
    const width = 5
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
      swapL,
      swapR,
      replaces,
      stageWidth,
      stageHeight,
      disabledExceptStop,
    } = this.state

    if (haystack.length === 0) {
      return <div />
    }
    return (
      <div>
        <Head>
          <title>Sort Visualization</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="stylesheet" href="https://unpkg.com/tachyons@4.9.1/css/tachyons.min.css" />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
        </Head>
        <style jsx global>{`
        body {
          padding: 1em;
          font-weight: 300;
          font-family: 'Open Sans', sans-serif;
        }
    `}</style>
        <div className="link b f3 f3-ns dim black-70 lh-solid">SORT VISUALIZATION</div>

        <main className="pa0 black-80">
          <form className="measure">
            <fieldset className="ba b--transparent ph0 mh0">
              {/* <legend className="f4 fw6 ph0 mh0">Controller</legend> */}
              <div className="mt3 mv3">
                <label className="db fw6 lh-copy f6">Delay</label>
                <input
                  type="text"
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  disabled={disabledExceptStop}
                  onChange={this.handleDelayChange}
                  value={this.state.delay}
                />
              </div>
              <div className="mt3 mv3">
                <label className="db fw6 lh-copy f6">Sort Method</label>
                {Object.keys(methods).map(method =>
                  <label key={method} className="pa0 ma0 mr2 lh-copy f6 pointer">
                    <input
                      type="radio"
                      name="method"
                      value={method}
                      disabled={disabledExceptStop}
                      checked={method === this.state.method}
                      onChange={this.handleMethodChange}
                    /> {method}
                  </label>,
                )}
              </div>
            </fieldset>
            <div className="">
              <input
                disabled={this.state.disabledExceptStop}
                onClick={() => { this.start() }}
                className="b ph3 pv2 mr1 input-reset ba b--black bg-transparent grow pointer f6 dib" type="button" value="Start" />
              <input

                disabled={this.state.disabledExceptStop}
                onClick={() => { this.shuffle() }}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="button" value="Shuffle" />
            </div>
            {/* <div className="lh-copy mt3">
              <a href="#0" className="f6 link dim black db">Sign up</a>
              <a href="#0" className="f6 link dim black db">Forgot your password?</a>
            </div> */}
          </form>
        </main>

        <div className="mt4 mv4">
          <h2 className="f5 f4-m f3-l fw2 black-50 mt0 lh-copy">
            {this.state.message}
          </h2>
          <div><small>number of elements: {count}</small></div>
          <div><small>replace count: {replaceCount}</small></div>
          <div><small>swap count: {swapCount}</small></div>
          <div><small>compare count: {compareCount}</small></div>
        </div>
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {haystack.map((element, index) => {
              let fill = color
              if (compareL === index || compareR === index) {
                fill = '#FFC8F2'
              }
              if (swapL === index) {
                fill = '#44B4D5'
              } else if (swapR === index) {
                fill = '#44B4D5'
              }
              if (replaces.includes(index)) {
                fill = '#C9DECB'
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
        <footer className="pv4 tl">
          <a className="link near-black hover-silver dib h2 w2 mr3" href="https://github.com/eseom/sortvisualization" title="GitHub">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.083-.202-.358-1.015.077-2.117 0 0 .672-.215 2.2.82.638-.178 1.323-.266 2.003-.27.68.004 1.364.092 2.003.27 1.527-1.035 2.198-.82 2.198-.82.437 1.102.163 1.915.08 2.117.513.56.823 1.274.823 2.147 0 3.073-1.87 3.75-3.653 3.947.287.246.543.735.543 1.48 0 1.07-.01 1.933-.01 2.195 0 .215.144.463.55.385C13.71 14.53 16 11.534 16 8c0-4.418-3.582-8-8-8" /></svg>
          </a>
        </footer>
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

  handleDelayChange(changeEvent) {
    this.setState({
      delay: changeEvent.target.value,
    })
  }

  start() {
    this.setState({
      disabledExceptStop: true,
      complete: false,
      swapCount: 0,
      compareCount: 0,
      replaceCount: 0,
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
        this.setState({
          compareL: undefined,
          compareR: undefined,
          swapL: undefined,
          swapR: undefined,
          replaces: [],
        })
        if (p.type === 'compare') {
          this.setState({
            compareCount: this.state.compareCount + 1,
            compareL: p.x,
            compareR: p.y,
          })
        } else if (p.type === 'swap') {
          const o = haystack[p.x]
          haystack[p.x] = haystack[p.y]
          haystack[p.y] = o
          this.setState({
            swapCount: this.state.swapCount + 1,
            swapL: p.x,
            swapR: p.y,
          })
        } else if (p.type === 'replace') {
          haystack.splice(p.on, p.target.length, ...p.target)
          this.setState({
            replaceCount: this.state.replaceCount + p.target.length,
            replaces: [...Array(p.target.length).keys()].map(a => a + p.on),
          })
        }
      }, index * this.state.delay)
    })

    setTimeout(() => {
      this.setState({
        compareL: undefined,
        compareR: undefined,
        swapL: undefined,
        swapR: undefined,
        replaces: [],
        completed: true,
        disabledExceptStop: false,
      })
    }, haystack.playbook.length * this.state.delay)
  }
}


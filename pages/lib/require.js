/* eslint-disable no-extend-native */
/* eslint-disable no-param-reassign */

export class Element {
  constructor(position, value) {
    this.position = position
    this.value = value
  }
  setHaystack(haystack) {
    this.haystack = haystack
  }
  compare(element) {
    this.haystack.playbook.push({ type: 'compare', x: this.position, y: element.position })
    return this.value > element.value
  }
  swap(element) {
    this.haystack.swap(this, element)
  }
}

Array.prototype.playbook = []

Array.prototype.shuffle = function () {
  const input = this
  for (let i = input.length - 1; i >= 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const itemAtIndex = input[randomIndex]
    input[randomIndex] = input[i]
    itemAtIndex.position = i
    input[i] = itemAtIndex
  }
  return input
}
Array.prototype.replace = function (t, on) {
  const start = on.position
  t = t.map((o, i) => {
    o.position = i + start
    return o
  })
  this.playbook.push({ type: 'replace', target: t, on: start })
  this.splice(start, t.length, ...t)
}
Array.prototype.swap = function (x1, y1) {
  const x = x1.position
  const y = y1.position

  const b = this[x]
  this[x] = this[y]
  this[y] = b

  const c = this[x].position
  this[x].position = this[y].position
  this[y].position = c

  this.playbook.push({ type: 'swap', x, y })
  return this
}
Array.init = function (values) {
  const elements = values.map((value, index) => new Element(index, value))
  elements.forEach(element => element.setHaystack(elements))
  return elements
}

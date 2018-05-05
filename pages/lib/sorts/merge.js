export const combine = (a, b) => {
  const n = []
  while (a.length !== 0 || b.length !== 0) {
    if (a.length === 0) {
      n.push(b.shift())
    } else if (b.length === 0) {
      n.push(a.shift())
    } else if (a[0].compare(b[0])) {
      n.push(b.shift())
    } else {
      n.push(a.shift())
    }
  }
  return n
}

export const devide = (haystack, entireHaystack) => {
  if (haystack.length === 1) {
    return haystack
  }
  const center = parseInt(haystack.length / 2, 10)
  const left = devide(haystack.slice(0, center), entireHaystack)
  const right = devide(haystack.slice(center, haystack.length), entireHaystack)
  // for the drawing code begin
  const on = left[0]
  const t = combine(left, right)
  entireHaystack.replace(t, on)
  // for the drawing code end
  return t
}

export default {
  message: 'merge sort',
  sort(haystack) {
    devide(haystack, haystack)
  },
}

import '../pages/lib/require'

const methods = {
  bubble: require('../pages/lib/sorts/bubble').default,
  selection: require('../pages/lib/sorts/selection').default,
  insertion: require('../pages/lib/sorts/insertion').default,

  merge: require('../pages/lib/sorts/merge').default,
}

Object.keys(methods).forEach((method) => {
  test(methods[method].message, () => {
    const t = Array.init([5, 4, 8, 6, 3, 7, 2, 1])
    methods[method].sort(t)
    // expect(t.map(a => a.value)).toEqual([4, 5, 6, 8])
    expect(t.map(a => a.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
})

import '../pages/lib/require'
import { combine, devide } from '../pages/lib/sorts/merge'

test('combine in merge', () => {
  // const a = [1, 3, 4, 8]
  // const b = [2, 5, 6, 7]
  const c = Array.init([7, 3, 5, 8, 9, 2, 4, 6, 1])
  const t = devide(c, c)
  // const t = merge.combine(a, b)
  expect(t.map(a => a.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
})

test('combine in merge', () => {
  const a = Array.init([1, 3])
  const b = Array.init([2, 4])
  // const c = [7, 3, 5, 8, 9, 2, 4, 6, 1]
  expect(combine(a, b).map(u => u.value)).toEqual(
    [1, 2, 3, 4]
  )

  const c = Array.init([1, 3, 5])
  const d = Array.init([2, 4])
  // const c = [7, 3, 5, 8, 9, 2, 4, 6, 1]
  expect(combine(c, d).map(u => u.value)).toEqual(
    [1, 2, 3, 4, 5]
  )

  const e = Array.init([2, 9])
  const f = Array.init([1, 4, 6])
  // const c = [7, 3, 5, 8, 9, 2, 4, 6, 1]
  expect(combine(e, f).map(u => u.value)).toEqual(
    [1, 2, 4, 6, 9]
  )
})
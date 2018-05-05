export default {
  message: 'insertion sort',
  sort(haystack) {
    const count = haystack.length
    for (let i = 1; i < count; i += 1) {
      let j = i - 1
      for (; j >= 0; j -= 1) {
        if (!haystack[j].compare(haystack[i])) {
          break
        }
      }
      for (let k = i; k > j + 1; k -= 1) {
        haystack[k].swap(haystack[k - 1])
      }
    }
  },
}

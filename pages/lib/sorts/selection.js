export default {
  message: 'selection sort',
  sort(haystack) {
    const count = haystack.length
    for (let i = 0; i < count; i += 1) {
      let current = i
      for (let j = i + 1; j < count; j += 1) {
        if (haystack[current].compare(haystack[j])) {
          current = j
        }
      }
      if (haystack[i].compare(haystack[current])) {
        haystack[i].swap(haystack[current])
      }
    }
  },
}

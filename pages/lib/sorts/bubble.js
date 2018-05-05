export default {
  message: 'bubble sort',
  sort(haystack) {
    for (let j = haystack.length; j >= 0; j -= 1) {
      for (let i = 0; i < j - 1; i += 1) {
        if (haystack[i].compare(haystack[i + 1])) {
          haystack[i].swap(haystack[i + 1])
        }
      }
    }
  },
}

export function isFunction(value) {
  return typeof value === 'function'
}

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value)
}

export function addStyle(element, value) {
  if (isNumber(element.length)) {
    Array.from(element).forEach(elem => addStyle(elem.style, value))

    return
  }

  // 속성 복사
  Object.assign(element.style, value)
}

export function emptyStyle(element, value) {
  if (isNumber(element.length)) {
    Array.from(element).forEach(elem => emptyStyle(elem.style, value))

    return
  }

  element.setAttribute('style', '')
}

export function addClass(element, value) {
  if (isNumber(element.length)) {
    Array.from(element).forEach(elem => addClass(elem, value))

    return
  }

  element.classList.add(value)
}

export function removeClass(element, value) {
  if (isNumber(element.length)) {
    Array.from(element).forEach(elem => removeClass(elem, value))

    return
  }

  element.classList.remove(value)
}

export function emptyChild(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild)
  }
}

// From: https://medium.com/@TCAS3/debounce-deep-dive-javascript-es6-e6f8d983b7a1
export function debounce(fn, time) {
  let timeout

  return function () {
    const functionCall = () => fn.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}
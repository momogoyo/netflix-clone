import EventEmitter from 'events'
import { isFunction } from '../helper/utils'

class Router extends EventEmitter {
  constructor({ entry, routes, initialRoute }) {
    super()

    this._$entry = entry
    this._routes = routes
    // initialRoute가 안넘어올 경우에는 '/'로 초기화!
    this._initialRoute = initialRoute || '/'
    // 이전 component를 저장
    this._previousComponent = null

    // this.$emit = EventEmitter

    this._init()
  }

  _init() {
    // DOM Rendering
    this._initRender()
    this._initEvents()
  }

  _initRender() {
    const path = this._getPath()
    const route = this._getRoute(path)

    if (route) {
      this._render(route)
    }
  }

  _initEvents() {
    window.addEventListener('popstate', this._onpopstate.bind(this))
  }

  _render(route) {
    const previousComponent = this._previousComponent
    if (previousComponent instanceof route.component) {
      return
    }

    const $entry = this._$entry

    while ($entry.hasChildNodes()) {
      $entry.removeChild($entry.lastChild)
    }

    if (previousComponent) {
      if (isFunction(previousComponent.destroyed)) {
        previousComponent.destroyed()
      }
    }

    // new 생성자로 인스턴스화 시키기
    const component = new route.component()

    // DOM append하기 전 실행하는 공간
    if (isFunction(component.created)) {
      component.created()
    }

    $entry.appendChild(component.$element)

    // DOM append한 후 전 실행하는 공간
    // if (typeof component.mounted === 'function') {
    if (isFunction(component.mounted)) {
      setTimeout(() => component.mounted(), 1)
    }

    this._previousComponent = component
  }

  _pushState(route) {
    const state = null
    const title = ''
    const path = route.path

    window.history.pushState(state, title, path)
  }

  _getRoute(path) {
    return this._routes.find(route => route.path === path)
  }

  // 현재 어떤 URL을 가지고 있나?
  _getPath() {
    return window.location.pathname
  }

  _onpopstate(event) {
    const path = this._getPath()
    const route = this._getRoute(path)

    if (route) {
      this._render(route)
    }
  }

  go(path) {
    const route = this._getRoute(path)

    if (route) {
      this._pushState(route)
      this._render(route)
    }
  }
}

export default Router
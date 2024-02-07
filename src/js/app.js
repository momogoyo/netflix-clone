import '../assets/styles/main.scss'
import Router from './router/router'
import routes from './router/routes'

// DOM 구분해주기
const DOM = {
  container: document.getElementById('main')
  // navLinks: document.querySelectorAll('.nav-links > a')
}
// 이런식으로 구분해주기도 한다.
// const $container = document.getElementById('container');

let router = null // Object는 보통 null로 초기화

function init() {
  initRouter()
  initEvents()
}

function initRouter() {
  router = new Router({
    initialRoute: '/',
    entry: DOM.container,
    routes: routes
  })

  // router.go()
  // router.back()
}

function initEvents() {
  // Array.from(DOM.navLinks).forEach(link => link.addEventListener('click', onNavLink))
  document.addEventListener('click', onRouteLinks)
}

// function onNavLink(event) {
function onRouteLinks(event) {
  // a tag가 없으면 그 위의 부모 요소를 타고 올라가며 a tag가 있는지 탐색한다.
  // 조건에 만족하는 요소가 없으면 null을 반환한다.
  const target = event.target.matches('a') ? event.target : event.target.closest('a')

  if (!target) return

  event.preventDefault() // 기본 이벤트를 막아준다. - 여기서는 a 태그에 기본적으로 걸려있는 이벤트를 막아주는 역할을 한다. 페이지 새로 고침되는 것을 막아주는 것이지!

  const path = event.target.getAttribute('href')
  router.go(path)
}

init()
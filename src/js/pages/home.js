import View from './view'
import template from '../../components/home.html'
import { tmdb } from '../api/index'
import Swiper from '../lib/swiper'
import VideoPlayer from '../lib/video-player'
import SharedTransition from '../lib/shared-transition'
import { addStyle, emptyStyle, emptyChild, addClass, removeClass, debounce } from '../helper/utils'

class Home extends View {
  constructor() {
    super({ // 이걸로 부모에 접근할 수 있다. (부모 클래스 constructor에 접근하도록 한다.)
      innerHTML: template,
      className: 'home'
    })

    this.DOM = {
      slides: this.$element.querySelector('.slides'),
      slide: this.$element.querySelectorAll('.slide'),
      slideInner: this.$element.querySelector('.slide-inner'),
      slideContainer: this.$element.querySelectorAll('.slide-wrapper'),
      slideContents: null,

      previewInfoContainer: this.$element.querySelector('.preview-info-container'),
      overview: this.$element.querySelector('.overview'),
      playTrailer: this.$element.querySelector('.play-trailer'),
      trailer: this.$element.querySelector('.trailer'),
      cancelTrailer: this.$element.querySelector('.trailer-cancel')
    }

    this._isScrolling = false
    this._beforeScrollTop = 0
    this.youtubeId = 0
    this._youtubeTimer = 0
  }

  mounted() {
    this._requestVideo()
    this._requestOriginal()
    this._requestPopular()
    this._requestKids()
    this._requestHorror()
    this._requestHistory()
    this._requestDocumentary()

    this._initDOM()
  }

  destroyed() {
    window.removeEventListener('scroll', this._onScrollStart)
    window.removeEventListener('scroll', this._onScrollEnd)
  }

  _initDOM() {
    this._initEvent()

    for (let i = 0; i < this.DOM.slideContainer.length; i++) {
      this.DOM.slideContainer[i].insertAdjacentHTML('beforeend', `
        <div class="slide-content">
          <a href="/">
            <div class="init-div">&nbsp;</div>
          </a>
        </div>
      `)
    }
  }

  _initEvent() {
    window.addEventListener("load", () => new VideoPlayer(this.$refs))
    this._onScrollStart = this._onScrollStart.bind(this)
    this._onScrollEnd = debounce(this._onScrollEnd.bind(this), 250)
    window.addEventListener('scroll', this._onScrollStart)
    window.addEventListener('scroll', this._onScrollEnd)

    this.DOM.playTrailer.addEventListener('click', this._onTrailer.bind(this))
    this.DOM.playTrailer.addEventListener('click', this._onTrailer.bind(this))
    this.DOM.cancelTrailer.addEventListener('click', this._closeTrailer.bind(this))
  }

  _onTrailer(event) {
    const trailer = this.DOM.trailer

    addClass(trailer, 'on')
  }

  _closeTrailer() {
    const trailer = this.DOM.trailer

    removeClass(trailer, 'on')
  }

  // GET DATA
  async _requestVideo() {
    const landing = this.$refs.landing

    tmdb.getMovieDetails(337401)
      .then((data) => {
        const landingList = data
        this._renderLanding(landing, landingList)
      })
      .catch((err) => {
        console.log('Fetch Error', err)
      })
  }

  _requestOriginal() {
    const original = this.$refs.original

    this.intersectionObserver(original, () => {
      tmdb.getGenre(37)
        .then((data) => {
          const originalList = data.results
          this._renderOriginal(original, originalList)
        })
        .catch(err => {
          console.log('Fetch Error', err)
        })
    })
  }

  _requestPopular() { // 영화 인기 순위 API
    const popular = this.$refs.popular

    this.intersectionObserver(popular, () => {
      // 인기가 많은 순서대로 정렬
      tmdb.getPopularMovie()
        .then((data) => {
          const movieList = data.results.sort((a, b) => b.popularity - a.popularity)
          this._render(popular, movieList)
        })
        .catch(err => {
          console.log('Fetch Error', err)
        })
    })
  }

  _requestKids() {
    const kids = this.$refs.kids

    this.intersectionObserver(kids, () => {
      tmdb.getGenre(16)
        .then(data => {
          const movieList = data.results
          this._render(kids, movieList)
        })
        .catch(err => {
          console.log('Fetch Error', err)
        })
    })
  }


  _requestHistory() {
    const history = this.$refs.history

    this.intersectionObserver(history, () => {
      tmdb.getGenre(36)
        .then(data => {
          const movieList = data.results
          this._render(history, movieList)
        })
        .catch(err => {
          console.log('Fetch Error', err)
        })
    })
  }

  _requestHorror() {
    const horror = this.$refs.horror

    this.intersectionObserver(horror, () => {
      tmdb.getGenre(27)
        .then(data => {
          const movieList = data.results
          this._render(horror, movieList)
        })
        .catch(err => {
          console.log('Fetch Error', err)
        })
    })
  }

  _requestDocumentary() {
    const documentary = this.$refs.documentary

    this.intersectionObserver(documentary, () => {
      tmdb.getGenre(99)
        .then(data => {
          const movieList = data.results
          this._render(documentary, movieList)
        })
        .catch(err => {
          console.log('Fetch Error', err);
        })
    })
  }

  _renderLanding(element, movieList) {
    return new Promise((resolve, reject) => {
      element.insertAdjacentHTML('beforeend', `
        <div class="landing-poster" data-id="${movieList.id}">
          <a href="/">
            <div class="landing-poster-thumbnail">
              <img src="${tmdb.BASE_IMAGE_URL + movieList.poster_path}" alt="${movieList.title} 이미지" />
            </div>
          </a>
        </div>
      `)

      resolve()
    })
  }

  _renderOriginal(element, movieList) {
    return new Promise((resolve, reject) => {
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild)
      }

      movieList.forEach((movie, index) => {
        const isLast = (index === movieList.length - 1)

        element.insertAdjacentHTML('beforeend', `
          <div class="poster-content" data-id="${movie.id}">
            <a href="/">
              <div class="poster-thumbnail">
                <img class="lazy-load" data-src="${tmdb.BASE_IMAGE_URL + movie.poster_path}" alt="${movie.title} 이미지" />
              </div>
            </a>
            <h3 class="movie-title">${movie.title}</h3>
          </div>
        `)

        if (isLast) {
          this._setupSwipe(element, 'original')
            .then(() => resolve())
        }
      })
    })
  }

  _render(element, movieList) {
    return new Promise((resolve, reject) => {
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild)
      }

      movieList.forEach((movie, index) => {
        const isLast = (index === movieList.length - 1)

        element.insertAdjacentHTML('beforeend', `
          <div class="slide-content" data-id="${movie.id}">
            <a href="/">
              <div class="slide-thumbnail">
                <img class="lazy-load" data-src=${tmdb.BASE_IMAGE_URL + movie.backdrop_path} alt="${movie.title} 이미지" />
              </div>
            </a>
            <h3 class="movie-title">${movie.title}</h3>
          </div>
        `)

        if (isLast) {
          this._setupSwipe(element, 'movie')
            .then(() => resolve())
        }
      })
    })
  }

  _setupSwipe(element, type) {
    return new Promise((resolve, reject) => {
      // 이미지 지연 로딩
      const images = Array.from(element.querySelectorAll('[data-src]'))
      this.lazyLoad(images)

      const swiper = new Swiper(element, {
        navigation: {
          prevEl: element.parentNode.querySelector('.prevBtn'),
          nextEl: element.parentNode.querySelector('.nextBtn')
        }
      })

      let enterPreview = 0

      const mouseenterFn = (event) => {
        enterPreview = setTimeout(() => {
          this._showSmallPreview(event, type)
        }, 400)
      }

      const mouseleaveFn = (event) => {
        if (enterPreview) clearTimeout(enterPreview)
      }

      // 모든 이미지에 mouseenter, mouseleave 이벤트 걸어주기
      images.forEach(item => {
        item.addEventListener('mouseenter', mouseenterFn)
        item.addEventListener('mouseleave', mouseleaveFn)
      })

      swiper.on('started', () => {
        element.parentNode.classList.add('started')
      })

      swiper.on('update', (index) => {
        // console.log(swiper.current)
      })

      resolve()
    })
  }

  _setSmallPreviewMetadata(data) {
    const average = data.vote_average * 10
    const runtime = data.runtime
    const releaseDate = data.release_date.slice(0, 4)
    const genres = data.genres

    this.$refs.average.insertAdjacentHTML('beforeend', `${average}% 일치`)
    this.$refs.releaseDate.insertAdjacentHTML('beforeend', `${releaseDate}`)
    this.$refs.runtime.insertAdjacentHTML('beforeend', `${runtime}분`)
    this.$refs.genres.insertAdjacentHTML('beforeend', genres.map(item => `<span>${item.name}</span>`).join())
  }

  _setPreviewMetadata(data) {
    const previewInfoContainer = this.DOM.previewInfoContainer
    const previewInfoRight = Array.from(this.DOM.previewInfoContainer.children)[1]
    addClass(previewInfoContainer, 'on')
    addClass(previewInfoRight, 'on')

    const title = data.original_title
    const overview = data.overview
    const companies = data.production_companies
    const fullGenres = data.genres

    this.$refs.title.insertAdjacentHTML('beforeend', `${title}`)
    this.$refs.overview.insertAdjacentHTML('beforeend', `${overview}`)
    this.$refs.companies.insertAdjacentHTML('beforeend', companies.map(item => `<span>${item.name}</span>`).join())
    this.$refs.fullGenres.insertAdjacentHTML('beforeend', fullGenres.map(item => `<span>${item.name}</span>`).join())
  }

  // small preview의 위치
  _setSmallPreviewPos(event, type) {
    const root = document.documentElement
    const fromEl = event.target
    const toEl = this.$refs.preview
    const metaEl = this.$refs.metadata
    const bounds = fromEl.getBoundingClientRect()
    const winW = window.innerWidth  // 브라우저 창의 틀은 빼고 스크롤 크기를 포함한 크기
    const scale = type === 'movie' ? 1.5 : 1.2
    let width = bounds.width * scale // width를 1.5만큼 늘리기
    let height = bounds.height * scale // height를 1.5만큼 늘리기

    height = height + metaEl.clientHeight // metaEl의 내부 높이를 픽셀로 반환

    let top = bounds.top - (height - bounds.height) / 2
    top = top + root.scrollTop

    let left = bounds.left - (width - bounds.width) / 2
    if (left <= 0) {
      left = bounds.left
    } else if ((left + width) >= winW) {
      left = bounds.right - width
    }

    addStyle(toEl, {
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${Math.ceil(width)}px`,
      height: `${Math.ceil(height)}px`,
      transform: `translate(${Math.ceil(left)}px, ${Math.ceil(top)}px)`
    })
  }

  async _showSmallPreview(event, type) {
    const root = document.documentElement
    const fromEl = event.target
    const toEl = this.$refs.preview
    const id = fromEl.closest('[data-id]').dataset.id
    const detailData = await tmdb.getMovieDetails(id)
    const similiar = detailData.similar.results

    // metadata 정보 설정해주기
    this._setSmallPreviewMetadata(detailData)

    // preview 위치 설정
    this._setSmallPreviewPos(event, type)

    const sharedTransition = new SharedTransition({
      from: fromEl,
      to: toEl
    })

    const { average, runtime, releaseDate, genres, title, overview, youtubeVideo, overlay, companies, fullGenres } = this.$refs
    const previewInfoContainer = this.DOM.previewInfoContainer
    const previewInfoRight = Array.from(previewInfoContainer.children)[1]

    const smallImageSrc = fromEl.getAttribute('src') // mouseenter한 img의 src 가져오기
    const largeImageSrc = smallImageSrc.replace('w500', 'original') // 고화질 img로 변경

    // 원래 위치로 이동시켜주기
    const reverse = () => {
      sharedTransition.reverse()
    }

    const showPreview = () => {
      this._showPreview(toEl, similiar)
      this._setPreviewMetadata(detailData)

      emptyChild(genres)

      toEl.removeEventListener('mouseleave', reverse)
    }

    const beforePlayStart = () => {
      // 저화질 이미지 로드
      this.$refs.smallImage.src = smallImageSrc

      if (type === 'movie') {
        toEl.parentNode.classList.add('small-expanded')
      } else {
        toEl.parentNode.classList.add('original-expanded')
        toEl.parentNode.classList.add('original-active')
      }

      toEl.addEventListener('mouseleave', reverse, { once: true })
    }

    const afterPlayEnd = () => {
      // 고화질 이미지 로드
      this.$refs.largeImage.src = largeImageSrc

      // Full preview 띄워주기
      this.$refs.details.addEventListener('click', showPreview, { once: true })

      // 동영상 로드
      this._loadYouTubeVideo(detailData.videos)
    }

    const beforeReverseStart = () => {
      const expanded = type === 'movie' ? 'small-expanded' : 'original-expanded'
      toEl.parentNode.classList.remove(expanded)
      toEl.parentNode.classList.remove('expanded')

      removeClass(youtubeVideo, 'show-video')
      removeClass(overlay, 'show-video')
      removeClass(previewInfoContainer, 'on')
      removeClass(previewInfoRight, 'on')
    }

    const afterReverseEnd = () => {
      this.$refs.smallImage.src = ''
      this.$refs.largeImage.src = ''

      toEl.parentNode.classList.remove('original-active')

      // 클래스로 바꿔보기
      if (this.$refs.homeWrapper.style.position === 'fixed') {
        emptyStyle(this.$refs.homeWrapper)
        root.scrollTop = this._beforeScrollTop
      }

      emptyChild(average)
      emptyChild(runtime)
      emptyChild(releaseDate)
      emptyChild(genres)
      emptyChild(youtubeVideo)

      emptyChild(title)
      emptyChild(overview)
      emptyChild(companies)
      emptyChild(fullGenres)

      youtubeVideo.insertAdjacentHTML('beforeend', '<div id="player"></div>')
      // clearInterval(this._youtubeTimer)
      this.$refs.details.removeEventListener('click', showPreview)
      this._smallSharedTransition = null
    }

    // key가 beforePlayStart, 뒤에가 리스너
    sharedTransition.on('beforePlayStart', beforePlayStart)
    sharedTransition.on('afterPlayEnd', afterPlayEnd)
    sharedTransition.on('beforeReverseStart', beforeReverseStart)
    sharedTransition.on('afterReverseEnd', afterReverseEnd)
    sharedTransition.play(type)

    this._smallSharedTransition = sharedTransition
  }

  // Full preview
  async _showPreview(element, similiar) {
    const root = document.documentElement
    const fromEl = element
    const toEl = element
    const close = this.$refs.previewClose

    const similiarContainer = this.$refs.similiar

    similiar.forEach(item => {
      let overview = item.overview.length > 200 ? item.overview.substring(0, 200) + '...' : item.overview
      let release = item.release_date ? item.release_date.slice(0, 4) : ''
      let voteAvg = item.vote_average ? item.vote_average * 10 : null

      if (item.backdrop_path !== null) {
        similiarContainer.insertAdjacentHTML('beforeend', `
          <div class="similiar-wrap">
            <div class="similiar-thumbnail">
              <img src=${tmdb.BASE_IMAGE_URL + item.backdrop_path} />
            </div>
            <div class="similiar-info">
              <div class="similiar-meta">
                <span class="similiar-release">${release}</span>
                <span class="similiar-average">${voteAvg}%</span>
              </div>
              <h3 class="similiar-title">${item.title}</h3>
              <p class="similiar-content">${overview}</p>
            </div>
          </div>
        `)
      }
    })

    // preview의 위치와 움직일 preview-inner를 저장해주어야하기 때문에 값을 넘겨주어야 한다.
    const sharedTransition = new SharedTransition({
      from: fromEl,
      to: toEl,
      points: {
        from: fromEl.getBoundingClientRect()
      }
    })

    this._beforeScrollTop = root.scrollTop

    const reverse = () => {
      this._smallSharedTransition.reverse()
      this._smallSharedTransition.on('afterReverseEnd', () => {
        similiarContainer.innerHTML = ''
      })
    }

    // click한 이미지의 src 넘겨주기
    const beforePlayStart = () => {
      // toEl.parentNode.classList.remove('original-active')
      // toEl.parentNode.classList.remove('original-expanded')
      toEl.parentNode.classList.remove('small-expanded')
      toEl.parentNode.classList.add('expanded')

      emptyStyle(toEl)

      addStyle(this.$refs.homeWrapper, {
        position: 'fixed',
        top: `${-this._beforeScrollTop}px`,
        width: '100%',
        paddingTop: '70px'
      })

      // Full 화면일 때 스크롤의 위치 강제로 이동시키기
      window.scrollTo({ top: 0 })

      addClass(this.$refs.overlay, 'show-video')
    }

    const afterPlayEnd = () => {
      close.addEventListener('click', reverse, { once: true })
    }

    sharedTransition.on('beforePlayStart', beforePlayStart)
    sharedTransition.on('afterPlayEnd', afterPlayEnd)
    sharedTransition.play()
  }

  // https://developers.google.com/youtube/iframe_api_reference?hl=ko
  _loadYouTubeScript() {
    return new Promise((resolve, reject) => {
      // Load the IFrame Player API code asynchronously.
      const firstScriptTag = document.getElementsByTagName('script')[0]
      const tag = document.createElement('script')
      tag.onload = () => window.YT.ready(resolve)
      tag.onerror = reject
      tag.src = 'https://www.youtube.com/player_api'

      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    })
  }

  // youtube 동영상 로드하기
  async _loadYouTubeVideo(videos) {
    const { results } = videos
    const youtubeVideo = this.$refs.youtubeVideo

    if (!results.length) return

    if (!window.YT) {
      await this._loadYouTubeScript()
    }

    const video = results.find(v => v.type === 'Teaser' || v.type === 'Trailer')
    if (!video) return

    const player = new window.YT.Player('player', {
      width: '100%',
      height: '100%',
      videoId: video.key,
      playerVars: {
        autoplay: 1,
        mute: 1,
        autohide: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3
      },
      events: {
        onReady: (event) => {
          event.target.playVideo()
        },

        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            addClass(youtubeVideo, 'show-video')
          }

          if (event.data === YT.PlayerState.UNSTARTED) {
            removeClass(youtubeVideo, 'show-video')
          }
        }
      }
    })

    // From: https://stackoverflow.com/questions/9914373/ontimeupdate-with-youtube-api/51552777
    // 동영상 끝나기 1초 전에 화면에서 없애기
    // 유튜브 API에 ontimeupdate 이벤트가 따로 없어서 인터벌로 돌림.
    this._youtubeTimer = setInterval(() => {
      if (player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime()
        const duration = player.getDuration()
        if (currentTime >= (duration - 1)) {
          removeClass(youtubeVideo, 'show-video')

          clearInterval(this._youtubeTimer)
        }
      }
    }, 100)
  }

  // 스크롤 감지
  _onScrollStart() {
    if (this._isScrolling) {
      return
    }
    this._isScrolling = true

    addStyle(document.body, {
      pointerEvents: 'none'
    })
  }

  _onScrollEnd() {
    if (!this._isScrolling) {
      return
    }

    this._isScrolling = false

    emptyStyle(document.body)
  }
}

export default Home
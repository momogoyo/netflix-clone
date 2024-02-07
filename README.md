# netflix-clone (사이드 프로젝트)

## _Vanilla JS 스터디를 목적으로한 Netflix Clone 코딩_

- Parcel
- TMDB API
- All Vanilla JS

## Folder Structor

```sh
├─src
   ├─assets
   │  ├─styles: 스타일이 정의되어 있는 폴더
   │  └─images: 이미지 파일들이 있는 폴더
   ├─components
   │   home.html: home 페이지
   │   movie.html: movie 페이지
   │   tv.html: tv 페이지
   ├─js
   │  ├─api
   │  │   index.js: TMDB API를 기능별로 함수를 정의한 폴더
   │  ├─helper
   │  │   utils.js: 여러 폴더에서 재사용되는 함수 정의
   │  ├─lib
   │  │   shared-transition.js: preview(small, large) 라이브러리
   │  │   swiper.js: Infinite slider 라이브러리
   │  │   video-player.js: 비디오 플레이어 라이브러리
   │  ├─pages
   │  │   home.js: home 페이지에 들어가는 기능들을 정의
   │  │   movie.js: movie 페이지에 들어가는 기능들을 정의
   │  │   tv.js: tv 페이지에 들어가는 기능들을 정의
   │  │   view.js: 가장 최상의 파일로 각 페이지의 부모 역할을 담당.
   │  ├─router
   │  │   router.js: 라우터 설정 파일
   │  └─  routes.js: 페이지 별 경로 및 이름 설정 파일
   │   app.js: js 시작점 (한번에 모아서 렌더링)
   └─index.html
```


## 정리

스터디하면서 알게된 내용들
  
### 스크롤 바 
scrollTop: scroll bar 위치
  
### 이벤트 위임
* mouseover - mouseout: 자식 요소 위에 마우스를 over해도 이벤트가 발생한다.
* mouseenter - mouseleave: 바인딩 된 요소에만 이벤트가 발생한다.

#### 이벤트 건거는 반드시 제거하기
* 페이지가 이동되더라도 등록된 이벤트는 자동으로 제거되지 않고 계속해서 돌아가기 때문에 해제해주지 않으면 성능에 좋지 않다.
  
### EventEmitter 
Node.js에 내장되어있는 일종의 observer 패턴 구현  
Node.js에는 많은 객체들은 이벤트를 발생시키는데, 이러한 객체들은 event.EventEmitter라는 인스턴스를 이용하고 있다.
* 이벤트를 활용하는 객체에는 해당 이벤트가 발생할 때 대응하여 동작하는 **콜백 함수**를 가진다.(이러한 함수를 이벤트 리스너라고 부른다.)
  
#### Events 객체의 메소드
* emitter.addListener(event, listener): on() 메소드와 같습니다. 이벤트를 생성하는 메소드
* emitter.on(event, listener): addListener()과 동일. 이벤트를 생성하는 메소드
* emitter.once(event, listener): 이벤트를 한 번만 연결한 후 제거
* emitter.removeListener(event, listener): 특정 이벤트의 특정 이벤트 핸들러를 제거. 이 메소드를 이용해 리스너를 삭제하면 리스너 배열의 인덱스가 갱신되니 주의
* emitter.removeAllListeners([event]): 모든 이벤트 핸들러를 제거
* emitter.emit(eventName[, ...args]): 이벤트를 발생시킨다.
  
### ||와 &&
* ||: true를 찾을 때까지 넘어간다. true가 없으면 가장 마지막에 있는 항목을 선택
* &&: false를 찾을 때까지 넘어간다. false가 없으면 가장 마지막에 있는 항목을 선택

### Debounce
* 예를 들어 스크롤 이벤트를 주면 스크롤을 할 때마다 우두두두 스크롤이 되고 있는게 보여진다.
* Debounce는 여러번 발생하는 이벤트에서 **가장 마지막 이벤트만을 실행**되도록 만드는 개념이다.
* 250초로 준건 여러 개발자들의 경험을 토대로!

```javascript
let timer = 0
window.addEventListener('scroll', () => {
	clearTimeout(timer)
	timer = setTimeout(() => {
  	console.log(1)
  }, 250)
})
```
  
### translateX
element를 이동시키는 작업을 할 때 position을 사용해서 이동을 시키기보다는 translate를 이용해서 움직이는 편이 성능에 더 좋다.  
translate는 paint 과정만 있기 때문에 굉장히 빠르다고 한다.


  
[참고](https://edu.goorm.io/learn/lecture/557/%ED%95%9C-%EB%88%88%EC%97%90-%EB%81%9D%EB%82%B4%EB%8A%94-node-js/lesson/174362/event-%EB%AA%A8%EB%93%88)

[기존 저장소 링크](https://github.com/HyunYuJin/netflix-clone)

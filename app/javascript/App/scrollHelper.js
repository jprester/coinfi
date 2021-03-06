export default () => {
  // Workarounds for Firefox overflow bug - for more information, see:
  // https://app.nuclino.com/CoinFi/Engineering/Handle-Firefox-Scrolling-Issues-724ec6e6-3d06-453b-b8fb-62582f796833

  const panelHeader = document.querySelector('#panel-header')
  if (panelHeader) {
    const newsfeedElem = document.querySelector('#newsfeed')
    const newsBodyElem = document.querySelector('.selected-news-content')
    const coinDrawerElem = document.querySelector('.coin-watch-list')
    const windowHeight = window.innerHeight
    const topNavHeight = document.querySelector('.topnav').offsetHeight
    const panelHeaderHeight = panelHeader.offsetHeight

    const calculatedHeight = windowHeight - topNavHeight - panelHeaderHeight

    if (!!newsfeedElem) {
      newsfeedElem.style.maxHeight = `${calculatedHeight}px`
      newsfeedElem.style.overflowY = `auto`
    }

    if (!!newsBodyElem) {
      newsBodyElem.style.maxHeight = `${calculatedHeight}px`
    }

    if (!!coinDrawerElem) {
      coinDrawerElem.style.maxHeight = `${calculatedHeight}px`
    }
  }
}

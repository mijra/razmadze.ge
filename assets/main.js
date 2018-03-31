// helpers
const compose = (...fns) =>
  fns.reverse().reduce((prevFn, nextFn) =>
    value => nextFn(prevFn(value)),
    value => value
  )

;(function(){
  const SETTINGS = {
    rootNode: document.querySelector('.slider'),
    slideNodes: document.querySelectorAll('.slide'),
    menuItemNodes: document.querySelectorAll('.menu a'),
    arrowNodes: document.querySelectorAll('.arrows svg'),

    // slider settings
    activeIndex: 0,
    slideInDelay: 550,
    secondSlideDelay: 100,
    slidingDuration: 750,
  }

  SETTINGS.slidesLength = SETTINGS.slideNodes.length
  SETTINGS.lastIndex = SETTINGS.slidesLength - 1

  /**
   * Initialize website animations 
   * and activate first slide
   */
  window.onload = compose(
    initial.bind(SETTINGS),
    slideSwitcher.bind(SETTINGS, undefined, initial),
    navigationItems.bind(SETTINGS),
    arrowsClickHandler.bind(SETTINGS),
    arrowsKeyHandler.bind(SETTINGS),
  )

  /**
   * Initialize website content
   * and remove loading effect
   */
  function initial () {
    let { rootNode } = this
    let { classList } = rootNode
    classList.add('ready')
    classList.remove('loading')
  }
  
  /**
   * Switching a slide
   */
  function slideSwitcher (index) {
    let { 
      rootNode, 
      slideNodes,
      activeIndex,
      lastIndex, 
      slidingDuration,
      slideInDelay,
      secondSlideDelay
    } = this
    
    // Stop if asking for the same slide
    if (index && index === activeIndex) return

    // Define updated information
    let newActiveIndex = index ? repeatIndex.call(this, index) : 0
    let direction = activeIndex <= newActiveIndex ? 'left' : 'right'

    // Define previous and next nodes
    let previousNode = slideNodes[activeIndex]
    let nextNode = slideNodes[newActiveIndex]

    let isProject = 
      previousNode.classList.contains('project') || 
      nextNode.classList.contains('project')
    if (isProject) rootNode.classList.add('move')
    else rootNode.classList.remove('move')

    // Slide total duration is duration + delay
    let totalDuration = slidingDuration + secondSlideDelay * 2
    
    // Animation state 1: 
    if (previousNode !== nextNode) 
      animateOut(previousNode, direction, totalDuration)
    
    // Animation state 2: 
    let timeout = window.setTimeout(() => {
      animateIn(nextNode, direction, totalDuration)
      window.clearTimeout(timeout)
    }, isProject ? 0 : slidingDuration)

    // Update active slide index in Settings
    this.activeIndex = newActiveIndex
  }

  /**
   * Check if new index is below, or above the range of slides 
   */
  function repeatIndex (index) {
    let { lastIndex } = this
    // If below the first slide, continue from the last
    if (index < 0) return lastIndex
    // If above of its total amount, continue from the first
    else if (index > lastIndex) return 0
    return index
  }
  
  function animateOut (previousNode, direction, slidingDuration) {
    previousNode.classList.remove('left', 'right')
    previousNode.classList.add('out', direction)

    let timeout = window.setTimeout(() => {
      previousNode.classList.remove('out', 'in', 'left', 'right')
      window.clearTimeout(timeout)
    }, slidingDuration)
  }

  function animateIn (nextNode, direction, slidingDuration) {
    nextNode.classList.add('in', direction)
  }

  /** 
   * Naviation menu items clicking
   * to switch the slide
   */
  function navigationItems () {
    let that = this
    let { menuItemNodes, slidesLength } = this

    createArray(menuItemNodes.length).map((v, key) => {
      let item = menuItemNodes[key]
      let index = parseInt(item.dataset.navigationIndex)
      if (index < 0) index = slidesLength + index
      item.addEventListener('click', (e) => {
        slideSwitcher.call(that, index)
      })
    })
  } 

  /**
   * Make new array and fill with undefined
   */
  function createArray (length) {
    return (new Array(length)).fill(void 0)
  }

  /** 
   * Arrows Triggering
   * on pressing arrow icons
   */
  function arrowsClickHandler () {
    let that = this

    // Define arrow DOM node variables
    let leftArrow = this.arrowNodes[0]
    let rightArrow = this.arrowNodes[1]

    // Add event listeners
    leftArrow.addEventListener('click', () => 
      slideSwitcher.call(that, that.activeIndex - 1))
    rightArrow.addEventListener('click', () => 
      slideSwitcher.call(that, that.activeIndex + 1))
  }

  /** 
   * Arrows Triggering on keyboard arrows
   * to switch the slide
   */
  function arrowsKeyHandler () {
    let that = this

    document.addEventListener('keydown', (e) => {
      let { activeIndex } = that
      let { keyCode } = e

      // Determine direction (it's -1 for the left and +1 for right)
      let direction = keyCode - 38
      
      // Run the function only on arrow keys
      if (keyCode === 37 || keyCode === 39)
        slideSwitcher.call(that, activeIndex + direction)
    })
  } 

})()

// carousel scripting
(function(){
  let main = document.querySelector('main')
  let figures = document.querySelectorAll('figure')
  let lastProjectIndex = figures.length - 1

  // activate first item
  var activeProject = 0
  
  var t = window.setTimeout(() => 0)
  function activateProject (n) {
    main.classList.remove('loading')
    window.clearTimeout(t)
    
    if (n < 0) n = lastProjectIndex
    else if (n > lastProjectIndex) n = 0
    main.classList.add('loading')
    figures[activeProject].classList.add('out')
    
    t = window.setTimeout(() => {
      let previous = figures[activeProject]
      previous.classList.remove('active', 'out')

      let active = figures[n]
      active.classList.add('active')

      // update active page
      activeProject = n

      main.classList.add('ready')

      t = window.setTimeout(() => {
        main.classList.remove('loading')
        window.clearTimeout(t)
      }, 750)
    }, 750)
  }

  window.onload = () => {
    activateProject(activeProject)
  }

  // arrows clicking
  let arrows = document.querySelectorAll('.arrows svg')
  let leftArrow = arrows[0]
  let rightArrow = arrows[1]

  leftArrow.addEventListener('click', () => activateProject(activeProject - 1))
  rightArrow.addEventListener('click', () => activateProject(activeProject + 1))

  document.addEventListener('keydown', (e) => {
    let { keyCode } = e
    let direction = keyCode - 38
    if (keyCode === 37 || keyCode === 39)
      activateProject(activeProject + direction)
  })
})()
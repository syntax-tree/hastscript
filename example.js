import {h, s} from './index.js'

// Children as an array:
console.log(
  h('.foo#some-id', [
    h('span', 'some text'),
    h('input', {type: 'text', value: 'foo'}),
    h('a.alpha', {class: 'bravo charlie', download: 'download'}, [
      'delta',
      'echo'
    ])
  ])
)

// SVG:
console.log(
  s('svg', {xmlns: 'http://www.w3.org/2000/svg', viewbox: '0 0 500 500'}, [
    s('title', 'SVG `<circle>` element'),
    s('circle', {cx: 120, cy: 120, r: 100})
  ])
)

/* eslint no-console:0 */
import Vue from 'vue'
import App from '../app.vue'

console.log('Hello World from Webpacker')
window['vue'] = 'Vue!!!'
document.addEventListener('DOMContentLoaded', () => {
  const el = document.body.appendChild(document.createElement('hello'))
  const app = new Vue({
    el,
    render: h => h(App)
  })
  window['vue'] = app
})

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    window.onload = this.setDisplay.bind(this)
    window.onresize = this.setDisplay.bind(this)
  }
  
  cross_btns = ['', 'u', '', 'l', '', 'r', '', 'd', '']
  codes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'E']
  password = '0000'
  state = 'default'
  secret_str = ''
  lock = true
  str = ''

  main_node: HTMLElement
  msg_node: HTMLElement
  bar_node: HTMLElement
  btns_node: HTMLElement

  _hold(period) {
    return new Promise(resolve => {
      this.lock = true
      setTimeout(() => {
        this.lock = false
        resolve()
      }, period)
    })
  }

  async setDisplay() {
    this.main_node = document.getElementById('main')
    this.msg_node = document.getElementById('msg')
    this.bar_node = document.getElementById('bar')
    this.btns_node = document.getElementById('btns')
    this.msg_node.style.display = 'block'
    this.main_node.style.opacity = '0'
    new Promise(resolve => {
      let loop_id = setInterval(() => {
        if (this.btns_node.offsetHeight > 0) {
          clearInterval(loop_id)
          resolve()
        }
      })
    }).then(() => {
      this.msg_node.style.display = 'none'
      this.main_node.style.opacity = '1'
      this.lock = false
    })
  }

  async interact(code) {
    if (this.lock) return

    if (this.state == 'change') {
      if (code == 'C') this.str = ''
      else if (code == 'E') {
        this.bar_node.style.background = 'green'
        await this._hold(1000)
        this.password = this.str.substring(0, 8)
        this.bar_node.style.background = 'white'
        this.state = 'default'
        this.str = ''
      } else if (this.str.length < 8) this.str += code
      return
    }

    if (this.state == 'finish') {
      this.secret_str += code
      if (this.secret_str.length > 8) {
        let len_ = this.secret_str.length
        this.secret_str = this.secret_str.substring(len_-8, len_)
      }
      if (['CCCCCCCC', 'EEEEEEEE'].includes(this.secret_str)) {
        this.bar_node.style.color = 'black'
        this.str = ''
        if (this.secret_str == 'CCCCCCCC') {
          this.bar_node.style.background = 'white'
          this.state = 'default'
        } else if (this.secret_str == 'EEEEEEEE') {
          this.bar_node.style.background = 'red'
          this.state = 'change'
        }
      }
      return
    }

    if (code == 'C') this.str = ''
    else if (code == 'E') {
      if (this.str == this.password) {
        this.bar_node.style.background = 'black'
        this.bar_node.style.color = 'red'
        this.state = 'finish'
      } else {
        this.bar_node.style.background = 'gray'
        await this._hold(1000)
        this.bar_node.style.background = 'white'
        this.str = ''
      }
    } else if (this.str.length < 8) this.str += code
  }

  move(val) {
    let t = window.getComputedStyle(this.main_node).getPropertyValue('top')
    let l = window.getComputedStyle(this.main_node).getPropertyValue('left')
    if (val == 'u') {
      this.main_node.style.top = parseInt(t)-window.innerHeight/200+'px'
    } else if (val == 'r') {
      this.main_node.style.left = parseInt(l)+window.innerWidth/200+'px'
    } else if (val == 'd') {
      this.main_node.style.top = parseInt(t)+window.innerHeight/200+'px'
    } else if (val == 'l') {
      this.main_node.style.left = parseInt(l)-window.innerWidth/200+'px'
    }
  }

  resize(val) {
    let w = window.getComputedStyle(this.main_node).getPropertyValue('width')
    let h = window.getComputedStyle(this.main_node).getPropertyValue('height')
    if (val == 'u') {
      this.main_node.style.height = parseInt(h)-window.innerHeight/200+'px'
    } else if (val == 'r') {
      this.main_node.style.width = parseInt(w)+window.innerWidth/200+'px'
    } else if (val == 'd') {
      this.main_node.style.height = parseInt(h)+window.innerHeight/200+'px'
    } else if (val == 'l') {
      this.main_node.style.width = parseInt(w)-window.innerWidth/200+'px'
    }
  }
}

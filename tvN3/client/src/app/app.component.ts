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
  
  codes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'E']
  password = '00000000'
  reset_state = false
  secret_str = ''
  lock = false
  val = ''

  main_node: HTMLElement
  msg_node: HTMLElement
  bar_node: HTMLElement
  btns_node: HTMLElement

  _checkNode(node) {
    return new Promise(resolve => {
      let loop_id = setInterval(() => {
        if (node.offsetHeight > 0) {
          clearInterval(loop_id)
          resolve()
        }
      })
    })
  }

  _hold(period) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), period)
    })
  }

  async setDisplay() {
    this.main_node = document.getElementById('main')
    this.msg_node = document.getElementById('msg')
    this.bar_node = document.getElementById('bar')
    this.btns_node = document.getElementById('btns')
    await this._checkNode(this.btns_node)
    this.msg_node.style.display = 'none'
    this.main_node.style.opacity = '1'
    if (window.innerHeight-60 < this.main_node.offsetHeight) {
      let new_h = window.innerHeight
      new_h -= this.bar_node.offsetHeight
      new_h -= parseInt(window.getComputedStyle(this.btns_node)
                              .getPropertyValue('margin-top'))
      this.main_node.style.width = (new_h-60)/4*3+'px'
    } else {
      this.main_node.style.width = window.innerWidth*0.75+'px'
    }
  }

  async interact(code) {

    if (this.reset_state) {
      if (code != 'C' && code != 'E')
      this.val += code
      if (this.val.length >= 8) {
        this.password = this.val.substring(0, 8)
        this.lock = this.reset_state = false
        this.bar_node.style.color = 'black'
        this.val = ''
        return
      }
    }
    if (this.reset_state) return

    if (this.lock) {
      this.secret_str += code
      if (this.secret_str.length > 8) {
        let len_ = this.secret_str.length
        this.secret_str = this.secret_str.substring(len_-8, len_)
      }
      if (this.secret_str == 'CCCCCCCE') {
        this.bar_node.style.background = 'white'
        this.bar_node.style.color = 'black'
        this.lock = false
        this.val = ''
      }
      else if (this.secret_str == 'CECECECE') {
        this.bar_node.style.background = 'white'
        this.bar_node.style.color = 'red'
        this.reset_state = true
        this.val = ''
      }
    }
    if (this.lock) return

    if (code == 'C') this.val = ''
    else if (code == 'E') this.val = this.val.substring(0, this.val.length-1)
    else if (this.val.length < 8) {
      this.val += code
    }
    if (this.val.length >= 8) {
      this.lock = true
      if (this.val == this.password) {
        this.bar_node.style.background = 'black'
        this.bar_node.style.color = 'red'
      } else {
        this.bar_node.style.background = 'gray'
        await this._hold(1000)
        this.bar_node.style.background = 'white'
        this.lock = false
        this.val = ''
      }
    }
  }
}

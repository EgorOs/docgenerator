import { Component, OnInit } from '@angular/core';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.sass']
})

export class LogoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  logoWidth = getRandomIntInclusive(100, 240) + 'px'
  logoHeight = getRandomIntInclusive(80, 170) + 'px'
  horizontalMargin = getRandomIntInclusive(40, 60) + '%'
  verticalMargin = getRandomIntInclusive(20, 40) + 'px'

  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  logoUrls = [
    "url('https://logos-download.com/wp-content/uploads/2016/03/Rolex_logo.png')",
    "url('https://www.freepnglogos.com/uploads/mcdonalds-png-logo/mcdonalds-brand-logo-png-7.png')",
    "url('https://dezov.s3.amazonaws.com/media/twitch-logo-png2c5-4796-8bfc-730d57da68f6.png')",
    "url('https://lh3.googleusercontent.com/proxy/E-Tg1tH0xDnjNo9j5kQq4LInMUYw26k98zuCFfQLSau_pW17d9sH9uyYmN1RIoZKR4NCFspKls8yf0UyTz0TGUTMRXmgz4Jhaai8xg')",
    "url('https://s1.logaster.com/static/v3/img/products/logo.png')",
    "url('https://lh3.googleusercontent.com/proxy/h_6RLcVMbLNFr6izEaWxov2av8s4OYNZPx-HiH6zA-3YLisw6s9bFFYAnjR9x8xpqCvfsBkRWCXLVsNmaeWcbK5-KfUNrnOxPaxaZXvXNJPdexM')",
  ]
  randomLogo = this.getRandom(this.logoUrls)
}

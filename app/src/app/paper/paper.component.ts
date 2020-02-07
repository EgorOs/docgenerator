import { Component, OnInit } from '@angular/core';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.sass']
})
export class PaperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  title = 'app';
  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
  paperBgUrls = [
    "url('https://images.unsplash.com/photo-1566041510632-30055e21a9cf?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9')",
    "url('https://www.altes-papier.com/wp-content/uploads/2018/03/pa02b-altes-Universalpapier-grau-nadeldrucker-retro-grafik.jpg')",
    "url('https://i.etsystatic.com/7388389/r/il/922bcf/1291573733/il_570xN.1291573733_93v3.jpg')",
  ];
  randomPaperBg = this.getRandom(this.paperBgUrls);
  textColor = "rgba(0,0,0,.8)";
  textShadow = "0 0 1px rgba(0,0,0," + Math.random() + ")";
  innerAreaVerticalPadding = getRandomIntInclusive(0, 50) + 'px';
  innerAreaHorizontalPadding = getRandomIntInclusive(5, 20) + '%';

}

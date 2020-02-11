import { Component, OnInit } from '@angular/core';
import { BaseRandomizedComponent } from "../base-randomized/base-randomized.component";
import { Randomization } from "../utils";

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.sass']
})
export class PaperComponent extends BaseRandomizedComponent{



  ngOnInit(): void {
  }
  title = 'app';

  paperBgUrls = [
    "url('https://images.unsplash.com/photo-1566041510632-30055e21a9cf?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9')",
    "url('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_NF1bGCj1mSbTfuuh2408tjJU7qnlOdOc09hMzIm22TT05kD6')",
    "url('https://imjustcreative.com/wp-content/uploads/ImJustCreative-2010-08-23-at-06.49.36.jpg')",
  ];
  fontList = [
    'Arial',
    'Thames New Roman',
    'Garamond',
    'Tahoma',
  ]

  randomPaperBg = Randomization.getRandom(this.paperBgUrls);
  fontFamily = Randomization.getRandom(this.fontList);
  textColor = "rgba(0,0,0,.8)";
  textShadow = "0 0 1px rgba(0,0,0," + Math.random() + ")";
  overlayColor = "rgba(255,255,255," + Math.random() + ")";
  innerAreaVerticalPadding = Randomization.getRandomIntInclusive(0, 50) + 'px';
  innerAreaHorizontalPadding = Randomization.getRandomIntInclusive(15, 25) + '%';

}

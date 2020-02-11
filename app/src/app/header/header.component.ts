import { Component, OnInit } from '@angular/core';
import {BaseRandomizedComponent} from "../base-randomized/base-randomized.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent extends BaseRandomizedComponent {

  ngOnInit(): void {
  }
  // headerHeight = getRandomIntInclusive(200, 300) + 'px'
  // horizontalMargin = getRandomIntInclusive(40, 60) + '%'
  // verticalMargin = getRandomIntInclusive(20, 40) + 'px'
}

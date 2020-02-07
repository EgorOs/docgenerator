import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  // headerHeight = getRandomIntInclusive(200, 300) + 'px'
  // horizontalMargin = getRandomIntInclusive(40, 60) + '%'
  // verticalMargin = getRandomIntInclusive(20, 40) + 'px'
}

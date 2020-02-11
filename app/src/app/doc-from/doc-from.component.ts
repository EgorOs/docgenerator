import { Component, OnInit } from '@angular/core';
import {BaseRandomizedComponent } from "../base-randomized/base-randomized.component";
import { Randomization } from "../utils";

// function getRandomIntInclusive(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
// }
//
// let random_style = `
// h3{
//   font-size: ${getRandomIntInclusive(16, 25)}pt;
// }
// `

@Component({
  selector: 'app-doc-from',
  templateUrl: './doc-from.component.html',
  styleUrls: ['./doc-from.component.sass'],
  // styles: [random_style]
})
export class DocFromComponent extends BaseRandomizedComponent {


  fromName = ''
  toName = ''
  address = ''

  ngOnInit(): void {
    this.getValFromEndpoint('fromName', 'name')
    this.getValFromEndpoint('toName', 'name')
    this.getValFromEndpoint('address', 'address')
  }

  borderConf =  Math.random() > 0.5 ? '1px solid #000' : 'none'

}

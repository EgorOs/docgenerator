import { Component, OnInit } from '@angular/core';
import { ElementRef } from "@angular/core";
import {Randomization} from "../utils";

@Component({
  selector: 'app-random-image',
  templateUrl: './random-image.component.html',
  styleUrls: ['./random-image.component.sass']
})
export class RandomImageComponent implements OnInit {

  constructor(private elem: ElementRef) {
    this.srcDir = elem.nativeElement.attributes.srcDir.nodeValue;
    this.count = elem.nativeElement.attributes.count.nodeValue;
  }

  srcDir = '';
  count = 0;
  src = '';

  ngOnInit(): void {
    this.src = `../../assets/${this.srcDir}/${Randomization.getRandomIntInclusive(1, this.count)}.png`;
  }

}

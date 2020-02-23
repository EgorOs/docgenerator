import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RandomizedCSSParser } from '../utils';
import { Randomization } from "../utils";


@Component({
  selector: 'app-base-randomized',
  templateUrl: './base-randomized.component.html',
  styleUrls: ['./base-randomized.component.sass']
})
export class BaseRandomizedComponent implements OnInit {

  constructor(public elem: ElementRef, public http: HttpClient) {}

  random = Randomization;

  ngOnInit(): void {
    this.initFollowup();
    this.randomizeChildren(this.elem.nativeElement.children);
  }

  initFollowup(): void {}

  getValFromEndpoint(variable, endpoint): void {
    this.http.get('http://127.0.0.1:3000/' + endpoint).subscribe((data:any) => {
      console.log(this)
      this[variable] = data[0].value
    }, error => {
      console.log("There was an error:", error);
    });
  }

  randomizeChildren(children: Array<HTMLElement>) {
    for (let el of children) {
      RandomizedCSSParser.renderRandomizedStyleRecursively(el);
    }
  }
}

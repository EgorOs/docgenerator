import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-base-randomized',
  templateUrl: './base-randomized.component.html',
  styleUrls: ['./base-randomized.component.sass']
})
export class BaseRandomizedComponent implements OnInit {

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
  }

  getValFromEndpoint(variable, endpoint): void {
    this.http.get('http://127.0.0.1:3000/' + endpoint).subscribe((data:any) => {
      console.log(this)
      this[variable] = data[0].value
    }, error => {
      console.log("There was an error:", error);
    });
  }


  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }
}

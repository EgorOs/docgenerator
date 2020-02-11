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
}

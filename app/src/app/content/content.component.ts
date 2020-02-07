import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  text = ''
  wordSpacing = getRandomIntInclusive(3, 12) + 'px'
  lineHeight = getRandomIntInclusive(20, 42) + 'px'

  ngOnInit(): void {
    this.getValFromEndpoint('text', 'content')
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

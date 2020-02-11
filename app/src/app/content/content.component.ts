import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Randomization } from "../utils";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  text = ''
  wordSpacing = Randomization.getRandomIntInclusive(3, 10) + 'px'
  lineHeight = Randomization.getRandomIntInclusive(17, 24) + 'px'

  ngOnInit(): void {
    this.getValFromEndpoint('text', 'content')
  }

  getValFromEndpoint(variable, endpoint): void {
    this.http.get('http://127.0.0.1:3000/' + endpoint).subscribe((data:any) => {
      this[variable] = this.fixSpaces(data[0].value);
    }, error => {
      console.log("There was an error:", error);
    });
  }

  fixSpaces(str) {
    // let tab_re = new RegExp('\t', 'g');
    // str = str.replace(tab_re, '&nbsp');
    let nl_re = new RegExp('\n', 'g');
    str = str.replace(nl_re, '</br></br>');
    return str
  }
}

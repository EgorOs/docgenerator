import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  text = ''

  ngOnInit(): void {
    this.getText()
  }

  getText(): void {
    this.http.get('http://127.0.0.1:3000/content').subscribe((data:any) => {
      this.text = data[0].value
    }, error => {
      console.log("There was an error:", error);
    });
  }
}

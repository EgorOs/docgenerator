import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
})
export class ContactComponent implements OnInit {

  constructor(private http: HttpClient) { }

    phoneNum = ''
    faxNum = ''
    emailAddr = ''

  ngOnInit(): void {
    this.getValFromEndpoint('phoneNum', 'phone')
    this.getValFromEndpoint('faxNum', 'fax')
    this.getValFromEndpoint('emailAddr', 'email')
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

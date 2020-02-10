import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doc-from',
  templateUrl: './doc-from.component.html',
  styleUrls: ['./doc-from.component.sass']
})
export class DocFromComponent implements OnInit {

  constructor(private http: HttpClient) { }
  fromName = ''
  toName = ''
  address = ''

  ngOnInit(): void {
    this.getValFromEndpoint('fromName', 'name')
    this.getValFromEndpoint('toName', 'name')
    this.getValFromEndpoint('address', 'address')
  }

  borderConf =  Math.random() > 0.5 ? '1px solid #000' : 'none'

  getValFromEndpoint(variable, endpoint): void {
    this.http.get('http://127.0.0.1:3000/' + endpoint).subscribe((data:any) => {
      this[variable] = data[0].value
    }, error => {
      console.log("There was an error:", error);
    });
  }
}

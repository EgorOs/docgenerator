import {Component, ElementRef, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.sass']
})
export class EntityComponent implements OnInit {

  constructor(private http: HttpClient, private elem: ElementRef) {
    this.endpoint = elem.nativeElement.attributes.endpoint.nodeValue;
    this.getValFromEndpoint('content', this.endpoint);
  }

  endpoint = '';
  content = '';

  ngOnInit(): void {
  }

  getValFromEndpoint(variable, endpoint): void {
    this.http.get('http://127.0.0.1:3000/' + endpoint).subscribe((data:any) => {
      this[variable] = data[0].value;
    }, error => {
      console.log("There was an error:", error);
    });
  }
}

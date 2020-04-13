import {Component, ElementRef, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContextService } from "../context.service";

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.sass']
})
export class EntityComponent implements OnInit {

  constructor(private http: HttpClient, private elem: ElementRef, public context: ContextService) {
    this.endpoint = elem.nativeElement.attributes.endpoint.nodeValue;
    // this.getValFromEndpoint('content', this.endpoint);
    // FIXME for the love of God we need to implement this using promises
    setTimeout(()=>{this.getValFromContext('content', this.endpoint);}, 1500)

  }

  endpoint = '';
  content = '';

  ngOnInit(): void {
  }

  getValFromEndpoint(variable, endpoint): void {
    this.http.get('http://127.0.0.1:3000/' + endpoint).subscribe((data: any) => {
      console.log(`fetching from "${endpoint}"`)
      this[variable] = data[0].value;
    }, error => {
      console.log("There was an error:", error);
    });
  }

  getValFromContext(variable, slot): void {
    console.log(`slot ${slot}`)
    console.log(this.context)
    this[variable] = this.context['context'][slot];
  }
}

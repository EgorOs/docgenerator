import {Component, ElementRef, OnInit, ChangeDetectorRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Randomization, RandomizedCSSParser} from "../utils";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.sass']
})
export class DocumentComponent implements OnInit {


  constructor(private http: HttpClient, private elem: ElementRef, private changeDetectorRef: ChangeDetectorRef) { }

  template = '<h1>Template</h1>'
  ready = false;


  ngOnInit(): void {
    this.http.get('http://127.0.0.1:3000/document').subscribe((data: any) => {
      this.template = data['template'];
      this.ready = true;
      // Register changes in DOM before applying randomized styles
      this.changeDetectorRef.detectChanges();
      RandomizedCSSParser.renderRandomizedStyleRecursively(this.elem.nativeElement);
      this.randomizeChildren(this.elem.nativeElement.children);
    }, error => {
      console.log("There was an error:", error);
    });
  }

  randomizeChildren(children: Array<HTMLElement>) {
    window.onload = (event) => {
      for (let el of children) {
        console.log(el)
        RandomizedCSSParser.renderRandomizedStyleRecursively(el);
      }
    };
  }
}

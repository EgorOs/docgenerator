import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.sass']
})
export class TextComponent implements OnInit {

  constructor(private elem: ElementRef) {
    this.content = elem.nativeElement.attributes.content.nodeValue;
  }
    content = '';

  ngOnInit(): void {
  }

}

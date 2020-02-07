import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-from',
  templateUrl: './doc-from.component.html',
  styleUrls: ['./doc-from.component.sass']
})
export class DocFromComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  borderConf =  Math.random() > 0.5 ? '1px solid #000' : 'none'
}

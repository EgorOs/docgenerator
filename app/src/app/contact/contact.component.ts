import { Component, OnInit } from '@angular/core';
import { BaseRandomizedComponent } from "../base-randomized/base-randomized.component";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
})

export class ContactComponent extends BaseRandomizedComponent {

    name = ''
    address = ''
    phoneNum = ''
    faxNum = ''
    emailAddr = ''

  ngOnInit(): void {
    this.getValFromEndpoint('phoneNum', 'phone')
    this.getValFromEndpoint('address', 'address')
    this.getValFromEndpoint('name', 'name')
    this.getValFromEndpoint('faxNum', 'fax')
    this.getValFromEndpoint('emailAddr', 'email')
  }
}

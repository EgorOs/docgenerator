import { Component } from '@angular/core';
import { BaseRandomizedComponent } from '../base-randomized/base-randomized.component';
import {tempRouter} from "./template.router";
import { Randomization } from "../utils";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
}
)

export class ContactComponent extends BaseRandomizedComponent {

    name = '';
    address = '';
    phoneNum = '';
    faxNum = '';
    emailAddr = '';

  initFollowup(): void {
    this.getValFromEndpoint('phoneNum', 'phone');
    this.getValFromEndpoint('address', 'address');
    this.getValFromEndpoint('name', 'name');
    this.getValFromEndpoint('faxNum', 'fax');
    this.getValFromEndpoint('emailAddr', 'email');
  }
}

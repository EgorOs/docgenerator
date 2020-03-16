import { Component, OnInit } from '@angular/core';
import { BaseRandomizedComponent } from "../base-randomized/base-randomized.component";
import { Randomization} from "../utils";

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.sass']
})

export class LogoComponent extends  BaseRandomizedComponent{

  ngOnInit(): void {
  }

  logoUrls = [
    "url('../../assets/logos/akte-03-054.png')",
    "url('../../assets/logos/akte-03-152.png')",
  ]

  randomLogo = Randomization.getRandom(this.logoUrls);
}

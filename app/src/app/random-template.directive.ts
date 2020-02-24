import { Directive, ElementRef, TemplateRef, ViewContainerRef, Input} from '@angular/core';
import {Randomization, RandomizedCSSParser} from "./utils";

@Directive({
  selector: '[appRandomTemplate]'
})
export class RandomTemplateDirective {

  // constructor(
  //   private elem: ElementRef) {
  //  Wait for DOM elements to load and then render randomized properties
  // window.onload = (event) => {
  //   for (let i = 0; i < elem.nativeElement.childElementCount; i++) {
  //     RandomizedCSSParser.renderRandomizedStyleRecursively(elem.nativeElement.children[i]);
  //   }
  // }
  // document.addEventListener("DOMContentLoaded", function(e) {
  //   for (let i = 0; i < elem.nativeElement.childElementCount; i++) {
  //     RandomizedCSSParser.renderRandomizedStyleRecursively(elem.nativeElement.children[i]);
  //   }
  // })
  // }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
    this.viewContainer.createEmbeddedView(this.templateRef)
  }

  @Input() set appRandomTemplate(templateArr: Array<TemplateRef<any>>) {
    let randomTemplate = Randomization.getRandom(templateArr)
    this.viewContainer.createEmbeddedView(randomTemplate);
  }
}

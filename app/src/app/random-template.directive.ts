import { Directive, ElementRef, TemplateRef, ViewContainerRef, OnInit, Input} from '@angular/core';
import {Randomization, RandomizedCSSParser} from './utils';

@Directive({
  selector: '[appRandomTemplate]'
})
export class RandomTemplateDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  @Input() set appRandomTemplate(templateArr: Array<TemplateRef<any>>) {
    const randomTemplate = Randomization.getRandom(templateArr);
    this.viewContainer.createEmbeddedView(randomTemplate);
  }
}

@Directive({
  selector: '[appRandomRender]'
})
export class RandomRenderDirective {

  constructor(
    private elem: ElementRef) {
    }

  ngOnInit() {
    console.log('Directive is called')
    document.addEventListener('DOMContentLoaded', (e) => {
      RandomizedCSSParser.renderRandomizedStyleRecursively(this.elem.nativeElement);
    });
  }
}

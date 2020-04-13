import { Pipe, PipeTransform } from '@angular/core';
import {ContextService} from "./context.service";


@Pipe({
  name: 'wrapWords'
})

export class WrapWordsPipe implements PipeTransform {

  constructor(public context: ContextService) {}

  transform(text: string, label?: string): string {
    return this.wrapInSpan(text, label);
  }

  isEntityTemplate(word: string) {
    if (word.match('<%(.*)%>')) {
      console.log(word)
      return true
    }
    return false
  }

  renderEntity(word: string) {
    const endpoint = word.match('<%(.*)%>')[1]
    return `<h1 [(ngModel)]="${this.context[endpoint]}"></h1>`
  }

  wrapInSpan(text: string, label: string): string {
    let wrapped = '';
    if (label === 'O') {
      for (const word of text.split(' ')) {
          wrapped += `<span class="token" label="${label}">${word}</span> `
      }
    } else {
      const wordArr = text.split(' ');
      for (let idx = 0; idx < wordArr.length; idx++ ) {
        if (label.match('docinvolvedparty\\d+')) {
          label = 'docinvolvedparty';
        }
        wrapped += `<span class="token" label="${idx ? 'I' : 'B'}-${label}">${wordArr[idx]}</span> `;
      }
    }
    return wrapped;
  }
}

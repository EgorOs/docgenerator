import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wrapWords'
})
export class WrapWordsPipe implements PipeTransform {

  transform(text: string, label?: string): string {
    return this.wrapInSpan(text, label);
  }

  wrapInSpan(text: string, label: string): string {
    let wrapped = '';
    if (label === 'O') {
      for (const word of text.split(' ')) {
        wrapped += `<span class="token" label="${label}">${word}</span> `;
      }
    } else {
      const wordArr = text.split(' ');
      for (let idx = 0; idx < wordArr.length; idx++ ) {
        wrapped += `<span class="token" label="${idx ? 'I' : 'B'}-${label}">${wordArr[idx]}</span> `;
      }
    }
    return wrapped;
  }
}

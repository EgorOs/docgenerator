import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wrapWords'
})
export class WrapWordsPipe implements PipeTransform {

  transform(text: string): string {
    return this.wrapInSpan(text);
  }

  wrapInSpan(text: string): string {
    let wrapped = '';
    for (const word of text.split(' ')) {
      wrapped += `<span class="token">${word}</span> `;
    }
    return wrapped;
  }
}

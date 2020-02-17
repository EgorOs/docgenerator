import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  highlight = false

  toggleLabels(event) {
    if (this.highlight) {
      this.removeHighlight();
      this.highlight = false;
    } else {
      this.highlightLabels();
      this.highlight = true;
    }
  }

  hideText(element) {
    element.style.color = 'rgba(0, 0, 0, 0)';
    element.style.textShadow = 'none';
  }

  showText(element) {
    element.style.color = 'rgba(0, 0, 0, 1)';
    element.style.textShadow = '0px 0px 2px rgba(0, 0, 0, 0.5)';
  }

  highlightLabels() {
    const content = <HTMLElement>document.getElementsByTagName("app-content")[0];
    content.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "p")[0].style.background = 'blue';
    this.hideText(content);

    const docfrom = <HTMLElement>document.getElementsByTagName("app-doc-from")[0];
    docfrom.style.background = 'green';
    this.hideText(docfrom);

    const contact = <HTMLElement> document.getElementsByTagName("app-contact")[0];
    contact.style.background = 'hsl(180, 50%, 50%)';
    this.hideText(contact);

    const logo = <HTMLElement> document.getElementsByTagName("app-logo")[0];
    logo.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "div")[0].style.background = 'hsl(120, 50%, 50%)';
  }

  removeHighlight() {
    const content = <HTMLElement> document.getElementsByTagName("app-content")[0];
    content.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "p")[0].style.background = 'none';
    this.showText(content);

    const docfrom = <HTMLElement> document.getElementsByTagName("app-doc-from")[0];
    docfrom.style.background = 'none';
    this.showText(docfrom);

    const contact = <HTMLElement> document.getElementsByTagName("app-contact")[0];
    contact.style.background = 'none';
    this.showText(contact);
  }
}

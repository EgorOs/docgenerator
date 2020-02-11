import { Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  highlight = false

  toggleLabels(event){
    if (this.highlight) {
      this.removeHighlight();
      this.highlight = false;
    }
    else {
      this.highlightLabels();
      this.highlight = true;
    }
  }

  highlightLabels() {
    const content = document.getElementsByTagName("app-content")[0];
    content.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","p")[0].style.background = 'blue';
  }

  removeHighlight() {
    const content = document.getElementsByTagName("app-content")[0];
    content.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","p")[0].style.background = 'none';
  }

}

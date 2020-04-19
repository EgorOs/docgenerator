import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaperComponent } from './paper/paper.component';
import { HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { BaseRandomizedComponent } from './base-randomized/base-randomized.component';
import {RandomRenderDirective, RandomTemplateDirective} from './random-template.directive';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { DocumentComponent } from './document/document.component';

@NgModule({
    declarations: [
        AppComponent,
        PaperComponent,
        BaseRandomizedComponent,
        RandomTemplateDirective,
        RandomRenderDirective,
        SanitizeHtmlPipe,
        DocumentComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

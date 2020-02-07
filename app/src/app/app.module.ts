import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PaperComponent } from './paper/paper.component';
import { LogoComponent } from './logo/logo.component';
import { DocFromComponent } from './doc-from/doc-from.component';
import { ContactComponent } from './contact/contact.component';
import { ContentComponent } from './content/content.component';
import { HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaperComponent,
    LogoComponent,
    DocFromComponent,
    ContactComponent,
    ContentComponent
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

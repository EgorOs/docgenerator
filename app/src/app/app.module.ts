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
import { BaseRandomizedComponent } from './base-randomized/base-randomized.component';
import {RandomRenderDirective, RandomTemplateDirective} from './random-template.directive';
import { WrapWordsPipe } from './wrap-words.pipe';
import { TextComponent } from './text/text.component';
import { EntityComponent } from './entity/entity.component';
import { RandomImageComponent } from './random-image/random-image.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        PaperComponent,
        LogoComponent,
        DocFromComponent,
        ContactComponent,
        ContentComponent,
        BaseRandomizedComponent,
        RandomTemplateDirective,
        RandomRenderDirective,
        WrapWordsPipe,
        TextComponent,
        EntityComponent,
        RandomImageComponent
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

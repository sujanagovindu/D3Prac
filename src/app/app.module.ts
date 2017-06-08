import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppService } from './app.service';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule,HttpModule ],
  declarations: [AppComponent],
  providers: [AppService],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {MatCardModule} from '@angular/material/card';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MatMenuModule, MatButtonModule,
MatInputModule, MatIconModule, MatListModule, MatCheckboxModule } from '@angular/material';
import { ColumnComponentComponent } from './column-component/column-component.component';
import { CardComponentComponent } from './card-component/card-component.component';
import { BoardComponentComponent } from './board-component/board-component.component';
import {Database} from './status-pipeline-module.database'
import {MatGridListModule} from '@angular/material/grid-list';
import { FlexLayoutModule } from "@angular/flex-layout";
@NgModule({
  imports:      [ 
    BrowserModule, 
    BrowserAnimationsModule,
    FormsModule, 
    PickerModule, 
    EmojiModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatGridListModule,
    FlexLayoutModule
  ],
  declarations: [ AppComponent, HelloComponent, ColumnComponentComponent, CardComponentComponent, BoardComponentComponent ],
  providers: [
    Database
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

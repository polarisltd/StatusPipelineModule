import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {TaskPipelineModule} from "./task-pipeline/task-pipeline.module";


@NgModule({
  imports:      [
    TaskPipelineModule
  ],
  declarations: [ AppComponent ],
  providers: [
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

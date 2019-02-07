import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Board} from "./task-pipeline/shared/board";
import {Observable, Subject} from "rxjs";
import {Database} from "./task-pipeline/shared/status-pipeline-module.database";
import {DataSource} from "./DataSource";
import {
  IPipelineColumn,
  IPipelineColumnElement,
  IStatusChange
} from "./task-pipeline/shared/status-pipeline-module.interface";




@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [DataSource]
})
export class AppComponent implements OnInit{
  public validateDragFunction: Function;




  boardSubject$ : Subject<Board>
  dataSource: DataSource;
  onTransition = new EventEmitter<IStatusChange>(); // card, fromCol, toCol
  onClickColumnTitle = new EventEmitter<IPipelineColumn>();

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.onTransition.subscribe(item => console.log('AppComponent#onClickColumnTitle ' ,item))
    this.onClickColumnTitle.subscribe(item => console.log('AppComponent#onClickColumnTitle ' , item))

  }

  ngOnInit() {
    this.boardSubject$ = this.dataSource.boardSubject$
    this.validateDragFunction = this.validateDrag.bind(this); // bind actual method

  }


  /** Actual validation function */
  validateDrag(id1,id2):boolean{
    console.log('*** Validate drag callback')
    return true
  }


}

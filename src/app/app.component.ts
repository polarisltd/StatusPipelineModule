import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Board} from "./task-pipeline/shared/board";
import {Observable, Subject} from "rxjs";
import {Database} from "./task-pipeline/shared/status-pipeline-module.database";
import {DataSource} from "./DataSource";
import {
  IPipelineColumn,
  IStatusChange
} from "./task-pipeline/shared/status-pipeline-module.interface";




@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [DataSource]
})
export class AppComponent implements OnInit{
  public  validateDragFunction: Function;




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
    this.validateDragFunction = this.validateDropRules.bind(this); // bind actual method

  }


  /** Actual validation function */
  validateDropRules(statusChange: IStatusChange):boolean{

    console.log('app.component#validateDragRules  ',statusChange)

    class Transition {
      constructor(public from: string,public  to: string) {}
    }

    const allowed: Transition[] = [
      new Transition('001-002','001-003'),
      new Transition('001-003','001-004'),
      new Transition('001-004','001-005'),
      new Transition('',''),
      new Transition('','')
    ];

    return (allowed.filter(

        elem => elem.from === statusChange.src.id &&
                  elem.to === statusChange.dst.id
    ).length > 0)

  }


}

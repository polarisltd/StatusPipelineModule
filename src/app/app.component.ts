import {Component, OnInit} from '@angular/core';
import {Board} from "./task-pipeline/shared/board";
import {Observable, Subject} from "rxjs";
import {Database} from "./task-pipeline/shared/status-pipeline-module.database";
import {DataSource} from "./DataSource";




@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [DataSource]
})
export class AppComponent implements OnInit{
  boardSubject$ : Subject<Board>
  dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  ngOnInit() {
    // this.database.setupObservable()
    this.boardSubject$ = this.dataSource.boardSubject$
  }


}

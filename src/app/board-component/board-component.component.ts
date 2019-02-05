import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, NgZone} from '@angular/core';
import { Board } from '../board-component/board'
import { Card } from '../card-component/card'
import { Column } from '../column-component/column'
import { Database } from '../status-pipeline-module.database'
import { Observable } from 'rxjs';
import {IPipelineColumn, PipelineColumnElementType, IColumnElement} from '../status-pipeline-module.interface'


@Component({
  selector: 'dvtx-status-pipeline',
  templateUrl: './board-component.component.html',
  styleUrls: ['./board-component.component.css'],
  providers:[Database]
})
export class BoardComponentComponent implements OnInit {
  @Input() columnObjects: IColumnElement [];
  @Input() columns: IPipelineColumn [];
  @Input() allowedTransitions: [{srcStatus:string, dstStatus:string}] = [];
  @Output() onTransition: {src: Column, dst: Column, elem: IColumnElement};
  @Output() onClick: IColumnElement;
  // board: Board;
  board$: Observable<Board>;
  board: Board;


  addingColumn = false;
  addColumnText: string;
  editingTilte = false;
  currentTitle: string;
  boardWidth: number;
  columnsAdded = 0;

  constructor(database: Database) { 

    this.board$ = database.getBoardObservable()
    this.board$.subscribe(data => console.log('BoardComponent#constructor subscribe board$ {}'/*,JSON.stringify(data,null,'\t')*/))

  }

  ngOnInit() {

  }

  editTitle() {
    this.currentTitle = this.board.title;
    this.editingTilte = true;
  }

}
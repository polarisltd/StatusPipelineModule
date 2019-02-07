import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, NgZone} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Database} from "../shared/status-pipeline-module.database";
import {
  IPipelineColumn,
  IPipelineColumnElement,
  IStatusChange,
  ITransition
} from "../shared/status-pipeline-module.interface";
import {Column} from "../shared/column";
import {Board} from "../shared/board";
import {StatusPipelineShared} from "../shared/status-pipeline-shared";


@Component({
  selector: 'dvtx-status-pipeline',
  templateUrl: './board-component.component.html',
  styleUrls: ['./board-component.component.css'],
  providers:[StatusPipelineShared]
})
export class BoardComponentComponent implements OnInit {
  @Input() boardSubject$ : Subject<Board>;
  @Input() allowedTransitions: (ITransition) => boolean ; // callback card, fromCol, toCol
  @Input() onTransition : EventEmitter<IStatusChange>; // card, fromCol, toCol
  @Input() onClickColumnTitle : EventEmitter<IPipelineColumn>;
   @Input() validateDrag: Function
  // board: Board;
  //board$: Observable<Board>;
  board: Board;
  board$:Observable<Board>



  addingColumn = false;
  addColumnText: string;
  editingTilte = false;
  currentTitle: string;
  boardWidth: number;
  columnsAdded = 0;

  constructor(
     statusPipelineShared: StatusPipelineShared ) {



  }

  ngOnInit() {
    this.board$ = this.boardSubject$
    this.board$.subscribe(board => {
      console.log('BoardComponent#constructor subscribe board$ {}'/*,JSON.stringify(data,null,'\t')*/)
      this.board = board
    })
  }

  editTitle() {
    this.currentTitle = this.board.title;
    this.editingTilte = true;
  }

}

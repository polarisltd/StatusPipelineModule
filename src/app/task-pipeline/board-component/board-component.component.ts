import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, NgZone} from '@angular/core';
import { Observable } from 'rxjs';
import {Database} from "../shared/status-pipeline-module.database";
import {IPipelineColumn, IPipelineColumnElement} from "../shared/status-pipeline-module.interface";
import {Column} from "../shared/column";
import {Board} from "../shared/board";


@Component({
  selector: 'dvtx-status-pipeline',
  templateUrl: './board-component.component.html',
  styleUrls: ['./board-component.component.css'],
  providers:[Database]
})
export class BoardComponentComponent implements OnInit {
  @Input() columnObjects: IPipelineColumnElement [];
  @Input() columns: IPipelineColumn [];
  @Input() allowedTransitions: [{srcStatus:string, dstStatus:string}] ;
  @Output() onTransition: {src: Column, dst: Column, elem: IPipelineColumnElement};
  @Output() onClick: IPipelineColumnElement;
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

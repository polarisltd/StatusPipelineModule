import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
// tslint:disable-next-line:import-blacklist
import {Observable, Subject} from 'rxjs';
import {
  IPipelineColumn,
  IPipelineColumnElement,
  IStatusChange
} from '../shared/status-pipeline-module.interface';
import {Board} from '../shared/board';
import {StatusPipelineShared} from '../shared/status-pipeline-shared';

@Component({
  selector: 'dvtx-status-pipeline',
  templateUrl: './board-component.component.html',
  styleUrls: ['./board-component.component.css'],
  providers: [StatusPipelineShared]
})
export class BoardComponentComponent implements OnInit {
  @Input() boardSubject$: Subject<Board>;
  @Input() onTransition: EventEmitter<IStatusChange>; // drag and drop operation
  @Input() onClickColumnTitle: EventEmitter<IPipelineColumn>; // column title click
  @Input() onAddCard: EventEmitter<IPipelineColumnElement>; // Add Card event
  @Input() onDeleteCard: EventEmitter<IPipelineColumnElement>;
  @Input() onUpdateCard: EventEmitter<IPipelineColumnElement>; // Add Card event
  @Input() onCardClick: EventEmitter<IPipelineColumnElement>; // Add Card event
  @Input() onRemoveColumn: EventEmitter<IPipelineColumn>; // Add Card event
  @Input() validateDropRules: Function // asking permission for drag and drop
  // board: Board;
  // board$: Observable<Board>;
  board: Board;
  board$: Observable<Board>

  editingTilte = false;
  currentTitle: string;

  constructor() {
  }

  ngOnInit() {
    this.board$ = this.boardSubject$
    this.board$.subscribe(board => {
      this.board = board
    })
  }

  editTitle() {
    this.currentTitle = this.board.title;
    this.editingTilte = true;
  }

}

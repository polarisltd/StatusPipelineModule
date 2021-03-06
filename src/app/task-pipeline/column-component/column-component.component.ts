import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef} from '@angular/core';
// tslint:disable-next-line:import-blacklist
import {Observable, Subject} from 'rxjs';
import {Database} from '../shared/status-pipeline-module.database';
import {Board} from '../shared/board';
import {Column} from '../shared/column';
import {Card} from '../shared/card';
import {IPipelineColumn, IPipelineColumnElement, IStatusChange} from '../shared/status-pipeline-module.interface';

/* tslint:disable */
@Component({
  selector: 'app-column-component',
  templateUrl: './column-component.component.html',
  styleUrls: ['./column-component.component.css']
})
export class ColumnComponentComponent implements OnInit {


  @Input()
  boardSubject$: Subject<Board> // initialised and provided by board component
  @Input()
  column: Column; // column on which this item having ownership
  @Input() onTransition: EventEmitter<IStatusChange>; // card, fromCol, toCol
  @Input() onClickColumnTitle: EventEmitter<IPipelineColumn>;
  @Input() validateDropRules: Function
  @Input() onAddCard: EventEmitter<Card>;
  @Input() onRemoveColumn: EventEmitter<IPipelineColumn>;
  @Input() onCardClick: EventEmitter<IPipelineColumnElement>;
  @Input() onUpdateCard: EventEmitter<Card>;
  @Input() onDeleteCard: EventEmitter<Card>;



  board$: Observable<Board>;

  database: Database
  board: Board
  dragClass: string = 'drag-color0'; // drag/drop enable/disable color
  inTimer: boolean = false;

  constructor( ) {
  }

  ngOnInit() {
       this.board$ = this.boardSubject$;
       this.board$.subscribe(board => {
           this.board = board
           this.database = new Database(this.boardSubject$, this.board);
      }

      )
  }

  getCards(columnId: string, board: Board): Card[] {
    return board.cards.filter(card => columnId === card.columnId)
  }

  onColumnClick(event) {
    this.onClickColumnTitle.emit(this.column)
  }


  handleDragStart(event, node) {
  }

  handleDragOver(event, node) {
    event.preventDefault();
    //
    // Known behavior, dragOver method discards data value.
    // therefore we cheat :)
    //
    const sourceId = this.extractDragSourceId(event)

    if (!this.validateDropRulesWrapper(sourceId, this.column.id)) { // functionality from internal method
      this.colorDragProtectedArea(node)
    }
  }


  validateDropRulesWrapper(srcCardId: string, targetColumnId: string): boolean {

    const srcCard = this.board.cards.find(entry => entry.id === srcCardId)

    if (!srcCard) return; // prevent impossible action.

    const srcColumn = this.board.columns.find(entry => entry.id === srcCard.columnId)

    const targColumn = this.board.columns.find(entry => entry.id === targetColumnId)

    return this.validateDropRules({src: srcColumn, dst: targColumn, elem: srcCard} as IStatusChange)

  }

  colorDragProtectedArea = (node) => {

    this.dragClass = 'drag-color1';
    if (!this.inTimer) {
      this.inTimer = true;
      setTimeout(() => {
        this.dragClass = 'drag-color0';
        this.inTimer = false;
      }, 2000);
    }

  }



  handleDrop(event, node) {
    event.preventDefault();
    // const dragId = event.dataTransfer.getData('foo')
    const dragId = this.extractDragSourceId(event)

    // external validator

    if (this.validateDropRulesWrapper(dragId, node.id)) {
       this.database.moveCard(dragId, node.id)

       const movedCard =  this.board.cards.find(entry => entry.id === dragId);
       const fromColumn = this.board.columns.find(entry => entry.id === movedCard.columnId);
       const toColumn = this.board.columns.find(entry => entry.id === node.id);

       const statusChange = {
         src: fromColumn,
         dst: toColumn,
         elem: movedCard
       } as IStatusChange;

       this.onTransition.emit(statusChange)
    }
  }

  handleDragEnd(event)  {
  }


onColumnButtonClick(column) {
  const c: Card = this.database.addCardRefColumn(column.id)
  this.onAddCard.emit(c)
}

onColumnButtonClickRemove(column) {
  const removedColumn: Column = this.database.removeColumn(column.id)
  this.onRemoveColumn.emit(removedColumn)

}


extractDragSourceId(event): string {
  return event.dataTransfer.types.find(entry => entry.includes('id=')).substr(3);
}


}

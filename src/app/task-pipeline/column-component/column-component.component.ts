import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Database} from "../shared/status-pipeline-module.database";
import {Board} from "../shared/board";
import {Column} from "../shared/column";
import {Card} from "../shared/card";


@Component({
  selector: 'app-column-component',
  templateUrl: './column-component.component.html',
  styleUrls: ['./column-component.component.css']
})
export class ColumnComponentComponent implements OnInit {


  @Input()
  boardSubject$: Subject<Board> // initialised and provided by board component
  @Input()
  column: Column;
  @Input()
  @Output()
  public onAddCard: EventEmitter<Card>;
  @Output() cardUpdate: EventEmitter<Card>;

  board$ : Observable<Board>;

  database: Database
  board : Board


  constructor( ) {
    this.onAddCard = new EventEmitter();
    this.cardUpdate = new EventEmitter();
  }

  ngOnInit() {
       this.board$ = this.boardSubject$;
       this.board$.subscribe(board => {
           console.log('ColumnComponent#ngOnInit board$.subscrive '/*, JSON.stringify(board,null,'\t')*/)
           this.board = board
           this.database = new Database(this.boardSubject$,this.board);
      }

      )
  }

  getCards(columnId: string, board:Board): Card[]{
    return board.cards.filter(card => columnId === card.columnId)
  }

  onColumnClick(event){
  console.log('ColumnComponent#-> onColumnClick ',this.column.title)
  }


  handleDragStart(event, node) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
/*
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
*/
   // event.dataTransfer.setData('foo', node.id);
   // console.log('ColumnComponent#handleDragStart',node.id)
   // ignore as columns are not sources for drag.
  }

  handleDragOver(event, node) {
     event.preventDefault();
    const dragId = event.dataTransfer.getData('foo')
    console.log('ColumnComponent#handleDragOver ',dragId,'->',node.id)
   }

  
  handleDrop(event, node) {
    event.preventDefault();
    const dragId = event.dataTransfer.getData('foo')
    console.log('ColumnComponent#handleDrop ',dragId,'->',node.id)
    this.database.moveCard(dragId, node.id)
  }

  handleDragEnd(event)  {
    const dragId = event.dataTransfer.getData('foo')
    console.log('ColumnComponent#handleDragEnd ',dragId,'->',this.column.id)
  }


onColumnButtonClick(column){
  console.log('onColumnButtonClick' , column.id)
  this.database.addCardRefColumn(column.id)
}

onColumnButtonClickRemove(column){
  console.log('onColumnButtonClick' , column.id)
  this.database.removeColumn(column.id)
}


}

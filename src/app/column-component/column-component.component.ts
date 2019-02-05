import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef} from '@angular/core';
import { Card } from '../card-component/card'
import { Column } from '../column-component/column'
import { Board } from '../board-component/board'
import { Database } from '../status-pipeline-module.database'
import { Observable } from 'rxjs';


@Component({
  selector: 'app-column-component',
  templateUrl: './column-component.component.html',
  styleUrls: ['./column-component.component.css']
})
export class ColumnComponentComponent implements OnInit {

  database: Database
  board$ : Observable<Board>;

  @Input()
  column: Column;
  @Output()
  public onAddCard: EventEmitter<Card>;
  @Output() cardUpdate: EventEmitter<Card>;

  editingColumn = false;
  addingCard = false;
  addCardText: string;
  currentTitle: string;

  constructor(database : Database ) { 
   this.database = database
    this.onAddCard = new EventEmitter();
    this.cardUpdate = new EventEmitter();
    this.board$ = database.getBoardObservable()

    this.board$.subscribe(board => console.log('ColumnComponentComponent#constructor board$.subscrive '/*, JSON.stringify(board,null,'\t')*/))

  }

  ngOnInit() {
  }

  getCards(columnId: string, board:Board): Card[]{
    return board.cards.filter(card => columnId === card.columnId)
  }

onColumnClick(event){
  console.log('ColumnComponent#-> onColumnClick ',this.column.title)
}

///////////

  handleDragStart(event, card) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
/*
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
*/
   console.log('ColumnComponent#handleDragStart',JSON.stringify(card,null,'\t')) 
  }

  handleDragOver(event, node) {
     event.preventDefault();
// console.log('handleDragOver')
   }

  
  handleDrop(event, column) {
    
    event.preventDefault();
 console.log('ColumnComponent#handleDrop',JSON.stringify(column,null,'\t'))
  this.database.moveCard(this.database.dndSourceCard.id,column.id)
  }

  handleDragEnd(event)  {
 console.log('ColumnComponent#handleDragEnd')


}



onColumnButtonClick(column){
  console.log('onColumnButtonClick' , column.id)
  this.database.addCardRefColumn(column.id)
}

onColumnButtonClickRemove(column){
  console.log('onColumnButtonClick' , column.id)
  this.database.removeColumn(column.id)
}
//////////

}

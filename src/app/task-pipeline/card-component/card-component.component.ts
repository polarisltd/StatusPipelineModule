
import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef} from '@angular/core';
import { ViewChild} from '@angular/core';
import {Database} from "../shared/status-pipeline-module.database";
import {Card} from "../shared/card";
import {Observable, Subject} from "rxjs";
import {Board} from "../shared/board";
import {IPipelineColumnElement} from "../shared/status-pipeline-module.interface";

@Component({
  selector: 'app-card-component',
  templateUrl: './card-component.component.html',
  styleUrls: ['./card-component.component.scss']
})
export class CardComponentComponent implements OnInit {
  @ViewChild('emptyItem') emptyItem: ElementRef;
  @Input() boardSubject$: Subject<Board> // initialised and provided by board component
  @Input() card: Card;
  @Output() cardUpdate: EventEmitter<Card>;
  @Input() onCardClick : EventEmitter<IPipelineColumnElement>;
  editingCard = false;
  currentTitle: string;
  database: Database;

  isTitleClicked : boolean = false;
  board$ : Observable<Board>;
  board : Board


  constructor() {
  }

    ngOnInit() {
        this.board$ = this.boardSubject$; //this.database.getBoardObservable()
        this.board$.subscribe(board => {
            console.log('ColumnComponent#ngOnInit board$.subscrive '/*, JSON.stringify(board,null,'\t')*/)
            this.board = board
            this.database = new Database(this.boardSubject$,this.board);
            }

        )
    }
  clickOnCardTitle(event,isInput){
  console.log('CardComponent#-> onCardTitleClick ',   this.card.title,',', isInput.elementRef)
  this.isTitleClicked = !this.isTitleClicked;
}

///////////

  handleDragStart(event, card) {
   event.dataTransfer.setData(`id=${this.card.id}`, 'data'); // whatever data
   console.log('CardComponent#handleDragStart',card.id)
  }

  handleDragOver(event, node) {
    event.preventDefault();
      // known behaviuor, dragOver did not know originating item.
      // therefore we cheat :)
      const sourceId = event.dataTransfer.types.find(entry => entry.includes("id="))
      console.log('CardComponent#handleDragOver #sourceId '   , sourceId )
   }

  
  handleDrop(event, card) {
    event.preventDefault();
      const dragId = event.dataTransfer.getData('foo')
      console.log('CardComponent#handleDrop DISABLED ',dragId,'->',this.card.columnId)
      // this.database.moveCard(dragId,this.card.columnId) // moving into current card column
  }

  handleDragEnd(event) {
      const dragId = event.dataTransfer.getData('foo')
      console.log('CardComponent#handleDragEnd ',dragId,'->',this.card.id)

}

clickCardDeleteButton(card){
  console.log('CardComponent#onCardButtonClick' , card.id)
  this.database.removeCard(card.id)
  this.onCardClick.emit(this.database.getCard(card.id))
}

onCardButtonClick2(card){
  console.log('CardComponent#onCardButtonClick' , card.id)
  this.database.addCardRefCard(card.id)
}

clickOnCard(card){
    console.log('CardComponent#onCardButtonClick' , card.id)
    this.onCardClick.emit(this.database.getCard(card.id))
}



}

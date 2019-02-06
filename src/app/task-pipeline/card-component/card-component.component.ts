
import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef} from '@angular/core';
import { ViewChild} from '@angular/core';
import {Database} from "../shared/status-pipeline-module.database";
import {Card} from "../shared/card";
import {Observable, Subject} from "rxjs";
import {Board} from "../shared/board";

@Component({
  selector: 'app-card-component',
  templateUrl: './card-component.component.html',
  styleUrls: ['./card-component.component.css']
})
export class CardComponentComponent implements OnInit {
  @ViewChild('emptyItem') emptyItem: ElementRef;
  @Input()
  boardSubject$: Subject<Board> // initialised and provided by board component
  @Input()
  card: Card;
  @Output() cardUpdate: EventEmitter<Card>;
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
  onCardTitleClick(event,isInput){
  console.log('CardComponent#-> onCardTitleClick ',   this.card.title,',', isInput.elementRef)
  this.isTitleClicked = !this.isTitleClicked;
}

///////////

  handleDragStart(event, card) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)


this.database.dndSourceCard = card;

   console.log('CardComponent#handleDragStart',JSON.stringify(card,null,'\t')) 
  }

  handleDragOver(event, node) {
    event.preventDefault();
// console.log('handleDragOver')
   }

  
  handleDrop(event, card) {
    event.preventDefault();
 console.log('CardComponent#handleDrop',JSON.stringify(card,null,'\t'))
  }

  handleDragEnd(event) {
 console.log('CardComponent#handleDragEnd')

}

onCardButtonClick(card){
  console.log('onCardButtonClick' , card.id)
  this.database.removeCard(card.id)
}

onCardButtonClick2(card){
  console.log('onCardButtonClick' , card.id)
  this.database.addCardRefCard(card.id)
}

}

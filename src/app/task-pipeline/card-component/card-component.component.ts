
import {Component, Input, OnInit, EventEmitter, ElementRef} from '@angular/core';
import { ViewChild} from '@angular/core';
import {Database} from '../shared/status-pipeline-module.database';
import {Card} from '../shared/card';
// tslint:disable-next-line:import-blacklist
import {Observable, Subject} from 'rxjs';
import {Board} from '../shared/board';
import {IPipelineColumnElement} from '../shared/status-pipeline-module.interface';
import {FormBuilder, FormGroup} from '@angular/forms';

/* tslint:disable */
@Component({
  selector: 'app-card-component',
  templateUrl: './card-component.component.html',
  styleUrls: ['./card-component.component.scss']
})
export class CardComponentComponent implements OnInit {
  @ViewChild('emptyItem') emptyItem: ElementRef;
  @Input() boardSubject$: Subject<Board> // initialised and provided by board component
  @Input() card: Card;
  @Input() onUpdateCard: EventEmitter<IPipelineColumnElement>;
  @Input() onDeleteCard: EventEmitter<IPipelineColumnElement>;
  @Input() onCardClick: EventEmitter<IPipelineColumnElement>;
  database: Database;

  isCardEditMode: boolean = false;
  board$: Observable<Board>;
  board: Board
  cardForm: FormGroup;
  cardFormChanged: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
        this.board$ = this.boardSubject$; // this.database.getBoardObservable()
        this.board$.subscribe(board => {
            this.board = board
            this.database = new Database(this.boardSubject$, this.board);
            }
        )

      this.cardForm = this.fb.group({
          'title': this.card.title,
          'content': this.card.content
      });
      this.cardForm.valueChanges.subscribe(form => {
          this.cardFormChanged = true;
          this.card.title = form.title;
          this.card.content = form.content;
      });



  }

  clickOnCardField(event) {
  }



handleDragStart(event, card) {
   this.insertDragSourceId(event, this.card.id)
}

handleDragOver(event, node) {
    event.preventDefault();
    const sourceId = this.extractDragSourceId(event)
}

  
handleDrop(event, card) {
    event.preventDefault();
}

handleDragEnd(event) {
}

clickCardDeleteButton(card) {
  this.database.removeCard(card.id)
  this.onDeleteCard.emit(card)
}

clickCardEditButton(card) {
    this.isCardEditMode = true
}


clickOnCard(card) {
    this.onCardClick.emit(this.database.getCard(card.id))
}

clickExitUpdate() {
    this.isCardEditMode = false
    if (this.cardFormChanged) {
        this.onUpdateCard.emit(this.card)
        this.isCardEditMode = false
    }
}

extractDragSourceId(event): string {
    // extract drag source as we coded it.
    return event.dataTransfer.types.find(entry => entry.includes('id=')).substr(3);
}
insertDragSourceId(event, id: string) {
    // known behavior, dragOver did not make available originating item.
    // normally we insert drag source via event.dataTransfer.setData(key,value)
    // but now we cheat by inserting  event.dataTransfer.setData('key=value',whatever)
    // dragOver strips only value but not key so thats our backdoor solution
    event.dataTransfer.setData(`id=${id}`, 'data'); // whatever data
}

}

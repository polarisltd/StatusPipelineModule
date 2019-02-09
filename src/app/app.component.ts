import {Component, EventEmitter, OnInit} from '@angular/core';
import {Board} from "./task-pipeline/shared/board";
import {Subject} from "rxjs";
import {DataSource} from "./DataSource";
import {IPipelineColumn, IPipelineColumnElement,IStatusChange
} from "./task-pipeline/shared/status-pipeline-module.interface";




@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [DataSource]
})
export class AppComponent implements OnInit{

  ALLOWED_TRANSITIONS = [
    ['001-002','001-003'],
    ['001-003','001-004'],
    ['001-004','001-005']
  ]

  public  validateDragFunction: Function;
  boardSubject$ : Subject<Board>
  dataSource: DataSource;
  onTransition = new EventEmitter<IStatusChange>(); // card, fromCol, toCol
  onClickColumnTitle = new EventEmitter<IPipelineColumn>();
  onCardClick = new EventEmitter<IPipelineColumnElement>();
  onAddCard = new EventEmitter<IPipelineColumnElement>();
  onRemoveColumn = new EventEmitter<IPipelineColumn>();

  messageArea: string = ''

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.onTransition.subscribe(item => this.showMessage('Drag-n-drop:',item))
    this.onClickColumnTitle.subscribe(item => this.showMessage('click column:',item))
    this.onAddCard.subscribe(item => this.showMessage('addCard:',item))
    this.onRemoveColumn.subscribe(item => this.showMessage('removeColumn',item))
    this.onCardClick.subscribe(item => this.showMessage('cardClick',item))
  }

  ngOnInit() {
    this.boardSubject$ = this.dataSource.boardSubject$
    this.validateDragFunction = this.validateDropRules.bind(this); // bind actual method

  }


  /** Actual validation function */
  validateDropRules(statusChange: IStatusChange):boolean{

    console.log('app.component#validateDragRules  ',statusChange)

    return (this.ALLOWED_TRANSITIONS.filter(

        elem => elem[0] === statusChange.src.id &&
                  elem[1] === statusChange.dst.id
    ).length > 0)

  }


  showMessage(prefix:string, value:string){

      this.messageArea =  prefix + JSON.stringify(value)
      console.log('=>',this.messageArea)
      setTimeout(() => {
          this.messageArea = ''
      }, 10000);
  }


}

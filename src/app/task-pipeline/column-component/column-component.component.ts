import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Database} from "../shared/status-pipeline-module.database";
import {Board} from "../shared/board";
import {Column} from "../shared/column";
import {Card} from "../shared/card";
import {IPipelineColumn, IPipelineColumnElement, IStatusChange} from "../shared/status-pipeline-module.interface";
import {ColumnsSortPipe} from "../shared/sortby-pipe";



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
  @Input() onTransition : EventEmitter<IStatusChange>; // card, fromCol, toCol
  @Input() onClickColumnTitle : EventEmitter<IPipelineColumn>;
  @Input() validateDrag: Function
  @Output()
  public onAddCard: EventEmitter<Card>;
  @Output() cardUpdate: EventEmitter<Card>;


  board$ : Observable<Board>;

  database: Database
  board : Board
  dragClass: string = 'drag-color0'; // drag/drop enable/disable color
  inTimer:boolean = false;

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
    this.onClickColumnTitle.emit(this.column)
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
    //
    // known behaviuor, dragOver did not know originating item.
    // therefore we cheat :)
    //
    const sourceId = event.dataTransfer.types.find(entry => entry.includes("id=")).substr(3) // strip id=
    // console.log('CardComponent#handleDragOver #sourceId '   , sourceId )


    // console.log('ColumnComponent#handleDragOver ',dragId,'->',node.id)
    // event.dataTransfer.dropEffect = 'none'  ;
    // console.log('dropEffect'   ,event.dataTransfer.dropEffect)

    if(true && !this.validateDrag(sourceId,this.column.id)) {
      this.colorDragProtectedArea(node)
    }

    // bellow works just change flag!
    if(false && !this.validateDropRules(sourceId,this.column.id)) {
      this.colorDragProtectedArea(node)
    }
  }


  validateDropRules(srcCardId:string,dstColumnId:string):boolean{

    const srcCard = this.board.cards.find(entry => entry.id === srcCardId)

    if(srcCard)
      console.log('CardComponent#validateRules #sourceId card/col => col' ,srcCardId,'/',srcCard.columnId,' => '   ,dstColumnId    )
    else
      console.log('card not found ',srcCardId,' board_cards.len '  , this.board.cards.length)

    const srcColumn = this.board.columns.find(entry => entry.id === srcCard.columnId)
    const idxSourceColumn = this.board.columns.indexOf(srcColumn)

    // rules: allowed to move only to next column if such exists

    if(this.board.columns.length <= (idxSourceColumn + 1) || this.board.columns[idxSourceColumn + 1].id !== dstColumnId  )
      return false; //

    // rule:  prevent moving to same column as originating card. above prevents coming here.

    if (!srcCard || srcCard.columnId === dstColumnId) return false;

    // default to true
    return true;
  }




  colorDragProtectedArea = (node) => {

    this.dragClass = 'drag-color1';
    if (!this.inTimer) {
      this.inTimer = true;
      setTimeout(() => {
        console.log('-> reset ngClass', ' =', node.id)
        this.dragClass = 'drag-color0';
        this.inTimer = false;
      }, 2000);
    }


  }



  handleDrop(event, node) {
    event.preventDefault();
    const dragId = event.dataTransfer.getData('foo')
    console.log('ColumnComponent#handleDrop ',dragId,'->',node.id)

    if(this.validateDrag(dragId,node.id) /*this.validateDropRules(dragId,node.id)*/){
       console.log('moving ...')
       this.database.moveCard(dragId, node.id)

       const movedCard =  this.board.cards.find(entry => entry.id === dragId);
       const fromColumn = this.board.columns.find(entry => entry.id === movedCard.columnId);
       const toColumn = this.board.columns.find(entry => entry.id === node.id);


       const statusChange = {
         src:fromColumn,
         dst:toColumn,
         elem:movedCard
       } as IStatusChange;

       console.log('emitting statusChange: ', statusChange)
       this.onTransition.emit(statusChange)
    }
  }

  handleDragEnd(event)  {
    const dragId = event.dataTransfer.getData('foo')
    console.log('ColumnComponent#handleDragEnd ',dragId,'->',this.column.id)
  }


onColumnButtonClick(column){
  console.log('ColumnComponent#onColumnButtonClick ' , column.id)
  this.database.addCardRefColumn(column.id)
}

onColumnButtonClickRemove(column){
  console.log('ColumnComponent#onColumnButtonClick' , column.id)
  this.database.removeColumn(column.id)
}


}

import { Board } from './board-component/board';
import { Column } from './column-component/column';
import { Card } from './card-component/card';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { Subject } from "rxjs";
import { BehaviorSubject } from "rxjs";




export class Database {

  dndSourceCard: Card;
  dndTargetColumn: Column;

  dataSource = {
    "_id": "000-000",
    "title": "CanBan Board",
    "columns": [
      {
        "id": "001-001",
        "title": "Open",
        "boardId": "000-000",
        "order": 0,
        "color":"red"
      },
      {
        "id": "001-002",
        "title": "Todo",
        "boardId": "000-000",
        "order": 1,
        "color":"blue"
      },
      {
        "id": "001-003",
        "title": "Doing",
        "boardId": "000-000",
        "order": 2,
        "color":"green"
      },
      {
        "id": "001-004",
        "title": "Done",
        "boardId": "000-000",
        "order": 3,
        "color":"magenta"
      },
      {
        "id": "001-005",
        "title": "Future-1",
        "boardId": "000-000",
        "order": 4,
        "color":"blue"
      },
      {
        "id": "001-006",
        "title": "Future-2",
        "boardId": "000-000",
        "order": 5,
        "color":"cyan"
      },
      {
        "id": "001-007",
        "title": "Future-3",
        "boardId": "000-000",
        "order": 6,
        "color":"blue"
      }
    ],
    "cards": [
      {
        "id": "002-001",
        "title": "Id 1",
        "content": "a variable amount of columns depending on the amount of stati a task can show",
        "boardId": "000-000",
        "order": 0,
        "columnId": "001-001"
      },
      {
        "id": "002-002",
        "title": "Id 2",
        "content": "Each column must have an editable title",
        "boardId": "000-000",
        "order": 1,
        "columnId": "001-001"
      },
      {
        "id": "002-003",
        "title": "Id 3",
        "content": "Each column must have an editable title",
        "boardId": "000-000",
        "order": 2,
        "columnId": "001-002"
      },
      {
        "id": "002-004",
        "title": "Id 4",
        "content": "Each column must allow to transit a task from one column to the next.This goal must be achievable by drag ‘n drop.",
        "boardId": "000-000",
        "order": 3,
        "columnId": "001-003"
      },
      {
        "id": "002-005",
        "title": "Id 5",
        "content": "Each column must be able to trigger events on the tasks, so a transition of a task from one column to the next is able to change task attributes.",
        "boardId": "000-000",
        "order": 4,
        "columnId": "001-004"
      }
      ,
      {
        "id": "002-006",
        "title": "Id 6",
        "content": "Each column must be able to trigger events on the tasks, so a transition of a task from one column to the next is able to change task attributes.",
        "boardId": "000-000",
        "order": 4,
        "columnId": "001-002"
      }
      ,
      {
        "id": "002-007",
        "title": "Id 7",
        "content": "Each column must be able to trigger events on the tasks, so a transition of a task from one column to the next is able to change task attributes.",
        "boardId": "000-000",
        "order": 4,
        "columnId": "001-002"
      }
    ]
  } as Board;


  board: Board;
  boardInternal: Board;
  board$: Observable<Board>;
  boardSubject$: Subject<Board>;  

  constructor() {

    this.boardSubject$ = new BehaviorSubject<Board>(this.dataSource);

    this.board$ = this.boardSubject$

    //  this.board$ = this.boardSubject$.asObservable; //this.getBoardObservable()


    this.board$.subscribe((data: Board) => {

      this.boardInternal = data;
      console.log('Database# board$.subscribe'/*, JSON.stringify(this.boardInternal, null, '\t')*/); // users array display

    });

    // Important!
    // remebemr that observable will return data later then expected :)

    this.boardSubject$.subscribe(board =>
      console.log('Database# boardSubject$.subscribe '/*, JSON.stringify(this.board, null, '\t')*/)
    )

    this.boardSubject$.next(this.dataSource);

  }


  public getBoardObservable(): Observable<Board> {
    
    return this.board$

  }


  removeCard(cardId: string) {
    const c: Card = this.boardInternal.cards.find(c => c.id === cardId)
    this.boardInternal.cards.splice(
      this.boardInternal.cards.indexOf(c), 1
    )
    this.boardSubject$.next(this.boardInternal);
  }

  addCardRefCard(cardId: string) {
    const c: Card = this.boardInternal.cards.find(c => c.id === cardId)
    const newCard = new Card()
    newCard.id = this.uuidv4()
    newCard.boardId = c.boardId
    newCard.columnId = c.columnId
    newCard.title = 'new card'
    newCard.content = 'coming soon'

    this.boardInternal.cards.push(newCard)
    this.boardSubject$.next(this.boardInternal);  // submit to topic
  }

  addCardRefColumn(columnId: string) {
    const c: Column = this.boardInternal.columns.find(c => c.id === columnId)
    const newCard = new Card()
    newCard.id = this.uuidv4()
    newCard.boardId = c.boardId
    newCard.columnId = c.id
    newCard.title = 'new card'
    newCard.content = 'coming soon'

    this.boardInternal.cards.push(newCard)
    this.boardSubject$.next(this.boardInternal);  // submit to topic
  }

  /** drag n drop support. Move card to different column */
  moveCard(cardId, targetColumnId) {

    const c: Card = this.boardInternal.cards.find(c => c.id === cardId)

    const idxC = this.boardInternal.cards.indexOf(c)

    this.boardInternal.cards[idxC].columnId = targetColumnId;

    console.log('moving card->column ', this.boardInternal.cards[idxC].id, ' -> ', this.boardInternal.cards[idxC].columnId)

    this.boardSubject$.next(this.boardInternal);

  }


  removeColumn(columnId: string) {
    const c: Column = this.boardInternal.columns.find(c => c.id === columnId)
    // make sure to remove only empty
    const cardsInThisColumn: Card[] = this.boardInternal.cards.filter(c => c.columnId === columnId)
    if (!cardsInThisColumn || cardsInThisColumn.length === 0)
      this.boardInternal.columns.splice(
        this.boardInternal.columns.indexOf(c), 1
      )
    this.boardSubject$.next(this.boardInternal);
  }



  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }




}

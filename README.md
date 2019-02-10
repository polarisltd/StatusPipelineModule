# StatusPipelineModule

This is a component providing Can-Ban board style Task management.
It provides vertical swimlines style board were each swimline e.g. stati allows 
attach multiple cards which could be moved forward as Task progresses 
via drag and drop.

Component is based on outside of component provided Observable data. It is based on following data model:

- Board, can having multiple Columns;
- Columns, can having multiple Cards;
- Cards, those containing Task data.

Functionality

- Board is built dynamically based on above data model;
- Columns having defined sequence of following on Board;
- Draggable Cards between columns;
- Rules describing Drag and Drop permissions are provided as Callback at embedding component side;
- Column title editable;
- Click on column title emites event;
- Cards can be added; Event emitted and Data updated.
- Cards cn be edited; updated card delivered as event and Data updated.
- Cards can be removed; Delivered as Event and Data updated.


## Usage example

```html5
<dvtx-status-pipeline
        [boardSubject$]="boardSubject$"
        [onTransition]="onTransition"
        [onClickColumnTitle]="onClickColumnTitle"
        [validateDropRules]="validateDragFunction"
        [onAddCard]="onAddCard"
        [onUpdateCard]="onUpdateCard"
        [onRemoveColumn]="onRemoveColumn"
        [onCardClick]="onCardClick"
        [onDeleteCard]="onDeleteCard">
</dvtx-status-pipeline>

```

Arguments:

[boardSubject$]="boardSubject$" 

provides input data source. It has to be constructed by Embedding component.

Bellow please find example.

```
export class Board {
	id: string;
	title: string;
	columns: Column[];
    cards: Card[];
}

export class Column implements IPipelineColumn{
	id: string;
    title: string;
    boardId: string;
    order: number;
    status: string;
    color: string;
}

export class Card implements IPipelineColumnElement{
  id: string;
  title: string;
  content: string;
  columnId: string;
  boardId: string;
  order: number;
  type: PipelineColumnElementType;
  status: string;
}


    dataSource: Board = {
        "_id": "000-000",
        "title": "CanBan Board",
        "columns": [
            {
                "id": "001-001",
                "title": "Open",
                "boardId": "000-000",
                "order": 0,
                "color": "red"
            }, ....
        ],
        "cards": [
                    {
                        "id": "002-001",
                        "title": "Id 1",
                        "content": "a variable amount of columns depending on the amount of stati a task can show",
                        "boardId": "000-000",
                        "order": 0,
                        "columnId": "001-001"
                    },.....    
         ]
     } } as Board;    


this.boardSubject$ = new BehaviorSubject<Board>(this.dataSource);
```

[onTransition]="onTransition"

Event emitter being triggered at Drag and Drop operation moving card between columns.

Provide and Subscribe for it like this:

```
onTransition = new EventEmitter<IStatusChange>();

this.onTransition.subscribe(item => this.showMessage('Drag-n-drop:',item))
```

[onClickColumnTitle]="onClickColumnTitle"

Provides Event on user clicking Column Title

```
  onClickColumnTitle = new EventEmitter<IPipelineColumn>();
```

[onCardClick]="onCardClick"

Provides Event on user clicking Card

```
  onCardClick = new EventEmitter<IPipelineColumnElement>();
```

[onClickColumnTitle]="onClickColumnTitle"

Provides Event on user clicking Column Title.

```
  onClickColumnTitle = new EventEmitter<IPipelineColumn>();
```

[onAddCard]="onAddCard"

Provides Event on Adding Card.

Adding a Card ends with template Card being created. User can modify actual Card. Please see bellow.

```
  onAddCard = new EventEmitter<IPipelineColumnElement>();
```

[onDeleteCard]="onDeleteCard"

To remove Card click on [-] button bellow the card. Currently there is no any brestrictions to remove the Card.

```
   onDeleteCard = new EventEmitter<IPipelineColumnElement>();
 
```

[onUpdateCard]="onUpdateCard"

User can modify card by clicking button [e] bellow that card.
2 editable fields appears. One for Title and one for column. Once done press Enter key or click on link bellow editable Card Form.
This is a way how to update a Card once one has been created.

```
  onUpdateCard = new EventEmitter<IPipelineColumnElement>();
```

[onRemoveColumn]="onRemoveColumn"

This triggers when user clicks on [-] button bellow Column Title. Currently there is no restrictions for column removal

```
  onRemoveColumn = new EventEmitter<IPipelineColumn>();
```

[validateDropRules]="validateDragFunction"

Callback  is defined as Function type. This Function identifier needs to be bind to actual function. See example bellow.

```
validateDragFunction: Function;

this.validateDragFunction = this.validateDropRules.bind(this); // bind actual method

validateDropRules(statusChange: IStatusChange):boolean{

    console.log('app.component#validateDragRules  ',statusChange)

    return (this.ALLOWED_TRANSITIONS.filter(

        elem => elem[0] === statusChange.src.id &&
                  elem[1] === statusChange.dst.id
    ).length > 0)

  }
```






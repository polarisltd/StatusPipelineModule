import {Column} from '../column-component/column';
import {Card} from '../card-component/card';

export class Board {
	_id: string;
	title: string;
	columns: Column[];
  cards: Card[];
}
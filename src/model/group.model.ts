import { List } from 'immutable';
import { RowModel } from './';

export class GroupModel {
    constructor(
        public readonly rows: List<RowModel>
    ) { }
}
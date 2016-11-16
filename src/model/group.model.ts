import { List } from 'immutable';
import { RowModel } from './';

export class GroupModel {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly rows: List<RowModel>
    ) { }
}
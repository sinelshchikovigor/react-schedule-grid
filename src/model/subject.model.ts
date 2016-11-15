import { List } from 'immutable';

type SubjectColumn = {
    id: number;
    data: string;
}

// TODO: Add raw typings
export class SubjectModel {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly columns: List<SubjectColumn>,
        public readonly raw: any
    ) { }
}
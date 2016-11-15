import { List } from 'immutable';
import { SubjectModel, EntityModel } from './';

export class RowModel {
    constructor(
        public readonly subject: SubjectModel,
        public readonly entities: List<EntityModel>,
        public readonly isSelected: boolean
    ) { }

    equalsTo(other: RowModel): boolean {
        return this === other || (this.subject === other.subject && this.entities === other.entities && this.isSelected === other.isSelected);
    }

    updateIsSelected(isSelected: boolean): RowModel {
        if (this.isSelected === isSelected) {
            return this;
        }
        return new RowModel(this.subject, this.entities, isSelected);
    }
}
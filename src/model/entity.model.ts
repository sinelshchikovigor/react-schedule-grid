import { SegmentModel } from './';
import { List } from 'immutable';

// TODO: Add raw typings
export class EntityModel {
    constructor(
        public readonly id: number,
        public readonly subjectId: number,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly segments: List<SegmentModel>,
        public readonly raw: any
    ) { }
}
export class EntityModel {
    constructor(
        public readonly id: number,
        public readonly subjectId: number,
        public readonly startDate: Date,
        public readonly endDate: Date
    ) { }
}
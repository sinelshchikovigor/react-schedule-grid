export class SegmentModel {
    constructor(
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly type: string
    ) { }
}
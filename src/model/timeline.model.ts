export class TimelineModel {
    constructor(
        public readonly zoomStartDate: Date,
        public readonly zoomEndDate: Date,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly horizontalScrollPosition: number,
        public readonly fullWidth,
        public readonly hourWidth: number,
        public readonly dayWidth: number
    ) { }
}
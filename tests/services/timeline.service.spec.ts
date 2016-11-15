import { TimelineService } from '../../src/services';
import { TimelineModel } from '../../src/model';

let schedulerWidth: number = 1920;

describe('TimelineService tests', () => {
    describe('Zooming in cases', () => {
        let timeline: TimelineModel = new TimelineModel(
            new Date(2016, 9, 1),
            new Date(2016, 9, 15),
            new Date(2016, 9, 1),
            new Date(2016, 9, 15),
            0,
            0,
            0,
            0
        );

        it('Zoom in one day', () => {
            let oneDay: Date = new Date(2016, 9, 2);

            let resultTimeline: TimelineModel = TimelineService.processZooming(
                timeline,
                schedulerWidth,
                oneDay,
                oneDay
            );

            expect(resultTimeline).toBeDefined();
            expect(resultTimeline.zoomStartDate).toBe(oneDay);
            expect(resultTimeline.zoomEndDate).toBe(oneDay);
        });

        it('Zoom in a week', () => {
            let weekStart: Date = new Date(2016, 9, 4);
            let weekEnd: Date = new Date(2016, 9, 10);

            let resultTimeline: TimelineModel = TimelineService.processZooming(
                timeline,
                schedulerWidth,
                weekStart,
                weekEnd
            );

            expect(resultTimeline).toBeDefined();
            expect(resultTimeline.zoomStartDate).toBe(weekStart);
            expect(resultTimeline.startDate).toBe(timeline.startDate);
            expect(resultTimeline.zoomEndDate).toBe(weekEnd);
            expect(resultTimeline.endDate).toBe(timeline.endDate);
        });
    });
});

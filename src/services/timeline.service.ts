import { List } from 'immutable';
import { TimelineModel, EntityModel, WeekModel } from '../model';
import { DateTimeService } from './datetime.service';

export class TimelineServiceException extends Error {
    public name: string;
    constructor(public message: string) {
        super(message);
        Error.captureStackTrace(this);
        this.name = (this as any).constructor.name;
    }
}

export interface EntityGeometry {
    left: number;
    width: number;
}

const MAX_DAY_SIZE: number = 155;

export class TimelineService {
    static calculateTimeline(startDate: Date, endDate: Date, zoomStartDate: Date, zoomEndDate: Date, width: number): TimelineModel {
        let dayWidth: number = TimelineService.calculateDayWidth(zoomStartDate, zoomEndDate, width);
        let hourWidth: number = TimelineService.calculateHourWidth(zoomStartDate, zoomEndDate, width);

        let wholeWidth = DateTimeService.calculateDaysDifference(startDate, DateTimeService.addSeconds(endDate, 1)) * dayWidth;
        let horizontalScrollPosition: number = (zoomStartDate.getTime() - startDate.getTime()) / (60 * 60 * 1000) * hourWidth;
        let timeline = new TimelineModel(
            zoomStartDate,
            zoomEndDate,
            startDate,
            endDate,
            horizontalScrollPosition,
            wholeWidth,
            hourWidth,
            dayWidth
        );

        return timeline;
    }

    static processZooming(currentTimeline: TimelineModel, width: number, zoomStartDate: Date, zoomEndDate: Date): TimelineModel {
        // Process zoom out cases
        let timeline: TimelineModel;

        if (DateTimeService.isSameDay(zoomStartDate, currentTimeline.zoomStartDate)) {
            if (DateTimeService.isSameDay(zoomStartDate, zoomEndDate)) {
                // Proccess day click zoom out
                let week: WeekModel = TimelineService.calculateWeekForDate(zoomStartDate);
                timeline = TimelineService.zoomToDateRange(currentTimeline, week.weekStart, week.weekEnd, width);
            } else {
                // Proccess week click zoom out
                timeline = TimelineService.zoomToMax(currentTimeline, width);
            }
        } else {
            if (zoomEndDate) {
                timeline = TimelineService.zoomToDateRange(currentTimeline, zoomStartDate, zoomEndDate, width);
            } else {
                timeline = TimelineService.zoomOneDay(currentTimeline, zoomStartDate, width);
            }
        }

        return timeline || currentTimeline;
    }

    static calculateIntervalsCountFromDates(startDate: Date, endDate: Date) {
        let daysDifference: number = DateTimeService.calculateDaysDifference(startDate, endDate);

        return daysDifference || 24;
    }

    static isEntityInPeriod(entity: EntityModel, timeline: TimelineModel) {
        let stateStartDate = timeline.startDate;
        let stateEndDate = timeline.endDate;

        return (entity.startDate >= stateStartDate && entity.startDate < stateEndDate)
            || (entity.endDate > stateStartDate && entity.endDate <= stateEndDate);
    }

    static calculateEntityGeometry(entity: EntityModel, isTabularView: boolean, timeline: TimelineModel): EntityGeometry {
        let width = 0;
        let left = -1;

        let timelineStartDate = timeline.startDate;
        let entityStartDate = entity.startDate;
        let entityEndDate = entity.endDate;
        let daysDifference = DateTimeService.calculateDaysDifference(timelineStartDate, entityEndDate);


        if (isTabularView) {
            width = 24 * timeline.hourWidth;
            left = daysDifference <= 0 ? 0 : daysDifference * timeline.dayWidth;
        } else {
            // TODO move calc into DateTimeService
            let hourDifference = (entity.endDate.getTime() - entity.startDate.getTime()) / (60 * 60 * 1000);
            width = hourDifference * timeline.hourWidth;
            left = daysDifference <= 0 ? 0 : (daysDifference * timeline.dayWidth) + timeline.hourWidth * entityStartDate.getHours();
        }

        return {
            left: left,
            width: width
        };
    }

    static calculateDayWidth(startDate: Date, endDate: Date, width: number): number {
        let daysDifference: number = DateTimeService.calculateDaysDifference(startDate, DateTimeService.addSeconds(endDate, 1));
        return Math.max(width / daysDifference, MAX_DAY_SIZE);
    }

    static calculateHourWidth(startDate: Date, endDate: Date, width: number): number {
        return TimelineService.calculateDayWidth(startDate, endDate, width) / 24;
    }

    static calculateWeekForDate(date: Date): WeekModel {
        let result: WeekModel;
        let startResultDate = DateTimeService.addDays(date, -date.getDay());
        let weekStart = startResultDate;
        let weekEnd = DateTimeService.addDays(startResultDate, 7);

        result = new WeekModel(
            weekStart,
            weekEnd
        );

        return result;
    }

    static calculateWeeks(startDate: Date, endDate: Date): List<WeekModel> {
        if (startDate > endDate) {
            throw new TimelineServiceException('Parameter "startDate" should be less than parameter "endDate"');
        }

        let result = List<WeekModel>([]);

        let startResultDate = DateTimeService.addDays(startDate, -startDate.getDay());
        let endResultDate = DateTimeService.addDays(endDate, 6 - endDate.getDay());

        while (startResultDate < endResultDate) {
            let nextStartDate = DateTimeService.addDays(startResultDate, 7);
            let weekEnd = DateTimeService.addSeconds(nextStartDate, -1);

            result = result.push(new WeekModel(
                startResultDate,
                weekEnd
            ));

            startResultDate = nextStartDate;
        }

        return result;
    }

    static calculateWeekWidth(weeks: List<WeekModel>, width: number): number {
        return width / weeks.size;
    }

    private static zoomToDateRange(currentTimeline: TimelineModel, zoomStartDate: Date, zoomEndDate: Date, width: number): TimelineModel {
        return TimelineService.calculateTimeline(
            currentTimeline.startDate,
            currentTimeline.endDate,
            zoomStartDate,
            zoomEndDate,
            width
        );
    }

    private static zoomOneDay(currentTimeline: TimelineModel, day: Date, width: number): TimelineModel {
        return TimelineService.calculateTimeline(
            currentTimeline.startDate,
            currentTimeline.endDate,
            day,
            day,
            width
        );
    }

    private static zoomToMax(currentTimeline: TimelineModel, width: number): TimelineModel {
        return TimelineService.calculateTimeline(
            currentTimeline.startDate,
            currentTimeline.endDate,
            currentTimeline.startDate,
            currentTimeline.endDate,
            width
        );
    }

    static await(func, wait) {
        var timeout;

        return function () {
            var context = this;
            var args = arguments;
            var awaitFunc = function () {
                timeout = null;
                func.apply(context, args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(awaitFunc, wait);
        };
    };
}
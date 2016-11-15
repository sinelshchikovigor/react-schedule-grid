import { List } from 'immutable';

export class DateTimeServiceException extends Error {
    public name: string;
    constructor(public message: string) {
        super(message);
        Error.captureStackTrace(this);
        this.name = (this as any).constructor.name;
    }
}

export class DateTimeService {

    private static readonly MONTHS = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    private static readonly WEEK_DAYS = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];

    private static readonly MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

    public static addDays(date: Date, dayCount: number): Date {
        let result = new Date(date);
        result.setTime(date.getTime() + dayCount * DateTimeService.MILLISECONDS_PER_DAY);
        return result;
    }

    public static addSeconds(date: Date, secondCount: number): Date {
        let result = new Date(date);
        result.setTime(date.getTime() + secondCount * 1000);
        return result;
    }

    public static isSameDay(dateA: Date, dateB: Date): boolean {
        return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
    }

    public static isBetween(dateToTest: Date, startDate: Date, endDate: Date): boolean {
        if (startDate > endDate) {
            throw new DateTimeServiceException('Parameter "startDate" should be less than parameter "endDate"');
        }
        return startDate <= dateToTest && dateToTest <= endDate;
    }

    public static toDayAndMonthString(day: Date): string {
        return day.getDate() + ' ' + DateTimeService.MONTHS[day.getMonth()];
    }

    public static toHourAndMinutesString(date: Date) {
        let minutes: string = date.getMinutes() >= 10 ? date.getMinutes().toString() : '0' + date.getMinutes();
        return date.getHours() + ':' + minutes;
    }

    public static getWeekDayName(day: Date): string {
        return DateTimeService.WEEK_DAYS[day.getDay()];
    }

    public static toWeekDayAndMonthDayString(day: Date): string {
        return DateTimeService.WEEK_DAYS[day.getDay()] + ' ' + day.getDate() + '/' + (day.getMonth() + 1);
    }

    static calculateDaysDifference(startDate: Date, endDate: Date): number {
        if (startDate > endDate) {
            throw new DateTimeServiceException('Parameter "startDate" should be less than parameter "endDate"');
        }
        return Math.floor((endDate.getTime() - startDate.getTime()) / DateTimeService.MILLISECONDS_PER_DAY);
    }

    public static createDateListBetweenTwoDates(startDate: Date, endDate: Date): List<Date> {
        if (startDate > endDate) {
            throw new DateTimeServiceException('Parameter "startDate" should be less than parameter "endDate"');
        }
        let result: List<Date> = List<Date>([]);
        let daysCount = DateTimeService.calculateDaysDifference(startDate, endDate);

        if (daysCount) {
            for (let i = 0; i <= daysCount; i++) {
                let newDate = new Date(DateTimeService.addDays(startDate, i));
                result = result.push(newDate);
            }
        } else {
            result = result.push(startDate);
        }

        return result;
    }
}
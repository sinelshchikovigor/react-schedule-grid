import { SubjectModel } from './../model';

export class SubjectService {
    public static compareSubjectsByTitleAsc(valueA: SubjectModel, valueB: SubjectModel): number {
        return (valueA.title || '').localeCompare(valueB.title);
    }

    public static compareSubjectsByTitleDesc(valueA: SubjectModel, valueB: SubjectModel): number {
        return -SubjectService.compareSubjectsByTitleAsc(valueA, valueB);
    }
}
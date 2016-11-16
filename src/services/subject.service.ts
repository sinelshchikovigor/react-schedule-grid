import { SubjectModel } from './../model';

export class SubjectService {
    public static compareSubjectsByTitleAsc(valueA: SubjectModel, valueB: SubjectModel): number {
        return (valueA.name || '').localeCompare(valueB.name);
    }

    public static compareSubjectsByTitleDesc(valueA: SubjectModel, valueB: SubjectModel): number {
        return -SubjectService.compareSubjectsByTitleAsc(valueA, valueB);
    }
}
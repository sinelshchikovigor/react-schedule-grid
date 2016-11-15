import { List } from 'immutable';

import { EntityModel, SubjectModel, RowModel, SegmentModel, GroupModel } from '../model';

export class ConverterService {

    static createRows(subjects: List<SubjectModel>, entities?: List<EntityModel>): List<RowModel> {
        let result: List<RowModel> = List<RowModel>([]);

        // TODO: Performance
        subjects.forEach((subject: SubjectModel) => {
            let resultEntities: List<EntityModel> = List<EntityModel>([]);

            entities.forEach((entity: EntityModel) => {
                if (entity.subjectId === subject.id) {
                    resultEntities = resultEntities.push(entity);
                }
            });

            let row: RowModel = new RowModel(subject, resultEntities, false);
            result = result.push(row);
        });

        return result;
    }

    static createGroups(subjects: List<SubjectModel>, entities?: List<EntityModel>): List<GroupModel>  {
        let rows: List<RowModel> = List<RowModel>([]);

        // TODO: Performance
        subjects.forEach((subject: SubjectModel) => {
            let resultEntities: List<EntityModel> = List<EntityModel>([]);

            entities.forEach((entity: EntityModel) => {
                if (entity.subjectId === subject.id) {
                    resultEntities = resultEntities.push(entity);
                }
            });

            let row: RowModel = new RowModel(subject, resultEntities, false);
            rows = rows.push(row);
        });

        // Test group
        let groups: List<GroupModel> = List<GroupModel>([
            new GroupModel(rows)
        ]);

        return groups;
    }

    static wrapSubjects(subjectsRaw: Array<any>): List<SubjectModel> {
        let subjects = List<SubjectModel>(subjectsRaw
            .filter((subject) => subject.dtoId || (subject.dto && subject.dto.employee && subject.dto.employee.employeeId && subject.dto.employee.employeeId.id))
            .map((subject) => {
                let fullName = subject && subject.dto && subject.dto.employee && subject.dto.employee.fullName;

                return new SubjectModel(
                    (subject.dtoId && subject.dtoId.id) || (subject.dto && subject.dto.employee && subject.dto.employee.employeeId && subject.dto.employee.employeeId.id),
                    fullName,
                    subject.columns,
                    subject
                );
            }));

        return subjects;
    }

    static wrapEntities(entitiesRaw: Array<any>): List<EntityModel> {
        entitiesRaw = entitiesRaw.filter(entity => {
            return entity && entity.definition && entity.definition.id === 'entity.shift';
        });

        return List<EntityModel>(entitiesRaw.map((entity) => {
            let segments: List<SegmentModel> = List<SegmentModel>([]);
            let rawSegments = entity.segments;

            if (rawSegments) {
                rawSegments = rawSegments.map(segment => {
                    return new SegmentModel(segment.startDate, segment.endDate, segment.type);
                }) as Array<SegmentModel>;

                segments = List<SegmentModel>(rawSegments);
            }

            return new EntityModel(
                entity.dto.id.id,
                entity.dto.employee.employeeId.id,
                new Date(entity.dto.startDateTimeUTC.replace(' ', 'T')),
                new Date(entity.dto.endDateTimeUTC.replace(' ', 'T')),
                segments,
                ConverterService.getRawEntity(entity)
            );
        }));
    }

    static getEntityDefinitionId(entity: any): string {
        // TODO Add different shift types
        if (entity && entity.definition && entity.definition.id) {
            return 'shift';
        } else {
            return '';
        }
    }

    static getRawEntity(entity: any): any {
        return {
            Dto: entity.dto,
            DefinitionId: ConverterService.getEntityDefinitionId(entity)
        };
    }
}
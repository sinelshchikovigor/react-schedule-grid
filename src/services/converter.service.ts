import { List } from 'immutable';

import { EntityModel, SubjectModel, RowModel, GroupModel } from '../model';

export class ConverterService {

    static createRows(subjects: List<SubjectModel>, entities?: List<EntityModel>): List<RowModel> {
        let result: List<RowModel> = List<RowModel>([]);

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

    static createGroups(subjects: List<SubjectModel>, entities?: List<EntityModel>): List<GroupModel> {
        let rows: List<RowModel> = List<RowModel>([]);

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

        // TODO: Remove test group
        let groups: List<GroupModel> = List<GroupModel>([
            new GroupModel(
                -1,
                'Default group',
                rows
            )
        ]);

        return groups;
    }

    static wrapSubjects(subjectsRaw: Array<any>): List<SubjectModel> {
        let subjects = List<SubjectModel>(subjectsRaw
            .filter((subject) => {
                return subject;
            })
            .map((subject) => {
                return new SubjectModel(
                    subject.id,
                    subject.name
                );
            }));

        return subjects;
    }

    static wrapEntities(entitiesRaw: Array<any>): List<EntityModel> {
        entitiesRaw = entitiesRaw.filter(entity => {
            return entity;
        });

        return List<EntityModel>(entitiesRaw.map((entity) => {
            return new EntityModel(
                entity.id,
                entity.subjectId,
                new Date(entity.startDate),
                new Date(entity.endDate)
            );
        }));
    }
}
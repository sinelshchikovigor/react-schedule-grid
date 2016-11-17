import { subjects, entities } from '../src/mock.data';
import { SchedulerWrapper } from '../src/scheduler.wrapper';

const editorContent = {
    subjects,
    entities
};

SchedulerWrapper.initialize('app');
SchedulerWrapper.setDateRange(new Date(2016, 9, 1), new Date(2016, 9, 15));
SchedulerWrapper.loadData(editorContent);
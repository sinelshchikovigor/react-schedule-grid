import * as React from 'react';
import { shallow } from 'enzyme';

import { Scheduler } from '../src/scheduler';

describe('Scheduler tests', () => {

    it('Scheduler renders', () => {
        let scheduler = shallow(<Scheduler />);
        expect(scheduler).toBeDefined();
    });

});

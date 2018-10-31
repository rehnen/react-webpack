import React from 'react';
import { mount } from 'enzyme';
import App from '../src/components/App';

describe('App test suite', () => {
    it('should render', () => {
        const wrapper = mount(<App />);
        expect(wrapper.find('h1').text()).toEqual('Home');
    });
});

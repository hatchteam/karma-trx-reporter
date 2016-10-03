import { expect } from 'chai';

import * as Formatters from '../src/Reporter/Formatters';
import { FsStub, createFakeBrowser, createFakeResult } from './Helpers';

describe('formatters', () => {
    it('The default name formatter should combine browser name and description', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Chrome', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('any test description', true, false);

        // act
        const actual = Formatters.defaultNameFormatter(fakeBrowser, fakeResult);

        // assert
        expect(actual).to.be.equal('Chrome_any test description');
    });

    it('The default class name formatter should combine all suite values', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Chrome', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('any test description', true, false);

        // act
        const actual = Formatters.defaultClassNameFormatter(fakeBrowser, fakeResult);

        // assert
        expect(actual).to.be.equal('Sender.using it.get request');
    });
});
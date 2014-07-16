# karma-trx-reporter

> Reporter for the VisualStudio TRX format.

## Status
| Branch        | Status         |
| ------------- |:-------------:|
| master        | [![Build Status](https://travis-ci.org/hatchteam/protractor-trx-reporter.svg?branch=master)](https://travis-ci.org/hatchteam/protractor-trx-reporter) |
| develop       | [![Build Status](https://travis-ci.org/hatchteam/protractor-trx-reporter.svg?branch=develop)](https://travis-ci.org/hatchteam/protractor-trx-reporter)|

## Installation

The easiest way is to keep `karma-trx-reporter` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-trx-reporter": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-trx-reporter --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['progress', 'trx'],

    // the default configuration
	trxReporter: { outputFile: 'test-results.trx' }
  });
};
```

You can pass list of reporters as a CLI argument too:
```bash
karma start --reporters trx,dots
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com

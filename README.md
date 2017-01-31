# karma-trx-reporter

> Reporter for the VisualStudio TRX format.

## Status
| Branch        | Status         |
| ------------- |:-------------:|
| master        | [![Build Status](https://travis-ci.org/hatchteam/karma-trx-reporter.svg?branch=master)](https://travis-ci.org/hatchteam/karma-trx-reporter) |
| develop       | [![Build Status](https://travis-ci.org/hatchteam/karma-trx-reporter.svg?branch=develop)](https://travis-ci.org/hatchteam/karma-trx-reporter)|

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
	trxReporter: { outputFile: 'test-results.trx', shortTestName: false }
  });
};
```
### outDir (optional)
The folder where the trx file will be written
```js
trxReporter: { outputDir: 'testresults', outputFile: 'test-results.trx', shortTestName: false }
```
### outputFile
The output file specifies where the trx file will be written.

### outputFile with datetime
The output file specifies where the trx file will be written.
```js
trxReporter: { outputDir: 'testresults', outputFile: 'test-results_${date}.trx', shortTestName: false }
```
### shortTestName
The trx reporter will attend the browser name to the test name by default.
This can be switched off with the shortTestName config property.

You can pass list of reporters as a CLI argument too:
```bash
karma start --reporters trx,dots
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com

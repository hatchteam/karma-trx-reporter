export const defaultNameFormatter = (browser: karma.Browser, result: karma.TestResult) => {
    return `${browser.name}_${result.description}`;
};

export const defaultClassNameFormatter = (browser: karma.Browser, result: karma.TestResult) => {
    return result.suite.join('.');
};
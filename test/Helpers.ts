export interface FsStub {
    writeFile: any;
};

export function createFakeBrowser(name: string, error: boolean, success: number, skipped: number, failed: number): karma.Browser {
    return {
        id: `${name}_4_1_2`,
        name: name,
        fullName: `${name} 4.1.2`,
        lastResult: {
            error: false,
            total: 1,
            success: 1,
            skipped: 0,
            failed: 0,
            totalTime: 10 * 1000,
            netTime: 10 * 1000
            }
    };
};

export function createFakeResult(description: string, success: boolean, skipped: boolean): karma.TestResult {
    return {
        suite: [
            'Sender',
            'using it',
            'get request'
        ],
        description: description,
        log: [],
        time: 10 * 1000,
        success: success,
        skipped: skipped
    };
};
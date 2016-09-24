declare namespace karma {
    interface LoggerFactory {
        create(name: string): Logger;
    }

    interface Logger {
        warn(message: string): void;
        debug(message: string): void;
    }

    interface Helper {
        mkdirIfNotExists(directory:string, callback: () => void): void;
        normalizeWinPath(directory:string): string;
    }

    interface Browser {
        id: string;
        name: string;
        fullName: string;
        lastResult: BrowserResult;
    }

    interface BrowserResult {
        failed: number;
        total: number;
        skipped: number;
        success: number;
        error: boolean;
        totalTime: number;
        netTime: number;
    }

    interface TestResult {
        description: string;
        suite: Array<string>;
        time: number;
        log: Array<string>;
        skipped: boolean;
        success:boolean;
    }

   interface Reporter {
       
       onRunStart(browsers: Array<Browser>): void;
       onRunComplete(): void;
       onBrowserStart(browser: Browser): void;
       onBrowserComplete(browser: Browser): void;
       specSuccess(browser: Browser, result: TestResult): void;
       specSkipped(browser: Browser, result: TestResult): void;
       specFailure(browser: Browser, result: TestResult): void;

       onExit (done: () => any);
    }
}
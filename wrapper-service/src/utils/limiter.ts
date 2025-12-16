// src/utils/limiter.ts

import { scanConfig } from "../config/scan.config";

let active = 0;          // how many scans are running currently
const queue: Function[] = [];   // waiting functions

export function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {

        const execute = () => {
            active++;

            fn()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    active--;

                    // If queue has waiting tasks → run the next one
                    if (queue.length > 0) {
                        const nextTask = queue.shift();
                        nextTask && nextTask();
                    }
                });
        };

        // If concurrency slot free → execute immediately
        if (active < scanConfig.concurrency) {
            execute();
        } else {
            // Otherwise → push inside queue to wait
            queue.push(execute);
        }
    });
}

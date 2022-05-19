/* IMPORT */



/* FUNCTIONS */

// Report per worker
export function reportPerWorkerValidation(workerid: number): void {
    if (workerid) {
        throw new Error("You need to send worker's ID!");
      }

      console.log('orderPerWorkerValidation success!');
}

// Report per orders in specified time-frames
export function reportOrdersInTimeValidation(start: Date, end: Date): void {
    if (!start) {
        throw new Error("You need to send start time!");
      }
      if (!end) {
        throw new Error("You need to send end time!");
      }

      console.log('reportInTimeValidation success!');
}

// Report per orders in specified time-frames
export function reportIncomeInTimeValidation(start: Date, end: Date): void {
    if (!start) {
        throw new Error("You need to send start time!");
      }
      if (!end) {
        throw new Error("You need to send end time!");
      }

      console.log('reportInTimeValidation success!');
}
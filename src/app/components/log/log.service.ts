import { Injectable } from '@angular/core';
import { Log } from './log.interface';
import { LogType } from './log.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LogService {
    logs: Log[] = [];
    logsSubject = new BehaviorSubject<Log[]>(null);

    error(message: string) {
        const log = {
            message,
            time: new Date(),
            type: LogType.DANGER
        } as Log;

        this.logs.push(log);
        this.logsSubject.next(this.logs);
    }

    success(message: string) {
        const log = {
            message,
            time: new Date(),
            type: LogType.SUCCESS
        } as Log;

        this.logs.push(log);
        this.logsSubject.next(this.logs);
    }

    getLogsSubject(): BehaviorSubject<Log[]> {
        return this.logsSubject;
    }
}

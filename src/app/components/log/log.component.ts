import { Component, OnInit, OnDestroy } from '@angular/core';
import { Log } from './log.interface';
import { Subscription } from 'rxjs';
import { LogService } from './log.service';

@Component({
    'selector': 'tm-log',
    'templateUrl': './log.component.html'
})
export class LogComponent implements OnInit, OnDestroy {
    logs: Log[];
    logsSubscription: Subscription;

    constructor(private logService: LogService) { }

    ngOnInit() {
        this.logs = [];

        this.logsSubscription = this.logService
            .getLogsSubject()
            .subscribe(logs => this.logs = logs);
    }

    ngOnDestroy() {
        if (this.logsSubscription && !this.logsSubscription.closed) {
            this.logsSubscription.unsubscribe();
        }
    }

    close(log: Log) {
        this.logs.splice(this.logs.indexOf(log), 1);
    }

    clearAll() {
        if (confirm('You really want to clear all log?\nThis operation is irreversible.')) {
            this.logs = [];
        }
    }
}
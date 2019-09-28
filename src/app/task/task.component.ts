import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from './task.model';

@Component({
    'selector': 'tm-task',
    'templateUrl': './task.component.html'
})
export class TaskComponent {
    @Input() task: Task;

    @Output() cancel = new EventEmitter();
    @Output() complete = new EventEmitter();

    cancelTask() {
        this.cancel.emit(this.task);
    }

    completeTask() {
        this.complete.emit(this.task);
    }
}
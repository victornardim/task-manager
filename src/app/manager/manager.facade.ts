import { Injectable } from '@angular/core';
import { Task } from '../task/task.model';
import { Subject, timer, Subscription } from 'rxjs';
import { LogService } from '../log/log.service';
import { DatabaseService } from '../shared/services/database.service';
import { TaskRemoveOperation } from './task-remove-operation.enum';

@Injectable({
    'providedIn': 'root'
})
export class ManagerFacade {
    private tasks: Task[];
    private tasksSubject: Subject<Task[]>;

    databaseReady: boolean;

    private timerSubscription: Subscription;

    constructor(
        private logService: LogService,
        private databaseService: DatabaseService) { }

    init() {
        this.databaseService.init();
        this.databaseReady = false;

        this.tasks = [];
        this.tasksSubject = new Subject();

        this.timerSubscription = timer(0, 2000)
            .subscribe(() => this.startMonitoringProgress());

        this.loadTasks();
    }

    private startMonitoringProgress() {
        this.tasks.forEach(task => {
            task.doProgress();

            if (task.isFinished()) {
                this.completeTask(task);
            }
        });

        this.tasksSubject.next(this.tasks);
    }

    private loadTasks() {
        this.databaseService
            .init()
            .subscribe(() => {
                this.databaseReady = true;
                this.databaseService.loadAll()
                    .subscribe(tasks => {
                        if (tasks) {
                            this.tasks = tasks.map(task => Object.assign(new Task(), task));
                            this.tasksSubject.next(this.tasks);
                        }
                    },
                        error => this.logService.error(error));
            },
                error => this.logService.error(error));
    }

    destroy() {
        if (this.timerSubscription && !this.timerSubscription.closed) {
            this.timerSubscription.unsubscribe();
        }
    }

    createTask(task: Task) {
        try {
            this.convertTaskEndDate(task);

            const newTask = Object.assign(new Task(), task);
            newTask.validate();

            if (this.isDatabaseReady()) {
                this.databaseService
                    .insert(newTask)
                    .subscribe(() => {
                        this.tasks.push(newTask);
                        this.tasksSubject.next(this.tasks);
                    },
                        error => this.logService.error(error));
            }
        } catch (ex) {
            this.logService.error(ex.message);
            throw ex;
        }
    }

    private convertTaskEndDate(task: Task) {
        task.end = new Date(task.end);
    }

    completeTask(task: Task) {
        this.removeTask(task, TaskRemoveOperation.COMPLETE);
    }

    cancelTask(task: Task) {
        this.removeTask(task, TaskRemoveOperation.CANCEL);
    }

    private removeTask(task: Task, operation: TaskRemoveOperation) {
        if (this.isDatabaseReady()) {
            this.databaseService
                .delete(task)
                .subscribe(() => {
                    this.tasks.splice(this.tasks.indexOf(task), 1);
                    this.tasksSubject.next(this.tasks);
                    this.logRemoveTask(task, operation);
                },
                    error => this.logService.error(error));
        }
    }

    private logRemoveTask(task: Task, operation: TaskRemoveOperation) {
        switch (operation) {
            case TaskRemoveOperation.COMPLETE:
                this.logService.success(`'${task.title}' is completed.`);
                break;

            case TaskRemoveOperation.CANCEL:
                this.logService.error(`'${task.title}' has been canceled.`);
                break;
        }
    }

    private isDatabaseReady(): boolean {
        if (!this.databaseReady) {
            this.logService.error(`The database isn't ready yet, try again later.`);
        }

        return this.databaseReady;
    }

    getTasksSubject() {
        return this.tasksSubject;
    }
}
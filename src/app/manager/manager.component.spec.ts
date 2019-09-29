import { TestBed, async } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ManagerComponent } from './manager.component';
import { Task } from '../task/task.model';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from '../task/task.component';

describe('ManagerComponent', () => {
    let fixture = null;
    let app = null;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ManagerComponent,
                TaskComponent
            ],
            imports: [
                NgbModule,
                ReactiveFormsModule
            ]
        }).compileComponents();

        jasmine.clock().mockDate(new Date('2019-09-28 01:00:00'));

        fixture = TestBed.createComponent(ManagerComponent);
        app = fixture.debugElement.componentInstance;

        spyOn(app.managerFacade, 'getTasksSubject').and.returnValue(of(getTasks()));
        spyOn(app.managerFacade, 'init');

        app.ngOnInit();
    }));

    function getTasks(): Task[] {
        const tasks = [];

        const task1 = new Task();
        task1.title = 'Firtst task';
        task1.description = 'This is a simple task'
        task1.start = new Date('2019-09-28 01:00:00');
        task1.start = new Date('2019-09-28 05:00:00');
        task1.progress = 0;
        tasks.push(task1);

        const task2 = new Task();
        task2.title = 'Second task';
        task2.description = 'This is a simple task'
        task2.start = new Date('2019-09-28 01:00:00');
        task2.start = new Date('2019-09-28 10:00:00');
        task2.progress = 0;
        tasks.push(task2);

        return tasks;
    }

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should add task', () => {
        const task = {
            'title': 'New task',
            'description': '',
            'start': new Date('2019-09-28 01:30:00'),
            'end': '2019-09-28 06:00:00',
            'progress': 0
        };

        spyOn(app.managerFacade, 'createTask').and.callFake(function () {
            const newTask = Object.assign(new Task(), task);
            app.tasks.push(newTask);
        });

        app.taskForm.setValue(task);
        app.createTask();
        expect(app.tasks.length).toEqual(3);
    });

    it('should reset form', () => {
        const task = {
            'title': 'New task',
            'description': '',
            'start': new Date('2019-09-28 01:30:00'),
            'end': '2019-09-28 06:00:00',
            'progress': 0
        };

        app.taskForm.setValue(task);
        app.taskFormReset();
        expect(app.taskForm.value).toEqual({
            'title': null,
            'description': null,
            'start': new Date('2019-09-28 01:00:00'),
            'end': null,
            'progress': 0
        });
    });

    it('should complete task when confirm dialog', () => {
        const task = {
            'title': 'First task',
            'description': 'This is a simple task',
            'start': new Date('2019-09-28 01:00:00'),
            'end': '2019-09-28 05:00:00',
            'progress': 0
        };

        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(app.managerFacade, 'completeTask').and.callFake(function () {
            app.tasks.splice(app.tasks.indexOf(task), 1);
        });

        app.completeTask(task);
        expect(app.tasks.length).toEqual(1);
    });

    it('should not complete task when cancel dialog', () => {
        const task = {
            'title': 'First task',
            'description': 'This is a simple task',
            'start': new Date('2019-09-28 01:00:00'),
            'end': '2019-09-28 05:00:00',
            'progress': 0
        };

        spyOn(window, 'confirm').and.returnValue(false);

        app.completeTask(task);
        expect(app.tasks.length).toEqual(2);
    });

    it('should cancel task when confirm dialog', () => {
        const task = {
            'title': 'First task',
            'description': 'This is a simple task',
            'start': new Date('2019-09-28 01:00:00'),
            'end': '2019-09-28 05:00:00',
            'progress': 0
        };

        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(app.managerFacade, 'cancelTask').and.callFake(function () {
            app.tasks.splice(app.tasks.indexOf(task), 1);
        });

        app.cancelTask(task);
        expect(app.tasks.length).toEqual(1);
    });

    it('should not cancel task when cancel dialog', () => {
        const task = {
            'title': 'First task',
            'description': 'This is a simple task',
            'start': new Date('2019-09-28 01:00:00'),
            'end': '2019-09-28 05:00:00',
            'progress': 0
        };

        spyOn(window, 'confirm').and.returnValue(false);

        app.cancelTask(task);
        expect(app.tasks.length).toEqual(2);
    });

    it('should not return error for title', () => {
        app.taskForm.controls.title.setValue('Simple task');
        expect(app.titleHaveErrors()).toBeFalsy();
        expect(app.mustShowTitleRequiredError()).toBeFalsy();
    });

    it('should return error for empty title', () => {
        app.taskForm.controls.title.markAsTouched();
        app.taskForm.controls.title.setValue('');
        expect(app.titleHaveErrors()).toBeTruthy();
        expect(app.mustShowTitleRequiredError()).toBeTruthy();
    });

    it('should return error for whitespace title', () => {
        app.taskForm.controls.title.markAsTouched();
        app.taskForm.controls.title.setValue('    ');
        expect(app.titleHaveErrors()).toBeTruthy();
        expect(app.mustShowTitleRequiredError()).toBeTruthy();
    });

    it('should not return error for task end', () => {
        app.taskForm.controls.end.setValue('2019-09-28 01:00:00');
        expect(app.endHaveErrors()).toBeFalsy();
        expect(app.mustShowEndRequiredError()).toBeFalsy();
        expect(app.mustShowEndDateInThePastError()).toBeFalsy();
        expect(app.mustShowEndDateIsAbsurdError()).toBeFalsy();
    });

    it('should return error for empty task end', () => {
        app.taskForm.controls.end.markAsTouched();
        app.taskForm.controls.end.setValue('');
        expect(app.endHaveErrors()).toBeTruthy();
        expect(app.mustShowEndRequiredError()).toBeTruthy();
    });

    it('should return error for task end in the past', () => {
        app.taskForm.controls.end.markAsTouched();
        app.taskForm.controls.end.setValue('2019-09-27 23:59:59');
        expect(app.endHaveErrors()).toBeTruthy();
        expect(app.mustShowEndDateInThePastError()).toBeTruthy();
    });

    it('should return error for absurd task end', () => {
        app.taskForm.controls.end.markAsTouched();
        app.taskForm.controls.end.setValue('10000-09-27 00:00:00');
        expect(app.endHaveErrors()).toBeTruthy();
        expect(app.mustShowEndDateIsAbsurdError()).toBeTruthy();
    });
});

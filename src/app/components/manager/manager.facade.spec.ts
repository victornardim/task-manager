import { TestBed, async } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../task/task.model';
import { ManagerFacade } from './manager.facade';
import { LogService } from '../log/log.service';
import { DatabaseService } from '../../core/services/database.service';
import { of } from 'rxjs';


describe('ManagerFacade', () => {
    let facade = null;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],
            imports: [
                NgbModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        jasmine.clock().mockDate(new Date('2019-09-28 01:00:00'));

        facade = new ManagerFacade(new LogService(), new DatabaseService());

        spyOn(facade.databaseService, 'init').and.returnValue(of(null));
        spyOn(facade.databaseService, 'loadAll').and.returnValue(of(getTasks()));
        spyOn(facade, 'startMonitoringProgress');

        facade.init();
    })

    function getTasks(): Task[] {
        const tasks = [];

        const task1 = new Task();
        task1.title = 'First task';
        task1.description = 'This is a simple task'
        task1.start = new Date('2019-09-28 01:00:00');
        task1.end = new Date('2019-09-28 05:00:00');
        task1.progress = 0;
        tasks.push(task1);

        const task2 = new Task();
        task2.title = 'Second task';
        task2.description = 'This is a simple task'
        task2.start = new Date('2019-09-28 01:00:00');
        task2.end = new Date('2019-09-28 10:00:00');
        task2.progress = 0;
        tasks.push(task2);

        return tasks;
    }

    it('should create the facade', () => {
        expect(facade).toBeTruthy();
    });

    it('should create task', () => {
        const task = {
            'title': 'New task',
            'description': '',
            'start': new Date('2019-09-28 01:30:00'),
            'end': '2019-09-28 06:00:00',
            'progress': 0
        };

        spyOn(facade.databaseService, 'insert').and.returnValue(of(null));

        facade.createTask(task);
        expect(facade.tasks.length).toEqual(3);
        expect(facade.tasks[2].end).toEqual(new Date('2019-09-28 06:00:00'));
    });

    it('should not create task when database isn\'t ready', () => {
        const task = {
            'title': 'New task',
            'description': '',
            'start': new Date('2019-09-28 01:30:00'),
            'end': '2019-09-28 06:00:00',
            'progress': 0
        };

        spyOn(facade.logService, 'error').and.callFake(message => {
            expect(message).toEqual(`The database isn't ready yet, try again later.`);
        });

        facade.databaseReady = false;

        facade.createTask(task);
        expect(facade.tasks.length).toEqual(2);
    });

    it('should complete task', () => {
        const task = {
            'title': 'First task',
            'description': 'This is a simple task',
            'start': new Date('2019-09-28 01:00:00'),
            'end': new Date('2019-09-28 05:00:00'),
            'progress': 0
        };

        spyOn(facade.databaseService, 'delete').and.returnValue(of(null));
        spyOn(facade.logService, 'error').and.callFake(message => {
            expect(message).toEqual(`'First task' is completed.`);
        });

        facade.completeTask(task);
        expect(facade.tasks.length).toEqual(1);
    });

    it('should not complete task when database isn\'t ready', () => {
        const task = {
            'title': 'First task',
            'description': 'This is a simple task',
            'start': new Date('2019-09-28 01:00:00'),
            'end': new Date('2019-09-28 05:00:00'),
            'progress': 0
        };

        spyOn(facade.logService, 'error').and.callFake(message => {
            expect(message).toEqual(`The database isn't ready yet, try again later.`);
        });

        facade.databaseReady = false;

        facade.completeTask(task);
        expect(facade.tasks.length).toEqual(2);
    });

    it('should cancel task', () => {
        const task = {
            'title': 'First task',
            'description': 'This is a simple task',
            'start': new Date('2019-09-28 01:00:00'),
            'end': new Date('2019-09-28 05:00:00'),
            'progress': 0
        };

        spyOn(facade.databaseService, 'delete').and.returnValue(of(null));
        spyOn(facade.logService, 'error').and.callFake(message => {
            expect(message).toEqual(`'First task' has been canceled.`);
        });

        facade.cancelTask(task);
        expect(facade.tasks.length).toEqual(1);
    });

    it('should not cancel task when database database isn\'t ready', () => {
        const task = {
            'title': 'First task',
            'description': 'This is a simple task',
            'start': new Date('2019-09-28 01:00:00'),
            'end': new Date('2019-09-28 05:00:00'),
            'progress': 0
        };

        spyOn(facade.logService, 'error').and.callFake(message => {
            expect(message).toEqual(`The database isn't ready yet, try again later.`);
        });

        facade.databaseReady = false;

        facade.cancelTask(task);
        expect(facade.tasks.length).toEqual(2);
    });
});

import { TestBed, async } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskComponent } from './task.component';
import { Task } from './task.model';

describe('TaskComponent', () => {
    let fixture = null;
    let app = null;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskComponent
            ],
            imports: [
                NgbModule
            ]
        }).compileComponents();

        jasmine.clock().mockDate(new Date('2019-09-28 01:00:00'));

        fixture = TestBed.createComponent(TaskComponent);
        app = fixture.debugElement.componentInstance;
        app.task = getTask();
    }));

    function getTask(): Task {
        const task = new Task();

        task.title = 'First task';
        task.description = 'This is a test task';
        task.start = new Date('2019-09-28 01:00:00');
        task.end = new Date('2019-09-28 05:00:00');
        task.progress = 0;

        return task;
    }

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should validate task', () => {
        expect(app.task.validate()).toBeUndefined();
    });

    it('should not validate task because title is empty', () => {
        app.task.title = '';
        expect(function () {
            app.task.validate()
        }).toThrow(new Error('Title is required.'));
    });

    it('should not validate task because end is empty', () => {
        app.task.end = '';
        expect(function () {
            app.task.validate()
        }).toThrow(new Error('Task end is required.'));
    });

    it('should not validate task because end is in the past', () => {
        app.task.end = new Date('2019-09-28 00:00:00');
        expect(function () {
            app.task.validate()
        }).toThrow(new Error('Task end can\'t be in the past.'));
    });

    it('should do progress', () => {
        jasmine.clock().mockDate(new Date('2019-09-28 03:30:00'));

        app.task.doProgress();
        expect(app.task.getProgress()).toEqual('62.50');
    });

    it('should return progress', () => {
        app.task.progress = 41.256589;
        expect(app.task.getProgress()).toEqual('41.26');
    });

    it('should return start display', () => {
        expect(app.task.getStartDisplay()).toEqual('28/09/2019 01:00:00');
    });

    it('should return end display', () => {
        expect(app.task.getEndDisplay()).toEqual('28/09/2019 05:00:00');
    });

    it('should return period display', () => {
        expect(app.task.getPeriodDisplay()).toEqual('28/09/2019 01:00:00 - 28/09/2019 05:00:00');
    });
});

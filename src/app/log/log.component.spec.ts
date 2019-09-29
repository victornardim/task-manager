import { TestBed, async } from '@angular/core/testing';
import { LogComponent } from './log.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Log } from './log.interface';
import { LogType } from './log.enum';
import { of } from 'rxjs';

describe('LogComponent', () => {
    let fixture = null;
    let app = null;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LogComponent
            ],
            imports: [
                NgbModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LogComponent);
        app = fixture.debugElement.componentInstance;

        spyOn(app.logService, 'getLogsSubject').and.returnValue(of(getLogs()));

        app.ngOnInit();
    }));

    function getLogs(): Log[] {
        return [
            {
                'message': 'Simple log message',
                'time': new Date('2019-09-28 01:00:00'),
                'type': LogType.INFO
            },
            {
                'message': 'Error',
                'time': new Date('2019-09-28 02:00:00'),
                'type': LogType.DANGER
            }] as Log[];
    }

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should close one log', () => {
        app.close({
            'message': 'Simple log message',
            'time': new Date('2019-09-28 01:00:00'),
            'type': LogType.INFO
        });
        expect(app.logs.length).toEqual(1);
    });

    it('should clear all logs when confirm the dialog', () => {
        spyOn(window, 'confirm').and.returnValue(true);

        app = fixture.debugElement.componentInstance;
        app.clearAll();
        expect(app.logs.length).toEqual(0);
    });

    it('should not clear all logs when cancel the dialog', () => {
        spyOn(window, 'confirm').and.returnValue(false);

        app = fixture.debugElement.componentInstance;
        app.clearAll();
        expect(app.logs.length).toEqual(2);
    });
});

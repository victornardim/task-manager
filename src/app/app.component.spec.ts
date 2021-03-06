import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LogComponent } from './components/log/log.component';
import { TaskComponent } from './components/task/task.component';
import { ManagerComponent } from './components/manager/manager.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LogComponent,
        TaskComponent,
        ManagerComponent
      ],
      imports: [
        NgbModule,
        ReactiveFormsModule,
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});

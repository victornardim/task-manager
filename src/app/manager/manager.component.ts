import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagerFacade } from './manager.facade';
import { Task } from '../task/task.model';
import { Subscription } from 'rxjs';
import { dateInThePastValidator } from '../shared/validators/date-in-the-past.validator';
import { justWhitespaceValidator } from '../shared/validators/just-whitespace.validator';

@Component({
    selector: 'tm-manager',
    templateUrl: './manager.component.html'
})
export class ManagerComponent implements OnInit, OnDestroy {
    taskForm: FormGroup;
    tasksForm: FormGroup;

    tasks: Task[];
    tasksSubscription: Subscription;

    @ViewChild('inputTitle') inputTitle: ElementRef<HTMLInputElement>;

    constructor(
        private managerFacade: ManagerFacade,
        private formBuilder: FormBuilder,
        private modalService: NgbModal) { }

    ngOnInit() {
        this.formInit();
        this.managerFacade.init();
        this.tasks = [];

        this.listenToTaskCreate();
    }

    ngOnDestroy(): void {
        this.managerFacade.destroy();

        if (!this.tasksSubscription.closed) {
            this.tasksSubscription.unsubscribe();
        }
    }

    formInit() {
        this.taskForm = this.formBuilder.group({
            'title': ['', [Validators.required, justWhitespaceValidator]],
            'description': [''],
            'start': [new Date(), [Validators.required]],
            'end': ['', [Validators.required, dateInThePastValidator]],
            'progress': [0]
        });
    }

    private listenToTaskCreate() {
        this.tasksSubscription = this.managerFacade
            .getTasksSubject()
            .subscribe(tasks => {
                this.tasks = tasks;
            });
    }

    createTask() {
        try {
            this.managerFacade.createTask(this.getTaskFromForm());
            this.closeTaskCreateForm();
            this.taskFormReset();
        } catch (ex) {
            // This catch statement is empty beacuse the exception is 
            // thrown to this layer just to prevent the modal from closing
        }
    }

    private taskFormReset() {
        this.taskForm.controls.title.reset();
        this.taskForm.controls.description.reset();
        this.taskForm.controls.start.setValue(new Date());
        this.taskForm.controls.end.reset();
    }

    private getTaskFromForm(): Task {
        return this.taskForm.value;
    }

    openTaskCreateForm(content) {
        this.taskFormReset();
        this.modalService.open(content);
    }

    closeTaskCreateForm() {
        this.modalService.dismissAll();
    }

    completeTask(task: Task) {
        if (confirm(`Do you really want to complete '${task.title}'?\nThis operation is irreversible.`)) {
            this.managerFacade.completeTask(task);
        }
    }

    cancelTask(task: Task) {
        if (confirm(`Do you really want to cancel '${task.title}'?\nThis operation is irreversible.`)) {
            this.managerFacade.cancelTask(task);
        }
    }

    get title(): AbstractControl {
        return this.taskForm.controls.title;
    }

    get description(): AbstractControl {
        return this.taskForm.controls.description;
    }

    get end(): AbstractControl {
        return this.taskForm.controls.end;
    }
}
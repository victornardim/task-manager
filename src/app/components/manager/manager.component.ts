import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagerFacade } from './manager.facade';
import { Task } from '../task/task.model';
import { Subscription } from 'rxjs';
import { dateInThePastValidator } from '../../shared/validators/date-in-the-past.validator';
import { justWhitespaceValidator } from '../../shared/validators/just-whitespace.validator';
import { dateIsAbsurdValidator } from '../../shared/validators/date-is-absurd.validator';

@Component({
    selector: 'tm-manager',
    templateUrl: './manager.component.html'
})
export class ManagerComponent implements OnInit, OnDestroy {
    taskForm: FormGroup;

    tasks: Task[];
    tasksSubscription: Subscription;

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

        if (this.tasksSubscription && !this.tasksSubscription.closed) {
            this.tasksSubscription.unsubscribe();
        }
    }

    formInit() {
        this.taskForm = this.formBuilder.group({
            'title': [null, [Validators.required, justWhitespaceValidator]],
            'description': [null],
            'end': [null, [Validators.required, dateInThePastValidator, dateIsAbsurdValidator]]
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
            this.taskForm.reset();
        } catch (ex) {
            // This catch statement is empty beacuse the exception is 
            // thrown to this layer just to prevent the modal from closing
        }
    }

    private getTaskFromForm(): Task {
        return this.taskForm.value;
    }

    openTaskCreateForm(content) {
        this.taskForm.reset();
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

    mustShowTitleRequiredError(): boolean {
        return (this.titleHaveErrors() && (this.title.errors.required || this.title.errors.justWhitespace));
    }

    titleHaveErrors(): boolean {
        return (this.title.errors && this.title.touched);
    }

    get description(): AbstractControl {
        return this.taskForm.controls.description;
    }

    get end(): AbstractControl {
        return this.taskForm.controls.end;
    }

    mustShowEndRequiredError(): boolean {
        return (this.endHaveErrors() && this.end.errors.required);
    }

    mustShowEndDateInThePastError(): boolean {
        return (this.endHaveErrors() && this.end.errors.dateInThePast);
    }

    mustShowEndDateIsAbsurdError(): boolean {
        return (this.endHaveErrors() && this.end.errors.dateIsAbsurd);
    }

    endHaveErrors(): boolean {
        return (this.end.errors && this.end.touched);
    }
}
import { ITask } from './task.interface';

export class Task implements ITask {
    title: string;
    description: string;
    start: Date;
    end: Date;
    progress: number;

    constructor() {
        this.start = new Date();
        this.progress = 0;
    }

    doProgress() {
        const now = new Date();
        const onePercent = (this.end.getTime() - this.start.getTime()) / 100;
        this.progress = ((now.getTime() - this.start.getTime()) / onePercent);
    }

    isFinished(): boolean {
        return (this.progress >= 100);
    }

    getProgress(): string {
        return this.progress.toFixed(2);
    }

    getStartDisplay(): string {
        return this.start.toLocaleString();
    }

    getEndDisplay(): string {
        return this.end.toLocaleString();
    }

    getPeriodDisplay(): string {
        return `${this.getStartDisplay()} - ${this.getEndDisplay()}`;
    }

    validate() {
        const now = new Date();

        if (!this.title) {
            throw new Error('Title is required.');
        }

        if (!this.end) {
            throw new Error('Task end is required.');
        }

        if (this.end < now) {
            throw new Error('Task end can\'t be in the past.');
        }

        if (this.end > new Date('9999-12-31 23:59:59')) {
            throw new Error('Task end can\'t be further than 31/12/9999 23:59:59.');
        }
    }
}

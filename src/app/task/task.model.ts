export class Task {
    title: string;
    description: string;
    start: Date;
    end: Date;
    progress: number;

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
    }
}
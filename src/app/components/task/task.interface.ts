export interface ITask {
    title: string;
    description: string;
    start: Date;

    validate();
}
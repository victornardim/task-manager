import { LogType } from './log.enum';

export interface Log {
    message: string;
    time: Date;
    type: LogType;
}
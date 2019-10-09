import { Index } from './index.model';

export class ObjectStore {
    name: string;
    keyPath: string | string[];
    autoIncrement: boolean;
    indexes: Index[];
}

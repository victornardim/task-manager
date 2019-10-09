import { ObjectStore } from './object-store.model';

export class Database {
    name: string;
    version: number;
    objectStores: ObjectStore[];
}

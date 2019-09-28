import { Injectable } from '@angular/core';
import { Task } from 'src/app/task/task.model';
import { from, Observable } from 'rxjs';

const DATABASE_NAME = 'task_manager';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'tasks';

@Injectable({
    'providedIn': 'root'
})
export class DatabaseService {
    request: IDBOpenDBRequest;
    database: IDBDatabase;

    constructor() { }

    init() {
        const self = this;

        return from(new Promise((resolve, reject) => {
            this.request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
            this.request.onerror = function () {
                reject(this.error.message);
            };

            this.request.onupgradeneeded = function () {
                self.createDatabase(this);
                self.database = this.result;
            }

            this.request.onsuccess = function () {
                self.database = this.result;
                resolve(null);
            }
        }));
    }

    private createDatabase(database: IDBOpenDBRequest) {
        const objectStore = database.result.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'start' });
        objectStore.createIndex("start", "start", { unique: true });
        objectStore.createIndex("end", "end", { unique: false });
    }

    insert(task: Task) {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([OBJECT_STORE_NAME], 'readwrite');

            transaction.onerror = function () {
                reject(this.error.message);
            }

            const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
            const request = objectStore.add(task);

            request.onsuccess = function () {
                resolve(null);
            }

            request.onerror = function () {
                reject(this.error.message);
            }
        }));
    }

    loadAll(): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([OBJECT_STORE_NAME]);

            transaction.onerror = function () {
                reject(this.error.message);
            }

            const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
            const request = objectStore.getAll();

            request.onsuccess = function () {
                resolve(this.result);
            }

            request.onerror = function () {
                reject(this.error.message);
            }
        }));
    }

    delete(task: Task): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([OBJECT_STORE_NAME], 'readwrite');

            transaction.onerror = function () {
                reject(this.error.message);
            }

            const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
            const request = objectStore.delete(task.start);

            request.onsuccess = function () {
                resolve(null);
            }

            request.onerror = function () {
                reject(this.error.message);
            }
        }));
    }
}
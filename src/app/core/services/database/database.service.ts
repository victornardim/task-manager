import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Database } from './model/database.model';
import databaseSetupObject from './database.json';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private databaseSettings: Database;
    private database: IDBDatabase;

    constructor() { }

    getDatabaseSetupObject(): Database {
        return databaseSetupObject;
    }

    setup(database: Database): void {
        this.databaseSettings = database;
    }

    init(): Observable<any> {
        const self = this;

        return from(new Promise((resolve, reject) => {
            const request = indexedDB.open(this.databaseSettings.name, this.databaseSettings.version);
            request.onerror = function() {
                reject(this.error.message);
            };

            request.onupgradeneeded = function() {
                self.createDatabase(this, self.databaseSettings);
                self.database = this.result;
            };

            request.onsuccess = function() {
                self.database = this.result;
                resolve(null);
            };
        }));
    }

    private createDatabase(database: IDBOpenDBRequest, databaseSettings: Database) {
        databaseSettings.objectStores.forEach(objectStore => {
            const createdStore = database.result.createObjectStore(objectStore.name, {
                keyPath: objectStore.keyPath,
                autoIncrement: objectStore.autoIncrement
            });

            objectStore.indexes.forEach(index => {
                createdStore.createIndex(index.name, index.keyPath, { unique: index.unique });
            });
        });
    }

    insert(storeName: string, object: object): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([storeName], 'readwrite');
            transaction.onerror = function() {
                reject(this.error.message);
            };

            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.add(object);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(this.error.message);
            };
        }));
    }

    load(storeName: string, key: any): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([storeName]);
            transaction.onerror = function() {
                reject(this.error.message);
            };

            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.get(key);
            request.onsuccess = function() {
                resolve(this.result);
            };

            request.onerror = function() {
                reject(this.error.message);
            };
        }));
    }

    loadByIndex(storeName: string, indexName: string, key: any): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([storeName]);
            transaction.onerror = function() {
                reject(this.error.message);
            };

            const objectStore = transaction.objectStore(storeName);
            const index = objectStore.index(indexName);
            const request = index.get(key);
            request.onsuccess = function() {
                resolve(this.result);
            };

            request.onerror = function() {
                reject(this.error.message);
            };
        }));
    }

    loadAll(storeName: string): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([storeName]);
            transaction.onerror = function() {
                reject(this.error.message);
            };

            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.getAll();
            request.onsuccess = function() {
                resolve(this.result);
            };

            request.onerror = function() {
                reject(this.error.message);
            };
        }));
    }

    update(storeName: string, key: any, object: object): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([storeName], 'readwrite');
            transaction.onerror = function() {
                reject(this.error.message);
            };

            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.get(key);
            request.onsuccess = () => {
                const data = request.result;

                Object.assign(data, object);

                const requestUpdate = objectStore.put(data);
                requestUpdate.onerror = function() {
                    reject(this.error.message);
                };

                requestUpdate.onsuccess = () => {
                    resolve(null);
                };
            };

            request.onerror = function() {
                reject(this.error.message);
            };
        }));
    }

    updateByIndex(storeName: string, indexName: string, key: any, object: object): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([storeName], 'readwrite');
            transaction.onerror = function() {
                reject(this.error.message);
            };

            const objectStore = transaction.objectStore(storeName);
            const index = objectStore.index(indexName);
            const request = index.get(key);
            request.onsuccess = () => {
                const data = request.result;

                Object.assign(data, object);

                const requestUpdate = objectStore.put(data);
                requestUpdate.onerror = function() {
                    reject(this.error.message);
                };

                requestUpdate.onsuccess = () => {
                    resolve(null);
                };
            };

            request.onerror = function() {
                reject(this.error.message);
            };
        }));
    }

    delete(storeName: string, key: any): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const transaction = this.database.transaction([storeName], 'readwrite');
            transaction.onerror = function() {
                reject(this.error.message);
            };

            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.delete(key);
            request.onsuccess = () => {
                resolve(null);
            };

            request.onerror = function() {
                reject(this.error.message);
            };
        }));
    }

    deleteDatabase(): Observable<any> {
        return from(new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(this.databaseSettings.name);
            request.onerror = function() {
                reject(this.error.message);
            };

            request.onsuccess = () => {
                resolve(null);
            };

            request.onblocked = function() {
                reject(this.error.message);
            };
        }));
    }
}

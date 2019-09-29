import { AbstractControl } from '@angular/forms';

export function dateIsAbsurdValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const limitDate = new Date('9999-12-31 23:59:59');
    const inputDate = new Date(control.value);
    if (isNaN(inputDate.getTime()) || inputDate > limitDate) {
        return { dateIsAbsurd: true };
    }

    return null;
}
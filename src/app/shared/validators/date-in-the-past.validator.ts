import { AbstractControl } from '@angular/forms';

export function dateInThePastValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const now = new Date();
    if (new Date(control.value) < now) {
        return { dateInThePast: true };
    }

    return null;
}
import { AbstractControl } from '@angular/forms';

export function justWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value || !control.value.trim()) {
        return { justWhitespace: true };
    }

    return null;
}
import { Directive } from '@angular/core';
import {
  AbstractControl,
  ValidatorFn,
  Validator,
  FormControl,
  NG_VALIDATORS
} from '@angular/forms';

function validatePassword(): ValidatorFn {
  return (c: AbstractControl) => {
    let isValid = false;
    if (c.value) {
      let hasUpperCase = c.value.match(/[A-Z]/);
      let hasLowerCase = c.value.match(/[a-z]/);
      let hasNumber = c.value.match(/[0-9]/);
      let is6CharsLong = c.value.length > 5;
      if (hasUpperCase && hasLowerCase && hasNumber && is6CharsLong) {
        isValid = true;
      }
    }

    if (isValid) {
      return null;
    } else {
      return {
        passInvalid: {
          valid: false
        }
      };
    }
  };
}

@Directive({
  selector: '[passwd][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CheckPasswordDirective, multi: true }]
})
export class CheckPasswordDirective implements Validator {
  validator: ValidatorFn;
  constructor() {
    this.validator = validatePassword();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}

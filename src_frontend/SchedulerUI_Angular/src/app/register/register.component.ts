import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { NgForm, ValidatorFn, Validator, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(protected authService: AuthService,
              private toastr: ToastrService,
              private fb: FormBuilder) { }

  newPhoneControl: AbstractControl;

  ngOnInit() {

    this.authService.registerReactiveForm = this.fb.group({
      username: ['', Validators.required],
      useremail: ['', Validators.email],
      phones: this.fb.array([
        ['', this.phoneValidator()]
      ]),
      address: this.fb.group({
        country: [''],
        city: ['']
      }),
      passwords: this.fb.group({
        password: ['',  [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['',  Validators.required]
      },
        { validator: this.passwordsAreEqual() })
    });

    this.authService.registerReactiveForm.valueChanges.subscribe((data) => {
      this.authService.logValidationErrors(this.authService.registerReactiveForm);
    });
  }

  addPhone(): void {
    this.newPhoneControl = this.fb.control(['']);
    this.newPhoneControl.setValidators(this.phoneValidator());
    ((this.authService.registerReactiveForm.controls.phones) as FormArray).push(this.newPhoneControl);
  }

  private phoneValidator(): ValidatorFn {
    const pattern: RegExp = /^\+?(\d{2})?\d{3}[-]?\d{3}[-]?\d{2}[-]?\d{2}$/;
    return (control: FormControl): { [key: string]: any } => {
      if (!(control.dirty || control.touched)) {
        return null;
      } else {
        return pattern.test(control.value) ? null : { phoneValidator: true };
      }
    }
  }

  private passwordsAreEqual(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      if (!(group.dirty || group.touched) || group.get('password').value === group.get('confirmPassword').value) {
        return null;
      }
      return {
        passwordsAreEqual: true
      };
    }
  }

  register() {
    return this.authService.register().subscribe(() => {
      this.toastr.success('Registration successful', 'User Added');
      this.authService.registerReactiveForm.reset();
    }, (error) => {
      this.toastr.warning(error, 'User not registred');
    });
  }
}

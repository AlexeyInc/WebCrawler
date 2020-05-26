import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt'; 
import { User } from 'src/app/shared/models/user.model';
import { FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly rootURL = 'https://localhost:44337/api/auth/';

  jwtHelper = new JwtHelperService();
  decodedToken: any;
  id: any;
  userModel: User;

  // @Output() authMode: EventEmitter<any> = new EventEmitter();

  registerReactiveForm: FormGroup;

  formsErrors = {
    username: '',
    useremail: '',
    phones: '',
    password: '',
    confirmPassword: '',
    passwords: ''
  };

  validationMessages = {
    username: {
      required: 'Username is required'
    },
    useremail: {
      email: 'Invalid email'
    },
    phones: {
      phoneValidator: 'Fulfill pattern "+38-000-000-00-00',
    },
    password: {
      required: 'Password is required',
      minlength: 'Min length password 3'
    },
    confirmPassword: {
      required: 'Confirm password is required'
    },
    passwords: {
      passwordsAreEqual: 'Passwords must be the same'
    }
  };

  constructor(private http: HttpClient) { }

  logValidationErrors(group: FormGroup = this.registerReactiveForm): void {
    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);

      this.formsErrors[key] = '';
      if (control && !control.valid && (control.touched || control.dirty)) {
        const message = this.validationMessages[key];
        for (const errorKey in control.errors) {
          if (errorKey) {
            this.formsErrors[key] += message[errorKey];
          }
        }

        if (control instanceof FormGroup) {
          this.logValidationErrors(control);
        }

        if (control instanceof FormArray) {
          for (const arrControl of control.controls) {
            if (arrControl) {
              const msg = this.validationMessages[key];

              for (const errorKey in arrControl.errors) {
                if (errorKey) {
                  this.formsErrors[key] += msg[errorKey];
                }
              }
            }
          }
        }
      }
    });
  }

  login(model: any) {
    return this.http.post(this.rootURL + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);

            this.decodedToken = this.jwtHelper.decodeToken(user.token);
          }
        })
    );
  }

  register(): any {
    this.userModel = {
      Username: this.registerReactiveForm.get('username').value,
      Password: this.registerReactiveForm.get('passwords').get('password').value
    }
    return this.http.post(this.rootURL + 'register', this.userModel);
  }

  loggetIn(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  onLogout(): void {
    localStorage.removeItem('token');
  }

  getUserId(): any {
    return this.decodedToken.nameid;
  }
}

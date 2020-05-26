import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  loginReactiveForm: FormGroup;

  loginFieldsvalidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(3)
  ];

  constructor(protected authService: AuthService,
              private toastr: ToastrService,
              private router: Router,
              private fb: FormBuilder
              ) { }

  ngOnInit() {
    this.loginReactiveForm = this.fb.group({
      username: ['', this.loginFieldsvalidators],
      password: ['', this.loginFieldsvalidators]
    });
  }

  login() {
    this.authService.login(this.loginReactiveForm.value).subscribe(next => {
      this.toastr.success('Logged in successfully', 'User authorized');
      this.loginReactiveForm.reset();
      this.router.navigate(['/tasks']);
    }, (error) => {
      this.toastr.error('Please register', 'User unauthorized');
    });
  }

  loggedIn() {
    return this.authService.loggetIn();
  }

  logout() {
    this.router.navigate(['/register']);
    this.authService.onLogout();
    this.toastr.info('Logget out', 'Message');
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskDetailComponent } from './task-details/task-detail/task-detail.component';
import { TaskDetailListComponent } from './task-details/task-detail-list/task-detail-list.component';
import { TaskDetailService } from './services/task-detail.service';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './services/auth/auth.service';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './shared/error.interceptor';
import { AppRoutingModule } from './shared/app-routing.module';
import { ConfirmEqualValidatorDirective } from './shared/confirm-equal-validator.directive';
import { ExecutedTasksListComponent } from './executed-tasks-list/executed-tasks-list.component';


export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      TaskDetailsComponent,
      TaskDetailComponent,
      TaskDetailListComponent,
      NavComponent,
      RegisterComponent,
      ConfirmEqualValidatorDirective,
      ExecutedTasksListComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot(),
      BsDropdownModule.forRoot(),
      AppRoutingModule,
      ReactiveFormsModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:44337'],
            blacklistedRoutes: ['localhost:44337/api/auth']
         }
      })
   ],
   providers: [
      TaskDetailService,
      AuthService,
      ErrorInterceptorProvider
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { TaskDetail } from '../shared/models/task-detail.model';
import { AuthService } from './auth/auth.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailService {

  readonly rootURL = "https://localhost:44337/api/";

  taskReactiveForm: FormGroup;
  list: TaskDetail[];
  submitButtonName: string;

  formsErrors = {
    TargetSite: '',
    XPath: '',
    TimeStart: '',
    ExecuteFrequency: ''
  };

  validationMessages = {
    TargetSite: {
      required: 'Site link is required',
      minlength: 'Min link length 3 characters',
      maxlength: 'Max link length 200 characters',
    },
    XPath: {
      required: 'XPath is required',
      minlength: 'Min XPath length 3 characters',
      maxlength: 'Max XPath length 200 characters',
    },
    TimeStart: {
      required: 'TimeStart is required',
    },
    ExecuteFrequency: {
      pattern: 'Fulfill pattern "hh:mm:ss"'
    }
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  logValidationErrors(group: FormGroup = this.taskReactiveForm): void {
    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      this.formsErrors[key] = '';

      if (control && !control.valid && control.touched) {
        const message = this.validationMessages[key];

        for (const errorKey in control.errors) {
          if (errorKey) {
            this.formsErrors[key] += message[errorKey];
          }
        }
      }
    });
  }

  validateProperty(key: string): boolean {
    const property = this.taskReactiveForm.get(key);
    return property.valid && (property.touched || property.dirty);
  }

  postTaskDetail() {
    this.taskReactiveForm.value.UserId = this.authService.getUserId();
    return this.http.post(this.rootURL + 'tasks', this.taskReactiveForm.value);
  }

  putTaskDetail() {
    return this.http.put(this.rootURL + 'tasks/' + this.taskReactiveForm.value.Id,
      this.taskReactiveForm.value,
      );
  }

  deleteTaskDetail(id) {
    return this.http.delete(this.rootURL + 'tasks/' + id);
  }

  refreshList() {
    this.http.get(this.rootURL + 'tasks/user/' + this.authService.getUserId())
      .toPromise()
      .then(res => this.list = res as unknown as TaskDetail[]);
  }

  populateReactiveForm(taskDetail: TaskDetail) {
    this.taskReactiveForm.setValue({
      Id: taskDetail.Id,
      TargetSite: taskDetail.TargetSite,
      XPath: taskDetail.XPath,
      TimeStart: taskDetail.TimeStart,
      toggleExecuteFrequency: taskDetail.ExecuteFrequency == null,
      ExecuteFrequency: taskDetail.ExecuteFrequency,
      UserId: taskDetail.UserId
    });
    this.submitButtonName = 'Update task';
  }
}

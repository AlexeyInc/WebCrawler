import { Component, OnInit } from '@angular/core';
import { TaskDetailService } from 'src/app/services/task-detail.service';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styles: []
})
export class TaskDetailComponent implements OnInit {

  executeFrequencyActive: boolean;

  constructor(protected service: TaskDetailService,
              private toastr: ToastrService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.service.taskReactiveForm = this.fb.group({
      Id: [0],
      TargetSite: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(200)
      ]],
      XPath: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(200)
      ]],
      TimeStart: ['', Validators.required],
      toggleExecuteFrequency: false,
      ExecuteFrequency: [null, [
        Validators.pattern('^(((([01]\\d)|(2[0-3])):[0-5]\\d:[0-5]\\d)|(24:00:00))$')
      ]],
      UserId: [0]
    });

    this.resetReactiveForm();

    this.service.taskReactiveForm.valueChanges.subscribe((data) => {
      this.service.logValidationErrors(this.service.taskReactiveForm);
    });
  }

  resetReactiveForm() {
    this.service.taskReactiveForm.reset();
    this.service.taskReactiveForm.get('Id').setValue(0);
    this.service.taskReactiveForm.get('toggleExecuteFrequency').setValue(false);
    this.service.taskReactiveForm.get('ExecuteFrequency').disable();
    this.service.taskReactiveForm.markAsUntouched();

    this.service.submitButtonName = 'Add task';
  }

  changeExecuteFrequencyMode() {
    if (this.executeFrequencyActive) {
      this.service.taskReactiveForm.get('ExecuteFrequency').disable();
      this.executeFrequencyActive = !this.executeFrequencyActive;
    } else {
      this.service.taskReactiveForm.get('ExecuteFrequency').enable();
      this.executeFrequencyActive = !this.executeFrequencyActive;
    }

    this.service.taskReactiveForm.value.toggleExecuteFrequency = this.executeFrequencyActive;
  }

  onReactiveSubmit() {
    if (!this.service.taskReactiveForm.valid) {
      this.toastr.error('Validation error');
      return;
    }
    if (this.service.taskReactiveForm.value.Id === 0) {
      this.insertReactiveRecord();
    } else {
      this.updateReactiveRecord();
    }
  }

  insertReactiveRecord() {
    this.service.postTaskDetail().subscribe(
      res => {
        this.resetReactiveForm();
        this.toastr.success('Submitted successfully', 'Task added');
        this.service.refreshList();
      },
      err => {
        console.log(err);
      }
    )
  }

  updateReactiveRecord() {
    this.service.putTaskDetail().subscribe(
      res => {
        this.resetReactiveForm();
        this.toastr.info('Submitted successfully', 'Task updated');
        this.service.refreshList();
      },
      err => {
        console.log(err);
      }
    )
  }
}

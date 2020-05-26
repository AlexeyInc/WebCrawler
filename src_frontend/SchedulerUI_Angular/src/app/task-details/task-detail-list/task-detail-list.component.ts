import { Component, OnInit } from '@angular/core';
import { TaskDetailService } from 'src/app/services/task-detail.service';
import { TaskDetail } from 'src/app/shared/models/task-detail.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-detail-list',
  templateUrl: './task-detail-list.component.html',
  styles: []
})
export class TaskDetailListComponent implements OnInit {

  constructor(protected taskService: TaskDetailService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.taskService.refreshList();
  }

  populateForm(taskItem: TaskDetail) {
    this.taskService.populateReactiveForm(taskItem);
  }

  onDelete(id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.taskService.deleteTaskDetail(id)
        .subscribe(res => {
          this.taskService.refreshList();
          this.toastr.warning('Deleted successfully', 'Task removed');
        },
          err => {
            console.log(err);
          })
    }
  }
}

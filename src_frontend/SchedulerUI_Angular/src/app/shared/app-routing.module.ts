import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from 'src/app/register/register.component';
import { TaskDetailsComponent } from 'src/app/task-details/task-details.component';
import { AuthGuard } from '../services/auth/auth.guard';
import { ExecutedTasksListComponent } from '../executed-tasks-list/executed-tasks-list.component';

const appRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TaskDetailsComponent, canActivate: [AuthGuard]  },
  { path: 'executedTasks', component: ExecutedTasksListComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: 'register', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

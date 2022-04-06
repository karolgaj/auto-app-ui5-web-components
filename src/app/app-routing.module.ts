import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TbrEmptyStateComponent } from './components/tbr-empty-state';
import { TbrDetailsComponent } from './components/tbr-details';
import { ThuDetailsComponent } from './components/thu-details';
import { TbrNetworkFormComponent } from './components/tbr-network-form';
import { TbrWorkflowComponent } from './components/tbr-workflow/tbr-workflow.component';
import { RoleGuard } from './shared/role.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TbrEmptyStateComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'network',
    component: TbrNetworkFormComponent,
    canActivate: [RoleGuard],
  },
  {
    path: ':shipItId',
    component: TbrDetailsComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'workflow/:shipItId',
    component: TbrWorkflowComponent,
    canActivate: [RoleGuard],
  },
  {
    path: ':shipItId/:articleNumber',
    component: ThuDetailsComponent,
    canActivate: [RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

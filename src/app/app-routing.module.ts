import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TbrEmptyStateComponent } from './components/tbr-empty-state';
import { TbrDetailsComponent } from './components/tbr-details';
import { ThuDetailsComponent } from './components/thu-details';
import { TbrNetworkFormComponent } from './components/tbr-network-form';
import { TbrWorkflowComponent } from './components/tbr-workflow/tbr-workflow.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TbrEmptyStateComponent,
  },
  {
    path: 'network',
    component: TbrNetworkFormComponent,
  },
  {
    path: ':shipItId',
    component: TbrDetailsComponent,
  },
  {
    path: 'workflow/:shipItId',
    component: TbrWorkflowComponent,
  },
  {
    path: ':shipItId/:articleNumber',
    component: ThuDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

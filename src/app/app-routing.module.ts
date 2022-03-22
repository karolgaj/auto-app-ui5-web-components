import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TbrEmptyStateComponent } from './components/tbr-empty-state/tbr-empty-state.component';
import { TbrDetailsComponent } from './components/tbr-details/tbr-details.component';
import { ThuDetailsComponent } from './components/thu-details/thu-details.component';
import { TbrNetworkFormComponent } from './components/tbr-network-form/tbr-network-form.component';
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

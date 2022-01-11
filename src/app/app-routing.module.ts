import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TbrEmptyStateComponent } from './components/tbr-empty-state/tbr-empty-state.component';
import { TbrDetailsComponent } from './components/tbr-details/tbr-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TbrEmptyStateComponent,
  },
  {
    path: ':shipItId',
    component: TbrDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

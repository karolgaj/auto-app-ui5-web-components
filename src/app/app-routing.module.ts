import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TbrEmptyStateComponent } from './components/tbr-empty-state/tbr-empty-state.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TbrEmptyStateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

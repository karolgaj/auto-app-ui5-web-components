import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TbrDetailsComponent,
  TbrEmptyStateComponent,
  TbrNetworkFormComponent,
  TbrWorkflowComponent,
  ThuDetailsComponent,
} from './components';
import { LayoutComponent } from './ui';
import { AuthenticatedGuard, LoadedExpressGuard } from './shared';
import { WizardSummaryComponent } from './components/tbr-workflow';
import { NetworkResolver } from './core/providers/network.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'xtr',
  },
  {
    path: 'xtr',
    component: LayoutComponent,
    canActivate: [AuthenticatedGuard],
    canActivateChild: [AuthenticatedGuard],
    children: [
      {
        path: '',
        component: TbrEmptyStateComponent,
      },
      {
        path: 'network',
        component: TbrNetworkFormComponent,
        resolve: {
          booking: NetworkResolver,
        },
      },
      {
        path: 'workflow/:shipItId',
        component: TbrWorkflowComponent,
        canActivate: [LoadedExpressGuard],
      },
      {
        path: 'workflow/:shipItId/summary',
        component: WizardSummaryComponent,
        canActivate: [LoadedExpressGuard],
      },

      {
        path: ':shipItId',
        component: TbrDetailsComponent,
        canActivate: [LoadedExpressGuard],
      },
      {
        path: ':shipItId/:releaseLineId',
        component: ThuDetailsComponent,
        canActivate: [LoadedExpressGuard],
      },
    ],
  },
  {
    path: 'health',
    component: TbrEmptyStateComponent,
  },
  {
    path: 'volvooauth/callback',
    component: TbrEmptyStateComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: TbrEmptyStateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

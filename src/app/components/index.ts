import { ThuDetailsComponent } from './thu-details';
import { WORKFLOW_COMPONENTS } from './tbr-workflow';
import { TbrNetworkComponent } from './tbr-network';
import { TbrNetworkFormComponent } from './tbr-network-form';
import { TbrDetailsComponent } from './tbr-details';
import { TbrEmptyStateComponent } from './tbr-empty-state';
import { TbrListComponent } from './tbr-list';

export * from './thu-details';
export * from './tbr-network';
export * from './tbr-network-form';
export * from './tbr-details';
export * from './tbr-empty-state';
export * from './tbr-list';
export * from './tbr-workflow/tbr-workflow.component';

export const COMPONENTS = [
  ...WORKFLOW_COMPONENTS,
  ThuDetailsComponent,
  TbrNetworkComponent,
  TbrNetworkFormComponent,
  TbrDetailsComponent,
  TbrEmptyStateComponent,
  TbrListComponent,
];

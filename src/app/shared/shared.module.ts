import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHasRolesDirective } from './user-has-roles.directive';

@NgModule({
  declarations: [UserHasRolesDirective],
  exports: [UserHasRolesDirective],
  imports: [CommonModule],
})
export class SharedModule {}

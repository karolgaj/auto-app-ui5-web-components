import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRole } from '../models/user.model';
import { selectUserData } from '../state';

@UntilDestroy()
@Directive({
  selector: '[appUserHasRoles]',
})
export class UserHasRolesDirective implements OnInit {
  @Input()
  appUserHasRoles!: UserRole[];
  @Input()
  appUserHasRolesElse?: TemplateRef<unknown>;
  private isVisible = false;
  constructor(private templateRef: TemplateRef<unknown>, private viewContainerRef: ViewContainerRef, private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectUserData)
      .pipe(
        filter((value) => value == null),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.isVisible = false;
        this.viewContainerRef.clear();
      });

    this.store
      .select(selectUserData)
      .pipe(
        filter((value) => value != null),
        map((userData) => userData!.roles),
        untilDestroyed(this)
      )
      .subscribe((roles) => {
        if (roles == null || this.appUserHasRoles == null) {
          this.createSubstituteView();
          return;
        }

        if (this.appUserHasRoles.some((role) => roles.includes(role)) && !this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
          return;
        }

        this.isVisible = false;
        this.createSubstituteView();
      });
  }

  private createSubstituteView(): void {
    if (this.appUserHasRolesElse != null) {
      this.viewContainerRef.createEmbeddedView(this.appUserHasRolesElse);
    }
  }
}

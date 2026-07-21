import { Directive, TemplateRef, ViewContainerRef, inject, input, effect } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { Role } from '../../features/auth/auth.model';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  readonly appHasRole = input.required<Role[]>();

  private hasView = false;

  constructor() {
    effect(() => {
      const allowed = this.authService.hasRole(...this.appHasRole());
      if (allowed && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!allowed && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}

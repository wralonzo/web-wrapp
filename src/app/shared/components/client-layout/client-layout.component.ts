import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '@core/auth/auth.service';
import { UserRole as ROLES } from '@shared/enums/roles/roles.enum';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
    selector: 'app-client-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, ThemeToggleComponent],
    templateUrl: './client-layout.component.html',
    styleUrls: ['./client-layout.component.scss']
})
export class ClientLayoutComponent extends PageConfiguration {
    public override authService = inject(AuthService);
    public readonly ROLES = ROLES;

    profile() {
        this.nav.push('/client/profile');
    }
}

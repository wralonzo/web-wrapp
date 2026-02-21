import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-client-profile',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './client-profile.component.html',
    styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
    public authService = inject(AuthService);
    public user = this.authService.currentUser;

    ngOnInit(): void {
        // Any additional profile fetching if needed
    }

    logout() {
        this.authService.logout();
    }
}

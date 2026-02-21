import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

@Component({
    selector: 'app-auth-selection',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './auth-selection.component.html',
    styleUrls: ['./auth-selection.component.scss']
})
export class AuthSelectionComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    public authMode = signal<'login' | 'register'>('register');
    private serviceId: string | null = null;

    authForm: FormGroup;
    loginForm: FormGroup;

    constructor() {
        this.serviceId = this.route.snapshot.queryParamMap.get('serviceId');

        this.authForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            password: ['Test123456']
        });

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // If already authenticated, redirect to book
        if (this.authService.isAuthenticated()) {
            this.redirectToBooking();
        }
    }

    private redirectToBooking() {
        this.router.navigate(['/client/book'], {
            queryParams: { serviceId: this.serviceId }
        });
    }

    setAuthMode(mode: 'login' | 'register') {
        this.authMode.set(mode);
    }

    async onGoogleLogin() {
        console.log('Google Login initiated...');
        // For demonstration, we simulate success with a mock token
        try {
            await this.authService.loginGoogle('mock-id-token');
            this.redirectToBooking();
        } catch (error) {
            console.error('Google Login error', error);
        }
    }

    async onSubmit() {
        if (this.authMode() === 'register') {
            if (this.authForm.invalid) return;
            try {
                await this.authService.registerClient({
                    auth: {
                        fullName: this.authForm.value.name,
                        email: this.authForm.value.email,
                        phone: this.authForm.value.phone,
                        username: this.authForm.value.email,
                        password: this.authForm.value.password || 'Test123456'
                    },
                    client: { clientType: 'REGULAR' },
                    flagUser: true
                });

                // After registration, we login to get the User object in session
                await this.authService.login(this.authForm.value.email, this.authForm.value.password || 'Test123456');
                this.redirectToBooking();
            } catch (error) {
                console.error('Registration error', error);
                alert('Error al registrar. Inténtalo de nuevo.');
            }
        } else {
            if (this.loginForm.invalid) return;
            try {
                await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
                this.redirectToBooking();
            } catch (error) {
                console.error('Login error', error);
                alert('Credenciales incorrectas.');
            }
        }
    }
}

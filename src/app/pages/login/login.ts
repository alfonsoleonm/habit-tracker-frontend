import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HabitsService } from '../../services/habits';

type Mode = 'signin' | 'signup' | 'confirm';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent {
    private auth = inject(AuthService);
    private habits = inject(HabitsService);
    private router = inject(Router);

    mode = signal<Mode>('signin');
    email = '';
    password = '';
    code = '';
    error = signal<string>('');
    loading = signal<boolean>(false);

    async onSignIn() {
        this.loading.set(true);
        this.error.set('');
        try {
            await this.auth.signIn(this.email, this.password);
            const token = await this.auth.getToken();
            if (token) {
                this.habits.setToken(token);
                this.router.navigate(['/calendar']);
            }
        } catch (e: any) {
            this.error.set(e.message ?? 'Sign in failed');
        }
        this.loading.set(false);
    }

    async onSignUp() {
        this.loading.set(true);
        this.error.set('');
        try {
            await this.auth.signUp(this.email, this.password);
            this.mode.set('confirm');
        } catch (e: any) {
            this.error.set(e.message ?? 'Sign up failed');
        }
        this.loading.set(false);
    }

    async onConfirm() {
        this.loading.set(true);
        this.error.set('');
        try {
            await this.auth.confirmSignUp(this.email, this.code);
            await this.auth.signIn(this.email, this.password);
            const token = await this.auth.getToken();
            if (token) {
                this.habits.setToken(token);
                this.router.navigate(['/calendar']);
            }
        } catch (e: any) {
            this.error.set(e.message ?? 'Confirmation failed');
        }
        this.loading.set(false);
    }
}
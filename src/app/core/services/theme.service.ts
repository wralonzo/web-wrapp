import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'user-theme';
    isDarkMode = signal<boolean>(false);

    constructor() {
        this.initializeTheme();
    }

    toggleTheme() {
        this.isDarkMode.update(dark => !dark);
        console.log('Theme toggled. Mode:', this.isDarkMode() ? 'dark' : 'light');
        this.applyTheme();
        localStorage.setItem(this.THEME_KEY, this.isDarkMode() ? 'dark' : 'light');
    }

    private initializeTheme() {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.isDarkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));
        console.log('Theme initialized. Mode:', this.isDarkMode() ? 'dark' : 'light');
        this.applyTheme();
    }

    private applyTheme() {
        const root = document.documentElement;
        if (this.isDarkMode()) {
            root.classList.add('dark');
            console.log('Class "dark" added to <html>');
        } else {
            root.classList.remove('dark');
            console.log('Class "dark" removed from <html>');
        }
    }
}

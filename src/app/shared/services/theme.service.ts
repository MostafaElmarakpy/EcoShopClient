import { Injectable, effect, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<ThemeMode>(
    localStorage.getItem('eco-shop-theme') === 'dark' ? 'dark' : 'light'
  );

  constructor() {
    effect(() => {
      const mode = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark-mode', mode === 'dark');
        document.documentElement.style.colorScheme = mode;
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('eco-shop-theme', mode);
      }
    });
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LottieComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  public authService = inject(AuthService);

  // Signals para el estado del menú
  public isSidebarCollapsed = signal(true); // Para PC (ancho vs estrecho)
  public isMobileMenuOpen = signal(true); // Para Móvil (escondido vs visible)

  public isCollapsed = signal(true); // Estado del sidebar

  public lottieOptions: AnimationOptions = {
    path: 'assets/lottie/salon-logo.json',
    loop: true,
    autoplay: true,
  };

  public logoOptions: AnimationOptions = {
    path: 'assets/lottie/fashion-logo.json', // Asegúrate de tener el json en assets
    loop: true,
    autoplay: true,
  };
  toggleSidebar() {
    this.isCollapsed.update((v) => !v);
  }

  // Cerrar menú al hacer clic en un enlace (solo en móvil)
  closeMobileMenu() {
    if (window.innerWidth < 768) {
      this.isMobileMenuOpen.set(true);
    }
  }
}

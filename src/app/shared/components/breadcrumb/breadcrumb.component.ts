import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public crumbs = signal<Breadcrumb[]>([]);

  ngOnInit(): void {
    // 1. CARGA INICIAL: Generamos las migas inmediatamente al refrescar
    this.updateBreadcrumbs();

    // 2. CAMBIOS FUTUROS: Escuchamos navegaciones siguientes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  // Encapsulamos la lógica en un método limpio
  private updateBreadcrumbs(): void {
    const root = this.activatedRoute.root;
    this.crumbs.set(this.createBreadcrumbs(root));
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Usamos el 'title' o la data de la ruta
      const label = child.snapshot.title;

      if (label) {
        // Evitamos duplicar si ya existe (opcional dependiendo de tu estructura)
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}

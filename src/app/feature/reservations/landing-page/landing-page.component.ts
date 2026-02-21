import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
    private router = inject(Router);
    public selectedServiceId: string = '';

    public promotions = [
        {
            title: 'Tinte + Hidratación',
            discount: '- 20% OFF',
            description: 'Renueva tu color y dale vida a tu cabello con nuestra hidratación profunda. Luce espectacular.',
            serviceId: 'dye',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop'
        },
        {
            title: 'Manicura Spa',
            discount: '2x1 Martes',
            description: 'Ven con una amiga y disfruten de nuestra manicura relajante. El cuidado perfecto para tus manos.',
            serviceId: 'mani',
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop'
        },
        {
            title: 'Corte de Temporada',
            discount: '- 15% OFF',
            description: 'Luce el estilo que está en tendencia este mes. Un cambio look para realzar tu belleza.',
            serviceId: 'cut',
            image: 'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=600&auto=format&fit=crop'
        }
    ];

    public testimonials = [
        { name: 'María G.', text: '"El mejor lugar al que he ido. Me dejaron el cabello hermoso para mi boda."', rating: 5 },
        { name: 'Laura P.', text: '"Excelente atención, las chicas son súper amables y el resultado me encantó."', rating: 5 },
        { name: 'Ana S.', text: '"Mi manicura duró impecable por semanas. 100% recomendado."', rating: 5 },
    ];

    goToBooking(serviceId?: string) {
        if (serviceId) {
            this.selectedServiceId = serviceId;
        }
        this.router.navigate(['/client/auth-selection'], {
            queryParams: { serviceId: this.selectedServiceId }
        });
    }
}

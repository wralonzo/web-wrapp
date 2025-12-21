import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  servicios = signal([
    { 
      titulo: 'Corte & Estilo', 
      desc: 'Diseños personalizados que resaltan tu esencia.',
      img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400',
      precio: 'Desde $25'
    },
    { 
      titulo: 'Colorimetría', 
      desc: 'Expertos en Balayage y tonos tendencia.',
      img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400',
      precio: 'Desde $80'
    },
    { 
      titulo: 'Manicura Premium', 
      desc: 'Cuidado y arte para tus manos con productos de lujo.',
      img: 'https://images.unsplash.com/photo-1604654894610-df490668f61e?auto=format&fit=crop&q=80&w=400',
      precio: 'Desde $30'
    }
  ]);
}
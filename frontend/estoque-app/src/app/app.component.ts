import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa todas as ferramentas de roteamento necessárias
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // Adiciona as ferramentas ao componente
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarColapsada = false;
  showFallback = false;

  toggleSidebar() {
    this.sidebarColapsada = !this.sidebarColapsada;
  }

  onImageError(event: any) {
    console.log('Logo não encontrada, usando ícone de fallback');
    this.showFallback = true;
    event.target.style.display = 'none';
  }
}
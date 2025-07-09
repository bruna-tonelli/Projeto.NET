import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  sidebarColapsada = false;

  toggleSidebar() {
    this.sidebarColapsada = !this.sidebarColapsada;
  }

  onLogoLoad() {
    console.log('✅ Logo carregada com sucesso!');
  }

  onLogoError() {
    console.log('❌ Erro ao carregar logo. Verifique o caminho do arquivo.');
  }

  ngOnInit() {
    // Debug: verificar se a imagem está sendo carregada
    console.log('Verificando se a logo está carregando...');
    const img = new Image();
    img.onload = () => console.log('Logo carregada com sucesso!');
    img.onerror = () => console.log('Erro ao carregar logo. Verifique o caminho.');
    img.src = 'assets/images/logo.png';
  }
}
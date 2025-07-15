import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa todas as ferramentas de roteamento necessárias
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

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
  showSidebar = true; // Nova propriedade para controlar a visibilidade da sidebar

  constructor(private router: Router, private authService: AuthService) {}

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

    // Escuta mudanças na rota para controlar a visibilidade da sidebar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Oculta a sidebar nas rotas de login e register
        const authRoutes = ['/login', '/register'];
        this.showSidebar = !authRoutes.includes(event.urlAfterRedirects);
      });

    // Verifica a rota inicial
    const currentUrl = this.router.url;
    const authRoutes = ['/login', '/register'];
    this.showSidebar = !authRoutes.includes(currentUrl);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
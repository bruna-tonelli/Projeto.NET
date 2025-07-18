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
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sidebarColapsada = false;
  showSidebar = true;
  isDarkMode = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggleSidebar() {
    this.sidebarColapsada = !this.sidebarColapsada;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
  }

  onLogoLoad() {
    console.log('✅ Logo carregada com sucesso!');
  }

  onLogoError() {
    console.log('❌ Erro ao carregar logo. Verifique o caminho do arquivo.');
  }

  ngOnInit() {
    // Carrega preferência do modo escuro
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Verifica logo
    const img = new Image();
    img.onload = () => console.log('Logo carregada com sucesso!');
    img.onerror = () => console.log('Erro ao carregar logo. Verifique o caminho.');
    img.src = 'assets/images/logo.png';

    // Escuta mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const authRoutes = ['/login', '/register'];
        this.showSidebar = !authRoutes.includes(event.urlAfterRedirects);
      });

    // Rota atual
    const currentUrl = this.router.url;
    const authRoutes = ['/login', '/register'];
    this.showSidebar = !authRoutes.includes(currentUrl);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

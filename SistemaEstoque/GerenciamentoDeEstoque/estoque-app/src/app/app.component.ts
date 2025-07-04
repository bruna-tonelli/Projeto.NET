import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa todas as ferramentas de roteamento necessárias
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// Importa os componentes que serão acessados via rota
import { EstoqueComponent } from './components/estoque/estoque.component';
import { MovimentacaoComponent } from './Movimentacao/movimentacao.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // Adiciona as ferramentas ao componente
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    // Adiciona os componentes para que o Angular os "conheça"
    EstoqueComponent,
    MovimentacaoComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
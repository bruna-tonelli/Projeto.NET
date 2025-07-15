import { Routes } from '@angular/router';
// Importe os componentes que serão usados nas rotas
import { EstoqueComponent } from './components/estoque/estoque.component';
import { MovimentacaoComponent } from './Movimentacao/movimentacao.component';
import { FuncionarioComponent } from './Funcionarios/funcionario.component';
import { FinanceiroComponent } from './Financeiro/financeiro.component';
import { InventarioComponent } from './Inventario/inventario.component';

export const routes: Routes = [
  // Rota padrão: Se o usuário acessar a raiz, redirecione para /estoque
  { path: '', redirectTo: '/estoque', pathMatch: 'full' },

  // Rota para a tela de Estoque
  { path: 'estoque', component: EstoqueComponent },

  // Rota para a tela de Movimentação
  { path: 'movimentacao', component: MovimentacaoComponent },

  { path: 'inventario' , component: InventarioComponent },

  {
    path: 'funcionarios',
    component: FuncionarioComponent
  },
  
  { path: 'financeiro', 
    component: FinanceiroComponent 
  },

  {
    path: '',
    redirectTo: '/funcionarios',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: '/funcionarios'
  }
];
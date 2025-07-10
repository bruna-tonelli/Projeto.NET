import { Routes } from '@angular/router';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { MovimentacaoComponent } from './Movimentacao/movimentacao.component';
import { FuncionarioComponent } from './Funcionarios/funcionario.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { FinanceiroComponent } from './Financeiro/financeiro.component';

export const routes: Routes = [
  // Rotas de autenticação (não protegidas)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rota padrão: Se o usuário acessar a raiz, redirecione para /estoque
  { path: '', redirectTo: '/estoque', pathMatch: 'full' },

  // Rotas protegidas com AuthGuard
  { path: 'estoque', component: EstoqueComponent, canActivate: [AuthGuard] },
  { path: 'movimentacao', component: MovimentacaoComponent, canActivate: [AuthGuard] },
  { path: 'funcionarios', component: FuncionarioComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
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
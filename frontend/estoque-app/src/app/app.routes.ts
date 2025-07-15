import { Routes } from '@angular/router';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { MovimentacaoComponent } from './Movimentacao/movimentacao.component';
import { FuncionarioComponent } from './Funcionarios/funcionario.component';
//import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { FinanceiroComponent } from './Financeiro/financeiro.component';
import { InventarioComponent } from './Inventario/inventario.component';

export const routes: Routes = [
  // Rotas de autenticação (não protegidas)
  //{ path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rota padrão: Se o usuário acessar a raiz, redirecione para /estoque
  { path: '', redirectTo: '/estoque', pathMatch: 'full' },


  // Rotas protegidas com AuthGuard
  { path: 'estoque', component: EstoqueComponent},
  { path: 'movimentacao', component: MovimentacaoComponent},
  { path: 'funcionarios', component: FuncionarioComponent,  },
  { path: 'financeiro', component: FinanceiroComponent,  },
  { path: 'inventario' , component: InventarioComponent,  },

  
  // Rota catch-all: redireciona para login para rotas não encontradas
  //{ path: '**', redirectTo: '/login' }
];
// Local: src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; // Importa a função do roteador
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes'; // <-- 1. IMPORTA O SEU MAPA DE ROTAS

export const appConfig: ApplicationConfig = {
  providers: [
    // 2. ATIVA AS ROTAS NA APLICAÇÃO
    provideRouter(routes),

    provideHttpClient() // Para os seus serviços funcionarem
  ]
};
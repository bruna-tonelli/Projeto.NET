// CÓDIGO FINAL E CORRIGIDO para main.server.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // <-- CORREÇÃO AQUI
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
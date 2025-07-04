// CÓDIGO FINAL - JÁ ESTÁ CORRETO

import 'zone.js'; // Mantém o Zone.js para detecção automática de mudanças

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
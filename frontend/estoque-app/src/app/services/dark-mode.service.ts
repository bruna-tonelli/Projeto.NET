import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getSavedMode());
  darkMode$ = this.darkModeSubject.asObservable();

  private getSavedMode(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleDarkMode(): void {
    const newValue = !this.darkModeSubject.value;
    this.setDarkMode(newValue);
  }

  setDarkMode(isDark: boolean): void {
    localStorage.setItem('darkMode', String(isDark));
    this.darkModeSubject.next(isDark);

    // Se quiser aplicar uma classe no body
    document.body.classList.toggle('dark-mode', isDark);
  }
}

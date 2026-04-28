import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './security/component/login/login';

@Component({
  selector: 'app-root',
  imports: [Login],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('scaf-client');
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private readonly router: Router) {}

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/layout']);
  }
}

import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthenticationService) {}
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}



import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: any = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login() {
    const { email, password } = this.user; // Destructure user object to get email and password

    this.authService.loginUser(email, password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        const token = response.token;
        const role= response.role;
        if(token){
          const cookieExpirationDays=7;
          this.cookieService.set('token', token, cookieExpirationDays, '/','',true,'Strict');
          this.cookieService.set('role', role, cookieExpirationDays, '/', '', true, 'Strict');
        }
        alert('Login successful!'); // You can customize this message
        // Redirect to the desired page after successful login
        if(this.authService.isTokenValid(token)){
          this.router.navigate(['/home']);
        } else{
          alert("Token invalide, veuillez réessayer.");
        } 
         // Redirect to home or dashboard
      },
      (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials and try again.'); // Display error message
      }
    );
  }
}

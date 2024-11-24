import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';  

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePicture: '', // Add profile picture path
    wishlist: [],
    cart: []
  };

  // Flag for indicating whether the form is submitting
  isSubmitting: boolean = false;

  constructor(private userServices: AuthenticationService, private router: Router) {}

  register() {
    if (this.isSubmitting) return; // Prevent multiple submissions
    this.isSubmitting = true;

    const userData = new FormData();
    // Add fields to FormData
    userData.append('firstname', this.user.firstname ?? '');
    userData.append('lastname', this.user.lastname ?? '');
    userData.append('email', this.user.email ?? '');
    userData.append('password', this.user.password ?? '');
    userData.append('phoneNumber', this.user.phoneNumber ?? '');
    userData.append('wishlist', JSON.stringify(this.user.wishlist ?? []));
    userData.append('cart', JSON.stringify(this.user.cart ?? []));

    // Add the profile picture if it is a file
    if (this.user.profilePicture instanceof File) {
      userData.append('profilePicture', this.user.profilePicture);
    } else {
      console.warn('Profile picture is not a file.');
    }

    // Call the registration service
    this.userServices.registerUser(userData).subscribe(
      (response) => {
        console.log(response);
        alert('Inscription réussie');
        this.router.navigate(['/']);
        this.isSubmitting = false;
      },
      (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        if (error.status === 500) {
          alert('Un problème est survenu côté serveur. Veuillez réessayer plus tard.');
        } else {
          alert('Une erreur inconnue est survenue. Veuillez vérifier vos informations et réessayer.');
        }
        this.isSubmitting = false;
      }
    );
  }

  // File input handler for the profile picture
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Optional: Check file type (for example, images only)
      if (file.type.startsWith('image/')) {
        this.user.profilePicture = file; // Ensure profilePicture is a File
        console.log('Profile picture selected:', file);
      } else {
        alert('Veuillez sélectionner un fichier image.');
      }
    }
  }
}

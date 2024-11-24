import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
  updateUserForm: FormGroup;
  userId: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: AuthenticationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialiser le formulaire avec FormBuilder
    this.updateUserForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      profilePicture: [null],
      role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur depuis l'URL
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    // Charger les détails de l'utilisateur pour pré-remplir le formulaire
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (user) => {
          // Pré-remplir le formulaire avec les données utilisateur
          this.updateUserForm.patchValue({
            firstname: user.firstrname,
            lastname: user.lastrname,
            email: user.email,
            password: user.password,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            role: user.role
          });
       
        },
        (error) => {
          console.error('Error retrieving user informations', error);
        }
      );
            
    }
  }

  // Soumettre le formulaire de mise à jour
  onSubmit(): void {
    if (this.updateUserForm.valid) {
      this.loading = true;

      // Prepare the FormData object to handle file uploads
      const formData = new FormData();
      formData.append('firstname', this.updateUserForm.get('firstname')?.value);
      formData.append('lastname', this.updateUserForm.get('lastname')?.value);
      formData.append('email', this.updateUserForm.get('email')?.value);
      formData.append('phone', this.updateUserForm.get('phone')?.value);
      formData.append('role', this.updateUserForm.get('role')?.value);

      // If a profile picture is selected, append it to the formData
      const profilePicture = this.updateUserForm.get('profilePicture')?.value;
      if (profilePicture) {
        formData.append('profilePicture', profilePicture, profilePicture.name);
      }

      // Optional: If the password field is filled, add it to the formData
      const password = this.updateUserForm.get('password')?.value;
      if (password) {
        formData.append('password', password);
      }



      this.userService.updateUser(this.userId, this.updateUserForm.value).subscribe(
        () => {
          this.loading = false;
          alert('User updated successfully');
          this.router.navigate(['/listusers']); // Redirection après la mise à jour
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Error while updating the user';
          console.error(error);
        }
      );
    }
  }
}



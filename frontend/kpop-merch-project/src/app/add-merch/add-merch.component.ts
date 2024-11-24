// src/app/add-merch/add-merch.component.ts
import { Component } from '@angular/core';
import { MerchandiseService } from '../services/merch.service';
import { Router } from '@angular/router';
import { Merch } from '../models/merch.model';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-add-merch',
  templateUrl: './add-merch.component.html',
  styleUrls: ['./add-merch.component.css']
})
export class AddMerchComponent {
merch: any ={};
userId: string='';
currentUser: any;

constructor(
  private merchandiseService: MerchandiseService,
  private router: Router,
  private authenticationService: AuthenticationService // Inject AuthenticationService
) {
  // Get the current user from the authentication service
  this.currentUser = this.authenticationService.getCurrentUser();
  if (this.currentUser) {
    this.userId = this.currentUser._id; // Assign userId from currentUser
  } else {
    // Handle the case where the user is not logged in
    console.log('No user logged in');
    alert('You must be logged in to add merchandise.');
    this.router.navigate(['/login']); // Redirect to login if no user is logged in
  }
}

addMerch() {
  // Ensure userId is assigned before making the request
  if (this.userId) {
    this.merch.user = this.userId; // Assign the userId to the merchandise object
    this.merchandiseService.addMerch(this.merch).subscribe(
      (response) => {
        console.log(response);
        alert('Merchandise added successfully!');
        this.router.navigate(['/']); // Redirect to homepage or merchandise list
      },
      (error) => {
        console.error('Error adding merchandise:', error);
        alert('An error occurred while adding merchandise.');
      }
    );
  } else {
    alert('User ID is missing.');
  }
}
}

export interface User {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phoneNumber: string;
    profilePicture?: string | File;
    wishlist?: string[];  // Assuming wishlist is an array of item IDs or names
    cart?: string[];      // Assuming cart is an array of item IDs or names
  }
  
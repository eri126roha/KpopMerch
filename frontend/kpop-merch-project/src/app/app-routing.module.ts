import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ListusersComponent } from './listusers/listusers.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'listusers', component: ListusersComponent},
  {path:'users/update/:id', component: UpdateUserComponent},
  {path:'home', component: HomeComponent, canActivate:[AuthGuard]}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

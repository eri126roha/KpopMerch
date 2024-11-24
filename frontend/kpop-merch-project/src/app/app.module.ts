import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ListusersComponent } from './listusers/listusers.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AddMerchComponent } from './add-merch/add-merch.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ListusersComponent,
    UpdateUserComponent,
    HomeComponent,
    HeaderComponent,
    AddMerchComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withFetch()) ,
    provideClientHydration(),
    AuthGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

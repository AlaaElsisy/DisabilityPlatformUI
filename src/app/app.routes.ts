import { NotfoundComponent } from './../components/notfound/notfound.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from './../components/login/login.component';
import { Routes } from '@angular/router';
import { PatientLayoutComponent } from '../components/patient-layout/patient-layout.component';
import { RegisterComponent } from '../components/register/register.component';
import { PatienthomeComponent } from '../components/patienthome/patienthome.component';
import { PatientProfileComponent } from '../components/patientProfile/patientProfile.component';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', title: 'Home' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'about', component: NotfoundComponent },

  {
    path: '',
    component: PatientLayoutComponent,
    children: [
      { path: 'patienthome', component: PatienthomeComponent, title: 'Home' },
      { path: 'patientProfile', component: PatientProfileComponent, title: 'Profile' },
    ]
  },

  { path: '**', component: NotfoundComponent }
];



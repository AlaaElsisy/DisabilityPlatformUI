import { NotfoundComponent } from './../components/notfound/notfound.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from './../components/login/login.component';
import { Routes } from '@angular/router';
import { PatientLayoutComponent } from '../components/patient-layout/patient-layout.component';
import { RegisterComponent } from '../components/register/register.component';
import { PatienthomeComponent } from '../components/patienthome/patienthome.component';
import { UserProfileComponent } from '../components/patientProfile/patientProfile.component';
import { ProviderServicesComponent } from 'components/provider-services/provider-services.component';
import { ServiceCategoriesComponent } from 'components/service-categories/service-categories.component';
import { AddPatientRequestComponent } from 'components/add-patient-request/add-patient-request.component';
import { AddProposalComponent } from 'components/Patient/proposals/add-proposal/add-proposal/add-proposal.component';

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
      { path: 'userProfile', component: UserProfileComponent, title: 'Profile' },
      { path: 'provider-services', component: ProviderServicesComponent, title: 'Provider Services' },
      { path: 'service-categories', component: ServiceCategoriesComponent, title: 'Service Categories' },
      { path: 'add-patient-request', component: AddPatientRequestComponent, title: 'Add Patient Request'},
      { path: 'patient-add-proposal', component: AddProposalComponent, title: 'Proposal' },
    ]
  },

  { path: '**', component: NotfoundComponent }
];



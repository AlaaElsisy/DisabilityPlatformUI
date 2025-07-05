import { NotfoundComponent } from './../components/notfound/notfound.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from './../components/login/login.component';
import { Routes } from '@angular/router';
import { PatientLayoutComponent } from '../components/patient-layout/patient-layout.component';
import { RegisterComponent } from '../components/register/register.component';
import { PatienthomeComponent } from '../components/patienthome/patienthome.component';

import { UserProfileComponent } from '../components/patientProfile/patientProfile.component';

import { ProviderhomeComponent } from '../components/providerhome/providerhome.component';
import { ProviderLayoutComponent } from '../components/provider-layout/provider-layout.component';
import { ProviderservicesComponent } from '../components/providerservices/providerservices.component';
import { ProviderRequestsComponent } from '../components/providerrequests/providerrequests.component';
import { HelperaddserviceComponent } from '../components/helperaddservice/helperaddservice.component';

import { ProviderServicesComponent } from 'components/provider-services/provider-services.component';
import { ServiceCategoriesComponent } from 'components/service-categories/service-categories.component';
import { AddPatientRequestComponent } from 'components/add-patient-request/add-patient-request.component';
import { AddProposalComponent } from 'components/Patient/proposals/add-proposal/add-proposal/add-proposal.component';

import { HelperExploreOffersComponent } from 'components/helper-explore-offers/helper-explore-offers.component';
import { OneOfferWithPropozelsComponent } from 'components/one-offer-with-propozels/one-offer-with-propozels.component';
import { HelperAddRequestToOfferComponent } from 'components/helper-add-request-to-offer/helper-add-request-to-offer.component';

import { PatientRequestsComponent } from 'components/patient-requests/patient-requests.component';
import { PatientOfferProposalsComponent } from 'components/patient-offer-proposals/patient-offer-proposals.component';
import { ServiceRequestsComponent } from 'components/Patient/service-Requests/service-Requests.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', title: 'Home' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'about', component: NotfoundComponent },
   {path:'provider', component:ProviderLayoutComponent,children:[
 {path:'home',component:ProviderhomeComponent, title:'Home'},
  {path:'services',component:ProviderservicesComponent, title:'Services'},
  {path:'requests',component:ProviderRequestsComponent, title:'Requests'},
  { path: 'helperaddservice', component: HelperaddserviceComponent, title: 'Add Service' },
  { path: 'helperaddservice/:id', component: HelperaddserviceComponent, title: 'Edit Service' },
  {path:'offers',component:HelperExploreOffersComponent, title:'Offers'},
   { path: 'applyoffer/:id', component: OneOfferWithPropozelsComponent, title: 'Offer Proposal' },
   { path: 'AddRequest/:id', component: HelperAddRequestToOfferComponent, title: 'New Request' },
  ]},

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

      { path: 'patient-requests', component: PatientRequestsComponent, title: 'Patient Offers' },
      { path: 'patient-serviceRequests', component: ServiceRequestsComponent, title: 'Patient Requests' },

      { path: 'patient-offer-proposals', component: PatientOfferProposalsComponent, title: 'Patient Offer Proposals' },
      { path: 'offers/:id/proposals', component: PatientOfferProposalsComponent, title: 'Patient Offer Proposals' },

    ]
  },

  { path: '**', component: NotfoundComponent }
];



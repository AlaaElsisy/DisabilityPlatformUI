
import { authGuardGuard } from './../core/Guards/auth-guard.guard';

import {  TestNotificationComponent } from 'components/test/test.component';

import { NotfoundComponent } from './../components/notfound/notfound.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from './../components/login/login.component';
import { Routes } from '@angular/router';
import { PatientLayoutComponent } from '../components/patient-layout/patient-layout.component';
import { RegisterComponent } from '../components/register/register.component';
import { PatienthomeComponent } from '../components/patienthome/patienthome.component';



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
import { PaymentComponent } from 'components/payment/payment/payment.component';
import { ProviderRequestPaymentComponent } from 'components/provider-request-payment/provider-request-payment.component';

import { UserProfileComponent } from 'components/userProfile/patientProfile.component';
import { UserProfileViewComponent } from 'components/user-profile-view/user-profile-view.component';
import { WithdrawalPaymentComponent } from './components/withdrawal-payment/withdrawal-payment.component';


import { ProviderOrdersComponent } from 'components/provider-orders/provider-orders.component';
import { cantReturnToLoginGuard } from 'core/Guards/cant-return-to-login.guard';
import { roleGuardsGuard } from 'core/Guards/role-guards.guard';
import { NotificationsComponent } from 'components/notification/notification.component';
import { ChatbotComponent } from 'components/chatbot/chatbot.component';




export const routes: Routes = [
  { path: '', redirectTo: 'home',  pathMatch: 'full', title: 'Home' },
  { path: 'home', component: HomeComponent, title: 'Home' },
{ path: 'chat', component: ChatbotComponent, title: 'chat' },
  { path: 'login', component: LoginComponent,canActivate: [cantReturnToLoginGuard], title: 'Login' },
  { path: 'register', component: RegisterComponent,canActivate: [cantReturnToLoginGuard], title: 'Register' },
  { path: 'about', component: NotfoundComponent },
  {path:'provider', component:ProviderLayoutComponent,data: { expectedRole: 'helper' },
  canActivate: [authGuardGuard, roleGuardsGuard] ,children:[
  {path:'home',component:ProviderhomeComponent, title:'Home'},
  {path:'services',component:ProviderservicesComponent, title:'Services'},
  {path:'requests',component:ProviderRequestsComponent, title:'Requests'},
  { path: 'helperaddservice', component: HelperaddserviceComponent, title: 'Add Service' },
  { path: 'helperaddservice/:id', component: HelperaddserviceComponent, title: 'Edit Service' },
  {path:'offers',component:HelperExploreOffersComponent, title:'Offers'},

  { path: 'applyoffer/:id', component: OneOfferWithPropozelsComponent, title: 'Offer Proposal' },
  { path: 'AddRequest/:id', component: HelperAddRequestToOfferComponent, title: 'New Request' },

   { path: 'applyoffer/:id', component: OneOfferWithPropozelsComponent, title: 'Offer Proposal' },
   { path: 'AddRequest/:id', component: HelperAddRequestToOfferComponent, title: 'New Request' },
   { path: 'test', component: TestNotificationComponent, title: 'test' },
      { path: 'notification/:id', component: NotificationsComponent, title: 'notification' },



   { path: 'profile', component: UserProfileComponent, title: 'My Profile' },
   { path: 'withdrawal-payment', component: WithdrawalPaymentComponent, title: 'Withdraw Funds' },

     {
       path: 'userprofile',
  component: UserProfileViewComponent
}
,

   { path: 'orders/:id', component: ProviderOrdersComponent, title: 'orders' },


  ]},

  {
    path: '',
    component: PatientLayoutComponent,
    data: { expectedRole: 'patient' },
  canActivate: [authGuardGuard, roleGuardsGuard],
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

       { path: 'payment', component: PaymentComponent, title: 'Payment' },
       { path: 'provider-request-payment', component: ProviderRequestPaymentComponent, title: 'Provider Request Payment' },


      { path: 'notification/:id', component: NotificationsComponent, title: 'notification' },


      { path: 'test', component: TestNotificationComponent, title: 'test' },
      





    ]
  },
  {
  path: 'user-view-profile',
  component: UserProfileViewComponent

},



  { path: '**', component: NotfoundComponent },
];



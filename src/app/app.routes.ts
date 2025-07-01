import { NotfoundComponent } from './../components/notfound/notfound.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from './../components/login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from '../components/register/register.component';
import { PatienthomeComponent } from '../components/patienthome/patienthome.component';
import { PatientProfileComponent } from '../components/patientProfile/patientProfile.component';
import { ProvidernavbarComponent } from '../components/providernavbar/providernavbar.component';
import { ProviderhomeComponent } from '../components/providerhome/providerhome.component';
import { ProviderLayoutComponent } from '../components/provider-layout/provider-layout.component';
import { ProviderservicesComponent } from '../components/providerservices/providerservices.component';
import { ProviderrequestsComponent } from '../components/providerrequests/providerrequests.component';
import { HelperaddserviceComponent } from '../components/helperaddservice/helperaddservice.component';
export const routes: Routes = [
   {path:'',redirectTo:'home',pathMatch:'full',title:'Home'}, 
  {path:'login',component:LoginComponent, title:'Login'},
  {path:'home',component:HomeComponent ,title:'Home'},
 
  {path:'register',component:RegisterComponent, title:'Register'},
  {path:'patienthome',component:PatienthomeComponent, title:'Home'},
  {path:'patientProfile',component:PatientProfileComponent, title:'Profile'},
 
  {path:'provider', component:ProviderLayoutComponent,children:[
 {path:'home',component:ProviderhomeComponent, title:'Home'},
  {path:'services',component:ProviderservicesComponent, title:'Services'},
  {path:'requests',component:ProviderrequestsComponent, title:'Requests'},
  { path: 'helperaddservice', component: HelperaddserviceComponent, title: 'Add Service' },
  { path: 'helperaddservice/:id', component: HelperaddserviceComponent, title: 'Edit Service' }
  ]}

];


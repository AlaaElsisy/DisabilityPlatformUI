import { NotfoundComponent } from './../components/notfound/notfound.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from './../components/login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from '../components/register/register.component';


export const routes: Routes = [
   {path:'',redirectTo:'home',pathMatch:'full',title:'Home'}, 
  {path:'login',component:LoginComponent, title:'Login'},
  {path:'home',component:HomeComponent ,title:'Home'},
  {path:'about',component:NotfoundComponent},
  {path:'register',component:RegisterComponent, title:'Register'},
];


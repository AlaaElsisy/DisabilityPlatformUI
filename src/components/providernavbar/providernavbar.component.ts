import { Component, inject } from '@angular/core';
import { routes } from '../../app/app.routes';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-providernavbar',

  imports: [RouterLink,RouterLinkActive],
  templateUrl: './providernavbar.component.html',
  styleUrl: './providernavbar.component.css'
})
export class ProvidernavbarComponent {
  userId = localStorage.getItem('userId') || '';
  private _Router=inject(Router)
scrollTo(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

   sginout():void{
    const token='';
    const authToken=''
    const userId=''
    localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
 this._Router.navigate(['/login'])

  }
}

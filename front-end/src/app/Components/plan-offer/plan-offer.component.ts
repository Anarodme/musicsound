import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-offer',
  templateUrl: './plan-offer.component.html',
  styleUrls: ['./plan-offer.component.css']
})
export class PlanOfferComponent {

  constructor(private router: Router) { }

  navegarPago(){
    // Redirige al usuario al componente 'payment-window Component'
    this.router.navigate(['/pago']);
  }
  

}


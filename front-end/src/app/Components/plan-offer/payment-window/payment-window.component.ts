import { Component } from '@angular/core';
import { PaymentService } from 'src/app/Services/Payment/payment.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-payment-window',
  templateUrl: './payment-window.component.html',
  styleUrls: ['./payment-window.component.css']
})
export class PaymentWindowComponent {
  constructor(
    private paymentService: PaymentService,
    private userService: UserService
  ) { }

  user_id: number;
  userEmail: string;
  userDataLoaded: boolean = false;

  cardHolder: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;

  ngOnInit(): void {
    this.getUserData();
  }
  
  //Obtener el id del usuario y el correo
  getUserData(): void {
    this.userService.isAuth().then(
      (data) => {
        if (data && data.value) {
          this.user_id = data.userAuth;
          this.userEmail = data.email;
          this.userDataLoaded = true;
        } else {
          console.error('Usuario no autenticado.');
          // Manejar el caso de usuario no autenticado aquí
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }


  async realizarCompra(): Promise<void> {
    if (!this.userDataLoaded) {
      console.error('Usuario no autenticado.');
      // Manejar el caso de usuario no autenticado aquí si userDataLoaded es falso
      return;
    }
  
    this.paymentService.procesarCompra(this.user_id).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
  
        // Acceder a las propiedades correctas de la respuesta
        const expirationDate = new Date(response.expiration_date);
        const today = new Date();
        const daysUntilNextPayment = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        console.log('Días hasta el próximo pago:', daysUntilNextPayment);
  
        // Enviar correo al usuario (simulado)
        const userEmail = 'usuario@example.com'; // Suponiendo que tienes el correo del usuario
        this.enviarCorreoPagoPendiente(userEmail);
        alert('¡Su compra fue exitosa!');
      },
      (error) => {
        console.error('Error al procesar la compra:', error);
        alert('Ocurrió un error al procesar la compra.');
      }
    );
  }

enviarCorreoPagoPendiente(userEmail: string): void {
    // Simulación del envío de correo al usuario (puedes implementar la lógica real aquí)
    console.log('Enviando correo a:', userEmail);
    // Aquí puedes implementar la lógica para enviar el correo electrónico al usuario
    // Por ejemplo, puedes llamar a otro servicio que envíe el correo usando el correo electrónico del usuario
  }
}


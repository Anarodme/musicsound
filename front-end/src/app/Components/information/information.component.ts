import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent {
  formData = {
    nombre: '',
    email: '',
    mensaje: ''
  };
  showMessage = false;
  messageText = '';

  constructor() { }

  onSubmit() {
    const templateParams = {
      from_name: this.formData.nombre,
      from_email: this.formData.email,
      message: this.formData.mensaje
    };

    emailjs.init('n7OTvhEGADDy7VGXa');
    emailjs.send('service_ztjl5be', 'template_v92p3bh', templateParams)
      .then((response) => {
        console.log('Mensaje enviado con éxito!', response.status, response.text);
        this.showMessage = true;
        this.messageText = 'Mensaje enviado correctamente';
        setTimeout(() => {
          this.showMessage = false;
          this.messageText = '';
          this.resetForm(); // Limpiar los campos del formulario
        }, 3000); // Ocultar el mensaje después de 3 segundos
        // Realiza acciones adicionales después de enviar el formulario
      }, (error) => {
        console.log('Error al enviar el mensaje:', error);
        this.showMessage = true;
        this.messageText = 'Error al enviar el mensaje';
        setTimeout(() => {
          this.showMessage = false;
          this.messageText = '';
        }, 3000); // Ocultar el mensaje después de 3 segundos
        // Maneja el error según tus necesidades
      });
  }

  resetForm() {
    this.formData = {
      nombre: '',
      email: '',
      mensaje: ''
    };
  }
}
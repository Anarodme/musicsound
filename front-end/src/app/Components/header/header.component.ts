import { Component} from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{
  eliminar(){
    if(localStorage.getItem('token')){
      localStorage.removeItem('token');
    }else{
      console.log('No hay token!')
    }
  }
}

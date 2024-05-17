import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ValidIdGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const id = route.paramMap.get('id');
    if (id === 'Crear' || id === 'Editar') {
      return true;
    } else {
      this.router.navigate(['']); 
      return false;
    }
  }
}

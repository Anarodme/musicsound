import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesPodcastServiceService {

  constructor() { }
  
  private showCategoriesSource = new BehaviorSubject<boolean>(true);
  showCategories$ = this.showCategoriesSource.asObservable();

  toggleCategories(show: boolean): void {
    this.showCategoriesSource.next(show);
  }
}
import { Directive, ViewContainerRef, ComponentFactoryResolver, OnInit, OnDestroy, OnChanges, SimpleChanges, DoCheck, AfterContentInit } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { NotAuthenticatedComponent } from './notAuthenticated/notAuthenticated.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { DefaultComponent } from './default/default.component';

@Directive({
  selector: '[appDynamicComponent]'
})
export class DynamicComponentDirective implements OnInit, OnDestroy{
  private componentRef: any;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private uService: UserService
  ) {  }


  ngOnInit(): void {
    this.loadComponent();
    
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }

  private loadComponent(): void {
    this.uService.isAuth().then((datos) => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        datos.value ? AuthenticatedComponent : NotAuthenticatedComponent
      );
  
      this.viewContainerRef.clear();
      this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    });

    const componentFactoryDefault = this.componentFactoryResolver.resolveComponentFactory(DefaultComponent);

    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(componentFactoryDefault);
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}

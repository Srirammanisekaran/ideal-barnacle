import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    username: string;
    password: string;
    errorMessage: string;


    constructor(public layoutService: LayoutService,private router: Router) { }
    // login() {
    //     // Perform login logic here, e.g., make an API request to authenticate the user
    //     // Assuming login is successful for demonstration purposes
    //     if (this.username === 'admin' && this.password === 'password') {
    //       // Redirect to the dashboard
    //       this.router.navigate(['/dashboard']);
    //     } else {
    //       // Handle login error
    //       console.log('Invalid credentials');
    //     }
    //   }
    
  login() {
    if (this.username === 'admin' && this.password === 'admin') {
            // Redirect to the dashboard
            this.router.navigate(['/dashboard']);
          } else {
            // Handle login error
            //console.log('Invalid credentials');
            this.errorMessage = 'Invalid credentials. Please try again.';
          }
  }
}

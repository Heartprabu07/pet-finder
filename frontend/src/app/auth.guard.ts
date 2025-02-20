import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../app/services/user.service'; // Make sure to create an AuthService to handle authentication logic

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    if (this.userService.isAuthenticated()) {
      // If the user is authenticated, allow the route
      return true;
    } else {
      // If the user is not authenticated, redirect to the login page
      this.router.navigate(['/home']);
      return false;
    }
  }
}

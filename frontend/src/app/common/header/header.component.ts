import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated = false;
  role: string | null = '';
  constructor(private router: Router,private userService: UserService) {}
  ngOnInit() {
    this.isAuthenticated = this.userService.isAuthenticated();
    this.role = this.userService.getUserRole();
  }

  logout(): void {
    this.userService.removeToken();  // Remove token from localStorage
    this.isAuthenticated = false;
    this.router.navigate(['/home']);  // Redirect to login page
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private router: Router,private userService: UserService) {}
  logout(): void {
    this.userService.removeToken();  // Remove token from localStorage
    this.router.navigate(['/login']);  // Redirect to login page
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private toastr: ToastrService,private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required, this.emailOrPhoneValidator]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/report-pet-form']);
    }
  }

  emailOrPhoneValidator(control: any) {
    const value = control.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phonePattern = /^\d{10}$/;

    if (!emailPattern.test(value) && !phonePattern.test(value)) {
      return { invalidEmailOrPhone: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe(
        response => {
          console.log('response', response);
  
          if (response.status === 200) { // Check if login is successful
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response?.user?.role); // Store role in localStorage
            this.toastr.success('Login successful!', 'Welcome');
            
            if (response.user.role === 'admin') {
              this.router.navigate(['/dashboard']); // Redirect to admin dashboard
            } else {
              this.router.navigate(['/report-pet-form']); // Redirect to normal user page
            }
          }
        },
        error => {
          console.error('Login error:', error);
          
          if (error.status === 400) {
            this.toastr.error('Invalid credentials!', 'Error');
            this.errorMessage = 'Invalid email or phone number.';
          } else if (error.status === 403) {
            this.toastr.warning('Your account is not active. Please contact support.', 'Warning');
            this.errorMessage = 'Your account is inactive.';
          } else if (error.status === 500) {
            this.toastr.error('Server error! Please try again later.', 'Error');
            this.errorMessage = 'Something went wrong. Please try again.';
          } else {
            this.toastr.error('Unexpected error occurred.', 'Error');
            this.errorMessage = 'Unexpected error. Please try again.';
          }
        }
      );  
    }
  }
  
}

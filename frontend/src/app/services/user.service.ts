import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl =environment.API_URL;

  constructor(private http: HttpClient) {}


    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token'); // Fetch token from localStorage
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json'
      });
    }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');  // Example check for a user token in localStorage
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
  

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials);
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/profile`);
  }

  getDashboardStats() {
    return this.http.get<{
      data: any;
      status: number; missingPets: number; sightedPets: number; petOwners: number 
}>(`${this.apiUrl}/auth/dashboardStats`,{
      headers: this.getHeaders()
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/allusers`,{
      headers: this.getHeaders()
    });
  }

  changeUserStatus(id:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/changestatus/${id}`,{
      headers: this.getHeaders()
    });
  }

  deleteUser(id:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/deleteuser/${id}`,{
      headers: this.getHeaders()
    });
  }

  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
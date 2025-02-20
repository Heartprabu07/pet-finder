import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PetService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/json'
    });
  }

  submitPetForm(data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pets/reportForm`, data, {
      headers: this.getHeaders()
    });
  }

  getMissingPets(status:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pets/getAllReports/${status}`,{
      headers: this.getHeaders()
    });
  }
}
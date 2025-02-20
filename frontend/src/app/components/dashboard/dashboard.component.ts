import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';  // Import the service
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private userService: UserService) {}
  missingPets = 0;
  sightedPets = 0;
  petOwners = 0;
  ngOnInit(): void {
    this.userService.getDashboardStats().subscribe((response) => {
      if(response.data){
        this.missingPets = response.data.missingPets;
        this.sightedPets = response.data.sightedPets;
        this.petOwners = response.data.petOwners;
      }
  
    });
  }
}

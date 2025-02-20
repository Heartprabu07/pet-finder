import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { PetService } from '../../services/pet.service';  // Import the service
import { UserService } from '../../services/user.service'; 
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-missing-pet-report',
  templateUrl: './missing-pet-report.component.html',
  styleUrls: ['./missing-pet-report.component.css']
})
export class MissingPetReportComponent implements OnInit {
  reports: any[] = [];   // Corrected type
  searchText: string = '';
  selectedSpecies: string = '';
  selectedStatus: string = '';
  searchLocation:string ='';
  selectedDate:any;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  uniqueSpecies: string[] = [];
  speciesList: string[] = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
  private imageURL = environment.IMAGE_URL;
  private mapboxToken = environment.MAPBOX_TOKEN;
  role: string | null = '';
  constructor(private route: ActivatedRoute,private petService: PetService,private userService:UserService) {}

  ngOnInit(): void {
    this.role = this.userService.getUserRole();
    this.route.paramMap.subscribe(params => {
      const param = params.get('any');  // Get URL param
      let status = (param === 'lost') ? '0' : (param === 'all') ? '2' : '1';
      this.selectedStatus = status;
      this.petAllReports(status);  // Fetch data based on new status
    });
  }

  petAllReports(status:string) {
    this.petService.getMissingPets(status).subscribe((response) => {
      this.reports = response;
      this.uniqueSpecies = [...new Set(this.reports.map((p: any) => p.species))];
    });
  }

  viewPetDetails(pet: any): void {
    Swal.fire({
      title: `<strong>${pet.petName}</strong>`,
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <img src="${this.getFullImagePath(pet.petPhoto)}" alt="Pet Photo" style="width: 200px; height: auto; margin-bottom: 15px;"/>
          <p><strong>Species:</strong> ${pet.species}</p>
          <p><strong>Breed:</strong> ${pet.petBreed}</p>
          <p><strong>Age:</strong> ${pet.petAge} years</p>
          <p><strong>Features:</strong> ${pet.petFeatures} years</p>
          <p><strong>Last Seen Date:</strong> ${this.getTimeAgo(pet.dateReported)}</p>
          <p><strong>Owner's Email:</strong> ${pet.userId?.email}</p>
          <p><strong>Owner's Mobile Number:</strong> ${pet.userId?.phoneNumber}</p>
          <p><strong>Last Seen Location:</strong></p>
          <div id="map" style="width: 100%; height: 300px;"></div>
        </div>
      `,
      didOpen: () => {
        // Initialize Mapbox map
        (mapboxgl as any).accessToken = this.mapboxToken;
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [pet.location?.longitude, pet.location?.latitude],
          zoom: 12
        });
  
        // Add a marker at the pet's last known location
        new mapboxgl.Marker()
          .setLngLat([pet.longitude, pet.latitude])
          .addTo(map);
      },
      width: '800px',
      showCloseButton: true,
      confirmButtonText: 'Close'
    });
  }
  

  getFilteredPets() {
    return this.reports.filter(pet => {
      // Filter by search name
      const matchesName = !this.searchText || pet.petName.toLowerCase().includes(this.searchText.toLowerCase());
  
      // Filter by species
      const matchesSpecies = !this.selectedSpecies || pet.species.toLowerCase() === this.selectedSpecies;

      // Filter by status
      const matchesStatus =
      Number(this.selectedStatus) === 2
        ? pet.status === 0 || pet.status === 1
        : !Number(this.selectedStatus) || pet.status === Number(this.selectedStatus);
      // Filter by location
      const matchesLocation = !this.searchLocation || pet.lastSeenAddress.toLowerCase().includes(this.searchLocation.toLowerCase());
  
      // Filter by last seen date
      const matchesDate = !this.selectedDate || new Date(pet.dateReported).toDateString() === new Date(this.selectedDate).toDateString();
  
      return matchesName && matchesSpecies && matchesStatus && matchesLocation && matchesDate;
    });
  }

  getPaginatedPets() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.getFilteredPets().slice(start, end);
  }

 
  

  totalPages(): number {
    return Math.ceil(this.getFilteredPets().length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getFullImagePath(petPhoto: string): string {
    return petPhoto ? `${this.imageURL}${petPhoto}` : 'assets/default-avatar.png';
  }

  getTimeAgo(date: string | Date): string {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
  
    for (const [unit, seconds] of Object.entries(intervals)) {
      const count = Math.floor(diffInSeconds / seconds);
      if (count >= 1) {
        return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
      }
    }
  
    return 'Just now';
  }
  
}

import { Component,OnInit,AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { debounceTime, filter,distinctUntilChanged  } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PetService } from 'src/app/services/pet.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-report-pet-form',
  templateUrl: './report-pet-form.component.html',
  styleUrls: ['./report-pet-form.component.css']
})
export class ReportPetFormComponent implements OnInit,AfterViewInit{
  petProfileForm: FormGroup;
  searchSubscription: Subscription | undefined;
  petPhotoPreview: string | ArrayBuffer | null = null;
  searchResults: any[] = []; // Store search results
  isDropdownVisible = false;
  selectedFile:any;
  lat: number | null = null;  // Store latitude
  lng: number | null = null;  // Store longitude
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map!: mapboxgl.Map;
  searchQuery: string = '';
  speciesList: string[] = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
    private mapboxToken = environment.MAPBOX_TOKEN;
  constructor(private fb: FormBuilder,private petservice:PetService,private toastr: ToastrService) {
    this.petProfileForm = this.fb.group({
      petName: ['', Validators.required],
      species: ['', Validators.required],
      petBreed: ['', Validators.required],
      lastSeenAddress:['', Validators.required],
      petAge: [null, [Validators.required, Validators.min(0)]],
      petFeatures: [''],
      petPhoto: [null, Validators.required]
    });
  }



  ngOnInit(): void {
    this.isDropdownVisible = false;
    (mapboxgl as any).accessToken = this.mapboxToken;

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ -74.5, 40 ], // Default to New York
      zoom: 9
    });

    new mapboxgl.NavigationControl();
    this.searchSubscription = this.petProfileForm.get('lastSeenAddress')?.valueChanges
    .pipe(
      debounceTime(500), // Wait for 500ms after typing stops
      filter(value => value && value.length >= 3), // Trigger only if 3+ characters
      distinctUntilChanged() // Only trigger if value has changed
    )
    .subscribe(value => {
      // Ensure no multiple concurrent API calls by unsubscribing from previous subscription
      if (this.searchSubscription && this.isDropdownVisible) {
        this.searchSubscription.unsubscribe();
      }
      this.fetchLocations(value);
    });
  }


  fetchLocations(searchQuery: string): void {
    this.isDropdownVisible = false;
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${this.mapboxToken}`)
      .then(res => res.json())
      .then(data => {
        if (data.features.length > 0) {
          this.searchResults = data.features; // Store suggestions
          this.isDropdownVisible = true;
        } else {
          this.searchResults = []; // Clear suggestions if no results
          this.isDropdownVisible = false;
        }
      });
  }

  selectLocation(place: any): void {
    const [lng, lat] = place.center;
    this.lng = lng; 
    this.lat = lat;
    this.petProfileForm.get('lastSeenAddress')?.setValue(place.place_name); // Auto-fill input

    this.map.flyTo({
      center: [lng, lat],
      zoom: 12,
      essential: true
    });

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
    this.searchResults = []; // Hide dropdown after selection
    this.isDropdownVisible = false;  
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if (!file) return;

        // Allowed file types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastr.error('Only JPG, JPEG, and PNG files are allowed.', 'Invalid File Type');
        this.petProfileForm.get('petPhoto')?.setErrors({ invalidType: true });
        return;
      }
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.toastr.error('File size must be less than 2MB.', 'File Too Large');
        this.petProfileForm.get('petPhoto')?.setErrors({ maxSizeExceeded: true });
        return;
      }
      this.selectedFile = input.files[0];
       this.petProfileForm.get('petPhoto')?.setErrors(null);
      const reader = new FileReader();
      reader.onload = () => {
        this.petPhotoPreview = reader.result;
        this.petProfileForm.patchValue({ petPhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.petProfileForm.valid) {
      const formData = new FormData();
      formData.append('petName', this.petProfileForm.get('petName')?.value);
      formData.append('species', this.petProfileForm.get('species')?.value);
      formData.append('petBreed', this.petProfileForm.get('petBreed')?.value);
      formData.append('lastSeenAddress', this.petProfileForm.get('lastSeenAddress')?.value);
      formData.append('petAge', this.petProfileForm.get('petAge')?.value);
      formData.append('petFeatures', this.petProfileForm.get('petFeatures')?.value || '');
      if (this.lat !== null && this.lng !== null) {
        const locationData = {
          latitude: this.lat,
          longitude: this.lng
        };
        formData.append('location', JSON.stringify(locationData)); // Convert object to JSON string
      }
      if (this.selectedFile) {
        formData.append('petPhoto', this.selectedFile);
      }
      formData.append('status', '0'); 
      this.petservice.submitPetForm(formData).subscribe(
        (response)=>{
          this.toastr.success('Report Added Successfully', 'Success');
          this.petProfileForm.reset();
          this.petPhotoPreview = null;
          this.lat = null; // Reset lat/lng
          this.lng = null;
        },
        (error) => {
          this.toastr.error(error, 'Failed');
          console.error('Error submitting form:', error);
        }
      )  
  
    } else {
      this.petProfileForm.markAllAsTouched();
    }
  }
  ngAfterViewInit() {
  
  }

  ngOnDestroy(): void {
    // Ensure to clean up the subscription when the component is destroyed
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}

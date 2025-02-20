import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Pet Finder';
  showLayout: boolean = true; // Determines whether to show header, sidebar, and footer
  currentPage='';
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(() => {
      // Hide header/footer/sidebar on login and register pages
      const currentRoute = this.router.url;
      this.showLayout = !(currentRoute.includes('/login') || currentRoute.includes('/register'));
    });
  }

  ngOnInit() {
  }


}

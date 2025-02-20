import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyPetsComponent } from './components/my-pets/my-pets.component';
import { ReportPetFormComponent } from './components/report-pet-form/report-pet-form.component';
import { MissingPetReportComponent } from './components/missing-pet-report/missing-pet-report.component';
//Admin'
import { UsersComponent } from './components/users/users.component';

import { AuthGuard } from './auth.guard';  // Import the guard

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'pet-users', component: UsersComponent,canActivate: [AuthGuard] },
  { path: 'my-pets', component: MyPetsComponent,canActivate: [AuthGuard] },
  { path: 'report-pet-form', component: ReportPetFormComponent,canActivate: [AuthGuard] },
  { path: 'pets/:any', component: MissingPetReportComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component,OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';  // Import the service
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phonenumber','status', 'created_date','actions'];
  dataSource!: MatTableDataSource<any>;
    allUsersRecords : any = [];
    constructor(private userService: UserService,private swalService:SwalService) {}
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    ngOnInit(): void {
      this.getAllUser();
    }

    getAllUser(){
      this.userService.getAllUsers().subscribe((response) => {
        this.allUsersRecords = response;
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.dataSource.filter = filterValue;
    }

    async editUser(obj:any){
      const isConfirmed = await this.swalService.showConfirmation('Are you sure?', 'You want change the status');
      if (isConfirmed) {
        this.userService.changeUserStatus(obj._id).subscribe((response) => {
          this.updateUserInDataSource(response.user);
          this.swalService.showSuccess(response.message);
        });
      }
    }


    updateUserInDataSource(updatedUser:any): void {
      const index = this.dataSource.data.findIndex(user => user._id === updatedUser._id);
      if (index !== -1) {
        this.dataSource.data[index] = updatedUser;
        this.dataSource.data = [...this.dataSource.data];
      }
    }

    async deleteUser(obj:any){
      const isConfirmed = await this.swalService.showConfirmation('Are you sure?', 'You want delete user');
      if (isConfirmed) {
        this.userService.deleteUser(obj._id).subscribe((response) => {
          this.removeUserFromDataSource(obj._id);
          this.swalService.showSuccess(response.message);
        });
      }
    }

    removeUserFromDataSource(userId: string): void {
      this.dataSource.data = this.dataSource.data.filter(user => user._id !== userId);
    }
  
}

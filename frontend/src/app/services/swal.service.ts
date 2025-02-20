import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }


 // Basic Alert
 showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') {
  Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
}

// Confirmation Dialog
showConfirmation(title: string, text: string, confirmText: string = 'Yes', cancelText: string = 'Cancel'): Promise<boolean> {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  }).then((result) => result.isConfirmed);
}

// Success Alert
showSuccess(message: string) {
  Swal.fire({ title: 'Success', text: message, icon: 'success', confirmButtonText: 'OK' });
}

// Error Alert
showError(message: string) {
  Swal.fire({ title: 'Error', text: message, icon: 'error', confirmButtonText: 'OK' });
}

// Auto Close Alert
showAutoCloseAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info', timer: number = 3000) {
  Swal.fire({ title, text, icon, timer, showConfirmButton: false });
}


}

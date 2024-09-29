import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCustomerComponent } from '../../customer/create-customer/create-customer.component';
import { CreatePinComponent } from '../create-pin/create-pin.component';

@Component({
  selector: 'app-pin-list',
  templateUrl: './pin-list.component.html',
  styleUrl: './pin-list.component.css',
})
export class PinListComponent implements OnInit {
  pins: any[] = [];
  constructor(private readonly modalService: NgbModal) {
  }
  ngOnInit(): void {
    this.getPins();
  }

   // Method to get pins data
   getPins() {
    // Get pins from localStorage
    this.pins = JSON.parse(localStorage.getItem('pins') || '[]');
  }

  // Method to open Add Customer modal
  openAddCusomerModal() {
    this.modalService.open(CreateCustomerComponent, { scrollable: true, size: 'lg' });
  }

  // Method to open Add Pin modal
  openAddPinModal() {
    const modalRef =  this.modalService.open(CreatePinComponent, { scrollable: true, size: 'lg' });
    modalRef.result.then(
      (_result) => {
        this.getPins();
      },
      (_reason) => {
        // console.log('Modal dismissed with reason:', _reason);
      }
    );
  }

}

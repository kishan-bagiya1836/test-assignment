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
    throw new Error('Method not implemented.');
  }

  openAddCusomerModal() {
    this.modalService.open(CreateCustomerComponent, { scrollable: true});
  }
  openAddPinModal() {
    const modalRef =  this.modalService.open(CreatePinComponent, { scrollable: true});
    modalRef.result.then(
      (result) => {
        console.log('Modal closed with:', result);
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason);
      }
    );
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSelectModule } from 'ngx-select-ex';
import { Subscription } from 'rxjs';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxSelectModule],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription(); // Initialize the Subscription
  customerForm!: FormGroup;
  regionsData: any[] = [];
  uniqueRegions: string[] = [];
  countries: string[] = []; 
  
  constructor(private fb: FormBuilder, private readonly customerService: CustomerService, public activeModal: NgbActiveModal) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      region: ['', Validators.required],
      country: ['']
    });
  }

  ngOnInit() {
    this.fetchRegions();
  }

  // Method to get countries by region
  getCountriesByRegion(regionName: string): string[] {
    return Object.values(this.regionsData)
      .filter(countryData => countryData.region === regionName)
      .map(countryData => countryData.country);
  }
  
  // Method to fetch regions
  fetchRegions() {
    this.subscription.add(
      this.customerService.getRegionList().subscribe((response: any) => {
        this.regionsData = response?.data ? Object.values(response?.data) : [];
        this.uniqueRegions = [...new Set(this.regionsData.map(item => item.region))];
      })
    );
  }

  // Method to get countries
  getCountries(regionName: string) {
    if (regionName) {
      this.countries = this.getCountriesByRegion(regionName);
    }
  }

  // Method to save customer data in localStorage
  saveCustomerData(data: any): void {
    // Get existing customers from localStorage
    const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    // Add the new customer to the array
    existingCustomers.push(data);
    // Store the updated array back to localStorage
    localStorage.setItem('customers', JSON.stringify(existingCustomers));
   
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      this.saveCustomerData(customerData);
      alert('Customer saved successfully!');
      this.customerForm.reset();
      this.cancel('Success');
    } else {
      alert('Please fill in all required fields.');
      // Mark all controls as touched to show validation errors
      this.customerForm.markAllAsTouched();
    }
  }

  // Method to cancel form and close modal
  cancel(action: string = 'Canceled'): void {
    this.activeModal.close(action);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.subscription.unsubscribe();
  }
}

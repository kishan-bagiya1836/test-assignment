import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { CustomerService } from '../../customer/services/customer.service';

@Component({
  selector: 'app-create-pin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxSelectModule, FileUploadModule ],
  templateUrl: './create-pin.component.html',
  styleUrl: './create-pin.component.css'
})
export class CreatePinComponent implements OnInit {
  pinForm!: FormGroup;
  uploader: FileUploader;
  collaboratorsList: any[] = []; 
  selectedFile = false;
  imageDataUrl: string | null = null;
  constructor(private fb: FormBuilder, private readonly customerService: CustomerService, public activeModal: NgbActiveModal) {
    
   // Initialize uploader (without URL since we are uploading to localStorage)
   this.uploader = new FileUploader({
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 2 * 1024 * 1024, // 2 MB
      url: ''
    });

    // Initialize form  
    this.pinForm = this.fb.group({
      title: ['', Validators.required],
      image: [null], // Single image, drag and drop feature
      collaborators: [[], Validators.required], // Multi-select for collaborators
      privacy: ['Public', Validators.required], // Radio buttons for privacy
    });

    // Hook to uploader when file is added
     this.uploader.onAfterAddingFile = (file) => {
      this.readImage(file._file); // Pass file to readImage for storing it in localStorage
    };
  }

  ngOnInit(): void {
    this.selectedFile = false;
    this.getCustomers();
  }

  // Method to read image file
  readImage(file: any): void {
    this.selectedFile = false;
    const reader = new FileReader();
    if (file && file.type.startsWith('image/')) {
      reader.onload = (e: any) => {
        // Store the base64 image in localStorage
        const imageBase64 = e.target.result;
        this.selectedFile = true;
        this.imageDataUrl = imageBase64;
      };
    
      reader.readAsDataURL(file);  // Read the file as base64 if it's an image
    } else {
      console.error('Only image files are allowed');
      file.target.value = '';  // Clear the file input field
    }
  }

  // Method to get customers data
  getCustomers(): void {
    const customersData = localStorage.getItem('customers');
    if (customersData) {
      this.collaboratorsList = JSON.parse(customersData);
    }
  }

  // Method to save data to localStorage
  saveToLocalStorage(pinData: any) {
    const existingPins = (localStorage.getItem('pins')) ? JSON.parse(localStorage.getItem('pins') || '[]') : [] ;
    existingPins.push(pinData);
    try {
      localStorage.setItem('pins', JSON.stringify(existingPins));
      alert('Pin saved successfully!');
    } catch (err) {
      alert(err);
    }
    this.uploader.clearQueue(); // Clear the uploaded files
  }

  // Method to submit form
  onSubmit(): void {
    if (this.pinForm.valid) {
      const formData = this.pinForm.value;

      const pinData = {
        title: formData.title,
        collaborators: formData.collaborators,
        privacy: formData.privacy,
        image: this.imageDataUrl
      }

      this.saveToLocalStorage(pinData);
      this.pinForm.reset();
      this.cancel('Success');
    } else {
      alert('Please fill in all required fields.');
       // Mark all controls as touched to show validation errors
       this.pinForm.markAllAsTouched();
    }
  }

  // Method to cancel form and close modal
  cancel(action: string = 'Canceled'): void {
    this.activeModal.close(action);
  }
}

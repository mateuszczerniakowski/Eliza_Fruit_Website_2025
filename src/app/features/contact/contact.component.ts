import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // Here you would typically send the form data to a service
      this.translateService.get('CONTACT.SUCCESS_MESSAGE').subscribe(message => {
        alert(message);
      });
      this.contactForm.reset();
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      const fieldNameUpper = fieldName.toUpperCase();
      if (field.errors['required']) {
        return this.translateService.instant(`CONTACT.VALIDATION.${fieldNameUpper}_REQUIRED`);
      }
      if (field.errors['email']) {
        return this.translateService.instant('CONTACT.VALIDATION.EMAIL_INVALID');
      }
      if (field.errors['minlength']) {
        return this.translateService.instant(`CONTACT.VALIDATION.${fieldNameUpper}_MIN_LENGTH`);
      }
      if (field.errors['pattern']) {
        return this.translateService.instant('CONTACT.VALIDATION.PHONE_INVALID');
      }
    }
    return null;
  }
}
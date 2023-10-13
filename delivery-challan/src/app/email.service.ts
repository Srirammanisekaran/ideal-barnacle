import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  sendEmailWithAttachment(pdfBlob: Blob) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}

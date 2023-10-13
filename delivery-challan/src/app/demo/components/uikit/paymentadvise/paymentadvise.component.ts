import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//import { Product } from 'src/app/demo/api/product';
//import { ProductService } from 'src/app/demo/service/product.service';


interface Product {
  sno: number;
  code: string;
  description: string;
  hsn: string;
  nop: string;
  qty: number;
  eom: string;
  rate: number;
  evalue: number;
}

@Component({
  templateUrl: './paymentadvise.component.html',
  styleUrls: ['./paymentadvise.component.css']
})
export class PaymentadviseComponent implements OnInit{
  deliveryChallanForm: FormGroup;

  date: Date | undefined;
  rdate: Date | undefined;
    
  products: Product[] = [];
  snoCounter = 1;
  
 

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    this.deliveryChallanForm = this.formBuilder.group({
      rdcno: ['', Validators.required],
      date: ['', Validators.required],
      billto: ['', Validators.required],
      shipto: ['', Validators.required],
      vehicleno: ['', Validators.required],
      gstinbill: ['', Validators.required],
      gstinship: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      returndate: ['', Validators.required],
      // Add form controls for other details
    });
  }

  addRow() {
    this.products.push({sno: this.snoCounter++, code: "", description: "", hsn: "", nop: "", qty: 0, eom: "", rate: 0, evalue: 0});
  }

  deleteRow(index: number) {
    this.products.splice(index, 1);
  }

  onEnterKey(index: number) {
    const nextRowIndex = index + 1;

    if (nextRowIndex === this.products.length) {
      this.addRow();
  }
}
  submitForm() {
    if (this.deliveryChallanForm.valid) {
      // Submit the form data to the backend or perform further actions
    }
  }

  resetForm() {
    this.deliveryChallanForm.reset();
  }

  previewPDF() {
    const documentDefinition = {
      pageMargins: [ 20, 30, 20, 30 ],

      content: [
    
          {
          text: '\nReturnable Delivery Challan',
          style: 'header',
          alignment: 'center'
        },
        { 
            table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            { text: 'No: XXXXXXXX',alignment: 'left',	fontSize: 11, border: [true, true, false, false] },
                            { text: 'Date and Time: 28/09/2023', alignment: 'right', fontSize: 11, border: [false, true, true, true] }
                        ],
                        [
                            { text: [ {text: '\nEase Digitronics Private Limited,', bold: true}, '\n 134, First floor, Dr Rajendra Prasad Rd, 2nd Street Extension, Gandhipuram,\n Coimbatore, Tamil Nadu 641012\n\n'], fontSize: 11, border: [true, true, false, false] },
                            { text: [ {text: '\nFCS MassTech,', bold: true},'\n46, Sivaraj 1st Cross St, Sakthivel Nagar, Kannadapalayam, Puzhal, \nChennai, Lyon, Tamil Nadu 600066\n\n'],fontSize: 11, border: [false, true, true, true] }
                        ],
                        [
                            { text: [ {text: '\nGSTIN No.: XXXXXXXXXXXX\nVehicle No.: XXXXXXXXXXXX\n Return Date: DD/MM/YY\n\n'}], fontSize: 11, border: [true, true, false, true]},
                            { text: [ {text: '\nGSTIN No.: XXXXXXXXXXXX\nEmail ID: XXXX@gmail.com\nPhone: +91-XXXXXXXX\n\n'}], fontSize: 11, border: [false, true, true, true]  }
                        ]
                    ]
                }
            },
        { 
            table: {
                    widths: ['*'],
                    body: [
                        [
                            { text: 'Part I', alignment: 'center', fontSize: 12, border: [true, false, true, true] },
                            
                        ],
                        
                    ]
                }
            },
        {
          style: 'tableExample',
          headerRows: 1,
          table: {
            body: [
                [{text: 'Sl.No', style: 'tableHeader'}, {text: 'Item Code', style: 'tableHeader'}, {text: 'Item Description', style: 'tableHeader'}, {text: 'HSN Code', style: 'tableHeader'}, {text: 'Nature of Processing', style: 'tableHeader'}, {text: 'Qty', style: 'tableHeader'}, {text: 'UOM', style: 'tableHeader'}, {text: 'Rate', style: 'tableHeader'}, {text: 'Estimated Value', style: 'tableHeader'}],
              ['1', 'XXXXX', '3M 8882 High Gel for Loaded', '3214', '', '1.00', 'Packet', '3839.63', '3839.63']
            ]
          },
          layout: 'lightHorizontalLines'
        },
        { 
            table: {
                    widths: [100, '*', 100, 100],
                    body: [
                        [
                            { text: '\nAmount in Words:\n\n', fontSize: 11, border: [false, true, false, true] },
                            { text: '\nThree Thousand Eight Hundreden Thirty Nine And Sixty Three Paisa Only\n\n', fontSize: 11, border: [false, true, false, true] },
                            { text: '\nTotal\n\n', fontSize: 11, border: [false, true, false, true] },
                            { text: '\n3839.63\n\n', fontSize: 11, alignment:'right', border: [false, true, false, true] }
                        ]
                    ]
                }
            },
            { 
            table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            { text: 'Expected Duration of Processing (Days) : 180', alignment: 'center', fontSize: 11, border: [false, false, false, false] },
                            { text: '',  style: 'textbold', border: [false, false, false, false] }
                        ],
                        
                    ]
                }
            },
        '\n\n\n\n',
        {
          columns: [
            {
                width: 350,
              text: '',
              alignment: 'left'
            },
            {
              text: 'Signature of Manufacturer\nAutorized Signatory\nfor Ease Digitronics Pvt Ltd.',
              alignment: 'center',
              fontSize: 11
            }
          ]
        },
            { 
            table: {
                    widths: ['*'],
                    body: [
                        [
                            { text: 'Part II', alignment: 'center', fontSize: 12, border: [false, false, false, true] },
                            
                        ],
                        
                    ]
                }
            },
             { 
            table: {
                    widths: ['*'],
                    body: [
                        [
                            { text: '\n1) Date & time of despatch of finished goods to parent factory/ another manufacturer and entry No. and date of receipt in the account in the processing factory\n 2) Quantity despatched (No./Weight/Litre/Meter) entered in account\n 3) Nature of processing/manufacturing done\n 4) Quantity of waste material return to parent factory of cleared for home consumption. Invoice No. & date Quantum of duty paid (both in words & figures)', fontSize: 11, border: [false, false, false, false]},
                        ],
                        
                    ]
                }
            },
        
        '\n\n\n\n\n\n',
        { 
            table: {
                    widths: [350, '*'],
                    body: [
                        [
                            { text: 'Place : TSD-BANGALORE \n\nDate :30-12-2022', alignment: 'left', fontSize: 11, border: [false, false, false, false] },
                            { text: 'Signature of Processor\nName and Address of Factory\nAuthorized Signatory', alignment: 'center', fontSize: 11,  border: [false, false, false, false] }
                        ],
                        
                    ]
                }
            },
      ],
      background: function (currentPage, pageSize) {
            return [
                {
                    canvas: [
                        { type: 'line', x1: 20, y1: 30, x2: 575, y2: 30, lineWidth: 1 }, //Up line
                        { type: 'line', x1: 20, y1: 30, x2: 20, y2: 800, lineWidth: 1 }, //Left line
                        { type: 'line', x1: 20, y1: 800, x2: 575, y2: 800, lineWidth: 1 }, //Bottom line
                        { type: 'line', x1: 575, y1: 30, x2: 575, y2: 800, lineWidth: 1 }, //Rigth line
                    ]
    
                }
            ]
        },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          fontSize: 11,
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black',
          alignment: 'center'
        },
        textbold: {
            bold: true
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    };
    
    pdfMake.createPdf(documentDefinition).open();
  }

  sendEmail() {
    // Implement the logic to send the generated PDF via email
  }
  
}
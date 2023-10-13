import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { DataService } from 'src/app/data.service';
import { DatePipe } from '@angular/common';
import { ToWords } from 'to-words';
interface Code {
  code: number;
}
interface Year {
  year: number;
}
interface Doc {
  type: string;
}
@Component({
  templateUrl: './rdc.component.html',
  styleUrls: ['./rdc.component.css']
})
export class RdcComponent implements OnInit{
  data: any;
  li:any;
  lis=[];
  selectedValue: any;
  selectedData: any[] = [];
  dataOptions: any[] = [];
  vendorOptions: any[] = [];
  selectedOption: any[] = [];
  selectedVendor: any[] = [];
  companycode: Code[] | undefined;
  selectedCode: Code | undefined;
  finyear: Year[] | undefined;
  selectedyear: Year | undefined;
  doctype: Doc[] | undefined;
  selectedtype: Doc | undefined;
  filterdate: Date | undefined;
  invoicedata: any[] = [];
  netAmount: number = 0;
constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private dataService: DataService, private _http: HttpClient) { }
  
 
  ngOnInit(): void {

    const apiUrl = 'https://my403075-api.s4hana.cloud.sap/sap/opu/odata/sap/API_OPLACCTGDOCITEMCUBE_SRV/A_OperationalAcctgDocItemCube'; // Replace with the actual API URL
      const username = 'APIUSER';
      const password = 'Essae@54321Essae@12345';
    
      // Create the headers and set the Authorization header with the credentials
      const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa(username + ':' + password));
    
      this._http.get(apiUrl, { headers })
      .subscribe((response :any) => {
        this.li=response;
        this.lis = this.li.d.results;
        this.dataOptions = this.getUniqueOptions(this.lis);
        this.vendorOptions = this.getUniqueVendor(this.lis);
        console.log(this.lis);   
      });
       
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.companycode = [
      { code: 1000 },
      { code: 2000 },
      { code: 3000 }
  ];
  this.finyear = [
    { year: 2022 },
    { year: 2023 },
    { year: 2024 },
    { year: 2025 },
    { year: 2026 },
    { year: 2027 },
    { year: 2028 },
    { year: 2029 },
    { year: 2030 }
];
this.doctype = [
  { type: 'KZ' }
  
];
  let today = new Date();
        this.filterdate = today;
  }
  
  onOptionSelect(event: any) {
    this.selectedData = []; // Clear previous selection
    if (this.selectedOption ) {
      
      // const selectedOptionData = this.lis.find(option => option.AccountingDocument === this.selectedOption);
      const selectedOptionData = this.lis.filter(obj => obj.AccountingDocument === this.selectedOption);
      this.selectedData = selectedOptionData;
      console.log(this.selectedData);
    }
   
  }

  getUniqueOptions(data: any[]): any[] {
    const uniqueOptions = [];

    data.forEach((item) => {
      const option = item.AccountingDocument; // Replace with the property you want to use as the option value

      if (!uniqueOptions.includes(option)) {
        uniqueOptions.push(option);
      }
    });
    
    return uniqueOptions;
  }
  getUniqueVendor(data: any[]): any[] {
    const uniqueOptions = [];

    data.forEach((item) => {
      const option = item.Supplier; // Replace with the property you want to use as the option value

      if (!uniqueOptions.includes(option)) {
        uniqueOptions.push(option);
      }
    });

    return uniqueOptions;
  }
  convertTimestamp(timestamp: string) {
    if(timestamp == "" || timestamp == null){
      return timestamp;
    }else{
    const date = timestamp.slice(6,-2);
    //console.log(date);
    const sdate:number = Number(date);
    const fdate = new Date(sdate);
    return this.datePipe.transform(fdate, 'yyyy-MM-dd');} // Adjust the desired date format
  }
 numbertoword(number: number){
  const toWords = new ToWords();
  const words = toWords.convert(number);
  return words;
 }

calculateNetAmount() {
    //const totalAmounts = this.invoicedata.map(item => item.AmountInTransactionCurrency); // Extract the amounts into an array
    const netAmount = this.invoicedata.reduce((acc, item) => acc + (parseFloat(item.AmountInTransactionCurrency)* -1), 0); // Calculate the sum of amounts
    return netAmount.toFixed(2);
}

private generateTableBody(data: number) {
    const tableBody = [];
    this.invoicedata = [];
    const invData = this.lis.filter(obj => obj.ClearingAccountingDocument === data && obj.AccountingDocumentType !== 'KZ');
    this.invoicedata = invData;
    //console.log(this.invoicedata);
    if (this.invoicedata && Array.isArray(this.invoicedata)) {
      this.invoicedata.forEach((item) => {
        const invdate = this.convertTimestamp(item.DocumentDate);
        const invno = item.DocumentReferenceID;
        const invamt = { text: item.AmountInCompanyCodeCurrency * -1, alignment: 'right'};
        const tdsamt = { text: item.WithholdingTaxAmount * -1, alignment: 'right'};
        const cpayment = { text: item.AmountInTransactionCurrency * -1, alignment: 'right'};
        tableBody.push([invdate, invno, invamt, tdsamt, cpayment],);
      });
    }
    const table = tableBody;
      //console.log(tableBody);
    return tableBody;
  }

  previewPDF(item:any, amt:any) {
    const index = this.selectedData.findIndex(x => x.AccountingDocument === item && x.AmountInTransactionCurrency === amt);
    // const invData = this.lis.filter(obj => obj.ClearingAccountingDocument === item);
    // this.invoicedata = invData;
    var documentDefinition = {
      pageMargins: [ 30, 30, 30, 30 ],
      content: [
      {
        text: '\nPayment Advise',
        style: 'header',
        alignment: 'center'
        
      },
      "\n",
          {
        columns: [
          {
            width: 200,
            text: 'To,\n' + this.selectedData[index].SupplierName,
            fontSize: 11,
          },
          {
            width: '*',
            text: 'Date:   '+this.convertTimestamp(this.selectedData[index].PostingDate) +'\nRef.No.:     '+this.selectedData[index].DocumentReferenceID ,
            fontSize: 10,
            alignment: 'right'
          }
        ]
      },
          {
              text:"\n 60 Days from the date of GRN.",
              alignment: 'right'
          },
          "\n",
          {
              text:"\n Dear Sir / Madam,\nWe have pleasure in transferring through Bank",
          },
          "\n",
          {
        columns: [
          {
            width: 200,
            text: 'Bank',
            bold: true
          },
          {
            width: '*',
            text: 'Transfer Date',
            bold: true
          },
          {
            width: '*',
            text: 'Reference',
            bold: true
          }
        ]
      },
      {
        columns: [
          {
            width: 200,
            text: this.selectedData[index].HouseBank
          },
          {
            width: '*',
            text: this.convertTimestamp(this.selectedData[index].PostingDate)
          },
          {
            width: '*',
            text: this.selectedData[index].DocumentReferenceID
          }
        ]
      },
          "\n",
      
      { 
          table: {
                  widths: ['*'],
                  body: [
                      [
                          { text: '', alignment: 'center', fontSize: 12, border: [false, false, false, true] },
                          
                      ],
                      
                  ]
              }
          },
          "\n",
          {
            columns: [
              {
                width: '*',
                text: 'Invoice/DN Date',
                bold: true,
                alignment: 'center'
              },
              {
                width: '*',
                text: 'Invoice/DN No.',
                bold: true,
                alignment: 'center'
              },
              {
                width: '*',
                text: 'Invoice/DN Amount',
                bold: true,
                alignment: 'center'
              },
              {
                width: '*',
                text: 'TDS Amount',
                bold: true,
                alignment: 'center'
              },
              {
                width: '*',
                text: 'Current Payment',
                bold: true,
                alignment: 'center'
              }
            ]
          },
      // {
      //   style: 'tableExample',
      //   table: {
      //     widths: ['*', '*', '*', '*', '*'],
      //     body: [
      //       [{text: 'Invoice/DN Date', style: 'tableHeader'}, {text: 'Invoice/DN No.', style: 'tableHeader'}, {text: 'Invoice/DN Amount', style: 'tableHeader'},  {text: 'TDS Amount', style: 'tableHeader'}, {text: 'Current Payment', style: 'tableHeader'}],
      //     ]
      //   },
      //   layout: 'lightHorizontalLines'
      // },
      "\n",
      { 
        table: {
                widths: ['*'],
                body: [
                    [
                        { text: '', alignment: 'center', fontSize: 12, border: [false, false, false, true] },
                        
                    ],
                    
                ]
            }
        },
        
      {
        style: 'tableExample',
        table: {
          widths: ['*', '*', '*', '*', '*'],
          body: 
            
            this.generateTableBody(this.selectedData[index].AccountingDocument),
          
        },
        layout: 'lightHorizontalLines'
      },
      {
        columns: [
          {
            width: '*',
            text: 'Amount in Words : '+ this.numbertoword(this.calculateNetAmount())+' Only',
            fontSize: 10,
            bold: true
          }
        ]
      },
      '\n',
      {
        columns: [
          {
            width: '*',
            text: 'Net Amount Paid :        '+ this.calculateNetAmount(),
            fontSize: 11,
            bold: true,
            alignment: 'right'
          }
        ]
      },
      '\n',
      {
        columns: [
          {
            width: '*',
            text: 'Remarks :',
            fontSize: 11,
            bold: true,
            alignment: 'left'
          }
        ]
      },
      {
        columns: [
          {
            width: '*',
            text: this.selectedData[index].DocumentItemText,
            fontSize: 11,
            alignment: 'left'
          }
        ]
      },
        
      '\n\n',
      {
        columns: [
        
          {
            text: 'Finance Department Address:',
            fontSize: 11,
            bold: true
          }
        ]
      },
          {
        columns: [
        
          {
            text: 'Essae Gears and Transmissions Pvt Ltd.,\n#13 (old 246), 13th Cross, 3rd Floor,\nWilson Garden, Bangalore-560 027\nPhone : 080-40834777',
            fontSize: 11,
          }
        ]
      },
      '\n',
          { 
          table: {
                  widths: ['*'],
                  body: [
                      [
                          { text: '', alignment: 'center', fontSize: 12, border: [false, false, false, true] },
                          
                      ],
                      
                  ]
              }
          },
      
      '\n\n\n\n',
      {
        columns: [
          {
            width: '*',
            text: '',
          },
          {
            width: '*',
            text: 'For Essae Gears and Transmissions Pvt Ltd',
            bold: true,
            alignment: 'center'
          }
        ]
      },
      {
        columns: [
          {
            width: '*',
            text: '',
          },
          {
            width: '*',
            text: '( CIN No. U36995KA2018PTC111913)',
            fontSize: 10,
            alignment: 'center'
          }
        ]
      },
      '\n\n',
        {
        columns: [
          {
            width: '*',
            text: '',
          },
          {
            width: '*',
            text: 'Authorised Signatory',
            fontSize: 10,
            alignment: 'center'
          }
        ]
      },
    ],
  
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
        alignment: 'left'
      },
      textbold: {
          bold: true
      }
    },
    defaultStyle: {
      // alignment: 'justify'
      fontSize: 11
    }
    };
    
    pdfMake.createPdf(documentDefinition).open();
 
  }

  sendEmail() {
    // Implement the logic to send the generated PDF via email
  }
  
}
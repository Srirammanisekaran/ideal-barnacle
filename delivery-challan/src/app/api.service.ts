import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseString } from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getDataFromXmlApi(): Observable<any> {
    const apiUrl = 'https://my403075-api.s4hana.cloud.sap/sap/opu/odata/sap/API_OPLACCTGDOCITEMCUBE_SRV/A_OperationalAcctgDocItemCube?$top=2'; // Replace with the actual API URL
    const username = 'APIUSER';
    const password = 'Essae@54321Essae@12345';
  
    // Create the headers and set the Authorization header with the credentials
    const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa(username + ':' + password));
    return this.http.get(apiUrl, {headers, responseType: 'text' }).pipe(
      map(response => this.parseXmlResponse(response))
    );
  }

  

   private parseXmlResponse(response: string): any {
    let parsedData: any;

    parseString(response, { trim: true }, (err, result) => {
      if (err) {
        throw new Error('Failed to parse XML response');
      }
      parsedData = result;
    });

    return parsedData;
  }
}
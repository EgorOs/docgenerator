import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ContextService {

  constructor(private http: HttpClient) { }


  // public context: Observable<any>;

  context = '';

  getValFromEndpoint(): void {
    this.http.get('http://127.0.0.1:3000/context').subscribe((data:any) => {
      console.log(data)
      this.context = data;
    }, error => {
      console.log("There was an error:", error);
    });
  }

  search(): Observable<any>{
      return this.http.get('http://127.0.0.1:3000/context')
  }

  getNewContext(): void {
    // this.search()
    // this.context = this.search()
    this.getValFromEndpoint()
  }

}

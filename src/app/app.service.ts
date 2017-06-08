import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppService {
    private _url = '../data.json';
    private result: any;
    constructor(private _http: Http) { }

    getJSONData(): any {
        return this._http.get(this._url)
            .toPromise()
            .then(response => response.json().data || [])
            .catch(this.handleError);
            
    } 

    private handleError(error: any): Promise<any> {
        console.error('An error occurred in httpget', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    }
    

   
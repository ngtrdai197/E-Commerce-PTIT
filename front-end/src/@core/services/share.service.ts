import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API } from '../config/API';

@Injectable({
    providedIn: "root"
})
export class ShareService {
    private eventEmitter = new BehaviorSubject<boolean>(true);
    constructor(private http: HttpClient) { }

    sentEmail(body: any) {
        return this.http.post(`${API.HOST}/api/feedback`, body);
    }

    setEventEmitter(state: boolean) {
        this.eventEmitter.next(state);
    }

    getEventEmitter() {
        return this.eventEmitter.asObservable();
    }
}
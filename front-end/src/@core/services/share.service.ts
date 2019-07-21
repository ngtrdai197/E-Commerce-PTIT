import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class ShareService {
    private isToggleSideMenu = new BehaviorSubject<boolean>(true);
    constructor() { }

    setToggleSideBar(isToggle: boolean){
        this.isToggleSideMenu.next(isToggle);
    }

    getToggleSideBar(){
        return this.isToggleSideMenu.asObservable();
    }
}
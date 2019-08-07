import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  lat: number = 10.848552;
  lng: number = 106.787487;
  constructor() { }

  ngOnInit() {
  }

}

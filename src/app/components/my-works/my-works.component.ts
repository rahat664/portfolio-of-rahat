import { Component } from '@angular/core';

@Component({
  selector: 'app-my-works',
  templateUrl: './my-works.component.html',
  styleUrls: ['./my-works.component.css']
})
export class MyWorksComponent {
  // This unused legacy section must not present unrelated demo repositories.
  cardData: Array<{imageUrl:string;title:string;likes:string;comments:string;description:string;gitLink:string;browserLink:string}> = [];
}

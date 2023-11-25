import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router:Router){}

  ngOnInit(): void {
    
  }

  doSearch(myInput:string){
    console.log(`myInput=${myInput}`);
    this.router.navigateByUrl(`/search/${myInput}`);

  }
}

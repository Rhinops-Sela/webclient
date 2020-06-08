import { Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-toolbar-component',
  templateUrl: './toolbar-component.component.html',
  styleUrls: ['./toolbar-component.component.scss']
})

export class ToolbarComponentComponent implements OnInit {
  faGithub = faGithub;

  constructor() { }

  ngOnInit(): void {
  }





}

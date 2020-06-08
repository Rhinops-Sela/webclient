import { Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { GlobalProviderService } from 'src/app/services/global-provider/global-provider.service';
@Component({
  selector: 'app-toolbar-component',
  templateUrl: './toolbar-layout.component.html',
  styleUrls: ['./toolbar-layout.component.scss']
})

export class ToolbarComponent implements OnInit {
  faGithub = faGithub;
  displayNameDomain: string;
  constructor(public globalService: GlobalProviderService) { }

  ngOnInit(): void {
    this.displayNameDomain = 'Home';
    this.globalService.refreshRequired.subscribe(required => {
      if (required) {
        const activeDomain = this.globalService.getActiveDomain();
        if (activeDomain) {
          this.displayNameDomain = activeDomain.displayName;
        } else {
          this.displayNameDomain = 'Home';
        }

      }
    });
  }





}

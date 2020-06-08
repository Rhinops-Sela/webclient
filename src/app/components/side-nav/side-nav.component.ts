import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalProviderService } from 'src/app/services/global-provider/global-provider.service';
import { IDomain } from 'src/app/interfaces/IDomain';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  domains: IDomain[];
  constructor(private domainService: GlobalProviderService, private router: Router) {
    this.domainService.refreshRequired.subscribe(() => {
      this.loadForm();
    });

  }

  ngOnInit(): void {
    this.loadForm();

  }


  private loadForm() {
    this.domainService.getAllDomains().then(form => {
      this.domains = form;
    }).catch(() => {
      this.router.navigate(['']);
    });
  }

  domainSelected(domain: IDomain) {
    this.domainService.onDomainChange(domain);
    this.router.navigate(['/pages']);
  }
}

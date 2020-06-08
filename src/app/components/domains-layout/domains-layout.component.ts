import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDomain } from 'src/app/interfaces/IDomain';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalProviderService } from 'src/app/services/global-provider/global-provider.service';
@Component({
  selector: 'app-domain-layout',
  templateUrl: './domains-layout.component.html',
  styleUrls: ['./domains-layout.component.scss'],
})

export class DomainsLayoutComponent implements OnInit {
  public domains: IDomain[];
  @Input() selectedDomain: IDomain;
  form: FormGroup;
  constructor(public domainService: GlobalProviderService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.domainService.getAllDomains().then(form => {
      this.domains = form;
    }).catch(() => {
      this.router.navigate(['']);
    });
  }
  public selectDomain(domain: IDomain) {
    this.domainService.onDomainChange(domain);
    this.router.navigate(['/pages']);
  }
}

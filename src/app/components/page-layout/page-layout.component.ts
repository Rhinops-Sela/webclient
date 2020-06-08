import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GlobalProviderService } from 'src/app/services/global-provider/global-provider.service';
import { IPage } from 'src/app/interfaces/IPage';
import { FormProviderService } from 'src/app/services/form-provider/form-provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-component',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
})
export class PageLayoutComponent implements OnInit {
  private formReset = false;
  form: FormGroup;
  page: IPage;

  constructor(
    public formService: FormProviderService,
    private globalService: GlobalProviderService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.page = this.globalService.getActivePage();
    this.globalService.refreshRequired.subscribe(required => {
      if (required) {
        this.loadPage();
      }
    });
    this.loadPage();
  }

  private loadPage() {
    this.page = this.globalService.getActivePage();
    if (!this.page || !this.page.inputs) {
      this.router.navigate(['']);
    } else {
      this.form = this.formService.toFormGroup(this.page.inputs);
    }

  }
  onSubmit() {
    if(this.formReset){
      this.formReset = false;
      return;
    }
    this.globalService.savePage(this.page, this.form);
    if (!this.formReset) {
      this.globalService.setDomainIcon(true);
    }
    this.formReset = false;
    this.router.navigate(['pages']);
  }

  onReset() {
    this.formReset = true;
    this.form.reset();
    this.globalService.resetPage(this.page);
  }
}

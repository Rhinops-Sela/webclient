import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/services/global/global.service';
import { IPage } from 'src/app/interfaces/IPage';
import { FormService } from 'src/app/services/form/form.service';
import { Router } from '@angular/router';
import { IRefreshRequried } from 'src/app/interfaces/IRefreshRequried';

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
    public formService: FormService,
    private globalService: GlobalService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.page = this.globalService.getActivePage();
    if (!this.page || !this.page.inputs) {
      this.router.navigate(['']);
    }
    this.globalService.refreshRequired.subscribe((result: IRefreshRequried) => {
      if (result.pageChanged) {
        this.page = this.globalService.getActivePage();
        this.form = this.formService.toFormGroup(this.page.inputs);
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

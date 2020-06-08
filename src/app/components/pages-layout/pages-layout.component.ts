import { Component, OnInit } from '@angular/core';
import { GlobalProviderService } from 'src/app/services/global-provider/global-provider.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IPage } from 'src/app/interfaces/IPage';
import { IDomain } from 'src/app/interfaces/IDomain';
@Component({
  selector: 'app-page-layout',
  templateUrl: './pages-layout.component.html',
  styleUrls: ['./pages-layout.component.scss']
})
export class PagesLayoutComponent implements OnInit {
  activeDomain: IDomain;
  page: IPage;
  constructor(public globalService: GlobalProviderService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.globalService.refreshRequired.subscribe(required => {
      if (required) {
        this.activeDomain = this.globalService.getActiveDomain();
      }
    });
    this.activeDomain = this.globalService.getActiveDomain();
  }


  public selectPage(page: IPage) {
    this.globalService.onPageChange(page);
    this.router.navigate(['/page']);
  }
  public trackbyFn(index: number, item: any) {
    return index;
  }

  public clone(page) {
    this.globalService.clonePage(page);
  }

  delete(page: IPage) {
    this.globalService.deletePage(page);

  }

  canDelete(page) {
    return this.globalService.canDelete(page);
  }



}

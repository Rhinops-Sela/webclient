import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IDomain } from 'src/app/interfaces/IDomain';
import { GlobalProviderService } from 'src/app/services/global-provider/global-provider.service';
@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  domainList: IDomain[];
  panelOpenState = true;
  constructor(public globalService: GlobalProviderService, public dialogRef: MatDialogRef<ConfirmationModalComponent>
  ) {
    this.domainList = [];
  }

  ngOnInit(): void {
    this.globalService.getAllDomains().then(domainList => {
      this.domainList = JSON.parse(JSON.stringify(domainList)) as IDomain[];
      this.getModifiedList();
    });
  }

  private getModifiedList() {
    const modifiedList: IDomain[] = [];
    this.domainList.forEach(domain => {
      const domainClone = JSON.parse(JSON.stringify(domain)) as IDomain;
      const pages = domainClone.pages.filter(page => {
        return page.modified === true;
      });
      domainClone.pages = pages;
      modifiedList.push(domainClone);
    });
    this.domainList = modifiedList;
  }


  complete(confirm: boolean) {
    this.dialogRef.close(confirm);
  }
}

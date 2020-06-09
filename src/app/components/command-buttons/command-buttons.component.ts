import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { DeploymentProgressModalComponent } from '../deplopyment-progress-modal/deployment-progress-modal.component';
import { IDomain } from 'src/app/interfaces/IDomain';
@Component({
  selector: 'app-command-buttons',
  templateUrl: './command-buttons.component.html',
  styleUrls: ['./command-buttons.component.scss']
})
export class CommandButtonsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  uploader: any;
  form: IDomain[];
  constructor(private globalService: GlobalService, private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  home() {
    this.router.navigate(['']);
    this.globalService.resetActiveDomainText()
  }

  deleteAll() {
    this.globalService.clearAll();
    this.router.navigate(['']);
  }
  async export() {
    try {
      this.form = await this.globalService.getAllDomains();
      const domains = this.form;
      const jsonFormat = JSON.stringify(domains);
      const blob = new Blob([jsonFormat], { type: 'text/plain;charset=utf-8' });
      saveAs.saveAs(blob, `fennec_${new Date().toISOString()}.json`);
    } catch (error) {
      ///TODO: handle error
      console.log(error);
    }

  }
  upload() {
    this.fileInput.nativeElement.click();

  }

  private openProgressDialog() {
    /* const dialogRef = this.dialog.open(DeploymentProgressModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Confirm?: ', result);
      if (result) {
      }
    }); */

    this.dialog.open(DeploymentProgressModalComponent, {
      data: this.form
    });
  }

  public async openConfirmationDialog() {
    const notCompleted = this.globalService.verifyMandatory();
    if (notCompleted.length === 0) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log('Confirm?: ', result);
        if (result) {
          this.export();
          this.openProgressDialog();
        }
      });
    } else {
      let incompleteStr = 'Please complete the following mandatory components: ';
      notCompleted.forEach(domain => {
        incompleteStr += domain.displayName + ' ,';
      });
      this.openSnackBar(incompleteStr.substring(0, incompleteStr.length - 1), 'dismiss');
    }

  }
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }



  onFileChanged(event) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, 'UTF-8');
    fileReader.onload = () => {
      const result = this.globalService.uploadForm(fileReader.result.toString());
      this.fileInput.nativeElement.value = '';
      this.globalService.refreshRequired.next(true);
      this.router.navigate(['']);
    };
    fileReader.onerror = (error) => {
      console.log(error);
      this.router.navigate(['']);
    };
  }

}

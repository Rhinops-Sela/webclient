import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IWizardPagesService } from "src/app/commons/services/wizard-pages.service/IWizardPagesService.interface";
import { WizardPagesService } from "src/app/commons/services/wizard-pages.service/wizard-pages.service";
import { IUserInput } from "src/app/commons/models/IUserInput";
import { IWizardPage } from "src/app/commons/models/IWizardPage";
import { TabsetComponent } from "ngx-bootstrap/tabs";

@Component({
  selector: "app-wizard-pages-list",
  templateUrl: "./wizard-pages-list.component.html",
  styleUrls: ["./wizard-pages-list.component.css"],
})
export class WizardPagesListComponent implements OnInit {
  toImport: boolean;
  wizardPagesService: IWizardPagesService;
  inputs: IWizardPage[];
  inputsShowArr: boolean[] = [];
  inputsShowArrLength: number;
  inputIndexShow: number;
  showWizardPages: boolean;

  next(): void {
    if (this.inputIndexShow < this.inputsShowArrLength - 1) {
      this.inputIndexShow++;
      this.inputsShowArr[this.inputIndexShow - 1] = false;
      this.inputsShowArr[this.inputIndexShow] = true;
    }
  }

  previous(): void {
    if (this.inputIndexShow > 0) {
      this.inputIndexShow--;
      this.inputsShowArr[this.inputIndexShow + 1] = false;
      this.inputsShowArr[this.inputIndexShow] = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    wizardPagesService: WizardPagesService
  ) {
    this.wizardPagesService = wizardPagesService;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (res) => {
        let { toImport } = res;
        toImport = JSON.parse(toImport);
        if (typeof toImport === "boolean") {
          console.log(toImport);
          if (!toImport) {
            this.showWizardPages = true;
            this.getPages();
          } else {
            this.showWizardPages = false;
          }
        }
      },
      (err) => {},
      () => {}
    );
    this.getPages();
  }
  getPages() {
    this.wizardPagesService.getPages().subscribe(
      (res) => {
        this.inputs = res;
        let i = 1;
        this.inputsShowArrLength = this.inputs.length;
        this.inputIndexShow = 0;
        this.inputsShowArr[this.inputIndexShow] = true;
        for (i; i < this.inputsShowArrLength; i++) {
          this.inputsShowArr[i] = false;
        }
      },
      (err) => {},
      () => {}
    );
    this.route.queryParams.subscribe((res) => (this.toImport = res.toImport));
  }

  onSelectFile(event) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = () => {
      this.getPagesLocal(JSON.parse(fileReader.result as string));
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };
  }

  getPagesLocal(pages) {
    this.inputs = this.wizardPagesService.dataParser(pages);
    this.showWizardPages = true;
  }
}

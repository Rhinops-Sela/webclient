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
  allowNext: boolean = false;
  firstIndexAfterGetMore: number = 0;

  next(index: number): void {
    console.log(index);
    if (index < this.inputsShowArrLength - 1) {
      this.inputIndexShow = index;
      this.inputsShowArr[this.inputIndexShow] = false;
      this.inputsShowArr[0] = false;
      this.inputsShowArr[this.firstIndexAfterGetMore] = false;
      this.inputsShowArr[this.inputIndexShow + 1] = true;
      console.log(this.inputsShowArr);
    }
  }

  onFormSubmitForMore(index: number) {
    this.wizardPagesService.wizardPages$.subscribe(
      (res: IWizardPage[]) => {
        if (res) {
          this.inputs = res;
          this.initializePagination();
          this.inputIndexShow = index;
          this.inputsShowArr[0] = false;
          this.inputsShowArr[index + 1] = true;
          this.firstIndexAfterGetMore = index + 1;
        }
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }

  previous(index: number): void {
    if (this.inputIndexShow > 0) {
      this.inputIndexShow = index;
      this.inputsShowArr[this.inputIndexShow] = false;
      this.inputsShowArr[this.inputIndexShow - 1] = true;
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
        this.toImport = res.toImport;
        toImport = JSON.parse(toImport);
        if (typeof toImport === "boolean") {
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
  }

  getPages() {
    this.wizardPagesService.getPages2();
    this.wizardPagesService.wizardPages$.subscribe(
      (res: IWizardPage[]) => {
        if (res) {
          this.inputs = res;
          this.initializePagination();
        }
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
    // this.wizardPagesService.getPages().subscribe(
    //   (res) => {
    //     this.inputs = res;
    //     this.initializePagination();
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    //   () => {}
    // );
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
    this.wizardPagesService.dataParser2(pages);
    this.wizardPagesService.wizardPages$.subscribe(
      (res: IWizardPage[]) => {
        if (res) {
          this.inputs = res;
          this.showWizardPages = true;
          this.initializePagination();
        }
      },
      (err) => {},
      () => {}
    );
    // this.showWizardPages = true;
    // this.initializePagination();
    // this.inputs = this.wizardPagesService.dataParser(pages);
    // this.showWizardPages = true;
    // this.initializePagination();
  }

  initializePagination() {
    let i = 1;
    this.inputsShowArrLength = this.inputs.length;
    this.inputIndexShow = 0;
    this.inputsShowArr[this.inputIndexShow] = true;
    for (i; i < this.inputsShowArrLength; i++) {
      this.inputsShowArr[i] = false;
    }
  }

  // updateWizardPages(event: IWizardPage) {
  //   const index = this.inputs.indexOf(event);
  //   this.inputs[index] = event;
  //   this.allowNext = this.wizardPagesService.updateWizardPages(
  //     this.inputs,
  //     index
  //   );
  // }
}

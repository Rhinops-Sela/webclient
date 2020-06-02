import { Injectable } from "@angular/core";
import { IWizardPagesService } from "./IWizardPagesService.interface";
import { Observable, BehaviorSubject } from "rxjs";
import { IWizardPage } from "../../models/IWizardPage";
import { HttpClient } from "@angular/common/http";
import { IUserInput } from "../../models/IUserInput";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class WizardPagesService implements IWizardPagesService {
  apiLink = "http://localhost:3000";
  wizardPages: IWizardPage[];
  wizardPages$: BehaviorSubject<IWizardPage[]>;
  WizardPagesChangedIndexs: boolean[] = [];

  constructor(private http: HttpClient) {
    this.wizardPages$ = new BehaviorSubject<IWizardPage[]>(null);
  }

  postPages(userInputs: IUserInput[]): Observable<any> {
    const last = this.wizardPages.length - 1;
    this.wizardPages[last].userValueType = userInputs;
    return this.http.post(this.apiLink, this.wizardPages);
  }

  repeatPage(index: number, userInputs: IUserInput[]) {
    this.updateWizardPages(index, userInputs);
    const page = this.wizardPages[index];
    if (page.repeatable) {
      const tmp = { ...page };
      tmp.userValueType.forEach((input) => {
        input.value = undefined;
      });
      this.wizardPages.splice(index, 0, tmp);
      this.wizardPages$.next(this.wizardPages);
    }
  }

  updateWizardPages(index: number, userInputs: IUserInput[]): void {
    if (this.wizardPages[index]) {
      this.wizardPages[index].userValueType = userInputs;
      this.wizardPages$.next(this.wizardPages);
    }
  }

  getConditionsPages(): Observable<any> {
    return this.http.get(`${this.apiLink}/condition`).pipe(
      map((data: IWizardPage[]) => {
        this.wizardPages = data.map((page: IWizardPage) => {
          return this.wizardPageAdapterPipe(page);
        });

        return this.wizardPages;
      })
    );
  }

  initializeWizardPagesChangedIndexs(length) {
    let index = 0;
    for (index; index < length; index++) {
      this.WizardPagesChangedIndexs[index] = false;
    }
  }

  getPages2(): void {
    this.http.get(this.apiLink).subscribe((res: IWizardPage[]) => {
      this.wizardPages = res.map((page: IWizardPage) => {
        return this.wizardPageAdapterPipe(page);
      });
      this.initializeWizardPagesChangedIndexs(this.wizardPages.length);
      this.wizardPages$.next(this.wizardPages);
    });
  }

  getMorePages(): void {
    this.http
      .get(`${this.apiLink}/newpages`)
      .subscribe((res: IWizardPage[]) => {
        const wizardPages = res.map((page: IWizardPage) => {
          return this.wizardPageAdapterPipe(page);
        });
        this.initializeWizardPagesChangedIndexs(wizardPages.length);
        this.wizardPages = [...this.wizardPages, ...wizardPages];
        this.wizardPages$.next(this.wizardPages);
      });
  }

  dataParser(pages): IWizardPage[] {
    return pages.map((page: IWizardPage) => {
      return this.wizardPageAdapterPipe(page);
    });
  }

  dataParser2(pages): void {
    this.wizardPages = pages.map((page: IWizardPage) => {
      return this.wizardPageAdapterPipe(page);
    });
    this.initializeWizardPagesChangedIndexs(this.wizardPages.length);
    this.wizardPages$.next(this.wizardPages);
  }

  wizardPageAdapterPipe(page): IWizardPage {
    const temp: IWizardPage = {
      header: page["ui-header"],
      info: page["ui-info"],
      repeatable: page["ui-page-unrepeatable"] ? false : true,
      image: page["ui-image"],
      formType: page["ui-form-type"],
      userValueType: page["ui-user-inputs"].map((ui) =>
        this.userInputAdapterPipe(ui)
      ),
    };
    return temp;
  }

  userInputAdapterPipe(ui): IUserInput {
    const temp: IUserInput = {
      subGroup: ui["ui-sub-group"],
      subGroupEnabler: ui["ui-sub-group-enabler"],
      displayName: ui["ui-display-name"],
      userValueType: ui["ui-user-value-type"],
      userValueTypeValues: ui["ui-user-value-type-values"],
      placeholder: ui["place-holder"],
      regexValidation: ui["ui-regex-validation"],
      toolTip: ui["ui-tooltip"],
      value: ui["value"],
      errMsg: ui["ui-error-message"] || "ggg",
      inputType: ui["ui-form-type"] || "regular",
    };
    console.log(temp.inputType);

    return temp;
  }
}

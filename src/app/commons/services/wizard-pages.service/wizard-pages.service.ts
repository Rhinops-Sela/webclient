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

  updateWizardPages(index: number, userInputs: IUserInput[]): void {
    if (this.wizardPages[index]) {
      this.wizardPages[index].userValueType = userInputs;
      this.wizardPages$.next(this.wizardPages);
    } 
    // this.wizardPages$.next(this.wizardPages);
    ///return (this.WizardPagesChangedIndexs[index] = true);
  }

  getPages(): Observable<any> {
    return this.http.get(this.apiLink).pipe(
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
      image: page["ui-image"],
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
      subGroupRepeatable: ui["ui-sub-group-repeatable"],
      displayName: ui["ui-display-name"],
      userValueType: ui["ui-user-value-type"],
      userValueTypeValues: ui["ui-user-value-type-values"],
      placeholder: ui["place-holder"],
      regexValidation: ui["ui-regex-validation"],
      toolTip: ui["ui-tooltip"],
      value: ui["value"],
      // userInputs: ui["ui-user-inputs"]
      //   ? ui["ui-user-inputs"].map(
      //       (ui) => this.userInputAdapterPipe(ui) //"ui-user-inputs"
      //     )
      //   : null,
    };

    return temp;
  }
}

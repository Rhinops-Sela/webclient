import { Injectable } from "@angular/core";
import { IWizardPagesService } from "./IWizardPagesService.interface";
import { Observable } from "rxjs";
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

  constructor(private http: HttpClient) {}

  emitWizardPage(page: IWizardPage) {
    console.log(page);
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

  dataParser(pages): IWizardPage[] {
    return pages.map((page: IWizardPage) => {
      return this.wizardPageAdapterPipe(page);
    });
  }

  wizardPageAdapterPipe(page): IWizardPage {
    const temp: IWizardPage = {
      header: page["ui-header"],
      info: page["ui-info"],
      userValueType: page["ui-user-value-type"].map((ui) =>
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
    };
    return temp;
  }
}

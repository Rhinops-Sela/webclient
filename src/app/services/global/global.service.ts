import { IDomain } from './../../interfaces/IDomain';
import { Injectable } from '@angular/core';
import { IPage } from 'src/app/interfaces/IPage';
import { IInput } from 'src/app/interfaces/IInput';
import { of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { BackendService } from '../backend/backend.service';
import { GUID } from 'src/app/helpers/guid';
import { IRefreshRequried } from 'src/app/interfaces/IRefreshRequried';
import { MessageHandlerService } from '../message-handler/message-handler.service';
@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private activeDomain: IDomain;
  private activePage: IPage;
  public refreshRequired: Subject<IRefreshRequried> = new Subject<
    IRefreshRequried
  >();
  private allDomains: IDomain[];
  constructor(
    private backendService: BackendService,
    private errorHandlerService: MessageHandlerService
  ) {}

  public async getAllDomains(): Promise<IDomain[]> {
    if (!this.allDomains) {
      await this.loadDomains();
    }
    return this.allDomains;
  }

  private async loadDomains() {
    if (!this.loadFromLocalStorage()) {
      this.allDomains = await this.backendService.getFormTemplate();
      this.allDomains.forEach((domain) => {
        domain.id = GUID();
        domain.pages.forEach((page) => {
          page.id = GUID();
          page.inputs.forEach((input) => {
            input.id = GUID();
          });
        });
      });
    }
  }

  private loadFromLocalStorage(): boolean {
    const storedForm = this.getLocalStorageForm();
    if (!storedForm) {
      return false;
    }
    this.allDomains = JSON.parse(storedForm);
    this.allDomains.forEach((domain) => {
      let icon = '';
      domain.pages.forEach((page) => {
        if (page.valid && page.inputs[0].value) {
          icon = 'done';
        }
      });
      domain.icon = icon;
    });
    return true;
  }

  public async clearAll() {
    localStorage.clear();
    await this.loadDomains();
    this.refreshRequired.next({ pageChanged: false, domainChanged: true });
    return true;
  }
  public uploadForm(jsonForm: string) {
    try {
      this.allDomains = JSON.parse(jsonForm);
      this.storeLocalStorage(this.allDomains);
      return { result: true };
    } catch (error) {
      this.errorHandlerService.onErrorOccured.next(
        `Failed to upload file: ${error.message}`
      );
      return false;
    }
  }

  private getLocalStorageForm() {
    const form = localStorage.getItem('storedForm');
    return form;
  }
  private getLocalStorageDomain() {
    const domain = localStorage.getItem('activeDomain');
    return domain;
  }

  private storeLocalStorage(storedForm?: IDomain[], activeDomain?: IDomain) {
    let refresh = false;
    if (storedForm) {
      localStorage.setItem('storedForm', JSON.stringify(storedForm));
      refresh = true;
    }
    if (activeDomain) {
      refresh = true;
      localStorage.setItem('activeDomain', JSON.stringify(activeDomain));
    }
  }

  private deleteLocalStorage(storedForm = false, activeDomain = false) {
    if (storedForm) {
      localStorage.removeItem('storedForm');
    }
    if (activeDomain) {
      localStorage.removeItem('activeDomain');
    }
    this.activeDomain = null;
    this.activePage = null;
  }

  public savePage(modifiedPage: IPage, form?: FormGroup) {
    const pageToModify = this.activeDomain.pages.find(
      (page) => page.id === modifiedPage.id
    );
    if (form) {
      pageToModify.inputs.forEach((input) => {
        if (form.controls[input.id]) {
          input.value = form.controls[input.id].value;
        }
      });
      pageToModify.modified = true;
      this.setDomainIcon(true);
    } else {
      pageToModify.inputs = modifiedPage.inputs;
      pageToModify.modified = false;
      this.setDomainIcon(false);
    }
    this.storeLocalStorage(this.allDomains, this.activeDomain);
  }

  public saveDomain(modifiedDomain: IDomain) {
    modifiedDomain.valid = true;
    for (let i = 0; i < this.allDomains.length; i++) {
      if (this.allDomains[i].id === modifiedDomain.id) {
        this.allDomains[i] = modifiedDomain;
        this.storeLocalStorage(this.allDomains);
        return;
      }
    }
  }

  public verifyMandatory(): IPage[] {
    const notValidMandatory: IPage[] = [];
    this.allDomains.forEach((domain) => {
      domain.pages.forEach((page) => {
        if (page.mandatory && !page.modified) {
          notValidMandatory.push(page);
        }
      });
    });

    return notValidMandatory;
  }

  public setDomainIcon(valid: boolean) {
    if (valid) {
      this.activeDomain.icon = 'done';
      this.activeDomain.pages.forEach((page) => {
        if (!page.valid) {
          this.activeDomain.icon = '';
          return;
        }
      });
    } else {
      this.activeDomain.icon = '';
    }
    this.saveDomain(this.activeDomain);
    this.refreshRequired.next({ pageChanged: false, domainChanged: true });
  }

  public resetPage(page: IPage) {
    this.activeDomain.icon = '';
    this.activeDomain.modified = false;
    this.saveDomain(this.activeDomain);
    page.modified = false;
    page.inputs.forEach((input) => {
      input.value = '';
    });
    this.savePage(page);
    this.refreshRequired.next({ pageChanged: true, domainChanged: false });
  }

  public clonePage(pageSource: IPage) {
    const newPage = JSON.parse(JSON.stringify(pageSource));
    newPage.id = GUID();
    newPage.inputs.forEach((input) => {
      input.id = GUID();
    });
    const index = this.activeDomain.pages.findIndex(
      (page) => page.id === pageSource.id
    );
    this.activeDomain.pages.splice(index + 1, 0, newPage);
    this.storeLocalStorage(null, this.activeDomain);
    this.saveDomain(this.activeDomain);
    this.refreshRequired.next({ pageChanged: true, domainChanged: true });
  }

  public deletePage(pageSource: IPage) {
    const index = this.activeDomain.pages.findIndex(
      (page) => page.id === pageSource.id
    );
    this.activeDomain.pages.splice(index, 1);
    this.storeLocalStorage(null, this.activeDomain);
    this.saveDomain(this.activeDomain);
    this.refreshRequired.next({ pageChanged: true, domainChanged: true });
  }

  public canDelete(pageToCheck: IPage): boolean {
    if (!this.activeDomain) {
      this.allDomains.forEach((domain) => {
        const workingPage = domain.pages.find(
          (page) => page.displayName === pageToCheck.displayName
        );
        if (workingPage) {
          this.activeDomain = domain;
        }
      });
    }
    const domainPages = this.activeDomain.pages.filter(
      (page) => page.displayName === pageToCheck.displayName
    );
    return domainPages.length > 1;
  }

  public getInputs(page: IPage): any {
    const pageInputs: IInput[] = [];
    page.inputs.forEach((input: IInput) => {
      pageInputs.push(input);
    });
    return of(pageInputs);
  }

  public onDomainChange(activeDomain: IDomain) {
    this.activeDomain = activeDomain;
    this.storeLocalStorage(null, activeDomain);
    this.refreshRequired.next({ pageChanged: true, domainChanged: true });
  }

  public onPageChange(activePage: IPage, activeDomain?: IDomain) {
    this.activePage = activePage;
    if (activeDomain && activeDomain !== this.activeDomain) {
      this.onDomainChange(activeDomain);
    } else {
      this.refreshRequired.next({ pageChanged: true, domainChanged: false });
    }
  }

  public getActivePage(): IPage {
    return this.activePage;
  }

  public getActiveDomain(): IDomain {
    const fromStorage = JSON.parse(this.getLocalStorageDomain());
    const result = fromStorage || this.activeDomain;
    return result;
  }

  public resetActiveDomainText() {
    this.activeDomain = null;
    this.deleteLocalStorage(false, true);
  }
}

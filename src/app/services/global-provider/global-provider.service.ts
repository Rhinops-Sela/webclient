import { Injectable } from '@angular/core';
import { IDomain } from '../../interfaces/IDomain';
import { IPage } from 'src/app/interfaces/IPage';
import { IInput } from 'src/app/interfaces/IInput';
import { of, Subject } from 'rxjs';
import allDomains from '../../../assets/template.json';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class GlobalProviderService {
  private activeDomain: IDomain;
  private activePage: IPage;
  public refreshRequired: Subject<boolean> = new Subject<boolean>();
  private allDomains: IDomain[];
  constructor() {
  }


  private static newGuid() {
    // tslint:disable-next-line: only-arrow-functions
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line: one-variable-per-declaration
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public async getAllDomains() {
    if (!this.allDomains) {
      await this.loadDomains();
    }
    return this.allDomains;
  }

  private async loadDomains(): Promise<IDomain[]> {
    if (!this.loadFromLocalStorage()) {
      this.allDomains = allDomains;
      this.allDomains.forEach(domain => {
        domain.id = GlobalProviderService.newGuid();
        domain.pages.forEach(page => {
          page.id = GlobalProviderService.newGuid();
          page.inputs.forEach(input => {
            input.id = GlobalProviderService.newGuid();
          });
        });
      });
    }
    return this.allDomains;
  }


  private loadFromLocalStorage(): boolean {
    const storedForm = localStorage.getItem('storedForm');
    if (!storedForm) {
      return false;
    }
    this.allDomains = JSON.parse(storedForm);
    this.allDomains.forEach(domain => {
      let icon = '';
      domain.pages.forEach(page => {
        if (page.valid && page.inputs[0].value) {
          icon = 'done';
        }
      });
      domain.icon = icon;
    });
    return true;
  }

  public clearAll() {
    localStorage.clear();
    this.loadDomains();
    this.refreshRequired.next(true);
  }
  public uploadForm(jsonForm: string) {
    try {
      this.allDomains = JSON.parse(jsonForm);
      localStorage.setItem('storedForm', jsonForm);
      return { result: true };
    } catch (error) {
      console.log('Failed to upload file: ', error.message);
      return { result: false, message: error.message };
    }
  }


  public savePage(modifiedPage: IPage, form?: FormGroup) {
    const pageToModify = this.activeDomain.pages.find(page => page.id === modifiedPage.id);
    if (form) {
      pageToModify.inputs.forEach((input) => {
        try {
          if (form.controls[input.id]) {
            input.value = form.controls[input.id].value;
          }
        } catch (error) {
          console.log(error);
        }
      });
      pageToModify.modified = true;
      this.setDomainIcon(true);
    } else {
      pageToModify.inputs.forEach((input) => {
        try {
          if (form.controls[input.id]) {
            input.value = modifiedPage.inputs[input.id].value;
          }
        } catch (error) {
          console.log(error);
        }
      });
      pageToModify.modified = false;
      this.setDomainIcon(false);
    }
    localStorage.setItem('storedForm', JSON.stringify(this.allDomains));
    localStorage.setItem('activeDomain', JSON.stringify(this.activeDomain));
  }

  public saveDomain(modifiedDomain: IDomain) {
    modifiedDomain.valid = true;
    for (let i = 0; i < this.allDomains.length; i++) {
      if (this.allDomains[i].id === modifiedDomain.id) {
        this.allDomains[i] = modifiedDomain;
        localStorage.setItem('activeDomain', JSON.stringify(modifiedDomain));
        localStorage.setItem('storedForm', JSON.stringify(this.allDomains));
        this.refreshRequired.next(true);
        return;
      }
    }
  }

  public verifyMandatory(): IPage[] {
    const notValidMandatory: IPage[] = [];
    this.allDomains.forEach(domain => {
      domain.pages.forEach(page => {
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
      this.activeDomain.pages.forEach(page => {
        if (!page.valid) {
          this.activeDomain.icon = '';
          return;
        }
      });
    } else {
      this.activeDomain.icon = '';
    }
    this.saveDomain(this.activeDomain);
    this.refreshRequired.next(true);
  }

  public resetPage(page: IPage) {
    this.activeDomain.icon = '';
    this.activeDomain.modified = false;
    this.saveDomain(this.activeDomain);
    page.modified = false;
    page.inputs.forEach(input => {
      input.value = '';
    });
    this.savePage(page);
    this.refreshRequired.next(true);
  }

  public clonePage(pageSource: IPage) {
    const newPage = JSON.parse(JSON.stringify(pageSource));
    newPage.id = GlobalProviderService.newGuid();
    newPage.inputs.forEach(input => {
      input.id = GlobalProviderService.newGuid();
    });
    const index = this.activeDomain.pages.findIndex(page => page.id === pageSource.id);
    this.activeDomain.pages.splice(index + 1, 0, newPage);
    localStorage.setItem('activeDomain', JSON.stringify(this.activeDomain));
    this.saveDomain(this.activeDomain);
  }

  public deletePage(pageSource: IPage) {
    const index = this.activeDomain.pages.findIndex(page => page.id === pageSource.id);
    this.activeDomain.pages.splice(index, 1);
    localStorage.setItem('activeDomain', JSON.stringify(this.activeDomain));
    this.saveDomain(this.activeDomain);
  }

  public canDelete(pageToCheck: IPage): boolean {
    if (!this.activeDomain) {
      this.allDomains.forEach(domain => {
        const workingPage = domain.pages.find(page => page.displayName === pageToCheck.displayName);
        if (workingPage) {
          this.activeDomain = domain;
        }
      });
    }
    const domainPages = this.activeDomain.pages.filter(page => page.displayName === pageToCheck.displayName);
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
    localStorage.setItem('activeDomain', JSON.stringify(activeDomain));
    this.refreshRequired.next(true);
  }

  public onPageChange(activePage: IPage) {
    this.activePage = activePage;
    localStorage.setItem('activePage', JSON.stringify(activePage));
    this.refreshRequired.next(true);
  }

  public getActivePage(): IPage {
    return this.activePage;
  }


  public getActiveDomain(): IDomain {
    const fromStorage = JSON.parse(localStorage.getItem('activeDomain'));
    const result = fromStorage || this.activeDomain;
    return result;
  }
}

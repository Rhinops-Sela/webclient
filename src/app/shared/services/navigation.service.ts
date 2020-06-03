import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { INavigationService } from "./INavigation.service.interface";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class NavigateService implements INavigationService {
  constructor(private router: Router, private route: ActivatedRoute) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  navigateWithParameter(path: string, params: any): void {
    this.router.navigate([path], { queryParams: params });
  }
}

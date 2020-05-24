import { Component, OnInit } from "@angular/core";
import { INavigationService } from "src/app/shared/services/INavigation.service.interface";
import { NavigateService } from "src/app/shared/services/navigation.service";

@Component({
  selector: "app-wizard-main-layout",
  templateUrl: "./wizard-main-layout.component.html",
  styleUrls: ["./wizard-main-layout.component.css"],
})
export class WizardMainLayoutComponent implements OnInit {
  navigationService: INavigationService;

  constructor(navigationService: NavigateService) {
    this.navigationService = navigationService;
  }

  ngOnInit() {}

  navigate(toImport: boolean) {
    // isNew?
    // this.navigationService.navigate('/wizard/pages'):
    this.navigationService.navigateWithParameter("/wizard/pages", { toImport });
  }
  onPhotoChanged(event) {
    console.log(event.target.value);
  }
  // onSelectFile(event) {
  //   const selectedFile = event.target.files[0];
  //   const fileReader = new FileReader();
  //   fileReader.readAsText(selectedFile, "UTF-8");
  //   fileReader.onload = () => {
  //     console.log(JSON.parse(fileReader.result as string));
  //   };
  //   fileReader.onerror = (error) => {
  //     console.log(error);
  //   };
  // }
}

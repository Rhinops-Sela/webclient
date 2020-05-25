import { Component, OnInit } from "@angular/core";
import { IWizardPage } from "./commons/models/IWizardPage";
import { IFormInputService } from "./commons/services/form-input.service/form-input.service.interface";
import { FormInputService } from "./commons/services/form-input.service/form-input.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "k8-bootstraper-client-angular";
}

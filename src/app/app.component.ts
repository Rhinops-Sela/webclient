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
  number: number = 5;
  page2: IWizardPage = {
    header: "AWS Credentials",
    info: "These credentials will be used to perform the cluster installation",
    userValueType: [
      {
        subGroup: "credentials",
        displayName: "kobi",
        userValueType: "CHECKBOX",
        userValueTypeValues: ["eu-west-1", "eu-central-1"],
        toolTip: "Please select a valid aws region",
      },
      {
        subGroup: "credentials",
        placeholder: "@#AWS.REGION#@",
        displayName: "AWS Region",
        userValueType: "SELECT",
        userValueTypeValues: ["eu-west-1", "eu-central-1"],
        toolTip: "Please select a valid aws region",
        value: "eu-central-1",
      },
      {
        subGroup: "credentials",
        placeholder: "@#AWS.REGION#@",
        displayName: "multi select:",
        userValueType: "MULTI-SELECT",
        userValueTypeValues: ["1", "2", "3", "4"],
        toolTip: "Please select a valid aws region",
        values: ["1", "2"],
      },
      {
        subGroup: "credentials",
        placeholder: "@#AWS.ACCESSKEY#@",
        displayName: "Access key",
        userValueType: "STRING",
        toolTip: "Please insert a valid key",
        value: "kobi",
      },
      {
        subGroup: "credentials",
        placeholder: "number...",
        displayName: "Access number",
        userValueType: "NUMBER",
        toolTip: "Please insert a valid key",
      },
      {
        subGroup: "credentials",
        placeholder: "passowrd...",
        displayName: "Access password",
        userValueType: "PASSWORD",
        toolTip: "Please insert a valid key",
        value:"1234"
      },
      {
        subGroup: "credentials",
        placeholder: "@#AWS.SECRETKEY#@",
        displayName: "Secret key",
        userValueType: "STRING",
        toolTip: "Please insert a valid key",
      },
    ],
  };
  page: IWizardPage = {
    header: "bla bla",
    info: "info",
    userValueType: [
      {
        displayName: "name",
        subGroup: "redis",
        userValueType: "text",
        placeholder: "redis placeholder",
        toolTip: "enter redis",
      },
    ],
  };
}

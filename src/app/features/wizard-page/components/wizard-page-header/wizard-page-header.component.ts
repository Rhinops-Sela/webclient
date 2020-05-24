import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-wizard-page-header",
  templateUrl: "./wizard-page-header.component.html",
  styleUrls: ["./wizard-page-header.component.css"],
})
export class WizardPageHeaderComponent implements OnInit {
  @Input() wizardPageHeader: string;
  constructor() {}

  ngOnInit() {}
}

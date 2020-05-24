import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-wizard-page-info",
  templateUrl: "./wizard-page-info.component.html",
  styleUrls: ["./wizard-page-info.component.css"],
})
export class WizardPageInfoComponent implements OnInit {
  @Input() wizardPageInfo: string;
  constructor() {}

  ngOnInit() {}
}

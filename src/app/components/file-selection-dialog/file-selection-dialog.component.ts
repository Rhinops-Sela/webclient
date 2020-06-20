import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-file-selection-dialog',
  templateUrl: './file-selection-dialog.component.html',
  styleUrls: ['./file-selection-dialog.component.scss'],
})
export class FileSelectionDialogComponent implements OnInit {
  selectedFileName: string;
  constructor(
    public dialogRef: MatDialogRef<FileSelectionDialogComponent>
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }
}

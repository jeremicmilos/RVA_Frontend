import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ObrazovanjeService } from './../../../services/obrazovanje.service';
import { RadnikService } from './../../../services/radnik.service';
import { Radnik } from 'src/app/models/radnik';
import { Obrazovanje } from './../../../models/obrazovanje';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-radnik-dialog',
  templateUrl: './radnik-dialog.component.html',
  styleUrls: ['./radnik-dialog.component.css']
})
export class RadnikDialogComponent implements OnInit, OnDestroy {

  obrazovanja: Obrazovanje[];
  public flag: number;
  obrazovanjeSubscription: Subscription;

  constructor(public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<RadnikDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Radnik,
              public radnikService: RadnikService,
              public obrazovanjeService: ObrazovanjeService) { }

  ngOnInit(): void {
    this.obrazovanjeService.getAllObrazovanje()
      .subscribe(obrazovanja => {
        this.obrazovanja = obrazovanja;
      }),
      (error: Error) => {
        console.log(error.name + ' '+ error.message);
      }
  }

  ngOnDestroy(): void {
    this.obrazovanjeSubscription.unsubscribe();
  }

  compareTo(a: any, b: any) {
    return a.id === b.id
  }

  public add(): void {
    this.radnikService.addRadnik(this.data)
      .subscribe(() => {
        this.snackBar.open('Uspesno dodat radnik! ', 'U redu', {
          duration: 2500
        })
      }),
      (error: Error) => {
        console.log(error.name + ' '+ error.message);
      }
  }

  public update(): void {
    this.radnikService.updateRadnik(this.data)
      .subscribe(() => {
        this.snackBar.open('Uspešno modifikovan radnik!', 'U redu', {
          duration: 2500
        })
      }),
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
        this.snackBar.open('Dogodila se greška!', 'Zatvori', {
          duration: 1500
        })
      };
  }

  public delete(): void {
    this.radnikService.deleteRadnik(this.data.id)
    .subscribe(() => {
      this.snackBar.open('Uspešno obrisan radnik!', 'U redu', {
        duration: 2500
      })
    }),
    (error: Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Dogodila se greška!', 'Zatvori', {
        duration: 1500
      })
    };
  }

  public cancel(): void {
    this.dialogRef.close();
    this.snackBar.open('Odustali ste!', 'Zatvori', {
      duration: 1500
    })
  }

}

import { Subscription } from 'rxjs';
import { PreduzeceService } from './../../../services/preduzece.service';
import { SektorService } from './../../../services/sektor.service';
import { Sektor } from './../../../models/sektor';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Preduzece } from './../../../models/preduzece';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sektor-dialog',
  templateUrl: './sektor-dialog.component.html',
  styleUrls: ['./sektor-dialog.component.css']
})
export class SektorDialogComponent implements OnInit, OnDestroy {
  
  preduzeca: Preduzece[];
  public flag: number;
  preduzeceSubscribtion: Subscription;

  constructor(public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<SektorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Sektor,
              public sektorService: SektorService,
              public preduzeceService: PreduzeceService) { }

  ngOnInit(): void {
    this.preduzeceSubscribtion = this.preduzeceService.getAllPreduzece()
      .subscribe(preduzeca => {
        this.preduzeca = preduzeca
      }),
      (error: Error) => {
        console.log(error.name + ' '+ error.message);
      }
  }

  ngOnDestroy(): void {
    this.preduzeceSubscribtion.unsubscribe();
  }

  compareTo(a: any, b: any) {
    return a.id == b.id;
  }

  public add(): void {
    this.sektorService.addSektor(this.data)
      .subscribe((data) => {
        this.snackBar.open('Uspesno dodat sektor', 'U redu', {
          duration: 2500
        });
      }),
      (error: Error) => {
        console.log(error.name + '-->' + error.message);
        this.snackBar.open('Dogodila se greska. Pokusajte ponovo!', 'Zatvori', {
          duration: 2500
        });
      };
  }

  public update(): void {
    this.sektorService.updateSektor(this.data)
    .subscribe((data) => {
      this.snackBar.open('Uspesno modifikovan sektor' + this.data.naziv, 'U redu', {
        duration: 2500
      });
    }),
    (error: Error) => {
      console.log(error.name + '-->' + error.message);
      this.snackBar.open('Dogodila se greska. Pokusajte ponovo!', 'Zatvori', {
        duration: 2500
      });
    };
  }

  public delete(): void {
    this.sektorService.deleteSektor(this.data.id)
    .subscribe((data) => {
      this.snackBar.open('Uspesno obrisan sektor', 'U redu', {
        duration: 2500
      });
    }),
    (error: Error) => {
      console.log(error.name + '-->' + error.message);
      this.snackBar.open('Dogodila se greska. Pokusajte ponovo!', 'Zatvori', {
        duration: 2500
      });
    };
  }

  public cancel(): void {
    this.dialogRef.close();
    this.snackBar.open('Odustali ste od izmena! ', 'U redu', {
      duration: 1000
    });
  }

}

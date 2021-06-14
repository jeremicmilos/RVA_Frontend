import { Component, ViewChild, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RadnikDialogComponent } from './../dialogs/radnik-dialog/radnik-dialog.component';
import { Obrazovanje } from './../../models/obrazovanje';
import { RadnikService } from './../../services/radnik.service';
import { Sektor } from './../../models/sektor';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Radnik } from './../../models/radnik';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-radnik',
  templateUrl: './radnik.component.html',
  styleUrls: ['./radnik.component.css']
})
export class RadnikComponent implements OnInit, OnChanges, OnDestroy {

displayedColumns = ['id', 'ime', 'prezime', 'brojLk', 'obrazovanje', 'sektor', 'actions'];
dataSource: MatTableDataSource<Radnik>;
radnikSubscription: Subscription;
@ViewChild(MatSort, {static: false}) sort: MatSort;
@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

@Input() selektovanSektor: Sektor;

  constructor(private radnikService: RadnikService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    //console.log('Selected sektor: ' + this.selektovanSektor);
    //this.loadData();
  }

  ngOnChanges(): void {
    if(this.selektovanSektor.id) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.radnikSubscription.unsubscribe();
  }

  public loadData() {
    this.radnikSubscription = this.radnikService.getRadnikSektor(this.selektovanSektor.id)
      .subscribe(data => {
        this.dataSource= new MatTableDataSource(data);

        this.dataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return key === 'obrazovanje' ? currentTerm + data.obrazovanje.naziv : currentTerm + data[key];
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        // sortiranje po nazivu ugnježdenog objekta
        this.dataSource.sortingDataAccessor = (data, property) => {
          switch (property) {
            case 'obrazovanje': return data.obrazovanje.naziv.toLocaleLowerCase();
            default: return data[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }),
      (error: Error) => {
        console.log(error.name + ' '+ error.message);
      }
  }

  public openDialog(flag: number, id?: number, ime?: string, prezime?: string, brojLk?: number, obrazovanje?: Obrazovanje, sektor?: Sektor) {
    const dialogRef = this.dialog.open(RadnikDialogComponent, {
      data: {id, ime, prezime, brojLk, obrazovanje, sektor}
    });
    dialogRef.componentInstance.flag = flag;
    if(flag===1) {
      dialogRef.componentInstance.data.sektor = this.selektovanSektor;
    }
    dialogRef.afterClosed()
      .subscribe(result => {
        if(result === 1) {
          this.loadData();
        }
      })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue; 
  }

}

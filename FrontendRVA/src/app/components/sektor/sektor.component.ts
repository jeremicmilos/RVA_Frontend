import { Subscription } from 'rxjs';
import { SektorDialogComponent } from './../dialogs/sektor-dialog/sektor-dialog.component';
import { Preduzece } from './../../models/preduzece';
import { SektorService } from './../../services/sektor.service';
import { Sektor } from './../../models/sektor';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-sektor',
  templateUrl: './sektor.component.html',
  styleUrls: ['./sektor.component.css']
})
export class SektorComponent implements OnInit, OnDestroy {

  displayedColumns = ['id', 'naziv', 'oznaka', 'preduzece', 'actions'];
  dataSource: MatTableDataSource<Sektor>;
  selektovanSektor: Sektor;
  sektorSubscription: Subscription;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  constructor(public sektorService: SektorService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy(): void {
    this.sektorSubscription.unsubscribe();
  }

  public loadData() {
    this.sektorSubscription = this.sektorService.getAllSektor()
      .subscribe((data) => {

        this.dataSource = new MatTableDataSource(data);
        
        this.dataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return key === 'preduzece' ? currentTerm + data.preduzece.naziv : currentTerm + data[key];
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        this.dataSource.sortingDataAccessor = (data, property) => {
          switch (property) {
            case 'preduzece': return data.preduzece.naziv.toLocaleLowerCase();
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

  public openDialog(flag: number, id?: number, naziv?: String, oznaka?: String, preduzece?: Preduzece) {
    const dialogRef = this.dialog.open(SektorDialogComponent,
      {data: {id, naziv, oznaka, preduzece}});
      dialogRef.componentInstance.flag = flag;

      dialogRef.afterClosed().subscribe(result => {
        if(result == 1){
          this.loadData();
        }
      })
  }

  selectRow(row: any) {
    //console.log(row);
    this.selektovanSektor = row;
    console.log(this.selektovanSektor);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue; 
  }

}

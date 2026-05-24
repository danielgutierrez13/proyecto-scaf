import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface Carrera {
  idCarrera?: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-carrera-gestion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './carrera.html',
  styleUrls: ['./carrera.scss']
})
export class CarreraGestionComponent implements OnInit, AfterViewInit {

  carreraForm: FormGroup;
  displayedColumns: string[] = ['idCarrera', 'nombre', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Carrera>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder) {
    this.carreraForm = this.fb.group({
      idCarrera: [null],
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarCarreras() {
    // Datos simulados para la tabla
    this.dataSource.data = [
      { idCarrera: 1, nombre: 'Ingeniería de Sistemas', descripcion: 'Software y tecnología' },
      { idCarrera: 2, nombre: 'Administración', descripcion: 'Gestión y negocios' }
    ];
  }

  agregar() {
    const nueva: Carrera = this.carreraForm.value;
    nueva.idCarrera = this.dataSource.data.length + 1; // simulación ID
    this.dataSource.data = [...this.dataSource.data, nueva];
    this.limpiar();
  }

  actualizar() {
    const carreraEditada: Carrera = this.carreraForm.value;
    this.dataSource.data = this.dataSource.data.map(c =>
      c.idCarrera === carreraEditada.idCarrera ? carreraEditada : c
    );
    this.limpiar();
  }

  eliminar(carrera?: Carrera) {
    if (!carrera) return;
    this.dataSource.data = this.dataSource.data.filter(c => c.idCarrera !== carrera.idCarrera);
  }

  editar(carrera: Carrera) {
    this.carreraForm.patchValue(carrera);
  }

  limpiar() {
    this.carreraForm.reset();
  }
}
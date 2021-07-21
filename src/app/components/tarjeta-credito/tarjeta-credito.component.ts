import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

import * as printJS from 'print-js';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {

  listTarjetas: any[]=[];
  accion = 'Agregar';
  accionB = 'AGREGAR';
  id: number | undefined;
  form: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private _tarjetaService: TarjetaService) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(10)]],
      fechaExpiracion: ['', [Validators.maxLength(10), Validators.minLength(10)]],
      cvv: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getTarjetas();
  }

  getTarjetas(){
    this._tarjetaService.getListTarjetas().subscribe(data => {
      console.log(data);
      this.listTarjetas = data;
    }, error => {
      console.log(error);
    })
  }

  agregarTarjeta(){
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    }

    if(this.id == undefined){
      //AGREGAMOS TARJETA
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        this.toastr.success('Excelente!!', 'Tarjeta registrada con exito');
        this.getTarjetas();
        this.form.reset();
      }, error => {
        this.toastr.error('Error!!', 'Tarjeta no registrada');
        console.log(error);
      })
    }else{
      //MODIFICAMOS TARJETA
      tarjeta.id = this.id;

      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data => {
        this.form.reset();
        this.accion = 'Agregar';
        this.id = undefined;
        this.toastr.info('La tarjeta fue actualizada con exito!!', 'Tarjeta actualizada');
        this.getTarjetas();
      }, error => {
        console.log(error);
      })
    }

  }

  editTarjeta(tarjeta: any){
    this.accion = 'Modificar';
    this.accionB = 'MODIFICAR';
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv,
    })
  }

  eliminarTarjeta(id: number){
    this._tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.toastr.success('Excelente!!', 'Tarjeta eliminada con exito');
      this.getTarjetas();
    }, error => {
      console.log(error);
    })
  }

  public imprimirLista() {
    printJS('list', 'html')
  }
}

import { Component } from '@angular/core';
import { Registro } from 'src/app/models/registro.models';
import { DataLocalService } from 'src/app/services/data-local.service';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  get registros(): Registro[]{
    return this.dataLocalService.getLocalRegistros;
  }

  constructor(private dataLocalService:DataLocalService) {}

  abrirRegistro(registro:Registro ){
    this.dataLocalService.abrirRegistro(registro);
  }

}
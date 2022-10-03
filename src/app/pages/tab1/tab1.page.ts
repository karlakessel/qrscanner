import { AfterViewInit, Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, Platform } from '@ionic/angular';
import { Registro } from 'src/app/models/registro.models';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit{

  scanActivo: boolean = false;

  constructor(
    private platform:Platform,
    private alertCtrll:AlertController,
    private dataLocalService:DataLocalService
    ) {}

  ngAfterViewInit(): void {
    if (this.platform.is("capacitor")){
      BarcodeScanner.prepare();
    }
  }

  async scan(){
    console.log(this.platform)
    if(this.platform.is('capacitor')){

      const permitido =  this.checkPermission();

      if(permitido){

        this.scanActivo = true;
        const result = await BarcodeScanner.startScan();

        if(result.hasContent){
          const registro: Registro = new Registro(result.format,result.content);
          await this.dataLocalService.guardarRegistro(registro);
          this.dataLocalService.abrirRegistro(registro);
          this.scanActivo = false;
        }

      }

    }else{
      const registro: Registro = new Registro('QR_CODE','https://www.qrcode.es/es/generador-qr-code/');
      await this.dataLocalService.guardarRegistro(registro);
      this.dataLocalService.abrirRegistro(registro);   
      this.scanActivo = false;
    }

  }

  async checkPermission(){

    return new Promise (async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({force: true});
      if(status.granted){
        resolve(true);
      }else if (status.denied){

        const alert = await this.alertCtrll.create({
          header: "Sin Permisos",
          message: "Por favor permita el acceso a la camara en sus preferencias",
          buttons:[
            {
              text:"No",
              role: "cancel"
            },
            {
              text: "Abrir Preferencias",
              handler:()=>{
                BarcodeScanner.openAppSettings(),
                resolve(false)
              }
            }
          ],

        });
        await alert.present();

      }else{
        resolve(reject);
      }
    })


  }


}
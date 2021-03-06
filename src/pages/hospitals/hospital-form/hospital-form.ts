import { NavController, NavParams, LoadingController, Ion, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { Events } from 'ionic-angular';
import { HospitalApi } from '../../../providers/hospital-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-hospital-form',
  templateUrl: 'hospital-form.html',
})
export class HospitalForm {

  hospital: {};
  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public hospitalApi: HospitalApi,
    public respUtility: ResponseUtility) {

    this.hospital = this.navParams.data;

    this.slideOneForm = formBuilder.group({
       
      name: ['', Validators.compose([Validators.required])],   
      owner_name: ['', Validators.compose([Validators.required])],       
      address: ['', Validators.compose([Validators.required])], 
      city: ['', Validators.compose([Validators.required])], 
      nurse_break_mins: [0], 
      num_of_beds: [20],
      nurse_count: [15],  
      typical_workex: [3],
      specializations: [''],
      phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(11), Validators.pattern('^\\d+$')])],            
      image_url: [''],
      company_registration_number: ['', Validators.compose([Validators.required])], 
      dress_code: [''],
      parking_available: [false],
      paid_unpaid_breaks: ['Unpaid'],
      meals_provided_on_shift: [false],
      po_req_for_invoice: [false],
      meals_subsidised: [false],
    });

    this.slideTwoForm = formBuilder.group({
            
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HospitalsForm');
    this.respUtility.trackView("HospitalForm");
  }

  

  save() {
    this.respUtility.trackEvent("Hospital", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.hospital);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (!this.slideOneForm.valid) {
    }
    else {
      this.submitAttempt = false;
      loader.present();

      if (this.hospital["id"]) {
        this.hospitalApi.updateHospital(this.hospital).subscribe(
          hospital => {
            this.respUtility.showSuccess('Hospital saved successfully.');    
            this.navCtrl.pop();        
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
            this.events.publish("hospital:registration:failed");
          },
          () => {loader.dismiss();}
        );
      } else {
        this.hospitalApi.createHospital(this.hospital).subscribe(
          hospital => {
            this.events.publish("hospital:registration:success", hospital);                        
            this.navCtrl.popToRoot();
            //this.respUtility.showSuccess('Hospital saved successfully. We will inform you once this has been verified');
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => {loader.dismiss();}
        );
      }
    }
  }

}

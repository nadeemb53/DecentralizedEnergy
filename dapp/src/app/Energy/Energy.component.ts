/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EnergyService } from './Energy.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-energy',
  templateUrl: './Energy.component.html',
  styleUrls: ['./Energy.component.css'],
  providers: [EnergyService]
})
export class EnergyComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  energyId = new FormControl('', Validators.required);
  units = new FormControl('', Validators.required);
  value = new FormControl('', Validators.required);
  produced = new FormControl('', Validators.required);
  sold = new FormControl('', Validators.required);
  used = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceEnergy: EnergyService, fb: FormBuilder) {
    this.myForm = fb.group({
      energyId: this.energyId,
      units: this.units,
      value: this.value,
      produced: this.produced,
      sold: this.sold,
      used: this.used,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceEnergy.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.hackathon.dora.Energy',
      'energyId': this.energyId.value,
      'units': this.units.value,
      'value': this.value.value,
      'produced': this.produced.value,
      'sold': this.sold.value,
      'used': this.used.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'energyId': null,
      'units': null,
      'value': null,
      'produced': null,
      'sold': null,
      'used': null,
      'owner': null
    });

    return this.serviceEnergy.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'energyId': null,
        'units': null,
        'value': null,
        'produced': null,
        'sold': null,
        'used': null,
        'owner': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.hackathon.dora.Energy',
      'units': this.units.value,
      'value': this.value.value,
      'produced': this.produced.value,
      'sold': this.sold.value,
      'used': this.used.value,
      'owner': this.owner.value
    };

    return this.serviceEnergy.updateAsset(form.get('energyId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceEnergy.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceEnergy.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'energyId': null,
        'units': null,
        'value': null,
        'produced': null,
        'sold': null,
        'used': null,
        'owner': null
      };

      if (result.energyId) {
        formObject.energyId = result.energyId;
      } else {
        formObject.energyId = null;
      }

      if (result.units) {
        formObject.units = result.units;
      } else {
        formObject.units = null;
      }

      if (result.value) {
        formObject.value = result.value;
      } else {
        formObject.value = null;
      }

      if (result.produced) {
        formObject.produced = result.produced;
      } else {
        formObject.produced = null;
      }

      if (result.sold) {
        formObject.sold = result.sold;
      } else {
        formObject.sold = null;
      }

      if (result.used) {
        formObject.used = result.used;
      } else {
        formObject.used = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'energyId': null,
      'units': null,
      'value': null,
      'produced': null,
      'sold': null,
      'used': null,
      'owner': null
      });
  }

}

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

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * @param {org.hackathon.dora.UseEnergy} useEnergy
 * @transaction
 */

 async function useEnergy(useEnergy) {
    
    let tx = useEnergy;
    if(tx.energy.owner.userId != tx.owner.userId){

        throw new Error("Not the owner of energy");
    }

    if(tx.value > tx.energy.value){

        throw new Error("cannot consume more energy");
    }

    tx.energy.value -= tx.value;
    tx.energy.used += tx.value;

    const assetRegistry = await getAssetRegistry('org.hackathon.dora.Energy');
    await assetRegistry.update(tx.energy);
 }
 
 /**
  * @param {org.hackathon.dora.RequestEnergy} requestEnergy
  * @transaction
  */

async function requestEnergy(requestEnergy) {
    
    let tx = requestEnergy;
    let allListing = await query('getAllListing');

    let minDistance = 10000;
    let minCostSource = null;
    for(listing in allListing){

        let x_distance = abs(listing.owner.location.lat - tx.requester.location.lat);
        let y_distance = abs(listing.owner.location.long - tx.requester.location.long);

        if(x_distance+y_distance < minDistance){

            minDistance = x_distance+y_distance;
            minCostSource = listing;
        }
    }

}
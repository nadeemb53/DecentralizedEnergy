import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.hackathon.dora{
   export class Location {
      lat: number;
      long: number;
   }
   export enum UserType {
      Resident,
      UtilityCompany,
   }
   export class User extends Participant {
      userId: string;
      name: string;
      location: Location;
      type: UserType;
      reputation: number;
   }
   export class Coins extends Asset {
      coinsID: string;
      value: number;
      owner: User;
   }
   export class Energy extends Asset {
      energyId: string;
      units: string;
      value: number;
      produced: number;
      sold: number;
      used: number;
      owner: User;
   }
   export enum ListingState {
      Available,
      Sold,
   }
   export class EnergyListing extends Asset {
      energyListingId: string;
      owner: User;
      state: ListingState;
      energy: Energy;
      requests: RequestEnergy[];
   }
   export class UseEnergy extends Transaction {
      owner: User;
      energy: Energy;
      value: number;
   }
   export class RequestEnergy extends Transaction {
      requiredEnergy: number;
      requester: User;
      coin: Coins;
   }
   export class giveEnergy extends Transaction {
      listing: EnergyListing;
      energyRate: number;
      requester: User;
      sender: User;
   }
// }

import {Randomization} from "../utils";

export const tempRouter = {
   // contactTemp: './contact.component.html',
   contactTemp: [
     './templates/temp.html',
     './contact.component.html'
   ],
  value: Randomization.getRandom(this.contactTemp)
};

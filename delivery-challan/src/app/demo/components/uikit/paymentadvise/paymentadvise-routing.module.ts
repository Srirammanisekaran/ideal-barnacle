import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentadviseComponent } from './paymentadvise.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PaymentadviseComponent }
	])],
	exports: [RouterModule]
})
export class PaymentadviseRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RdcComponent } from './rdc.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RdcComponent }
	])],
	exports: [RouterModule]
})
export class RdcRoutingModule { }

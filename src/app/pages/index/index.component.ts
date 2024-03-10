import {Component} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
	selector: 'app-index',
	standalone: true,
	imports: [
		MatListModule,
		MatToolbarModule,
		RouterLink,
		MatIcon,
		MatIconButton
	],
	templateUrl: './index.component.html',
	styleUrl: './index.component.css'
})
export class IndexComponent {
	
}

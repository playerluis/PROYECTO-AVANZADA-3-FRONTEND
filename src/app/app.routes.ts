import {Routes} from '@angular/router';
import {IndexComponent} from "./pages/index/index.component";
import {FormularioSolicitudCuentaComponent} from "./pages/formulario-solicitud-cuenta/formulario-solicitud-cuenta.component";
import {NuevasCuentasComponent} from "./pages/nuevas-cuentas/nuevas-cuentas.component";
import {ComprobarIdentidadComponent} from "./pages/comprobar-identidad/comprobar-identidad.component";
import {ImagenCedulaComponent} from "./pages/imagen-cedula/imagen-cedula.component";

export const routes: Routes = [
	{
		path: '',
		title: 'Inicio',
		component: IndexComponent
	},
	{
		path: 'solictud-cuenta',
		title: 'Formulario de solicitud de cuenta',
		component: FormularioSolicitudCuentaComponent
	},
	{
		path: 'cuentas-en-revision',
		title: 'Administración de Registros',
		component: NuevasCuentasComponent
	},
	{
		path: 'comprante-identidad',
		title: 'Tabla de comprobantes',
		component: ComprobarIdentidadComponent
	},
	{
		path: 'subir-cedula-de-identidad/:token',
		title: 'Subir cedula de identidad',
		pathMatch: 'full',
		component: ImagenCedulaComponent
	}
];

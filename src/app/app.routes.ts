import {Routes} from '@angular/router';
import {LayoutComponent} from "./components/layout/layout.component";

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'checkin',
        pathMatch: 'full'
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'checkin',
                loadChildren: () => import('./components/checkin/checkin.routes')
            }
        ]
    }

];

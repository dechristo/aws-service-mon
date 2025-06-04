import { JpaPoolChartComponent } from './jpa-pool-chart/jpa-pool-chart.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemoryViewComponent } from './memory-view/memory-view.component';
import { NeoDbPoolComponent } from './neo-db-pool/neo-db-pool.component';
import { PdwhPoolChartComponent } from './pdwh-pool-chart/pdwh-pool-chart.component';
import { DbTotalActiveViewComponent } from './db-total-active-view/db-total-active-view.component';
import { ExecutorTotalViewComponent } from './executor-total-view/executor-total-view.component';
import { RedshiftWetDbPoolChartComponent } from './redshift-wet-db-pool-chart/redshift-wet-db-pool-chart.component';
import { RestartServerComponent } from './restart-server/restart-server.component';
import { RedshiftInlineDbPoolChartComponent } from './redshift-inline-db-pool-chart/redshift-inline-db-pool-chart.component';
import { ExecutorRedshiftWetViewComponent } from './executor-redshift-wet-view/executor-redshift-wet-view.component';
import { ExecutorRedshiftInlineViewComponent } from './executor-redshift-inline-view/executor-redshift-inline-view.component';
import {ExecutorRedshiftSortViewComponent} from "./executor-redshift-sort-view/executor-redshift-sort-view.component";
import {ExecutorCfmViewComponent} from "./executor-cfm-view/executor-cfm-view.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
      path: 'memory',
      component: MemoryViewComponent
  },
  {
    path: 'total-pool',
    component: DbTotalActiveViewComponent
  },
  {
    path: 'jpa-pool',
    component: JpaPoolChartComponent
  },
  {
    path: 'neo-pool',
    component: NeoDbPoolComponent
  },
  {
    path: 'pdwh-pool',
    component: PdwhPoolChartComponent
  },
  {
    path: 'redshift-wet-pool',
    component: RedshiftWetDbPoolChartComponent
  },
  {
    path: 'redshift-inline-pool',
    component: RedshiftInlineDbPoolChartComponent
  },
  {
    path: 'executor-redshift-wet',
    component: ExecutorRedshiftWetViewComponent
  },
  {
    path: 'executor-redshift-inline',
    component: ExecutorRedshiftInlineViewComponent
  },
  {
    path: 'executor-redshift-sort',
    component: ExecutorRedshiftSortViewComponent
  },
  {
    path: 'executor-cfm',
    component: ExecutorCfmViewComponent
  },
  {
    path: 'executor-total',
    component: ExecutorTotalViewComponent
  },
  {
    path: 'restart-server',
    component: RestartServerComponent
  },
  {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
  },
  {
      path: '**',
      redirectTo: '/home',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

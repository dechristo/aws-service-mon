import { HttpErrorsService } from './service/HttpErrorsService';
import { InstanceHealthService } from './service/InstanceHealthService';
import { ExecutorService } from './service/ExecutorService';
import { DatabasePoolService } from './service/DatabasePoolService';
import { JvmMemoryService } from './service/JvmMemoryService';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemChartComponent } from './mem-chart/mem-chart.component';
import { DbPoolTotalActiveChartComponent } from './db-pool-total-active-chart/db-pool-total-active-chart.component';
import { JpaPoolChartComponent } from './jpa-pool-chart/jpa-pool-chart.component';
import { PdwhPoolChartComponent } from './pdwh-pool-chart/pdwh-pool-chart.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { DbPoolDetailsComponent } from './db-pool-details/db-pool-details.component';
import { NeoDbPoolComponent } from './neo-db-pool/neo-db-pool.component';
import { InstanceHealthComponent } from './instance-health/instance-health.component';
import { TotalHttpErrorsComponent } from './total-http-errors/total-http-errors.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MemoryViewComponent } from './memory-view/memory-view.component';
import { appInitializer } from './appInitializer';
import { DbTotalActiveViewComponent } from './db-total-active-view/db-total-active-view.component';
import { DbTotalTimeoutComponent } from './db-total-timeout/db-total-timeout.component';
import { ExecutorQueuedTotalComponent } from './executor-queued-total/executor-queued-total.component';
import { ExecutorActiveTotalComponent } from './executor-active-total/executor-active-total.component';
import { ExecutorTotalViewComponent } from './executor-total-view/executor-total-view.component';
import { RedshiftWetDbPoolChartComponent } from './redshift-wet-db-pool-chart/redshift-wet-db-pool-chart.component';
import { RestartServerComponent } from './restart-server/restart-server.component';
import { DiskInfoComponent } from './disk-info/disk-info.component';
import { RedshiftInlineDbPoolChartComponent } from './redshift-inline-db-pool-chart/redshift-inline-db-pool-chart.component';
import { ExecutorActiveRedshiftWetComponent } from './executor-active-redshift-wet/executor-active-redshift-wet.component';
import { ExecutorQueuedRedshiftWetComponent } from './executor-queued-redshift-wet/executor-queued-redshift-wet.component';
import { ExecutorRedshiftWetViewComponent } from './executor-redshift-wet-view/executor-redshift-wet-view.component';
import { ExecutorActiveRedshiftInlineComponent } from './executor-active-redshift-inline/executor-active-redshift-inline.component';
import { ExecutorQueuedRedshiftInlineComponent } from './executor-queued-redshift-inline/executor-queued-redshift-inline.component';
import { ExecutorRedshiftInlineViewComponent } from './executor-redshift-inline-view/executor-redshift-inline-view.component';
import { ThreadChartComponent } from './thread-chart/thread-chart.component';
import { TomcatActiveSessionsChartComponent } from './tomcat-active-sessions-chart/tomcat-active-sessions-chart.component';
import { TomcatSessionService } from './service/TomcatSessionService';
import { ExecutorActiveFetcherComponent } from './executor-active-fetcher/executor-active-fetcher.component';
import { ExecutorActiveRedshiftSortComponent } from './executor-active-redshift-sort/executor-active-redshift-sort.component';
import { ExecutorQueuedRedshiftSortComponent } from './executor-queued-redshift-sort/executor-queued-redshift-sort.component';
import { ExecutorQueuedCfmComponent } from './executor-queued-cfm/executor-queued-cfm.component';
import { ExecutorActiveCfmComponent } from './executor-active-cfm/executor-active-cfm.component';
import { ExecutorRedshiftSortViewComponent } from './executor-redshift-sort-view/executor-redshift-sort-view.component';
import { ExecutorCfmViewComponent } from './executor-cfm-view/executor-cfm-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MemChartComponent,
    DbPoolTotalActiveChartComponent,
    JpaPoolChartComponent,
    PdwhPoolChartComponent,
    ActiveUsersComponent,
    DbPoolDetailsComponent,
    NeoDbPoolComponent,
    InstanceHealthComponent,
    TotalHttpErrorsComponent,
    HomeComponent,
    MemoryViewComponent,
    DbTotalActiveViewComponent,
    DbTotalTimeoutComponent,
    ExecutorQueuedTotalComponent,
    ExecutorActiveTotalComponent,
    ExecutorTotalViewComponent,
    RedshiftWetDbPoolChartComponent,
    RestartServerComponent,
    DiskInfoComponent,
    RedshiftInlineDbPoolChartComponent,
    ExecutorActiveRedshiftWetComponent,
    ExecutorQueuedRedshiftWetComponent,
    ExecutorRedshiftWetViewComponent,
    ExecutorActiveRedshiftInlineComponent,
    ExecutorQueuedRedshiftInlineComponent,
    ExecutorRedshiftInlineViewComponent,
    ThreadChartComponent,
    TomcatActiveSessionsChartComponent,
    ExecutorActiveFetcherComponent,
    ExecutorActiveRedshiftSortComponent,
    ExecutorQueuedRedshiftSortComponent,
    ExecutorQueuedCfmComponent,
    ExecutorActiveCfmComponent,
    ExecutorRedshiftSortViewComponent,
    ExecutorCfmViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [
      JvmMemoryService,
      TomcatSessionService,
      DatabasePoolService,
      ExecutorService,
      InstanceHealthService,
      HttpErrorsService
    ]}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

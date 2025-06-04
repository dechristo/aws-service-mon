import { TomcatSessionService } from './service/TomcatSessionService';
import { DatabasePoolService } from './service/DatabasePoolService';
import { JvmMemoryService } from './service/JvmMemoryService';
import { ExecutorService } from './service/ExecutorService';
import { HttpErrorsService } from './service/HttpErrorsService';
import { InstanceHealthService } from './service/InstanceHealthService';
import { DiskInfoService } from './service/DiskInfoService';


export function appInitializer(
  jvmMemoryService: JvmMemoryService,
  //jvmThreadService: JvmThreadService,
  tomcatSessionService: TomcatSessionService,
  dbPoolService: DatabasePoolService,
  executorService: ExecutorService,
  httpErrorsService: HttpErrorsService,
  instanceHealthService: InstanceHealthService,
  diskInfoService: DiskInfoService
){
  return () => console.info("Initializing services: Memory, Tomcat, Database, Executor, HttpErros, DiskInfoService and InstanceHealth.");
}

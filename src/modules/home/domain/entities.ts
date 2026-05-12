import { KpiPoblacional } from '@/modules/poblacional';
import { KpiSocioeconomico } from '@/modules/socioeconomico';
import {
  ResumenCorporacion,
  ResumenElectoral,
  VotosPorDepartamento,
} from '@/modules/electoral';

export interface DashboardHome {
  resumen: ResumenElectoral;
  tarjetasCorporaciones: ResumenCorporacion[];
  mapaDepartamentos: VotosPorDepartamento[];
  kpisSocioeconomicos: KpiSocioeconomico[];
  kpisPoblacionales: KpiPoblacional[];
}

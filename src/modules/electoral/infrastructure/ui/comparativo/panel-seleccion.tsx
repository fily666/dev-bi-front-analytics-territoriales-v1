'use client';

import {
  useCandidatos,
  usePartidos,
} from '@/modules/catalogos/application/hooks';
import type { TipoComparacionTerritorial } from '@/modules/electoral/domain/entities';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { Card, CardBody } from '@/shared/ui/components/card';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { SelectFiltro } from '@/shared/ui/components/select-filtro';
import { cn } from '@/shared/ui/utils/cn';
import { ArrowLeftRight, Building2, UserCheck } from 'lucide-react';
import {
  mismaSeleccion,
  SeleccionComparativo,
  useFiltrosComparativo,
} from './filtros-comparativo-store';
import { COLOR_A, COLOR_B } from './colores-comparativo';

/**
 * Codificación del `<option value>` de un candidato. Como `codigo_candidato`
 * se reinicia por partido, NO podemos usar sólo el código: dos candidatos
 * homónimos con el mismo código en partidos distintos colisionarían en el
 * <select>. Empaquetamos `codigo|codigoPartido` y lo desempaquetamos al cambiar.
 */
const SEP = '|';
const encodeCandidato = (codigo: string, codigoPartido: string | null): string =>
  `${codigo}${SEP}${codigoPartido ?? ''}`;
const decodeCandidato = (value: string): SeleccionComparativo => {
  const [codigo, partido] = value.split(SEP);
  return { codigo, codigoPartido: partido && partido !== '' ? partido : null };
};

export function PanelSeleccionComparativo() {
  const codigoCorporacion = useFiltrosGlobales((s) => s.codigoCorporacion);
  const {
    tipo,
    selA,
    selB,
    setTipo,
    setSelA,
    setSelB,
    swap,
  } = useFiltrosComparativo();

  if (!codigoCorporacion) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            tone="info"
            title="Seleccione una corporación"
            description="El comparativo electoral requiere acotar el contexto a una corporación desde los filtros generales."
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
              Tipo de comparación
            </span>
            <div className="inline-flex rounded-lg border border-border bg-surface-elevated p-0.5">
              <BotonTipo
                activo={tipo === 'candidato'}
                onClick={() => setTipo('candidato')}
                icon={<UserCheck size={13} />}
                label="Por candidato"
              />
              <BotonTipo
                activo={tipo === 'partido'}
                onClick={() => setTipo('partido')}
                icon={<Building2 size={13} />}
                label="Por partido"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={swap}
            disabled={!selA || !selB}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground-muted transition-colors',
              'hover:border-brand/40 hover:bg-brand-muted/30 hover:text-brand',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            aria-label="Intercambiar A y B"
          >
            <ArrowLeftRight size={13} />
            Intercambiar
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <TarjetaSelector
            etiqueta={tipo === 'candidato' ? 'Candidato 1' : 'Partido 1'}
            color={COLOR_A}
            tipo={tipo}
            codigoCorporacion={codigoCorporacion}
            value={selA}
            otherValue={selB}
            onChange={setSelA}
          />
          <TarjetaSelector
            etiqueta={tipo === 'candidato' ? 'Candidato 2' : 'Partido 2'}
            color={COLOR_B}
            tipo={tipo}
            codigoCorporacion={codigoCorporacion}
            value={selB}
            otherValue={selA}
            onChange={setSelB}
          />
        </div>
      </CardBody>
    </Card>
  );
}

function BotonTipo({
  activo,
  onClick,
  icon,
  label,
}: {
  activo: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
        activo
          ? 'bg-brand text-brand-foreground shadow-soft'
          : 'text-foreground-muted hover:bg-surface hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

interface TarjetaSelectorProps {
  etiqueta: string;
  color: typeof COLOR_A;
  tipo: TipoComparacionTerritorial;
  codigoCorporacion: string;
  value: SeleccionComparativo | null;
  otherValue: SeleccionComparativo | null;
  onChange: (sel: SeleccionComparativo | null) => void;
}

function TarjetaSelector({
  etiqueta,
  color,
  tipo,
  codigoCorporacion,
  value,
  otherValue,
  onChange,
}: TarjetaSelectorProps) {
  const { data: partidos, isLoading: loadingPart } = usePartidos(
    tipo === 'partido' ? codigoCorporacion : null,
  );
  const { data: candidatos, isLoading: loadingCand } = useCandidatos(
    tipo === 'candidato'
      ? { codigoCorporacion, limite: 500 }
      : { codigoCorporacion: null, limite: 0 },
  );

  // Para candidatos el value del <option> codifica (codigo, codigoPartido) para
  // distinguir candidatos homónimos en partidos distintos. Para partidos, basta
  // con el código.
  const opciones =
    tipo === 'partido'
      ? (partidos ?? []).map((p) => ({
          value: p.codigo,
          label: p.nombre,
        }))
      : (candidatos ?? []).map((c) => ({
          // El value codifica (codigo, codigoPartido) para enviar la tupla al backend;
          // el label sólo muestra el nombre del candidato — el partido se infiere del valor.
          value: encodeCandidato(c.codigo, c.codigoPartido),
          label: c.nombre,
        }));

  // Excluir la selección del otro lado para no permitir A == B.
  const valueOther = otherValue
    ? tipo === 'candidato'
      ? encodeCandidato(otherValue.codigo, otherValue.codigoPartido)
      : otherValue.codigo
    : null;
  const opcionesFiltradas = opciones.filter(
    (o) => !valueOther || o.value !== valueOther,
  );

  const valueEncoded = value
    ? tipo === 'candidato'
      ? encodeCandidato(value.codigo, value.codigoPartido)
      : value.codigo
    : null;

  const handleChange = (v: string | null) => {
    if (v === null) {
      onChange(null);
      return;
    }
    if (tipo === 'partido') {
      onChange({ codigo: v, codigoPartido: null });
    } else {
      const sel = decodeCandidato(v);
      // Defensa: si el otro lado seleccionó exactamente este ítem, no aplicar.
      if (mismaSeleccion(sel, otherValue)) return;
      onChange(sel);
    }
  };

  const loading = tipo === 'partido' ? loadingPart : loadingCand;

  return (
    <div className={cn('rounded-xl border bg-surface p-4', color.border, color.bg)}>
      <div className={cn('text-[11px] font-semibold uppercase tracking-wider', color.text)}>
        {etiqueta}
      </div>
      <div className="mt-3">
        <SelectFiltro
          label={tipo === 'candidato' ? 'Candidato' : 'Partido'}
          value={valueEncoded}
          loading={loading}
          options={opcionesFiltradas}
          onChange={handleChange}
          placeholder="Seleccione…"
        />
      </div>
    </div>
  );
}

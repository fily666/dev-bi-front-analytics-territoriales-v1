/**
 * Paleta fija (hex) para identificar a cada candidato del comparativo
 * estadístico de forma consistente entre chips, columnas de la tabla y las
 * series de la gráfica. Se eligen tonos diferenciados alineados con el
 * brandbook (navy, red, amber, sky, teal, …). Como son hex fijos, el mismo
 * candidato conserva su color en tema claro y oscuro.
 */
export const PALETA_CANDIDATOS = [
  '#313f69', // navy · brand
  '#b32118', // red · danger
  '#c79100', // amber profundo
  '#3f7fb8', // sky
  '#14a085', // teal
  '#8c5fc8', // purple
  '#e86e5c', // coral
  '#a8903c', // mostaza
  '#5a8f3c', // verde oliva
  '#c25d9e', // magenta suave
  '#4d6b8a', // azul acero
  '#9a6b3f', // marrón cálido
];

/** Color hex estable para el candidato en la posición `i` (ciclo si excede). */
export function colorCandidato(i: number): string {
  return PALETA_CANDIDATOS[i % PALETA_CANDIDATOS.length];
}

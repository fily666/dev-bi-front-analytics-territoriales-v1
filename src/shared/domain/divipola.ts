/**
 * Tabla de equivalencia entre los códigos de departamento usados por la
 * Registraduría Nacional (cómo viene la BD en `dim_divipole.codigo_departamento`)
 * y los códigos DIVIPOLA del DANE (lo que trae el GeoJSON `colombia-departamentos`).
 *
 * Origen verificado contra `dim_divipole` (33 entradas, mayo 2026) cruzando
 * por `nombre_departamento` con la matriz oficial DIVIPOLA del DANE.
 */
export const REGISTRADURIA_TO_DIVIPOLA_DEPTO: Readonly<Record<string, string>> = {
  '01': '05', // ANTIOQUIA
  '03': '08', // ATLÁNTICO
  '05': '13', // BOLÍVAR
  '07': '15', // BOYACÁ
  '09': '17', // CALDAS
  '11': '19', // CAUCA
  '12': '20', // CESAR
  '13': '23', // CÓRDOBA
  '15': '25', // CUNDINAMARCA
  '16': '11', // BOGOTÁ D.C.
  '17': '27', // CHOCÓ
  '19': '41', // HUILA
  '21': '47', // MAGDALENA
  '23': '52', // NARIÑO
  '24': '66', // RISARALDA
  '25': '54', // NORTE DE SANTANDER
  '26': '63', // QUINDÍO
  '27': '68', // SANTANDER
  '28': '70', // SUCRE
  '29': '73', // TOLIMA
  '31': '76', // VALLE DEL CAUCA
  '40': '81', // ARAUCA
  '44': '18', // CAQUETÁ
  '46': '85', // CASANARE
  '48': '44', // LA GUAJIRA
  '50': '94', // GUAINÍA
  '52': '50', // META
  '54': '95', // GUAVIARE
  '56': '88', // SAN ANDRÉS Y PROVIDENCIA
  '60': '91', // AMAZONAS
  '64': '86', // PUTUMAYO
  '68': '97', // VAUPÉS
  '72': '99', // VICHADA
};

export const DIVIPOLA_TO_REGISTRADURIA_DEPTO: Readonly<Record<string, string>> =
  Object.freeze(
    Object.fromEntries(
      Object.entries(REGISTRADURIA_TO_DIVIPOLA_DEPTO).map(([reg, divipola]) => [
        divipola,
        reg,
      ]),
    ),
  );

/** Convierte cualquier código (Registraduría o ya DIVIPOLA) a DIVIPOLA, conservando padding `LPAD(2,'0')`. */
export function aDivipolaDepto(codigo: string | null | undefined): string | null {
  if (!codigo) return null;
  const norm = String(codigo).padStart(2, '0');
  return REGISTRADURIA_TO_DIVIPOLA_DEPTO[norm] ?? norm;
}

/** Convierte un código DIVIPOLA a su equivalente de la Registraduría; si no hay match, devuelve el original. */
export function aRegistraduriaDepto(codigo: string | null | undefined): string | null {
  if (!codigo) return null;
  const norm = String(codigo).padStart(2, '0');
  return DIVIPOLA_TO_REGISTRADURIA_DEPTO[norm] ?? norm;
}

/**
 * Normaliza un nombre de municipio/departamento para hacer matching sin tildes,
 * mayúsculas ni espacios extra. Útil para joinear por nombre cuando los códigos
 * municipales de la Registraduría no coinciden con los DIVIPOLA del DANE
 * (~1100 municipios sin equivalencia 1:1).
 */
export function normalizarNombre(nombre: string | null | undefined): string {
  if (!nombre) return '';
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.\-_,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/**
 * Tabla nombre normalizado → código DIVIPOLA. Sirve como fallback cuando
 * `codigo_departamento` en la BD viene en un esquema desconocido (DIVIPOLA
 * directo, sin padding, o incluso el nombre como texto) y el matching por
 * código no encuentra polígono. Incluye sinónimos comunes (D.C., SAI, etc.).
 */
export const NOMBRE_TO_DIVIPOLA_DEPTO: Readonly<Record<string, string>> = {
  ANTIOQUIA: '05',
  ATLANTICO: '08',
  'BOGOTA D C': '11',
  'BOGOTA DC': '11',
  BOGOTA: '11',
  BOLIVAR: '13',
  BOYACA: '15',
  CALDAS: '17',
  CAQUETA: '18',
  CAUCA: '19',
  CESAR: '20',
  CORDOBA: '23',
  CUNDINAMARCA: '25',
  CHOCO: '27',
  HUILA: '41',
  'LA GUAJIRA': '44',
  GUAJIRA: '44',
  MAGDALENA: '47',
  META: '50',
  NARINO: '52',
  'NORTE DE SANTANDER': '54',
  QUINDIO: '63',
  RISARALDA: '66',
  'SAN ANDRES Y PROVIDENCIA': '88',
  'SAN ANDRES': '88',
  SANTANDER: '68',
  SUCRE: '70',
  TOLIMA: '73',
  'VALLE DEL CAUCA': '76',
  VALLE: '76',
  ARAUCA: '81',
  CASANARE: '85',
  PUTUMAYO: '86',
  AMAZONAS: '91',
  GUAINIA: '94',
  GUAVIARE: '95',
  VAUPES: '97',
  VICHADA: '99',
};

/**
 * Resuelve el código DIVIPOLA preferentemente por nombre normalizado. Es
 * a prueba de esquemas — Registraduría, DIVIPOLA o nombre crudo en el
 * campo `codigo_departamento`. Cae al lookup por código si el nombre no
 * está disponible o no matchea.
 */
export function aDivipolaDeptoFlexible(
  codigo: string | null | undefined,
  nombre: string | null | undefined,
): string | null {
  const porNombre = NOMBRE_TO_DIVIPOLA_DEPTO[normalizarNombre(nombre)];
  if (porNombre) return porNombre;
  return aDivipolaDepto(codigo);
}

/**
 * Conjunto de DIVIPOLA válidos (33 entradas) — los códigos efectivamente
 * presentes en `colombia-departamentos.geojson`. Sirve para validar que
 * una traducción de código se resolvió a un polígono real antes de
 * filtrar el mapa (evita dejar el viewport vacío por un código sin match).
 */
export const DIVIPOLAS_DEPTO_VALIDOS: ReadonlySet<string> = new Set(
  Object.values(REGISTRADURIA_TO_DIVIPOLA_DEPTO),
);

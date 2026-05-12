# GeoJSON de Colombia (DANE / MGN)

Archivos descargados desde [caticoa3/colombia_mapa](https://github.com/caticoa3/colombia_mapa),
que es la conversión más actualizada y mejor curada del **Marco Geoestadístico Nacional (MGN)
del DANE** disponible públicamente como GeoJSON.

## Archivos

| Archivo | Tamaño | Features | Año MGN |
|---|---|---|---|
| `colombia-departamentos.geojson` | 396 KB | 33 | 2018 |
| `colombia-municipios.geojson` | 2.7 MB | 1 122 | 2018-2019 |

## Propiedades de cada feature

### `colombia-departamentos.geojson`
- `DPTO_CCDGO` — código DIVIPOLA del departamento (2 dígitos, ej. `"11"`, `"05"`)
- `DPTO_CNMBR` — nombre (`"BOGOTÁ, D.C."`, `"ANTIOQUIA"`)
- `DPTO_NANO`, `DPTO_CACTO` — metadatos del MGN

### `colombia-municipios.geojson`
- `DPTO_CCDGO` — código departamento (2 dígitos)
- `MPIO_CCDGO` — código municipio (3 dígitos, sufijo)
- `MPIO_CCNCT` — **código DIVIPOLA completo** (5 dígitos = dept + mun)
- `MPIO_CNMBR` — nombre del municipio
- `DPTO_CNMBR` — nombre del departamento
- `MPIO_NANO` — año

## Match con `dim_divipole`

El JOIN con la tabla `dim_divipole` del backend depende del **formato real** de
`codigo_municipio`. Verifíquelo con:

```sql
SELECT codigo_departamento, codigo_municipio, length(codigo_municipio) AS len
FROM dim_divipole
WHERE codigo_departamento = '11'
LIMIT 3;
```

| Si `codigo_municipio` tiene… | Use esta propiedad del GeoJSON |
|---|---|
| 3 caracteres (`"001"`, `"002"`) | `MPIO_CCDGO` |
| 5 caracteres (`"11001"`) | `MPIO_CCNCT` |

Esto se configura vía la prop `propiedadCodigo` del componente del mapa.

## Por qué MGN 2018 y no más reciente

DANE publicó actualizaciones del MGN en 2020 y 2022 (ajustes menores de límites
y creación de municipios como Barrancominas en Guainía). Sin embargo, **estas
versiones recientes solo se distribuyen como shapefiles** desde el Geoportal,
no como GeoJSON. La conversión requiere `ogr2ogr` (GDAL).

El archivo MGN 2018 incluido aquí ya tiene las correcciones más relevantes
incorporadas (algunos features tienen `MPIO_NANO: 2019`) y es la versión más
completa con propiedades DIVIPOLA estándar disponible públicamente como GeoJSON.

Si necesita MGN 2022/2023 exacto:

```bash
# 1. Descargar shapefile del Geoportal DANE: https://geoportal.dane.gov.co/
# 2. Convertir con GDAL:
ogr2ogr -f GeoJSON -t_srs EPSG:4326 colombia-municipios.geojson MGN_2022_MPIO_POLITICO.shp
```

## Fuentes oficiales

- [Geoportal DANE](https://geoportal.dane.gov.co/) — descargas oficiales (shapefiles)
- [DIVIPOLA Municipios (XLSX)](https://geoportal.dane.gov.co/descargas/divipola/DIVIPOLA_Municipios.xlsx) — tabla maestra de códigos
- [MGN Geovisor](https://geoportal.dane.gov.co/geovisores/territorio/mgn-marco-geoestadistico-nacional/)
- Repo fuente: [caticoa3/colombia_mapa](https://github.com/caticoa3/colombia_mapa)

## Validación

```bash
node -e "const g=JSON.parse(require('fs').readFileSync('colombia-municipios.geojson','utf8')); console.log(g.features.length,'municipios,',new Set(g.features.map(f=>f.properties.DPTO_CCDGO)).size,'departamentos')"
```

-- Prórrogas y Ajustes — tabla principal (legacy pago_prorroga completa)
-- alumno_id referencia al proyecto Winston Servicios (sin FK cross-project)

CREATE TABLE IF NOT EXISTS public.pago_prorroga (
  prorroga_id SERIAL PRIMARY KEY,
  alumno_id INTEGER NOT NULL,
  alumno_ref INTEGER NOT NULL,
  pago_concepto SMALLINT NOT NULL,
  pago_importe NUMERIC(10, 2) NOT NULL,
  prorroga_fecha DATE NOT NULL,
  prorroga_status SMALLINT NOT NULL DEFAULT 1,
  prorroga_ciclo_escolar SMALLINT NOT NULL,
  prorroga_no INTEGER NOT NULL,
  correccion SMALLINT NOT NULL DEFAULT 0,
  prorroga_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  autor VARCHAR(50) NOT NULL DEFAULT ''
);

COMMENT ON TABLE public.pago_prorroga IS 'Prórrogas de pago por alumno (módulo Prórrogas y Ajustes).';

CREATE INDEX IF NOT EXISTS pago_prorroga_alumno ON public.pago_prorroga (alumno_id);
CREATE INDEX IF NOT EXISTS pago_prorroga_fecha ON public.pago_prorroga (prorroga_fecha);
CREATE INDEX IF NOT EXISTS pago_prorroga_alumno_ciclo ON public.pago_prorroga (alumno_id, prorroga_ciclo_escolar);

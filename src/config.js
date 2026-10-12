// Datos de contacto y despliegue. Rellenar lo pendiente y ejecutar `node build.js`.
module.exports = {
  // Dominio final (sin barra al final). Se usa para canonical, hreflang y sitemap.
  site: 'https://atempopsychology.com',
  // Correo donde Adelina recibe las consultas. PENDIENTE: confirmar con ella.
  email: '',
  // Endpoint de formularios (Formspree o similar, p. ej. https://formspree.io/f/xxxxxx).
  // Si está vacío, el formulario abre el correo de la persona con el mensaje ya escrito.
  formEndpoint: '',
  // Instagram sin @ (opcional)
  instagram: '',
  // Número de colegiada (obligatorio en España para el aviso legal). PENDIENTE.
  colegiada: '',
  // --- Opcionales: si se dejan vacíos, no aparecen en la web ---
  // Llamada gratuita de presentación (minutos). 0 = no se ofrece. PENDIENTE: decidir con Adelina.
  freeCallMinutes: 0,
  // Horario de consulta en hora de España, p. ej. 'Lunes a jueves, 10:00 a 20:00 (hora de España)'
  hours: '',
  hoursEn: '',
  // Horas de antelación para cancelar sin coste, p. ej. 24
  cancelHours: 0,
  // Enfoques terapéuticos con los que trabaja (p. ej. 'Terapia cognitivo-conductual', 'EMDR')
  approaches: [],
  approachesEn: []
};

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Referencia al botón de envío
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Recopilar datos
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Validar campos básicos (opcional, ya que 'required' en HTML ayuda)
            if (!data.name || !data.email || !data.message) {
                $.alert({
                    title: 'Error',
                    content: 'Por favor, completa todos los campos requeridos.',
                    type: 'red',
                    theme: 'modern'
                });
                return;
            }

            // Cambiar estado del botón
            submitBtn.innerHTML = `
                <svg class="btn-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
                </svg>
                Enviando...
            `;
            submitBtn.disabled = true;

            // URL de la API (Cambiar por la URL real)
            const API_URL = 'http://localhost/mh/edumanager/public/requestContactFormLanding'; // URL de prueba

            // Enviar datos
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return response.json();
                })
                .then(result => {
                    console.log('Success:', result);

                    // Mostrar éxito
                    $.confirm({
                        title: '¡Mensaje Enviado!',
                        content: 'Gracias por ponerte en contacto con nosotros. Te responderemos a la brevedad.',
                        type: 'green',
                        theme: 'modern',
                        boxWidth: '400px',
                        useBootstrap: false,
                        buttons: {
                            ok: {
                                text: 'Entendido',
                                btnClass: 'btn-primary',
                                action: function () {
                                    contactForm.reset();
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);

                    // Mostrar error
                    $.alert({
                        title: 'Error',
                        content: 'Hubo un problema al enviar tu mensaje. Por favor intenta nuevamente más tarde.',
                        type: 'red',
                        theme: 'modern',
                        boxWidth: '400px',
                        useBootstrap: false,
                    });
                })
                .finally(() => {
                    // Restaurar botón
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});
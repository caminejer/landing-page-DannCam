// Validación personalizada de Bootstrap para el formulario de pago
(function () {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                // Comprueba si la validación falla
                if (!form.checkValidity()) {
                    event.preventDefault(); // Detiene el envío
                    event.stopPropagation(); // Detiene la propagación del evento
                }

                // Agrega la clase 'was-validated' para mostrar el feedback de Bootstrap
                form.classList.add('was-validated');
            }, false);
        });
})();
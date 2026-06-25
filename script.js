

// Configurar fecha mínima como hoy
const hoy = new Date().toISOString().split('T')[0];
document.getElementById('modalFecha').min = hoy;
document.getElementById('heroFecha').min = hoy;

let destinoActual = '';
let precioActual = 0;
let codigoReservaGlobal = '';

// Abrir modal y prellenar destino
document.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', () => {
        destinoActual = btn.getAttribute('data-destino');
        precioActual = parseInt(btn.getAttribute('data-precio'));
        
        document.getElementById('modalDestino').value = destinoActual;
        document.getElementById('modalPrecio').textContent = `$${precioActual.toLocaleString()} MXN`;
        
        // Resetear pasos
        document.getElementById('paso1').classList.remove('d-none');
        document.getElementById('paso2').classList.add('d-none');
        document.getElementById('paso3').classList.add('d-none');
        document.getElementById('reservaForm').reset();
        
        const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
        modal.show();
    });
});

// Función para ir al paso de pago
function irAPago() {
    const form = document.getElementById('reservaForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    document.getElementById('paso1').classList.add('d-none');
    document.getElementById('paso2').classList.remove('d-none');
}

// Función para regresar a datos
function regresarADatos() {
    document.getElementById('paso2').classList.add('d-none');
    document.getElementById('paso1').classList.remove('d-none');
}

// Cambiar método de pago
function cambiarMetodoPago() {
    const metodo = document.getElementById('metodoPago').value;
    
    document.getElementById('pagoTarjeta').classList.add('d-none');
    document.getElementById('pagoPaypal').classList.add('d-none');
    document.getElementById('pagoEfectivo').classList.add('d-none');
    
    if (metodo === 'tarjeta') {
        document.getElementById('pagoTarjeta').classList.remove('d-none');
    } else if (metodo === 'paypal') {
        document.getElementById('pagoPaypal').classList.remove('d-none');
    } else if (metodo === 'efectivo') {
        document.getElementById('pagoEfectivo').classList.remove('d-none');
    }
}

// Procesar pago
function procesarPago() {
    const metodo = document.getElementById('metodoPago').value;
    const btn = document.querySelector('.btn-success');
    const textoOriginal = btn.innerHTML;
    
    // Validar según método
    if (metodo === 'tarjeta') {
        const numTarjeta = document.getElementById('numTarjeta').value;
        const fechaExp = document.getElementById('fechaExp').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!numTarjeta || !fechaExp || !cvv) {
            alert('Por favor completa todos los campos de la tarjeta');
            return;
        }
    }
    
    // Mostrar loading
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
    
    // Simular procesamiento
    setTimeout(() => {
        // Generar código único
        codigoReservaGlobal = 'VMX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        document.getElementById('codigoReserva').textContent = codigoReservaGlobal;
        
        // Mostrar confirmación
        document.getElementById('paso2').classList.add('d-none');
        document.getElementById('paso3').classList.remove('d-none');
        
        // Restaurar botón
        btn.disabled = false;
        btn.innerHTML = textoOriginal;
        
        // Guardar en localStorage (simulando base de datos)
        guardarReserva();
        
    }, 2500);
}

// Guardar reserva
function guardarReserva() {
    const reserva = {
        codigo: codigoReservaGlobal,
        destino: destinoActual,
        nombre: document.getElementById('modalNombre').value,
        email: document.getElementById('modalEmail').value,
        fecha: document.getElementById('modalFecha').value,
        pasajeros: document.getElementById('modalPasajeros').value,
        precio: precioActual,
        metodo: document.getElementById('metodoPago').value,
        fechaReserva: new Date().toISOString()
    };
    
    let reservas = JSON.parse(localStorage.getItem('reservasViajesMX') || '[]');
    reservas.push(reserva);
    localStorage.setItem('reservasViajesMX', JSON.stringify(reservas));
}

// BUSCADOR FUNCIONAL
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const destinoBuscado = document.getElementById('heroDestino').value;
    const fechaBuscada = document.getElementById('heroFecha').value;
    const pasajerosBuscados = document.getElementById('heroPasajeros').value;
    
    // Ocultar todos los destinos primero
    const destinos = document.querySelectorAll('.destino-item');
    destinos.forEach(destino => {
        destino.classList.add('oculto');
        destino.classList.remove('resaltado');
    });
    
    // Si no se seleccionó destino específico, mostrar todos
    if (!destinoBuscado) {
        destinos.forEach(destino => {
            destino.classList.remove('oculto');
            destino.classList.add('resaltado');
        });
        document.getElementById('noResults').classList.add('d-none');
    } else {
        // Buscar destino que coincida
        let encontrado = false;
        destinos.forEach(destino => {
            const nombreDestino = destino.getAttribute('data-nombre');
            if (nombreDestino === destinoBuscado) {
                destino.classList.remove('oculto');
                destino.classList.add('resaltado');
                encontrado = true;
            }
        });
        
        // Mostrar mensaje si no hay resultados
        if (!encontrado) {
            document.getElementById('noResults').classList.remove('d-none');
        } else {
            document.getElementById('noResults').classList.add('d-none');
        }
    }
    
    // Scroll a la sección de destinos
    document.getElementById('destinos').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Mostrar info de búsqueda
    const nombreDestinoTexto = document.getElementById('heroDestino').options[document.getElementById('heroDestino').selectedIndex].text;
    console.log(`Búsqueda: ${nombreDestinoTexto} | Fecha: ${fechaBuscada} | Pasajeros: ${pasajerosBuscados}`);
});

// Resetear búsqueda al hacer clic en el logo o inicio
document.querySelector('.navbar-brand').addEventListener('click', () => {
    const destinos = document.querySelectorAll('.destino-item');
    destinos.forEach(destino => {
        destino.classList.remove('oculto');
        destino.classList.remove('resaltado');
    });
    document.getElementById('noResults').classList.add('d-none');
    document.getElementById('searchForm').reset();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Formato automático para número de tarjeta
document.getElementById('numTarjeta')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
});

// Formato automático para fecha de expiración
document.getElementById('fechaExp')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});
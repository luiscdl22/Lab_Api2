// Al cargar la pagina se llena la tabla automaticamente
document.addEventListener("DOMContentLoaded", function() {
    ListarProductos();
});

// Muestra el alert de Bootstrap debajo del formulario
function mostrarAlert(mensaje, tipo) {
    var box = document.getElementById("alertBox");
    // tipo: success, danger, warning, info
    box.className = "alert alert-" + tipo + " mt-3";
    box.innerHTML = mensaje;
    box.classList.remove("d-none");
    // Se oculta solo despues de 4 segundos
    setTimeout(function() {
        box.classList.add("d-none");
    }, 4000);
}

// Funcion principal que maneja los 3 botones del formulario
function accionFormulario(accion) {

    // Recolectamos los valores del formulario con FormData
    var datos = new FormData();
    datos.append("Accion",   accion);
    datos.append("id",       document.getElementById("id").value);
    datos.append("codigo",   document.getElementById("codigo").value.trim());
    datos.append("producto", document.getElementById("producto").value.trim());
    datos.append("precio",   document.getElementById("precio").value);
    datos.append("cantidad", document.getElementById("cantidad").value);

    // Validacion en el cliente antes de enviar al servidor
    // Switch en JS segun la accion del boton presionado
    switch (accion) {
        case "Guardar":
        case "Modificar":
            if (!datos.get("codigo") || !datos.get("producto") ||
                !datos.get("precio") || !datos.get("cantidad")) {
                Swal.fire("Campos vacios", "Por favor completa todos los campos.", "warning");
                mostrarAlert("Por favor completa todos los campos.", "warning");
                return;
            }
            break;

        case "Buscar":
            if (!datos.get("codigo")) {
                Swal.fire("Codigo requerido", "Ingresa un codigo para buscar.", "warning");
                mostrarAlert("Ingresa un codigo para buscar.", "warning");
                return;
            }
            break;
    }

    // Enviamos la peticion al servidor con Fetch API
    fetch("registrar.php", {
        method: "POST",
        body: datos
    })
    .then(function(res) {
        return res.json(); // Convertimos la respuesta a JSON
    })
    .then(function(json) {

        // Switch en JS segun la accion que respondio el servidor
        switch (json.accion) {

            case "guardar":
                Swal.fire("Exito", json.message, "success");
                mostrarAlert(json.message, "success");
                limpiarFormulario();
                ListarProductos();
                break;

            case "editar":
                Swal.fire("Actualizado", json.message, "success");
                mostrarAlert(json.message, "success");
                limpiarFormulario();
                ListarProductos();
                break;

            case "buscar":
                // Llenamos el formulario con los datos encontrados
                var d = json.data;
                document.getElementById("id").value       = d.id;
                document.getElementById("codigo").value   = d.codigo;
                document.getElementById("producto").value = d.producto;
                document.getElementById("precio").value   = d.precio;
                document.getElementById("cantidad").value = d.cantidad;
                Swal.fire("Encontrado", "Producto: " + d.producto, "info");
                mostrarAlert("Producto encontrado: " + d.producto, "info");
                break;

            default:
                // Si success es false mostramos los errores
                if (json.errors) {
                    Swal.fire("Errores", json.errors.join("\n"), "error");
                    mostrarAlert(json.errors.join(" | "), "danger");
                } else {
                    Swal.fire("Error", json.message, "error");
                    mostrarAlert(json.message, "danger");
                }
                break;
        }
    })
    .catch(function(err) {
        // Error de red o respuesta invalida del servidor
        Swal.fire("Error de red", err.message, "error");
        mostrarAlert("Error de red: " + err.message, "danger");
    });
}

// Consulta todos los productos y llena la tabla
function ListarProductos() {
    var datos = new FormData();
    datos.append("Accion", "Listar");

    fetch("registrar.php", { method: "POST", body: datos })
    .then(function(res) { return res.json(); })
    .then(function(json) {
        var tbody = document.getElementById("tablaProductos");

        if (!json.success || json.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay productos registrados.</td></tr>';
            return;
        }

        // Construimos las filas de la tabla dinamicamente
        tbody.innerHTML = json.data.map(function(p) {
            return '<tr>' +
                '<td>' + p.id + '</td>' +
                '<td>' + p.codigo + '</td>' +
                '<td>' + p.producto + '</td>' +
                '<td>$' + parseFloat(p.precio).toFixed(2) + '</td>' +
                '<td>' + p.cantidad + '</td>' +
                '<td>' +
                    '<button class="btn btn-sm btn-warning" onclick="cargarEditar(' +
                        p.id + ',\'' + p.codigo + '\',\'' + p.producto + '\',' +
                        p.precio + ',' + p.cantidad +
                    ')">Editar</button>' +
                '</td>' +
            '</tr>';
        }).join("");
    });
}

// Carga los datos de una fila en el formulario para editar
function cargarEditar(id, codigo, producto, precio, cantidad) {
    document.getElementById("id").value       = id;
    document.getElementById("codigo").value   = codigo;
    document.getElementById("producto").value = producto;
    document.getElementById("precio").value   = precio;
    document.getElementById("cantidad").value = cantidad;

    window.scrollTo({ top: 0, behavior: "smooth" });
    Swal.fire("Modo Edicion", "Editando: " + producto, "info");
    mostrarAlert("Editando producto: " + producto, "info");
}

// Limpia todos los campos del formulario
function limpiarFormulario() {
    ["id", "codigo", "producto", "precio", "cantidad"].forEach(function(id) {
        document.getElementById(id).value = "";
    });
}
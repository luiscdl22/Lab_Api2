document.addEventListener("DOMContentLoaded", function () {
  ListarProductos();
});

// ✅ MEJORADO: Limpia timeout anterior
function mostrarAlert(mensaje, tipo) {
  var box = document.getElementById("alertBox");
  if (window.alertTimeout) {
    clearTimeout(window.alertTimeout);
  }
  box.className = "alert alert-" + tipo + " mt-3";
  box.innerHTML = mensaje;
  box.classList.remove("d-none");
  window.alertTimeout = setTimeout(function () {
    box.classList.add("d-none");
  }, 4000);
}

function accionFormulario(accion) {
  var datos = new FormData();
  datos.append("Accion", accion);
  datos.append("id", document.getElementById("id").value);
  datos.append("codigo", document.getElementById("codigo").value.trim());
  datos.append("producto", document.getElementById("producto").value.trim());
  datos.append("precio", document.getElementById("precio").value);
  datos.append("cantidad", document.getElementById("cantidad").value);

  switch (accion) {
    case "Guardar":
    case "Modificar":
      if (
        !datos.get("codigo") ||
        !datos.get("producto") ||
        !datos.get("precio") ||
        !datos.get("cantidad")
      ) {
        Swal.fire(
          "Campos vacios",
          "Por favor completa todos los campos.",
          "warning",
        );
        mostrarAlert("Por favor completa todos los campos.", "warning");
        return;
      }
      break;

    case "Buscar":
      if (!datos.get("codigo")) {
        Swal.fire(
          "Codigo requerido",
          "Ingresa un codigo para buscar.",
          "warning",
        );
        mostrarAlert("Ingresa un codigo para buscar.", "warning");
        return;
      }
      break;
  }

  fetch("registrar.php", {
    method: "POST",
    body: datos,
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
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
          var d = json.data;
          document.getElementById("id").value = d.id;
          document.getElementById("codigo").value = d.codigo;
          document.getElementById("producto").value = d.producto;
          document.getElementById("precio").value = d.precio;
          document.getElementById("cantidad").value = d.cantidad;
          Swal.fire("Encontrado", "Producto: " + d.producto, "info");
          mostrarAlert("Producto encontrado: " + d.producto, "info");
          break;

        case "eliminar":
          Swal.fire("Eliminado", json.message, "success");
          mostrarAlert(json.message, "success");
          ListarProductos();
          break;

        default:
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
    .catch(function (err) {
      Swal.fire("Error de red", err.message, "error");
      mostrarAlert("Error de red: " + err.message, "danger");
    });
}

function ListarProductos() {
  var datos = new FormData();
  datos.append("Accion", "Listar");

  fetch("registrar.php", { method: "POST", body: datos })
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
      var tbody = document.getElementById("tablaProductos");

      if (!json.success || json.data.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="6" class="text-center text-muted">No hay productos registrados.</td></tr>';
        return;
      }

      tbody.innerHTML = json.data
        .map(function (p) {
          return (
            "<tr>" +
            "<td>" +
            p.id +
            "</td>" +
            "<td>" +
            p.codigo +
            "</td>" +
            "<td>" +
            p.producto +
            "</td>" +
            "<td>$" +
            parseFloat(p.precio).toFixed(2) +
            "</td>" +
            "<td>" +
            p.cantidad +
            "</td>" +
            "<td>" +
            '<button class="btn btn-sm btn-warning me-1" onclick="cargarEditar(' +
            p.id +
            ",'" +
            p.codigo +
            "','" +
            p.producto +
            "'," +
            p.precio +
            "," +
            p.cantidad +
            ')">Editar</button>' +
            '<button class="btn btn-sm btn-danger" onclick="eliminarProducto(' +
            p.id +
            ')">Eliminar</button>' +
            "</td>" +
            "</tr>"
          );
        })
        .join("");
    });
}

function cargarEditar(id, codigo, producto, precio, cantidad) {
  document.getElementById("id").value = id;
  document.getElementById("codigo").value = codigo;
  document.getElementById("producto").value = producto;
  document.getElementById("precio").value = precio;
  document.getElementById("cantidad").value = cantidad;

  window.scrollTo({ top: 0, behavior: "smooth" });
  Swal.fire("Modo Edicion", "Editando: " + producto, "info");
  mostrarAlert("Editando producto: " + producto, "info");
}

function limpiarFormulario() {
  ["id", "codigo", "producto", "precio", "cantidad"].forEach(function (id) {
    document.getElementById(id).value = "";
  });
}

// ✅ NUEVO: Eliminar producto con confirmación
function eliminarProducto(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      var datos = new FormData();
      datos.append("Accion", "Eliminar");
      datos.append("id", id);

      fetch("registrar.php", {
        method: "POST",
        body: datos,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            Swal.fire("Eliminado", json.message, "success");
            mostrarAlert(json.message, "success");
            ListarProductos();
          } else {
            Swal.fire("Error", json.message, "error");
            mostrarAlert(json.message, "danger");
          }
        })
        .catch(function (err) {
          Swal.fire("Error de red", err.message, "error");
          mostrarAlert("Error de red: " + err.message, "danger");
        });
    }
  });
}

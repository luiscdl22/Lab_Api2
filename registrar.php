<?php
// Le dice al navegador que la respuesta es JSON puro
header("Content-Type: application/json");

require_once "Modelo/Productos.php";

// Leemos la accion enviada desde el formulario
$accion = $_POST['Accion'] ?? '';

// Creamos el objeto y asignamos los valores recibidos
$p = new Producto();
$p->id       = $_POST['id']       ?? '';
$p->codigo   = trim($_POST['codigo']   ?? '');
$p->producto = trim($_POST['producto'] ?? '');
$p->precio   = $_POST['precio']   ?? '';
$p->cantidad = $_POST['cantidad'] ?? '';

// Switch centraliza toda la logica en un solo archivo
switch ($accion) {
    case 'Guardar':
        echo json_encode($p->guardar());
        break;

    case 'Modificar':
        echo json_encode($p->editar());
        break;

    case 'Buscar':
        echo json_encode($p->buscar());
        break;

    case 'Listar':
        $lista = $p->listar();
        echo json_encode(["success" => true, "data" => $lista]);
        break;

    default:
        echo json_encode(["success" => false, "message" => "Accion no reconocida."]);
        break;
}
?>
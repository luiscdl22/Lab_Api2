<?php
header("Content-Type: application/json");

require_once "Modelo/Productos.php";

$accion = $_POST['Accion'] ?? '';

$p = new Producto();
$p->id       = $_POST['id']       ?? '';
$p->codigo   = trim($_POST['codigo']   ?? '');
$p->producto = trim($_POST['producto'] ?? '');
$p->precio   = $_POST['precio']   ?? '';
$p->cantidad = $_POST['cantidad'] ?? '';

switch ($accion) {
    case 'Guardar':
        echo json_encode($p->guardar());
        exit;
        break;

    case 'Modificar':
        echo json_encode($p->editar());
        exit;
        break;

    case 'Buscar':
        echo json_encode($p->buscar());
        exit;
        break;

    case 'Listar':
        $lista = $p->listar();
        echo json_encode(["success" => true, "data" => $lista]);
        exit;
        break;

    case 'Eliminar':
        echo json_encode($p->eliminar());
        exit;
        break;

    default:
        echo json_encode(["success" => false, "message" => "Accion no reconocida."]);
        exit;
        break;
}
?>
<?php
require_once "conexion.php";

class Producto {
    private $db;

    // Propiedades que representan las columnas de la tabla
    public $id;
    public $codigo;
    public $producto;
    public $precio;
    public $cantidad;

    public function __construct() {
        $this->db = new DB();
    }

    // Valida que los campos no esten vacios o con valores invalidos
    public function validar() {
        $errores = [];
        if (empty($this->codigo))   $errores[] = "El codigo es obligatorio.";
        if (empty($this->producto)) $errores[] = "El nombre del producto es obligatorio.";
        if (!is_numeric($this->precio) || $this->precio <= 0) $errores[] = "El precio debe ser mayor a 0.";
        if (!is_numeric($this->cantidad) || $this->cantidad < 1) $errores[] = "La cantidad minima al registrar es 1.";
        return $errores;
    }

    // INSERT en la tabla productos
    public function guardar() {
        $errores = $this->validar();
        if (!empty($errores)) return ["success" => false, "errors" => $errores];

        $sql = "INSERT INTO productos (codigo, producto, precio, cantidad) VALUES (?, ?, ?, ?)";
        $this->db->insertSeguro($sql, [$this->codigo, $this->producto, $this->precio, $this->cantidad]);
        return ["success" => true, "message" => "Producto guardado correctamente.", "accion" => "guardar"];
    }

    // UPDATE por ID
    public function editar() {
        $errores = $this->validar();
        if (!empty($errores)) return ["success" => false, "errors" => $errores];

        $sql = "UPDATE productos SET codigo=?, producto=?, precio=?, cantidad=? WHERE id=?";
        $this->db->updateSeguro($sql, [$this->codigo, $this->producto, $this->precio, $this->cantidad, $this->id]);
        return ["success" => true, "message" => "Producto actualizado correctamente.", "accion" => "editar"];
    }

    // SELECT por codigo
    public function buscar() {
        if (empty($this->codigo)) return ["success" => false, "message" => "Ingrese un codigo para buscar."];

        $sql    = "SELECT * FROM productos WHERE codigo = ?";
        $result = $this->db->query($sql, [$this->codigo]);

        if (count($result) > 0) {
            return ["success" => true, "data" => $result[0], "accion" => "buscar"];
        } else {
            return ["success" => false, "message" => "No se encontro ningun producto con ese codigo."];
        }
    }

    // SELECT todos los productos ordenados por ID descendente
    public function listar() {
        $sql = "SELECT * FROM productos ORDER BY id DESC";
        return $this->db->query($sql);
    }
}
?>
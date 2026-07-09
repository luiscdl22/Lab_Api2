<?php
require_once "conexion.php";

class Producto {
    private $db;
    public $id;
    public $codigo;
    public $producto;
    public $precio;
    public $cantidad;

    public function __construct() {
        $this->db = new DB();
    }

    // ✅ CORREGIDO: Validación con parámetro para diferenciar guardar/editar
    public function validar($esEdicion = false) {
        $errores = [];
        if (empty($this->codigo))   $errores[] = "El codigo es obligatorio.";
        if (empty($this->producto)) $errores[] = "El nombre del producto es obligatorio.";
        if (!is_numeric($this->precio) || $this->precio <= 0) $errores[] = "El precio debe ser mayor a 0.";
        
        // Regla de negocio: nuevo producto mínimo 1, edición permite 0
        if ($esEdicion) {
            if (!is_numeric($this->cantidad) || $this->cantidad < 0) {
                $errores[] = "La cantidad no puede ser negativa.";
            }
        } else {
            if (!is_numeric($this->cantidad) || $this->cantidad < 1) {
                $errores[] = "La cantidad minima al registrar es 1.";
            }
        }
        
        return $errores;
    }

    public function guardar() {
        $errores = $this->validar(false);
        if (!empty($errores)) return ["success" => false, "errors" => $errores];

        $sql = "INSERT INTO productos (codigo, producto, precio, cantidad) VALUES (?, ?, ?, ?)";
        $this->db->insertSeguro($sql, [$this->codigo, $this->producto, $this->precio, $this->cantidad]);
        return ["success" => true, "message" => "Producto guardado correctamente.", "accion" => "guardar"];
    }

    // ✅ CORREGIDO: Validación de ID + permite cantidad 0
    public function editar() {
        if (empty($this->id) || !is_numeric($this->id)) {
            return ["success" => false, "message" => "ID inválido para editar."];
        }
        
        $errores = $this->validar(true);
        if (!empty($errores)) return ["success" => false, "errors" => $errores];

        $sql = "UPDATE productos SET codigo=?, producto=?, precio=?, cantidad=? WHERE id=?";
        $this->db->updateSeguro($sql, [$this->codigo, $this->producto, $this->precio, $this->cantidad, $this->id]);
        return ["success" => true, "message" => "Producto actualizado correctamente.", "accion" => "editar"];
    }

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

    public function listar() {
        $sql = "SELECT * FROM productos ORDER BY id DESC";
        return $this->db->query($sql);
    }

    // ✅ NUEVO: Eliminar producto
    public function eliminar() {
        if (empty($this->id) || !is_numeric($this->id)) {
            return ["success" => false, "message" => "ID inválido para eliminar."];
        }
        
        $sql = "DELETE FROM productos WHERE id = ?";
        $this->db->updateSeguro($sql, [$this->id]);
        return ["success" => true, "message" => "Producto eliminado correctamente.", "accion" => "eliminar"];
    }
}
?>
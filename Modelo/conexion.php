<?php
class DB {
    private $conn;

    private $host     = "localhost";
    private $dbname   = "productosdb";
    private $user     = "root";
    private $password = "";

    // Se ejecuta automaticamente al crear un objeto DB
    public function __construct() {
        try {
            // PDO conecta a MySQL de forma segura
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->dbname};charset=utf8",
                $this->user,
                $this->password
            );
            // Si algo falla, PDO lanzara una excepcion
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error de conexion: " . $e->getMessage()]);
            exit;
        }
    }

    // INSERT seguro usando parametros para evitar SQL Injection
    public function insertSeguro($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $this->conn->lastInsertId();
    }

    // UPDATE seguro usando parametros
    public function updateSeguro($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($params);
    }

    // SELECT para consultas de busqueda
    public function query($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
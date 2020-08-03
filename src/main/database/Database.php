<?php
namespace RnctAdmin\Main;

class Database {
    protected $server;
    protected $tables;
    protected $css;
    protected $js;
    protected $jslazy;
    protected $conn;
    protected $folders;
    protected $root;
    protected $page_dir;
    // get settings json
    function __construct($json){
        $settings = $this->readJsonFile($json);
        $this->server = $settings['mysqlConnect'];
        $this->tables = $settings['tables'];
        $this->css = $settings['css'];
        $this->js = $settings['js'];
        $this->folders = $settings['folders'];
        $this->jslazy = $settings['jslazy'];
        $this->conn = $this->sql_connect();
        $this->root = $_SERVER['DOCUMENT_ROOT'];
        $this->page_dir = realpath($this->root ."/". $this->folders['pages']);
    }
    // update settings
    protected function update_settings($name,$data){
        $table = $this->tables['settings'];
        $sql = "UPDATE $table SET data = '$data' WHERE name = '$name';";
        $this->query($sql);
    }
    // get settings
    protected function get_image($id){
        $table = $this->tables['images'];
        $sql = "SELECT * FROM $table WHERE image_id = '$id';";
        $json = "";
        $result = $this->query($sql);
        while ($row = mysqli_fetch_assoc($result)) {
            $json = $row['data'];
        }
        return $json;
    }
    // get settings
    protected function get_settings($name){
        $table = $this->tables['settings'];
        $sql = "SELECT * FROM $table WHERE name = '$name';";
        $json = "";
        $result = $this->query($sql);
        while ($row = mysqli_fetch_assoc($result)) {
            $json = $row['data'];
        }
        return $json;
    }
    // get parameters
    public function get_params(){
        $param = [
            "conn" => $this->conn,
            "domain" => $this->domain_name(),
            "css" => $this->css,
            "js" => $this->js,
            "jslazy" => $this->jslazy,
            "tables" => $this->tables,
            "folders" => $this->folders,
            "root" => $this->root,
            "page_dir" => $this->page_dir
        ];
        return $param;
    }
    // get pages
    protected function get_pages(){
        $tables = $this->tables;
        $array = $this->get_data_json($tables['pages']);
        return $array;
    }
    // get menus
    protected function get_menus(){
        $tables = $this->tables;
        $array = $this->get_data_json($tables['menus']);
        return $array;
    }
    // get images
    protected function get_images(){
        $tables = $this->tables;
        $array = $this->get_data_json($tables['images']);
        return $array;
    }
    // get mysqli data column into an ass array
    private function get_data_json($tablename){
        $table = $tablename;
        $sql = "SELECT * FROM $table;";
        $result = $this->query($sql);
        $array = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $json = json_decode($row['data'],true);
            array_push($array,$json);
        }
        return $array;
    }
    // connect to sql
    public function sql_connect() {
        $this->conn = mysqli_connect(
            $this->server['server'],
            $this->server['username'],
            $this->server['password'],
            $this->server['database']
            ) or die(mysqli_connect_error());
        return $this->conn;
    }
    // get website domain
    public function domain_name(){
        $this->domain = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['HTTP_HOST'];
        return $this->domain;
    }
    // read json file
    private function readJsonFile($filename){
        if (!file_exists($filename)) {
            die("Json file not found");
        }
        $libraries = fopen($filename,"r");
        $json = "";
        while (!feof($libraries)) {
            $json .= fread($libraries, filesize($filename));
        }
        fclose($libraries);
        $json = json_decode($json,true);
        if ($json == null) {
            return false;
        }
        return $json;
    }
    // normal print
    protected function query($sql){
        $charset = "set names 'utf8';";
        mysqli_query($this->conn,$charset) or die(mysqli_error($this->conn));
        $result = mysqli_query($this->conn,$sql) or die(mysqli_error($this->conn));
        return $result;
    }
    // normal print
    protected function print($str){
        ?>
        <pre>
            <?php print_r($str); ?>
        </pre>
        <?php
    }
    // update a array
    protected function update_ass_array($old,$new){
    // update the value of associative array if they is a new value
        foreach ($new as $key => $val) {
            if (isset($old[$key])) {
                $old[$key] = $new[$key];
            }
        }
        return $old;
    }
}

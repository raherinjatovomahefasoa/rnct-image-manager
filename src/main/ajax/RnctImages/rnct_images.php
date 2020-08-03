<?php
namespace RnctAdmin\Main;

class RnctImages extends Database {
    private $command;
    private $commands = [
        'get_data',
        'upload_image',
        'update_image',
        'delete_image'
    ];
    function __construct($param){
        $this->conn = $param['conn'];
        $this->tables = $param['tables'];
        $this->folders = $param['folders'];
        $this->Imagine = 'Imagine\Gd\Imagine';
        $this->Box = 'Imagine\Image\Box';
        $this->execute_command();
    }
    // execute the command
    private function execute_command(){
        $this->get_command();
        // get data
        if ($this->command == $this->commands[0]) {
            $table = $this->tables['images'];
            $sql = "SELECT * FROM $table;";
            $json = [];
            $result = $this->query($sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $rowData = json_decode($row['data'],true);
                array_push($json,$rowData);
            }
            $sql = [
                "images" => $json,
                "folder" => $this->folders['images']
            ];
            echo json_encode($sql);
        } elseif ($this->command == $this->commands[1]) {
            // get imagine
            require_once realpath("composer_packages/Imagine/vendor/autoload.php");
            // dir folder
            $folder = realpath($this->folders['images']);
            // set image id
            $id = uniqid('image_');
            // get w/h ratio
            $image = $_FILES['file']["tmp_name"];
            $size = getimagesize($image);
            $ratio = round($size[0] / $size[1],2);
            // add new data to json array
            $json = $_POST['json'];
            $json = json_decode($json,true);
            $json["ratio"] = $ratio;
            $json["time"] = (int) date("U");
            $json["size"] = $_FILES['file']["size"];
            $json["width"] = $size[0];
            $json["height"] = $size[1];
            $json["id"] = $id;
            $json["date"] = date("M d, Y");
            $data = json_encode($json);
            $item = $json;
            // image resize
            $imagine = new $this->Imagine();
            $image = $imagine->open($image);
            $height = round($size[1] / $size[0] * 150);
            $width = round($size[0] / $size[1] * 150);
            $name = explode(".", $json['name']);
            if ($ratio > 1) {
                $image->resize(new $this->Box(300,$height * 2))
                    ->save($folder."/$name[0]-300x300.$name[1]");
                $image->resize(new $this->Box(150,$height))
                    ->save($folder."/$name[0]-150x150.$name[1]");
            } else {
                $image->resize(new $this->Box($width * 2, 300))
                ->save($folder."/$name[0]-300x300.$name[1]");
                $image->resize(new $this->Box($width, 150))
                    ->save($folder."/$name[0]-150x150.$name[1]");
            }
            move_uploaded_file($_FILES['file']["tmp_name"], "$folder/$json[name]");
            // Add to database
            $table = $this->tables["images"];
            $sql = "INSERT INTO $table (image_id,data) VALUES ('$id','$data');";
            $this->query($sql);
            // json
            echo json_encode($item);
        // update
        } elseif ($this->command == $this->commands[2]){
            $json = json_decode($_POST['json'],true);
            $item = [];
            $table = $this->tables['images'];
            $folder = realpath($this->folders['images']);
            $sql = "SELECT * FROM $table WHERE image_id = '$json[id]'";
            $result = $this->query($sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $item = json_decode($row['data'],true);
            }
            $image_1 = ("$folder/$item[name]");
            $name = explode(".", $item['name']);
            $image_2 = ("$folder/$name[0]-150x150.$name[1]");
            $image_3 = ("$folder/$name[0]-300x300.$name[1]");
            $item = $this->update_ass_array($item,$json);
            $image_1_new = "$folder/$item[name]";
            $name = explode(".", $item['name']);
            $image_2_new = "$folder/$name[0]-150x150.$name[1]";
            $image_3_new = "$folder/$name[0]-300x300.$name[1]";

            if ($image_1 != $image_1_new) {
                rename($image_1,$image_1_new);
                rename($image_2,$image_2_new);
                rename($image_3,$image_3_new);
            }
            $newdata = json_encode($item);
            $sql = "UPDATE $table SET data = '$newdata' WHERE image_id = '$json[id]';";
            $this->query($sql);
        } elseif ($this->command == $this->commands[3]){
            $folder = realpath($this->folders['images']);
            $table = $this->tables['images'];
            $json = json_decode($_POST['json'],true);
            $image_1 = "$folder/$json[name]";
            $name = explode(".", $json['name']);
            $image_2 = "$folder/$name[0]-150x150.$name[1]";
            $image_3 = "$folder/$name[0]-300x300.$name[1]";
            $sql = "DELETE FROM $table WHERE image_id = '$json[id]'";
            $this->query($sql);
            if (file_exists($image_1)) {
                unlink($image_1);
            }
            if (file_exists($image_2)) {
                unlink($image_2);
            }
            if (file_exists($image_3)) {
                unlink($image_3);
            }
        }
    }
    // get the command to execute
    private function get_command(){
        if (!isset($_POST['command'])) {
            die("No command received, no result");
        }
        $this->command = $_POST['command'];
    }
}

<?php
namespace RnctAdmin\Main;

class Ajax {
    private $module_name;
    private $modules = [
        "rnct_sidebar",
        "rnct_pages",
        "rnct_images"
    ];
    function __construct($param){
        $this->param = $param;
    }
    private function check_module(){
        if (!isset($_POST['module_name'])) {
            echo "Invalid ajax request, no module name to load class";
            return false;
        }
        if ($_POST['module_name'] == "") {
            echo "Invalid ajax request, no module name to load class";
            return false;
        }
        $this->module_name = $_POST['module_name'];
        return true;
    }
    public function process_data(){
        if (!$this->check_module()) {
            return;
        }
        // sidebar module
        if ($this->module_name == $this->modules[0]) {
            $sidebar = new Sidebar($this->param);
        } elseif ($this->module_name == $this->modules[1]) {
            $pages = new RnctPages($this->param);
        } elseif ($this->module_name == $this->modules[2]) {
            $images = new RnctImages($this->param);
        }
    }
}

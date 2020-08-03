function RnctImages(target=null,_settings={}){
    let error;
    try {
        new Element();
    } catch (e) {
        console.error("rnct js module Not Found, link it from rnct-dit/js");
        error++;
    }
    if (error) {
        return false;
    }
    // set this to the var self
    let self = this;
    self.name = "Image Manager";
    self.version = "1.0.0";
    self.items = [];
    self.modal = [];
    self.module_name = "rnct_images";
    self.progressBar = [];
    // settings
    let value = {
        phpAjax: "ajax.php",
        developerMode: false,
        trigger: null,
        asPanel: false,
        column_1: 8,
        triggerAction: afterShow,
        action: function(){}
    };
    // get user settings
    value = self._settings = updateAssArray(value,_settings);
    // get mysqli data
    getsql({
        open: self._settings.phpAjax,
        module_name: self.module_name,
        action: parseData
    })
    // parse data
    function parseData(str){
        if (value.developerMode) {
            try {
                console.log(JSON.parse(str));
            } catch {
                console.log(str);
            }
        }
        self.sqlImages = JSON.parse(str).images;
        self.folder = JSON.parse(str).folder;
        // show tab number 1
        self.Tabs[0].showTab(0);
        value.triggerAction();
    }
    // after the box is showed
    function afterShow(){
        if (window.innerWidth <= 1024){
            $(self.gallery).removeClass("row-cols-4");
            $(self.gallery).addClass("row-cols-3");
        } else {
            $(self.gallery).removeClass("row-cols-3");
            $(self.gallery).addClass("row-cols-4");
        }
        $(self.gallery).html("");
        printImages();
        window.onresize = function(){
            if (window.innerWidth <= 1024){
                $(self.gallery).removeClass("row-cols-4");
                $(self.gallery).addClass("row-cols-3");
            } else {
                $(self.gallery).removeClass("row-cols-3");
                $(self.gallery).addClass("row-cols-4");
            }
            $(self.gallery).html("");
            printImages();
        }
    }
    // init static HTML container
    init();

    // print images from db
    function printImages(){
        var db = self.sqlImages;
        self.items = [];
        for (let i = 0; i < db.length; i++) {
            self.items.push(new ImageItem(self.gallery,{
                index: i,
                action: afterSelect
            }));
        }
        function afterSelect(item){
            var db = self.sqlImages[item.index];
            self.Tabs[0].showTab(1);
            // show img details
            var image = "<img class='img-fluid img-thumbnail' src='"+item._settings.src_small()+"'>";
            self.thumbnail.html(image);
            var details = '<small><strong>'+db.name+'</strong></small><br><small>'+db.width + ' x ' + db.height+'</small><br><small>'+sizeUnit(db.size)+'</small><br><small>'+db.date+'</small>';
            self.details.html(details);
            // pass data to inputs
            var inputs = self.inputs;
            var name = db.name.split(".")[0];
            inputs[6].setValue(name);
            inputs[7].setValue(db.alt);
            inputs[8].setValue(db.title);
            inputs[9].setValue(db.caption);
            inputs[10].setValue(db.description);
            // pass index to self
            self.index = item.index;
        }
    }
    // trigger once and at the creation of the this object
    function init(){
        // parse static html
        staticHtml();
    }
    // parsing static html
    function staticHtml(){
        // set panel setting
        if (value.asPanel) {
            $(target).hide();
        } else {
            $(target).css({
                height: "550px"
            });
        }
        // html object array
        self.HTMLElement = [];
        self.Tabs = [];
        self.inputs = [];
        self.buttons = [];
        let htmlElement = self.HTMLElement;
        let tabObject = self.Tabs;
        let inputs = self.inputs;
        let buttons = self.buttons;
        let progressBar = self.progressBar;
        // set the display
        let classString;
        if (value.asPanel) {
            classString = "editbox";
        } else {
            classString = "editbox-fluid";
        }
        // create and parse html tree
        let container = new Element(target,{
            classAttr: classString
        })
        htmlElement.push(container);
        let content = new Element(container.element,{
            classAttr:"editbox-content"
        });
        htmlElement.push(content);
        let modalItem = new ModalBox();
        self.modal.push(modalItem);
        let header = new Element(content.element,{classAttr:"editbox-header modal-header"});
        header.html('<h5 class="text-info">'+self.name+'</h5>');
        htmlElement.push(header);
        let close = new Element(header.element,{tag:"button",classAttr:"close"});
        close.html("×");
        let body = new Element(content.element,{classAttr:"editbox-body row"});
        htmlElement.push(body);
        // column one
        let column_1 = new Element(body.element,{classAttr:"col-md-"+value.column_1+" editbox-primary"});
        htmlElement.push(column_1);
        // column two
        let column_2 = new Element(body.element,{classAttr:"col-md-"+(12-value.column_1)+" editbox-secondary bg-light"});
        htmlElement.push(column_2);
        // header of column 1
        let formBox = new Element(column_1.element,{classAttr:"editbox-form form-row"});
        htmlElement.push(formBox);
        // body of column 1
        let galleryBox = new Element(column_1.element,{classAttr:"editbox-gallery"});
        htmlElement.push(galleryBox);
        let imageFlex = new Element(galleryBox.element,{classAttr:"row row-cols-4 mx-0 px-2"});
        htmlElement.push(imageFlex);
        self.gallery = imageFlex.element;
        // tab
        let tab = new Tab(column_2.element,{
            tabs: ["Create", "Library"]
        });
        tabObject.push(tab);
        // script for dynamism
        $(close.element).click(function(){
            if (value.asPanel) {
                $(target).hide();
            }
        });
        $(value.trigger).click(function(){
            if (value.asPanel) {
                $(target).show();
                value.triggerAction();
            }
        });
        // pass dymanic content container
        let formWrap = formBox.element;
        let listWrap = galleryBox.element;
        let tab_1Wrap = document.getElementById(tab.tabs[0]);
        let tab_2Wrap = document.getElementById(tab.tabs[1]);
        // hide tab two content
        self.Tabs[0].hideTab(1);
        // pass the list container to main value
        value.pageList = listWrap;
        // empty tabs
        tab_1Wrap.innerHTML = tab_2Wrap.innerHTML = "";
        // tab 1 heading
        var h3 = new Element(tab_1Wrap,{
            tag: "h3",
            classAttr: "text-muted mb-3"
        })
        h3.html("Upload an image");
        htmlElement.push(h3);
        // parse inputs
        inputs.push(new InputFile(tab_1Wrap, {
            help: "Choose the Image you want to upload"
        }));
        inputs.push(new InputText(tab_1Wrap, {
            label: "Name",
            help: "Enter the name of the image"
        }));
        inputs.push(new InputText(tab_1Wrap, {
            label: "Alt",
            help: "Leave this empty if the image is purely decorative"
        }));
        inputs.push(new InputText(tab_1Wrap, {
            label: "Title",
            help: "Enter the title of the image"
        }));
        inputs.push(new InputText(tab_1Wrap, {
            label: "Caption",
            tag: "textarea",
            help: "Enter the image caption"
        }));
        inputs.push(new InputText(tab_1Wrap, {
            label: "Description",
            tag: "textarea",
            help: "Enter the Description of the image"
        }));
        progressBar.push(new ProgressBar(tab_1Wrap,{
            animated: true,
            striped: true,
            add_class: "mb-3"
        }))
        progressBar[0].hide();
        buttons.push(new InputSubmit(tab_1Wrap, {
            text: "Upload",
            add_class: "mr-2"
        }));
        buttons.push(new InputSubmit(tab_1Wrap, {
            bg: "secondary",
            text: "Cancel"
        }));
        buttons[1].hide();
        // tab 2
        // image details
        var row = new Element(tab_2Wrap, {
            classAttr: "fade-in row mb-3"
        });
        htmlElement.push(row);
        self.thumbnail = new Element(row.element, {
            classAttr: "col px-1"
        })
        self.details = new Element(row.element, {
            classAttr: "col text-muted px-1"
        })
        // parse inputs
        var selectButton = new InputSubmit(tab_2Wrap,{
            text: "Select",
            add_class: "mb-3"
        });
        // show only in palen mode
        if (!value.asPanel) {
            selectButton.hide();
        }
        inputs.push(new InputText(tab_2Wrap, {
            label: "Name",
            help: "Enter the name of the image"
        }));
        inputs.push(new InputText(tab_2Wrap, {
            label: "Alt",
            help: "Leave this empty if the image is purely decorative"
        }));
        inputs.push(new InputText(tab_2Wrap, {
            label: "Title",
            help: "Enter the title of the image"
        }));
        inputs.push(new InputText(tab_2Wrap, {
            label: "Caption",
            tag: "textarea",
            help: "Enter the image caption"
        }));
        inputs.push(new InputText(tab_2Wrap, {
            label: "Description",
            tag: "textarea",
            help: "Enter the Description of the image"
        }));
        buttons.push(new InputSubmit(tab_2Wrap, {
            text: "Update",
            add_class: "mr-2",
            bg: 'success'
        }));
        buttons.push(new InputSubmit(tab_2Wrap, {
            bg: "danger",
            text: "Delete"
        }));
        buttons.push(selectButton);
        // call the processing function
        requestScript();
    }
    // inputs event handler
    function requestEventHandler(){
        $(self.inputs[0].element).change(function(){
            if (self.inputs[1].val() == "") {
                self.inputs[1].setValue(self.inputs[0].filename);
                self.inputs[3].setValue(self.inputs[0].filename);
            }
        })
    }
    function inputsValidation(i){
        var options = ['upload','update'];
        var option = options[i];
        if (option == options[0]) {
            var inputsObj = self.inputs;
            var inputs = [
                inputsObj[0].element,
                inputsObj[1].element,
                inputsObj[3].element
            ]
            if (isEmpty(inputs)) {
                return false;
            }
            // check existance
            var file = inputsObj[0].val();
            var exists = false;
            for (var i = 0; i < self.sqlImages.length; i++) {
                if (self.sqlImages[i].original_name == file.name) {
                    inputFeedback(inputsObj[0].element,{
                        file: "This image has already been uploaded!",
                        type: "file"
                    });
                    exists = true;
                    break;
                }
            }
            var extention = "." + file.name.split(".")[1];
            var userImageName = inputsObj[1].val() + extention;
            for (var i = 0; i < self.sqlImages.length; i++) {
                if (self.sqlImages[i].name == userImageName) {
                    inputFeedback(inputsObj[1].element,{
                        text: "This name already exists! Please change it."
                    });
                    exists = true;
                    break;
                }
            }
            if (exists) {
                return false;
            }
            return true;
            // update
        } else if (option == options[1]) {
            var inputsObj = self.inputs;
            var inputs = [
                inputsObj[6].element,
                inputsObj[8].element
            ]
            if (isEmpty(inputs)) {
                return false;
            }
            // validate name
            var selected = self.sqlImages[self.index];
            var extention = "." + selected.name.split(".")[1];
            var userImageName = inputsObj[6].val() + extention;
            var exists = false;
            for (var i = 0; i < self.sqlImages.length; i++) {
                if (self.sqlImages[i].name == userImageName && i != self.index) {
                    inputFeedback(inputsObj[6].element,{
                        text: "This name already exists! Please change it."
                    });
                    exists = true;
                    break;
                }
            }
            if (exists) {
                return false;
            }
            // check if any change
            var userInputs = {
                name: inputsObj[6].val() + extention,
                alt: inputsObj[7].val(),
                title: inputsObj[8].val(),
                caption: inputsObj[9].val(),
                description: inputsObj[10].val()
            }
            var copyOfSelected = copyJson(selected);
            userInputs = updateAssArray(copyOfSelected,userInputs);
            if (isSameJson(selected,userInputs)) {
                var modal = self.modal[0];
                modal.settings({
                    title: "Warning!",
                    text: "Already saved! Change something before updating",
                    button_1_hide: true,
                    button_2_text: 'primary',
                    button_2_text: 'Okay'
                })
                modal.show();
                return false;
            }
            return true;
        }
    }
    // script for dynamism
    function requestScript(){
        // events
        requestEventHandler();
        // actions
        // on select
        $(self.buttons[4].element).click(function(){
            var data = {
                folder: self.folder,
                image: self.sqlImages[self.index]
            }
            value.action(data);
            $(target).hide();
        })
        // delete
        $(self.buttons[3].element).click(function(){
            var modal = self.modal[0];
            modal.settings({
                title: "Warning",
                text: "Are you sure you want to delete this image? This action is irreversible!",
                button_1_text: "Yes",
                button_1_hide: false,
                button_2_text: "Cancel",
                button_2_type: "primary",
                result: afterConfirmation
            })
            modal.show();
            function afterDelete(json){
                if (value.developerMode) {
                    try {
                        console.log(JSON.parse(json));
                    } catch {
                        console.log(json);
                    }
                }
                getsql({
                    open: self._settings.phpAjax,
                    module_name: self.module_name,
                    action: parseData,
                    spinnerInput: self.buttons[3]
                })
            }
            function afterConfirmation(result){
                if (result === true) {
                    var item = self.sqlImages[self.index];
                    var data = {
                        id: item.id,
                        name: item.name
                    }
                    self.buttons[3].showSpinner();
                    ajaxRequest(data,{
                        action: afterDelete,
                        module_name: self.module_name,
                        open: self._settings.phpAjax,
                        command: "delete_image"
                    })
                }
            }
        })
        // update
        $(self.buttons[2].element).click(function(){
            //validatio
            if (!inputsValidation(1)) {
                return;
            }
            var inputs = self.inputs;
            var item = self.sqlImages[self.index];
            var name = inputs[6].val() + "." + item.name.split(".")[1];
            var data = {
                name: name,
                alt: inputs[7].val(),
                title: inputs[8].val(),
                caption: inputs[9].val(),
                description: inputs[10].val(),
                id: item.id
            }
            self.buttons[2].showSpinner();
            ajaxRequest(data, {
                open: self._settings.phpAjax,
                action: afterUpdate,
                module_name: self.module_name,
                command: 'update_image'
            });
            function afterUpdate(json){
                if (value.developerMode) {
                    try {
                        console.log(JSON.parse(json));
                    } catch {
                        console.log(json);
                    }
                }
                getsql({
                    open: self._settings.phpAjax,
                    module_name: self.module_name,
                    action: parseData,
                    spinnerInput: self.buttons[2]
                })
            }
        })
        // upload
        $(self.buttons[0].element).click(function(){
            //validatio
            if (!inputsValidation(0)) {
                return;
            }
            var inputs = self.inputs;
            // get the image name
            function imageName(){
                var extentsion = inputs[1].val() + "." + self.inputs[0].val().name.split(".").reverse()[0];
                return extentsion;
            }
            var data = {
                name: imageName(),
                original_name: self.inputs[0].val().name,
                alt: inputs[2].val(),
                title: inputs[3].val(),
                caption: inputs[4].val(),
                description: inputs[5].val()
            };
            self.buttons[0].showSpinner();
            self.buttons[1].show();
            ajaxRequest(data, {
                file: self.inputs[0].val(),
                open: self._settings.phpAjax,
                loading: loading,
                action: afterUpload,
                cancel_btn: self.buttons[1].element,
                module_name: self.module_name,
                command: 'upload_image'
            });
            // progress bar
            function loading(x){
                self.progressBar[0].process(x);
            }
            // called after upload
            function afterUpload(json){
                if (value.developerMode) {
                    try {
                        console.log(JSON.parse(json));
                    } catch {
                        console.log(json);
                    }
                }
                self.progressBar[0].hide();
                self.buttons[1].hide();
                // reset inputs
                var inputs = self.inputs;
                var inputs = [
                    inputs[0].element,
                    inputs[1].element,
                    inputs[2].element,
                    inputs[3].element,
                    inputs[4].element,
                    inputs[5].element
                ];
                getsql({
                    open: self._settings.phpAjax,
                    module_name: self.module_name,
                    action: parseData,
                    spinnerInput: self.buttons[0]
                })
                // reset inputs
                resetAll(inputs);
            }
        })
    }
    // image object
    function ImageItem(target=null,param){
        let db = self.sqlImages;
        let self_me = this;
        let folder = self.folder;
        let value = {
            container_id: randomId(),
            input_id: randomId('input'),
            image_id: randomId('image'),
            frame_id: randomId(),
            index: 0,
            src: function(){
                return folder +"/"+ db[this.index].name;
            },
            src_small: function(){
                var small = db[this.index].name.split(".");
                return folder + "/" + small[0] + "-150x150" + "." + small[1];
            },
            src_medium: function(){
                var small = db[this.index].name.split(".");
                return folder + "/" + small[0] + "-300x300" + "." + small[1];
            },
            ratio: function(){
                return db[this.index].ratio * 1;
            },
            action: function(){}
        }
        value = updateAssArray(value,param);
        this._settings = value;
        this.index = value.index;
        let checkbox = "<input id='"+value.input_id+"' type='checkbox' class='editbox-checkbox ri-checkbox'>";
        let image = "<img src='"+value.src_small()+"' id='"+value.image_id+"' class=''>";
        let div = "<div id='"+value.frame_id+"' class='ri-img-thumbnail fade-in d-flex justify-content-center align-items-center overflow-hidden'>"+checkbox+image+"</div>";
        let container = new Element(target,{
            classAttr: "col",
            id: value.container_id
        })
        container.html(div);
        imageRatio();
        // checkbox
        var check_input = document.getElementById(value.input_id);
        check_input.addEventListener('input', function(){
            if (check_input.checked){
                for (let i = 0; i < self.items.length; i++) {
                    if (self.items[i] != self_me) {
                        self.items[i].unselect();
                    }
                }
                $(check_input).removeClass("editbox-checkbox");
                $(check_input).addClass("editbox-checkbox-show");
                $(container.element).addClass("ri-scaleDown");
                value.action(self_me);
            } else {
                self.Tabs[0].showTab(0);
                self.Tabs[0].hideTab(1);
                $(check_input).removeClass("editbox-checkbox-show");
                $(check_input).addClass("editbox-checkbox");
                $(container.element).removeClass("ri-scaleDown");
            }
        })
        self_me.unselect = function(){
            $(check_input).removeClass("editbox-checkbox-show");
            $(check_input).addClass("editbox-checkbox");
            $(container.element).removeClass("ri-scaleDown");
            check_input.checked = false;
        }
        function imageRatio(){
            $(container.element).css({
                padding: "3px"
            })
            var width = $("#"+value.container_id).innerWidth();
            width = Math.round(width);
            var ratio = 0.65;
            $("#"+value.container_id).css({
                height: (width*ratio)+"px"
            });
            ratio = $("#"+value.frame_id).width() / $("#"+value.frame_id).height();
            ratio.toFixed(3);

            // set css
            if (value.ratio() >= ratio) {
                $("#"+value.image_id).css({
                    height: "100%",
                    width: "auto"
                })
            } else {
                $("#"+value.image_id).css({
                    width: "100%",
                    height: "auto"
                })
            }
        }
    }
}

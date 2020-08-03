function sizeUnit(x){
    if (x < 1000000) {
        return (x / 1000).toFixed(1) + " Kb";
    } else {
        return (x / 1000000).toFixed(1) + " Mb";
    }
}
function ProgressBar(target, _settings={}){
    let value = {
        add_class: "",
        id: randomId("progress"),
        bg: "primary",
        striped: false,
        animated: false,
        barId: randomId("progress")
    };
    value = updateAssArray(value,_settings);
    var striped = animated = "";
    if (value.striped) {
        striped = 'progress-bar-striped ';
    }
    if (value.animated){
        animated = "progress-bar-animated ";
    }
    var bg = "bg-" + value.bg;
    var classAttr = ('progress-bar '+ bg + " " + animated + striped).trim();
    var element = '<div class="'+ classAttr +'"  role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="'+value.barId +'"></div>';
    var add_class = ('progress ' + value.add_class).trim();
    var container = new Element(target, {
        classAttr: add_class,
        id: value.id
    })
    container.html(element);
    this.element = document.getElementById(value.id);
    this._settings = value;
    this.barId = value.barId;
    this.hide = function(){
        $(container.element).hide();
        $("#"+value.barId).css({
            width: 0 + "%"
        });
        $("#"+value.barId).html("");
    }
    this.show = function(){
        $("#"+value.barId).css({
            width: 0 + "%"
        });
        $(container.element).show();
    }
    this.process = function(x){
        if (x > 100) {
            // console.error("progress bar error " + x + " > 100");
            return;
        }
        $(container.element).show();
        var x = Math.round(x);
        $("#"+value.barId).css({
            width: x + "%"
        });
        if (x >= 15) {
            $("#"+value.barId).html(x+"%");
        }
        if (x >= 100){
            var classAttr1 = ('progress-bar bg-success ' + animated + striped);
            $("#"+value.barId).attr('class', classAttr1);

        }
    }
}
function ImageThumbnail(target=null,_settings={}){
    let value = {
        classAttr: "img-thumbnail img-fluid",
        add_class: "",
        id: randomId("image"),
        src: "/"
    };
    value = updateAssArray(value,_settings);
    let container = new Element(target,{
        classAttr: value.add_class
    });
    let html = '<img class="'+value.classAttr+'" src="'+value.src+'" id="'+value.id+'">';
    container.html(html);
    this.element = document.getElementById(value.id);
    this._settings = value;
    this.container = container;
    this.hide = function(){
        $(container.element).hide();
    }
    this.show = function(){
        $(container.element).show();
    }
}
function Tab(target=null,_settings={}){
    var value = {
        tabs: ["tab one", "tab two"]
    }
    value = updateAssArray(value,_settings);
    var elements = [];
    var tabIds = [];
    // ul container
    var ul = new Element(target,{
        tag: "ul",
        classAttr: "nav nav-tabs"
    });
    elements.push(ul);
    this.tabWrap = ul.selector;
    for (var i = 0; i < value.tabs.length; i++) {
        var id = randomId("tab");
        tabIds.push(id);
        var active = "";
        if (!i) {
            active = "nav-link active";
        } else {
            active = "nav-link";
        }
        var child = '<li class="nav-item"><a href="#'+id+'" class="'+active+'" data-toggle="tab">'+value.tabs[i]+'</a></li>';
        $(ul.element).append(child);
    }
    var div = new Element(target,{
        tag: "div",
        classAttr: "tab-content editbox-tab"
    });
    elements.push(div);
    for (var i = 0; i < tabIds.length; i++) {
        var active = "";
        if (!i) {
            active = "tab-pane fade active show";
        } else {
            active = "tab-pane fade";
        }
        var tab = '<div id="'+tabIds[i]+'" class="'+active+'"><h5>Tab '+i+' content goes here</div>';
        $(div.element).append(tab);
    }
    this._settings = value;
    this.elements = elements;
    this.tabs = tabIds;
    this.container = $(target);
    this.hideTab = function(index){
        $("#"+tabIds[index]).addClass("d-none");
    }
    this.showTab = function(index){
        $("#"+tabIds[index]).removeClass("d-none");
        $(ul.selector + ' a[href="#'+tabIds[index]+'"]').tab('show');
    }
}
function InputSelect(target=null,_settings={}){
    var value = {
        label: "test",
        id: randomId('input'),
        help: "",
        placeholder: "Choose...",
        size: "default",
        input_only: false,
        add_class: "",
        options: [],
        append: "append"
    }
    value = updateAssArray(value,_settings);
    var size = {
        default: ["",""],
        small: ["form-control-sm","col-form-label-sm"],
        large: ["form-control-lg","col-form-label-lg"]
    },
    html,addClass,label,tagElement,formControl;
    addClass = ("form-group "+value.add_class).trim();
    label = "";
    if (!value.input_only) {
        label = '<label class="'+size[value.size][1]+'" for="'+value.id+'">'+value.label+'</label>';
    }
    formControl = ("form-control " + size[value.size][0]).trim();
    var tagElement = '<select class="'+formControl+'" id="'+value.id+'"><option value="0">'+value.placeholder+'</option>';
    for (var i = 0; i < value.options.length; i++) {
        tagElement += '<option value="'+(1+i)+'">'+value.options[i]+'</option>';
    }
    tagElement += '</select><div class=""></div><small class="form-text text-muted">'+value.help+'</small>';
    html = label+tagElement;
    var element = document.createElement('div');
    $(element).html(html);
    $(element).attr('class', addClass);
    if (target != null) {
        if (value.append == "append") {
            $(target).append(element);
            this.parent = $(target);
        } else if (value.append == "prepend") {
            $(target).prepend(element);
            this.parent = $(target);
        } else if (value.append == "after") {
            $(target).after(element);
            this.before = $(target);
        } else if (value.append == "before") {
            $(target).before(element);
            this.after = $(target);
        }
    }
    this._settings = value;
    this.container = element;
    this.element = document.getElementById(value.id);
    this.options = value.options;
    this.hide = function(){
        $(element).hide();
    }
    this.show = function(){
        $(element).show();
    }
    this.val = function(){
        return $("#"+value.id).val() * 1;
    }
    var self = this;
    this.reset = function(){
        var first = self.element.children[0];
        first.selected = true;
    }
    this.setSelected = function(i){
        self.element.children[i].selected = true;
    }
    this.selected = function(text){
        for (var i = 0; i < self.element.children.length; i++) {
            if (self.element.children[i].innerHTML == text) {
                var select = self.element.children[i];
                select.selected = true;
                break;
            }
        }
    }
    this.setOptions = function(opts){
        value.option = opts;
        self.option = value.option;
        var tagElement = '<option value="0">'+value.placeholder+'</option>';
        for (var i = 0; i < opts.length; i++) {
            tagElement += '<option value="'+(1+i)+'">'+opts[i]+'</option>';
        }
        $(self.element).html(tagElement);
        var last = self.element.children[opts.length];
        last.selected = true;
    }
}
function InputSubmit(target=null,_settings={}){
    var value = {
        striped: 0,
        id: randomId('button'),
        text: "Submit",
        loading: 0,
        color: "",
        bg: "primary",
        add_class: "",
        append: 'append',
        spinner_id: randomId('spinner')
    }
    value = updateAssArray(value,_settings);
    var display = ["d-none", ""],
    classAttr = "mr-1 spinner-border spinner-border-sm" + " " + display[value.loading] + " " + value.color,
    addClass = "btn btn-" + value.bg + " " + value.add_class;
    classAttr = classAttr.trim();
    addClass = addClass.trim();
    var span;
    span = '<span id="'+value.spinner_id+'" class="'+classAttr+'" role="status" aria-hidden="true"></span>' + value.text;
    var element = document.createElement('button');
    $(element).html(span);
    element.type = "button";
    element.id = value.id;
    $(element).attr('class', addClass);
    if (target != null) {
        if (value.append == "append") {
            $(target).append(element);
            this.parent = $(target);
        } else if (value.append == "prepend") {
            $(target).prepend(element);
            this.parent = $(target);
        } else if (value.append == "after") {
            $(target).after(element);
            this.before = $(target);
        } else if (value.append == "before") {
            $(target).before(element);
            this.after = $(target);
        }
    }
    this._settings = value;
    this.element = document.getElementById(value.id);
    var self = this;
    this.showSpinner = function(x){
        $("#"+value.spinner_id).removeClass(display[0]);
        self.element.disabled = true;
    }
    this.hideSpinner = function(x){
        $("#"+value.spinner_id).addClass(display[0]);
        self.element.disabled = false;
    }
    this.hide = function(){
        $(element).hide();
    }
    this.show = function(){
        $(element).show();
    }
}
function InputFile(target=null,_settings={}){
    var value = {
        label: "Choose a file",
        id: randomId('input'),
        help: "",
        add_class: "",
        append: 'append'
    }
    value = updateAssArray(value,_settings);
    let html,addClass,label,tagElement,formControl,htmlEnd;
    addClass = ("custom-file mb-4 "+value.add_class).trim();
    label = "";
    if (!value.input_only) {
        label = '<label class="custom-file-label" for="'+value.id+'">'+value.label+'</label>';
    }
    formControl = "custom-file-input";
    tagElement = '<input type="file" class="'+formControl+'" id="'+value.id+'">';
    htmlEnd = '<div class=""></div><small class="form-text text-muted">'+value.help+'</small>';
    html = tagElement+label+htmlEnd;
    var element = document.createElement('div');
    $(element).html(html);
    $(element).attr('class', addClass);
    if (target != null) {
        if (value.append == "append") {
            $(target).append(element);
            this.parent = $(target);
        } else if (value.append == "prepend") {
            $(target).prepend(element);
            this.parent = $(target);
        } else if (value.append == "after") {
            $(target).after(element);
            this.before = $(target);
        } else if (value.append == "before") {
            $(target).before(element);
            this.after = $(target);
        }
    }
    this._settings = value;
    this.container = element;
    this.element = document.getElementById(value.id);
    // filename
    var self = this;
    $(this.element).change(function(){
        self.filename = fileName(self.element);
    })
    this.hide = function(){
        $(element).hide();
    }
    this.show = function(){
        $(element).show();
    }
    this.val = function(){
        return this.element.files[0];
    }
}
function InputCheckbox(target=null,_settings={}){
    var value = {
        label: "test",
        id: randomId('input'),
        help: "",
        add_class: "",
        append: 'append'
    }
    value = updateAssArray(value,_settings);
    let html,addClass,label,tagElement,formControl,htmlEnd;
    addClass = ("custom-control custom-checkbox "+value.add_class).trim();
    label = "";
    if (!value.input_only) {
        label = '<label class="custom-control-label" for="'+value.id+'">'+value.label+'</label>';
    }
    formControl = "custom-control-input";
    tagElement = '<input type="checkbox" class="'+formControl+'" id="'+value.id+'">';
    htmlEnd = '<div class=""></div><small class="form-text text-muted">'+value.help+'</small>';
    html = tagElement+label+htmlEnd;
    var element = document.createElement('div');
    $(element).html(html);
    $(element).attr('class', addClass);
    if (target != null) {
        if (value.append == "append") {
            $(target).append(element);
            this.parent = $(target);
        } else if (value.append == "prepend") {
            $(target).prepend(element);
            this.parent = $(target);
        } else if (value.append == "after") {
            $(target).after(element);
            this.before = $(target);
        } else if (value.append == "before") {
            $(target).before(element);
            this.after = $(target);
        }
    }
    this._settings = value;
    this.container = element;
    this.element = document.getElementById(value.id);
    this.hide = function(){
        $(element).hide();
    }
    this.show = function(){
        $(element).show();
    }
    this.val = function(){
        return this.element.checked;
    }
    var self = this;
    this.checked = function(value){
        this.element.checked = value;
    }
}
function InputText(target=null,_settings={}){
    var value = {
        label: "test",
        id: randomId('input'),
        help: "",
        placeholder: "Enter something",
        size: "default",
        input_only: false,
        add_class: "",
        tag: "input",
        type: "text",
        icon_picker: false,
        picker_id: randomId("icon_picker"),
        append: 'append'
    }
    value = updateAssArray(value,_settings);
    var size = {
        default: ["",""],
        small: ["form-control-sm","col-form-label-sm"],
        large: ["form-control-lg","col-form-label-lg"]
    },
    html,addClass,label,tagElement,formControl,htmlEnd;
    addClass = ("form-group "+value.add_class).trim();
    label = "";
    if (!value.input_only) {
        label = '<label class="'+size[value.size][1]+'" for="'+value.id+'">'+value.label+'</label>';
    }
    tagElement = "";
    formControl = ("form-control "+ size[value.size][0]).trim();
    if (value.icon_picker) {
        tagElement = '<div class="input-group"><input id="'+value.id+'" type="'+value.type+'" class="form-control" placeholder="'+value.placeholder+'" aria-label="'+value.placeholder+'" aria-describedby="basic-addon2"><div class="input-group-append"><button id="'+value.picker_id+'" class="btn btn-outline-secondary" data-iconset="fontawesome5" data-icon="fas fa-link" role="iconpicker"></button></div></div>';
    } else if (value.tag.trim() != 'textarea') {
        tagElement = '<input id="'+value.id+'" type="'+value.type+'" class="'+formControl+'" placeholder="'+value.placeholder+'">';
    } else {
        tagElement = '<textarea id="'+value.id+'" class="'+formControl+'" placeholder="'+value.placeholder+'" rows="8" cols="80"></textarea>';
    }
    htmlEnd = '<div class=""></div><small class="form-text text-muted">'+value.help+'</small>';
    html = label+tagElement+htmlEnd;
    var element = document.createElement('div');
    $(element).html(html);
    $(element).attr('class', addClass);
    if (target != null) {
        if (value.append == "append") {
            $(target).append(element);
            this.parent = $(target);
        } else if (value.append == "prepend") {
            $(target).prepend(element);
            this.parent = $(target);
        } else if (value.append == "after") {
            $(target).after(element);
            this.before = $(target);
        } else if (value.append == "before") {
            $(target).before(element);
            this.after = $(target);
        }
    }
    this._settings = value;
    this.container = element;
    this.element = document.getElementById(value.id);
    this.hide = function(){
        $(element).hide();
    }
    this.show = function(){
        $(element).show();
    }
    this.val = function(){
        return $("#"+value.id).val().trim();
    }
    var self = this;
    if (value.icon_picker) {
        $("#"+value.picker_id).iconpicker();
        setInterval(function () {
            self.icon = document.getElementById(value.picker_id).children[0].getAttribute("class");
        }, 10);
    }
    this.setValue = function(value){
        this.element.value = value;
    }
    this.setIcon = function(icon){
        document.getElementById(value.picker_id).children[0].setAttribute("class", icon);
    }
}
function Element(target=null,_settings={}){
    var value = {
        tag: "div",
        id: randomId(),
        append: 'append',
        classAttr: ""
    }
    value = updateAssArray(value,_settings);
    var element = document.createElement(value.tag);
    element.id = value.id;
    if (value.tag.trim().toLocaleLowerCase() == "button") {
        element.type = "button";
    }
    $(element).attr("class", value.classAttr);
    if (target != null) {
        if (value.append == "append") {
            $(target).append(element);
            this.parent = $(target);
        } else if (value.append == "prepend") {
            $(target).prepend(element);
            this.parent = $(target);
        } else if (value.append == "after") {
            $(target).after(element);
            this.before = $(target);
        } else if (value.append == "before") {
            $(target).before(element);
            this.after = $(target);
        }
    }
    this._settings = value;
    this._settings = value;
    this.container = element;
    this.selector = "#"+value.id;
    this.element = document.getElementById(value.id);
    this.log = function(){
        console.log(element);
    }
    this.html = function(text){
        $('#'+value.id).html(text);
    }
    this.hide = function(){
        $(element).hide();
    }
    this.show = function(){
        $(element).show();
    }
}
function updateAssArray(oldJson,newJson,exceptions=null){
    for (var index in newJson) {
        if (oldJson.hasOwnProperty(index)) {
            if (exceptions == null ) {
                oldJson[index] = newJson[index];
            } else {
                dontChange = false;
                for (var i = 0; i < exceptions.length; i++) {
                    if (index == exceptions[i]) {
                        dontChange = true;
                        break;
                    }
                }
                if (!dontChange) {
                    oldJson[index] = newJson[index];
                }
            }
        }
    }
    return oldJson;
}
function randomId(str="element"){
    return str + "_" + (Math.random() * 1000000000).toFixed();
}
function isEmpty(inputs){
    var types = ["file","text","password","checkbox"],
    tag = ["input","textarea","select"],
    numberOfEmpty = 0,
    firstEmptyInput,
    messageType = "";
    // check all inputs in the array
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i],
        nodeName = inputs[i].nodeName.toLocaleLowerCase();
        // input
        if (nodeName == tag[0]) {
            // input file
            type = inputs[i].type;
            if (type == types[0]) {
                if (input.files.length == 0) {
                    numberOfEmpty++;
                    firstEmptyInput = input;
                    messageType = type;
                    break;
                }
            // input text and password
            } else if (type == types[1] || type == types[2]) {
                if (input.value.trim() == "") {
                    numberOfEmpty++;
                    firstEmptyInput = input;
                    messageType = type;
                    break;
                }
            // input checkbox
            } else if (type == types[3]) {
                if (input.checked == false) {
                    numberOfEmpty++;
                    firstEmptyInput = input;
                    messageType = type;
                    break;
                }
            }
        // textarea
        } else if (nodeName == tag[1]) {
            if (input.value.trim() == "") {
                numberOfEmpty++;
                firstEmptyInput = input;
                messageType = nodeName;
                break;
            }
        // select
        } else if (nodeName == tag[2]) {
            if (input.value.trim() == 0) {
                numberOfEmpty++;
                firstEmptyInput = input;
                messageType = nodeName;
                break;
            }
        }
    }
    // return true or false
    if (numberOfEmpty == 0) {
        return false;
    } else {
        // highlight the error
        inputFeedback(firstEmptyInput,{
            type: messageType
        });
        return true;
    }
}
function inputFeedback(input,json={}){
    var data = {
        type: "text",
        file: "Choose a file, you can't leave this empty!",
        text: "Fill out this input field! You can't leave it empty!",
        password: "Fill out this input field! You can't leave it empty!",
        textarea: "Fill out this input field! You can't leave it empty!",
        select: "Choose on option! You have to choose one!",
        checkbox: "Check this! You have to check it!"
    };
    // replace with user parameters
    data = updateJson(data,json);
    // bootstrap css classes
    var classes = {
        valid: ["is-valid","valid-feedback"],
        invalid: ["is-invalid","invalid-feedback"]
    },
    // feedback message
    message = data[data.type],
    // feedback container
    mesContainer = input.parentElement.getElementsByTagName("div")[0];
    if (input.nextElementSibling.getAttribute("class") == "input-group-append") {
        mesContainer = input.parentElement.parentElement.getElementsByTagName("div")[2];
        mesContainer.setAttribute("class", "input-group");
    }
    // show feedback
    $(input).addClass(classes.invalid[0]);
    $(mesContainer).addClass(classes.invalid[1]);
    $(mesContainer).html(message);
    input.focus();
    // remove feedback after change or input
    var events = {
        file: "input",
        text: "input",
        password: "input",
        textarea: "input",
        select: "change",
        checkbox: "input"
    }
    input.addEventListener(events[data.type], function(){
        $(input).removeClass(classes.invalid[0]);
        $(mesContainer).removeClass(classes.invalid[1]);
        $(mesContainer).html("");
    })
}
function updateJson(oldJson,newJson){
    for (var variable in newJson) {
        if (oldJson.hasOwnProperty(variable)) {
            oldJson[variable] = newJson[variable];
        }
    }
    return oldJson;
}
function fileName(input){
    var types = ["file","text","password","checkbox"],
    tag = ["input","textarea","select"],
    filename,
    nodeName = input.nodeName.toLocaleLowerCase();
    if (nodeName == tag[0] && input.type == types[0]) {
        var label = input.nextElementSibling,
        defaultText = "Choose a file",
        length = input.files.length;
        // return default text if no file chosen
        if (length == 0) {
            filename = defaultText;
            $(label).text(filename);
            return;
        // return filename if one file select
        } else if (length == 1) {
            // limit name to 20 characters length
            if (input.files[0].name.length > 20) {
                filename = (input.files[0].name).substr(0,20) + "...";
            } else {
                filename = input.files[0].name;
            }
        // return files number if more than one file selected
        } else {
            filename = length + " files";
        }
        // change the label innerHTML to filename
        $(label).text(filename);
    }
    // filename without extention
    return (input.files[0].name).split(".")[0];
}
function resetAll(inputs){
    for (var i = 0; i < inputs.length; i++) {
        tagName = inputs[i].nodeName.toLowerCase();
        if (tagName == 'input') {
            type = inputs[i].getAttribute("type");
            inputs[i].value = null;
            if (type == "file") {
                fileName(inputs[i]);
            }
            if (type == "checkbox") {
                inputs[i].checked = false;
            }
        } else if (tagName == 'select') {
            inputs[i].value = 0;
        } else {
            inputs[i].value = null;
        }
    }
}
function isLink(input){
    var regexp = /^([a-z-_]+)*$/;
    var bool = regexp.test(input.value.trim());
    if (bool) {
        return true;
    } else {
        inputFeedback(input,{
            text: "Do not add punctuations or numbers and use lowercase letters!"
        })
        return false;
    }
}

function isSameJson(newJson, oldJson){
    let result = true;
    for (var variable in newJson) {
        if (newJson.hasOwnProperty(variable)) {
            if (newJson[variable] != oldJson[variable]) {
                result = false;
                // console.log([newJson[variable],oldJson[variable]]);
            }
        }
    }
    return result;
}
function copyJson(object){
    var newJson = {};
    for (var variable in object) {
        if (object.hasOwnProperty(variable)) {
            newJson[variable] = object[variable];
        }
    }
    return newJson;
}
function isKeywords(input){
    // words separated with comma and space
    var regexp = /^([\w\s]+)(,\s[\w\s]+)*$/;
    var bool = regexp.test(input.value);
    if (bool) {
        return true;
    } else {
        inputFeedback(input, {
            text: "Use more than one keyword and separate kewords with comma and space, and don't add a comma at the end."
        });
        return false;
    }
}
function isUrl(input){
    var regexp = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})*$/;
    var bool = regexp.test(input.value.trim());
    if (bool) {
        return true;
    } else {
        inputFeedback(input,{
            text: "This is not a valid URL!"
        })
        return false;
    }
}
function getsql(param){
    var dataDefault = {
        open: "",
        module_name: "",
        action: function(){},
        spinnerInput: "",
        command: "get_data"
    };
    dataDefault = updateAssArray(dataDefault,param);
    var form = new FormData(),
    // http request
    xhttp = new XMLHttpRequest();
    // form setting
    form.append("module_name", dataDefault.module_name);
    form.append("command", dataDefault.command);
    // xhttp setting
    xhttp.open("post", dataDefault.open);
    xhttp.send(form);
    // show spinner
    xhttp.onreadystatechange = function(){
        // response
        if (xhttp.readyState == 4) {
            dataDefault.action(xhttp.responseText);
            if (dataDefault.spinnerInput != "") {
                dataDefault.spinnerInput.hideSpinner();
            }
        }
    }
}
function ajaxRequest(data="",param={}){
    // default parameters
    var dataDefault = {
        open: "",
        file: "",
        module_name: "",
        action: function(){},
        spinnerInput: "",
        command: "",
        cancel_btn: "",
        loading: function(){}
    };
    dataDefault = updateAssArray(dataDefault,param);
    // form to send
    var form = new FormData(),
    // http request
    xhttp = new XMLHttpRequest();
    // cancelled var
    let cancelled = false;
    // request upload progress
    xhttp.upload.addEventListener('progress',function(e){
        var loaded = e.loaded;
        var total = e.total;
        var percentage = (loaded / total) * 100;
        dataDefault.loading(percentage);
    })
    // cancel
    if (dataDefault.cancel_btn != "") {
        $(dataDefault.cancel_btn).click(function(){
            xhttp.abort();
        })
    }
    // form setting
    form.append("module_name", dataDefault.module_name);
    form.append("command", dataDefault.command);
    form.append("json", JSON.stringify(data));
    if (dataDefault.file != "") {
        form.append("file", dataDefault.file);
    }
    // xhttp setting
    xhttp.open("post", dataDefault.open);
    xhttp.send(form);
    // show spinner
    xhttp.onreadystatechange = function(){
        // response
        if (xhttp.readyState == 4) {
            dataDefault.action(xhttp.responseText);
        }
    }
}
function ModalBox(){
    var value = {
        id: randomId("modal_"),
        title: "Modal title",
        text: "Text goes here",
        title_id: randomId(),
        text_id: randomId(),
        button_1_text: "Close",
        button_1_type: 'secondary',
        button_1_id: randomId(),
        button_2_text: "Yes",
        button_2_type: 'primary',
        button_2_id: randomId(),
        button_1_hide: false,
        result: function(){}
    }
    var html = '<div class="modal fade" id="'+value.id+'" tabindex="-1" role="dialog" aria-labelledby="'+value.title_id+'" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="'+value.title_id+'">'+value.title+'</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="'+value.text_id+'">'+value.text+'</div><div class="modal-footer"><button type="button" class="btn btn-'+value.button_1_type+'" data-dismiss="modal" id="'+value.button_1_id+'">'+value.button_1_text+'</button><button type="button" class="btn btn-'+value.button_1_type+'" data-dismiss="modal" id="'+value.button_2_id+'">'+value.button_2_text+'</button></div></div></div></div>';
    $(document.body).prepend(html);
    this.settings = function(_settings){
        value = updateAssArray(value,_settings);
        $("#"+value.title_id).text(value.title);
        $("#"+value.text_id).text(value.text);
        $("#"+value.button_1_id).text(value.button_1_text);
        $("#"+value.button_2_id).text(value.button_2_text);
        $("#"+value.button_1_id).attr("class","btn btn-"+value.button_1_type);
        $("#"+value.button_2_id).attr("class","btn btn-"+value.button_2_type);
        if (value.button_1_hide) {
            $("#"+value.button_1_id).addClass("d-none");
        }
    }
    this.show = function(){
        $("#"+value.id).modal();
    }
    // on click
    $("#"+value.button_1_id).click(function(){
        value.result(true);
    })
    // on click
    $("#"+value.button_2_id).click(function(){
        value.result(false);
    })
}

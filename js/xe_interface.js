//Start editor
function editorStart_xe(editor_sequence, primary_key, content_key){
    console.log("editor start");
    var textarea = jQuery("#xpress-editor-"+editor_sequence);
    var form	 = textarea['context'].forms[1];
    if(form) form.setAttribute('editor_sequence', editor_sequence);
    editorRelKeys[editor_sequence] = new Array();
    editorRelKeys[editor_sequence]["primary"]   = document.getElementsByName(primary_key)[0];
    editorRelKeys[editor_sequence]["content"]   = document.getElementsByName(content_key)[0];
    editorRelKeys[editor_sequence]["func"]	  = editorGetContentTextarea_xe;
    editorRelKeys[editor_sequence]["pasteHTML"] = function(text){
        //CKEDITOR.instances.ckeditor_instance.insertHtml(text);
        CKEDITOR.instances["ckeditor_instance_"+editor_sequence].insertHtml(text);
    }
}

//Get content from editor
function editorGetContentTextarea_xe(editor_sequence){
    return CKEDITOR.instances["ckeditor_instance_"+editor_sequence].getData();
}

function editorGetContent(editor_sequence) {
    if(!CKEDITOR.instances.ckeditor_instance) {
        if(!CKEDITOR.instances[editor_sequence.id]) return CKEDITOR.instances["ckeditor_instance_"+editor_sequence].getData();
        else return CKEDITOR.instances[editor_sequence.id].getData();
    }
    else return CKEDITOR.instances.ckeditor_instance.getData()
}

//Replace html content to editor
function editorReplaceHTML(iframe_obj, content) {
    content = editorReplacePath(content);

    //HTML을 추가해줌.
    //이부분에서 iframe_obj 파싱을 해주어야함
    var srl = parseInt(iframe_obj.id.replace(/^.*_/,''),10);
    CKEDITOR.instances["ckeditor_instance_"+srl].insertHtml(content);
}

function editorGetIFrame(srl) {
	//IFrame 대신에 div를 돌려줌(그래도 별상관 없음)
	return jQuery('div#cke_ckeditor_instance_'+srl).get(0);
}


function editorReplacePath(content) {
	// 태그 내 src, href, url의 XE 상대경로를 http로 시작하는 full path로 변경
	content = content.replace(/\<([^\>\<]*)(src=|href=|url\()("|\')*([^"\'\)]+)("|\'|\))*(\s|>)*/ig, function(m0,m1,m2,m3,m4,m5,m6) {
		if(m2=="url(") { m3=''; m5=')'; } else { if(typeof(m3)=='undefined') m3 = '"'; if(typeof(m5)=='undefined') m5 = '"'; if(typeof(m6)=='undefined') m6 = ''; }
		var val = jQuery.trim(m4).replace(/^\.\//,'');
		if(/^(http\:|https\:|ftp\:|telnet\:|mms\:|mailto\:|\/|\.\.|\#)/i.test(val)) return m0;
		return '<'+m1+m2+m3+request_uri+val+m5+m6;
	});
	return content;
}
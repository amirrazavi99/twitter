$("#postTextarea").keyup(event=>{
    const textarea= $(event.target);
    const val = textarea.val();
    const submitbutton=$("#submitPostbutton");

    if(val==""){
        submitbutton.prop("disabled",true);
        return
    }else{
        submitbutton.prop("disabled",false)
    }
})
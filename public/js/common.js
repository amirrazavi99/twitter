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

$("#submitPostbutton").click((event)=>{
    const button =$(event.target);
    const textbox=$("#postTextarea");

    data={
        content:textbox.val()
    }

    $.post("/api/posts", data, postData =>{
        
        
        
        const html =CreatePostHtml(postData);
        
        $(".postContainer").prepend(html);
        textbox.val("");
        button.prop("disabled",true);

    })


})

function CreatePostHtml(postData){

    let postedBy = postData.postedBy;

    let display =postedBy.firstName +" "+ postedBy.lastName;

    let timestamp =postData.createdAt;
 


    return `<div class='post'>
                <div class='mainContainer'>
                     <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                </div>
                <div class='postcontentContainer'>
                    <div class ='header'>
                    <a href='/profile/${postedBy.userName}'>${display}</a>
                    <span>${postedBy.userName}</span>
                    <span>${timestamp}</span>
                    </div>
                    <div class ='postbody'>
                        <span>${postData.content}</span>
                    </div>
                    <div class ='postfooter'>
                    </div>

                </div>
            </div>
     </div>`;

}
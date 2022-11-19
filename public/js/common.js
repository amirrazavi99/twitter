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


$(document).on("click",".likeButton",(event)=>{
    const button=$(event.target);
    const postid=getpostFormId(button)

    if(postid == undefined) return alert("not id");

    $.ajax({
        url:`/api/posts/${postid}/likes`,
        type:"PUT",
        success:(postData)=>{
            button.find("span").text(postData.likes.length || "")

            if(postData.likes.includes(userLoggedIn._id)){
                
                button.addClass("active");
            }else{
               
                
                button.removeClass("active");
            }
        }


    })
})


function getpostFormId(element){
    const isroot=element.hasClass(".post")
    const rootElement =isroot ==true ?element:element.closest(".post")
    const postid=rootElement.data().id;


    if(postid == undefined) return alert("not id");
    return postid

}





function CreatePostHtml(postData){

    let postedBy = postData.postedBy;

    if(postedBy._id == undefined){
        return alert("not pupulate");
    }

    let display =postedBy.firstName +" "+ postedBy.lastName;

    let timestamp =timeDifference(new Date(),new Date(postData.createdAt));

    const likeButtonActive=postData.likes.includes(userLoggedIn._id) ? "active":"";
                



    return `<div class='post' data-id="${postData._id}">
                <div class='mainContainer'>
                     <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                </div>
                <div class='postcontentContainer'>
                    <div class ='header'>
                    <a href='/profile/${postedBy.userName}' class="displayName">@${display}</a>
                    <span>${postedBy.userName}</span>
                    <span>${timestamp}</span>
                    </div>
                    <div class ='postbody'>
                        <span>${postData.content}</span>
                    </div>
                    <div class ='postfooter'>
                        <div class ='postButtonContainer'>
                            <buttonn>
                                <i class="fa fa-comment"></i>
                            </buttonn>
                        </div>
                        <div class ='postButtonContainer green'>
                            <buttonn class="retweetButton">
                                <i class="fa fa-retweet"></i>
                            </buttonn>
                        </div>
                        <div class ='postButtonContainer red'>
                            <buttonn class="likeButton ${likeButtonActive}">
                                <i class="fa fa-heart"></i>
                                <span>${postData.likes.length || ""}</span>
                            </buttonn>
                        </div>
                    </div>

                </div>
            </div>
     </div>`;

}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return  Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return  Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
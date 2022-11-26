$("#postTextarea, #replyTextarea").keyup(event=>{
    const textarea= $(event.target);
    const val = textarea.val();
   

    const isModel = textarea.parents('.modal').length ==1;

    const submitbutton=isModel ? $("#submitReplyButton"): $("#submitPostbutton");

    if(val==""){
        submitbutton.prop("disabled",true);
        return
    }else{
        submitbutton.prop("disabled",false)
    }
})

$("#submitPostbutton, #submitReplyButton").click((event)=>{
    const button =$(event.target);

    const ismodel = button.parents('.modal').length ==1;
    
    const textbox= ismodel ? $("#replyTextarea"): $("#postTextarea");
    

    const data={
        content:textbox.val()
    }

    if (ismodel) {
        const id = button.data().id;
        console.log(id);
        if(id == null) return alert("Button id is null");
        data.replyTo = id;
    }


    $.post("/api/posts", data, postData => {

        if(postData.replyTo) {
            location.reload();
        }
        else {
            const html = CreatePostHtml(postData);
            $(".postsContainer").prepend(html);
            textbox.val("");
            button.prop("disabled", true);
        }
    })

})

$(document).on("click",".retweetButton",(event)=>{
    const button=$(event.target);
    const postid=getpostFormId(button)

    if(postid == undefined) return alert("not id");

    $.ajax({
        url:`/api/posts/${postid}/retweet`,
        type:"POST",
        success:(postData)=>{
            button.find("span").text(postData.retweetUsers.length || "")

            if(postData.retweetUsers.includes(userLoggedIn._id)){
                
                button.addClass("active");
            }else{
               
                
                button.removeClass("active");
            }
        }


    })
})

$("#replyModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget);
    const postId = getpostFormId(button);
    $("#submitReplyButton").data("id", postId);


    $.get("/api/posts" + postId, results => {
        outPostcontainer(results,$("#orginalPostContainer"))
    })
})


$("#replyModal").on("hidden.bs.modal", (event) => $("#orginalPostContainer").html(""));
 



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

$(document).on("click", ".post", (event) => {
    var element = $(event.target);
    var postId = getpostFormId(element);
    console.log(element);

    if(postId !== undefined && !element.is("buttonn")) {
        window.location.href = '/posts/' + postId;
    }
});




function getpostFormId(element){
    const isroot=element.hasClass(".post")
    const rootElement =isroot ==true ?element:element.closest(".post")
    const postid=rootElement.data().id;


    if(postid == undefined) return alert("not id");
    return postid

}





function CreatePostHtml(postData , largeFont =false){
    if(postData == null) return alert("post object is null");

    let isRetweet = postData.retweetData !== undefined;
    let retweetedBy = isRetweet ? postData.postedBy.userName : null;  
    postData = isRetweet ? postData.retweetData : postData;

    
    
    let postedBy = postData.postedBy;

    if(postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    let display = postedBy.firstName + " " + postedBy.lastName;
    let timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    let retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
    let largeFontClass = largeFont ? "largeFont" : "";

    let retweetText = '';
    if(isRetweet) {
        retweetText = `<span>
                        <i class='fas fa-retweet'></i>
                        Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>    
                    </span>`
    }



    let replyFlag = "";
    if(postData.replyTo && postData.replyTo._id) {
        
        if(!postData.replyTo._id) {
            return alert("Reply to is not populated");
        }
        else if(!postData.replyTo.postedBy._id) {
            return alert("Posted by is not populated");
        }

        const replyToUsername = postData.replyTo.postedBy.userName;
        
          replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
                    </div>`;
                    

    }
    let buttons = "";
    if (postData.postedBy._id == userLoggedIn._id) {
        buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class='fas fa-times'></i></button>`;
    }
    

    return `<div  class='post ${largeFontClass}' data-id="${postData._id}">
                <div class='postActionContainer'>
                ${retweetText}
                </div>
                <div class='mainContainer'>
                     <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                </div>
                <div class='postcontentContainer'>
                    <div class ='header'>
                    <a href='/profile/${postedBy.userName}' class="displayName">@${display}</a>
                    <span class='username'>${postedBy.userName}</span>
                    <span class='date'>${timestamp}</span>
                    ${buttons}
                    </div>
                    ${replyFlag}
                    <div class ='postbody'>
                        <span>${postData.content}</span>
                    </div>
                    <div class ='postfooter'>
                        <div class ='postButtonContainer'>
                            <buttonn  data-toggle='modal' data-target='#replyModal'>
                                <i class="fa fa-comment"></i>
                            </buttonn>
                        </div>
                        <div class ='postButtonContainer green'>
                            <buttonn class="retweetButton ${retweetButtonActiveClass}">
                                <i class="fa fa-retweet"></i>
                                <span>${postData.retweetUsers.length || ""}</span>
                            </buttonn>
                        </div>
                        <div class ='postButtonContainer red'>
                            <buttonn class="likeButton ${likeButtonActiveClass}">
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

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

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

function outPostcontainer(results, container){
    container.html("");

    if(!Array.isArray(results)){
        results =[results];
    }
    results.forEach((result)=>{
       const html = CreatePostHtml(result);
       container.append(html);
    })
    if(results.length == 0){
        container.append("<span> no post </span>")
}
}

function outPutPostsWithReplies(results, container) {
    container.html("");

    if(results.replyTo !== undefined && results.replyTo._id !== undefined) {
        let html = CreatePostHtml(results.replyTo)
        container.append(html);
    }

    const mainPostHtml = CreatePostHtml(results.postData ,true)
    container.append(mainPostHtml);

    results.replies.forEach(result => {
        let html = CreatePostHtml(result)
        container.append(html);
    });
}
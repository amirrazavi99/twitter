$(document).ready(()=>{
    $.get("/api/posts", results =>{
        outPostcontainer(results, $(".postContainer"))
    })
})
function outPostcontainer(results, container){
    container.html("");
    results.forEach((result)=>{
       const html = CreatePostHtml(result);
       container.append(html);
    })
    if(results.length == 0){
        container.append("<span> no post </span>")
}
}


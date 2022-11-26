$(document).ready(()=>{
    $.get("/api/posts", results =>{
        outPostcontainer(results, $(".postsContainer"))
    })
})



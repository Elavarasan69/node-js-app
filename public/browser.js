// console.log("Welcom to my page")


//e - event handler listener
document.addEventListener("click",function(e){

    //update
    if(e.target.classList.contains("edit-me")){
        let result = prompt("Enter new value", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        
        axios.post('/update-item',{text:result, id:e.target.getAttribute("data-id")}).then(function(){
            //doing some operations
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = result
        }).catch(function(){
            //error data
            console.log("Error try again")
        })
    }


    //delete
    if(e.target.classList.contains("delete-me")){
        confirm("Do you really want to delete ",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        axios.post('/delete-item',{id:e.target.getAttribute("data-id")}).then(function(){
            //doing some operations
            e.target.parentElement.parentElement.remove()
        }).catch(function(){
            //error data
            console.log("Error try again")
        })
    }
})
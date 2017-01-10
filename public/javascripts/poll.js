$(document).ready(function() {
    $("#plus").click(function() {
        $("#add-option").removeClass("hidden")
        $("#plus").addClass("hidden")
    })
    $("#cancel").click(function() {
        $("#add-option").addClass("hidden")
        $("#plus").removeClass("hidden")        
    })
})
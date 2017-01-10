$(document).ready(function() {
    let html = 
    '<div class="form-group">' +
        '<label for="options">Answer</label>' +
        '<input type="text" name="options" class="form-control" maxlength="30">' +
    '</div>'
    $("#plus").click(function() {
        $( "#more-options" ).append(html);
    })
})

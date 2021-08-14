var form_field_labels = ['Username','Email','Password','Re-Enter Password'] // signup form fields labels
var form_fields = document.getElementsByTagName('input') // get form fields

for(let i=1;i<form_fields.length;i++){
    form_fields[i].placeholder = form_field_labels[i-1] // set label
}
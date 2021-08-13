var form_field_labels = ['Username','Email','Password','Re-Enter Password']
var form_fields = document.getElementsByTagName('input')

for(let i=1;i<form_fields.length;i++){
    form_fields[i].placeholder = form_field_labels[i-1]
}
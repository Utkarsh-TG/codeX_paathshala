// get resource material
var resources_data = [['6','7','8','9','10'],['Maths','Science','English','Hindi','Social Studies']]

// present resource material
const showResourceMaterial = (data) => {
    $('#resource-material-container').css({'display':'flex'})
    $('#practice-material-container').css({'display':'none'})
    $('#doubts-container').css({'display':'none'})
    let parent = document.getElementById('resource-material-container')
}

// get resource data
const getResourceData = (elem) => {
    let data_type = $(elem).attr('data-type')
    let data_header = $(elem).attr('data-header')
    let filter_data = $(elem).attr('filter-data')
    // make ajax request with filters
    $.ajax({
        type: 'POST',
        url: '/user/study_material/',
        data:{
            dataType: data_type,
            dataHeader: data_header,
            filterData: filter_data,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(data){
            let tempData = data.study_material;
            console.log(tempData)
            showResourceMaterial(data)
            $('#study-dropdown-items').css({'display':'none'})
            $('#practice-dropdown-items').css({'display':'none'})
        },
    })
}

// set resources dropdown
const setResourcesDropdown = () => {
    // add dropdown UI
    let addDropdown = (parent, parentName) => {
        parent.innerHTML = ''
        for(let i=0;i<resources_data[0].length;i++){
            wrapper = document.createElement('div')
            wrapper.classList.add('dropdown-item')
            $(wrapper).attr({'data-type':'class','data-header':parentName,'filter-data':resources_data[0][i]})
            wrapper.innerHTML = 'Class ' + resources_data[0][i]
            $(wrapper).click((e)=>{
                getResourceData(e.currentTarget)
            })
            parent.appendChild(wrapper)
        }
        for(let j=0;j<resources_data[1].length;j++){
            wrapper = document.createElement('div')
            wrapper.classList.add('dropdown-item')
            $(wrapper).attr({'data-type':'subject','data-header':parentName,'filter-data':resources_data[1][j]})
            wrapper.innerHTML = resources_data[1][j]
            $(wrapper).click((e)=>{
                getResourceData(e.currentTarget)
            })
            parent.appendChild(wrapper)
        }
    }
    // set UI dropdown for study and practice material
    let parent1 = document.getElementById('study-dropdown-items') 
    let parent2 = document.getElementById('practice-dropdown-items')
    addDropdown(parent1, 'study-material')
    addDropdown(parent2, 'practice-material')
}

setResourcesDropdown()

$('#study-material-dropdown').click(()=>{
    $('#study-dropdown-items').css({'display':'block'})
    $('#practice-dropdown-items').css({'display':'none'})
})

$('#practice-material-dropdown').click(()=>{
    $('#practice-dropdown-items').css({'display':'block'})
    $('#study-dropdown-items').css({'display':'none'})
})
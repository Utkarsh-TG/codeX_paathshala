// get resource material
var resource_data = []
var validOptions = ['A','B','C','D']
// open specific resource info
const openStudyResource = (elem) => {
    $('#study-resource-window').css({'display':'block'})
    $('#practice-resource-window, #doubts-container, #study-material-container, #practice-material-container, .dropdown-items').css({'display':'none'})
    let id = $(elem).attr('data-id')
    let data = resource_data[id]
    $('#study-resource-title').html(data.title)
    $('#study-resource-date').html(data.date)
    $('#study-resource-description').html(data.description)
    $('#study-resource-file').attr('src',data.url)
    let tags_list = [data._class, data.subject, data.title]
    let tags_wrapper = document.getElementById('study-resource-tags-wrapper')
    tags_wrapper.innerHTML = ''
    for(let i in tags_list){
        let wrapper = document.createElement('span')
        wrapper.classList.add('study-resource-tag')
        $(wrapper).html(tags_list[i])
        tags_wrapper.appendChild(wrapper)
    }
}

const openPracticeResource = (elem) => {
    $('#practice-resource-window').css({'display':'block'})
    $('#study-resource-window, #doubts-container, #doubt-reply-window, #study-material-container, #practice-material-container').css({'display':'none'})
    let id = $(elem).attr('data-id')
    let data = resource_data[id]
    $('#practice-resource-title').html(data.title)
    $('#practice-resource-date').html(data.date)
    $('#practice-resource-description').html(data.description)
    let tags_list = [data._class, data.subject, data.title]
    let tags_wrapper = document.getElementById('practice-resource-tags-wrapper')
    tags_wrapper.innerHTML = ''
    for(let i in tags_list){
        let wrapper = document.createElement('span')
        wrapper.classList.add('practice-resource-tag')
        $(wrapper).html(tags_list[i])
        tags_wrapper.appendChild(wrapper)
    }
    let questions_list = data.questions
    let parent = document.getElementById('practice-questions-container')
    $(parent).html('')
    for(let j in questions_list){
        let questionData = questions_list[j]
        let question_wrapper = document.createElement('div')
        question_wrapper.classList.add('practice-question-wrapper')
        let questionContent = document.createElement('div')
        questionContent.classList.add('practice-question-text')
        let questionNum = parseInt(j) + 1
        $(questionContent).html('Question '+ questionNum +': '+questionData.questionText)
        question_wrapper.appendChild(questionContent)
        let optionsWrapper = document.createElement('div')
        optionsWrapper.classList.add('practice-options-wrapper')
        
        options_list = questionData.optionsList
        for(n in options_list){
            optionWrap = document.createElement('div')
            optionWrap.classList.add('practice-option-wrapper')
            $(optionWrap).html(validOptions[n]+': '+options_list[n])
            optionsWrapper.appendChild(optionWrap)
        }

        let correctOptionBtn = document.createElement('div')
        correctOptionBtn.classList.add('practice-correct-option-btn')
        $(correctOptionBtn).html('Show Correct Option')
        let correctOptionText = document.createElement('div')
        correctOptionText.classList.add('practice-correct-option-text')
        
        $(correctOptionText).html((questionData.correctOption).toUpperCase())
        $(correctOptionBtn).click(()=>{
            $(correctOptionText).toggle()
        })

        parent.appendChild(question_wrapper)
        question_wrapper.appendChild(optionsWrapper)
        
        question_wrapper.appendChild(correctOptionBtn)
        question_wrapper.appendChild(correctOptionText)
    }
}

// present study material
const showStudyResources = (data) => {
    let parent = document.getElementById('study-material-container')
    parent.innerHTML = ''
    // generate study resources from data
    for(let i in data){
        let wrapper = document.createElement('div')
        wrapper.classList.add('study-resource-wrapper', 'block-content')
        $(wrapper).html('<div class="resource-title">' + data[i].title + '</div><div class="resource-date">' + data[i].date + '</div>')
        $(wrapper).attr({'data-id':i, 'data-header':'study-material'})
        $(wrapper).click((e)=>{
            openStudyResource(e.currentTarget)
        })
        parent.appendChild(wrapper)
    }
}

//present practice material
const showPracticeResources = (data) => {
    let parent = document.getElementById('practice-material-container')
    parent.innerHTML = ''
    // generate practice resources from data
    for(let i in data){
        let wrapper = document.createElement('div')
        wrapper.classList.add('practice-resource-wrapper', 'block-content')
        $(wrapper).html('<div class="resource-title">' + data[i].title + '</div><div class="resource-date">' + data[i].date + '</div>')
        $(wrapper).attr({'data-id':i, 'data-header':'practice-material'})
        $(wrapper).click((e)=>{
            openPracticeResource(e.currentTarget)
        })
        parent.appendChild(wrapper)
    }
}

// get resource data
const getResourceData = (elem) => {
    let data_type = $(elem).attr('data-type')
    let data_header = $(elem).attr('data-header')
    let filter_data = $(elem).attr('filter-data')
    // retrieve resources data with filters
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
            if(data_header == "study-material"){
                $('#study-material-container').css({'display':'flex'})
                $('#practice-material-container').css({'display':'none'})
                let tempData = data.study_material;
                resource_data = tempData;
                showStudyResources(tempData)
            }
            else if(data_header == "practice-material"){
                $('#practice-material-container').css({'display':'flex'})
                $('#study-material-container').css({'display':'none'})
                let tempData = data.practice_material;
                resource_data = tempData;
                showPracticeResources(tempData)
            }
            $('#study-dropdown-items, #practice-dropdown-items, #study-resource-window, #doubts-container, #practice-resource-window').css({'display':'none'})
        },
    })
}

$('#study-material-dropdown').click(()=>{
    $('#study-dropdown-items').toggle()
    //$('#study-dropdown-items').css({'display':'block'})
    $('#practice-dropdown-items').css({'display':'none'})
})

$('#practice-material-dropdown').click(()=>{
    $('#practice-dropdown-items').toggle()
    $('#study-dropdown-items').css({'display':'none'})
})

$('#doubts-viewer').click(()=>{
    $('#doubts-container').css({'display':'block'})
    $('.doubts-wrapper, #doubts-function').css({'display':'flex'})
    $('#practice-dropdown-items, #study-material-container, #practice-material-container, #study-resource-window, #practice-resource-window, #doubt-reply-window, #study-dropdown-items, .ask-doubt-window-wrapper').css({'display':'none'})
})

// set resources dropdown
var dropdown_data = [['6','7','8','9','10'],['Maths','Science','English','Hindi','Social Studies']]

const setResourcesDropdown = () => {
    // add dropdown UI
    let addDropdown = (parent, parentName) => {
        parent.innerHTML = ''
        for(let i in dropdown_data[0]){
            let wrapper = document.createElement('div')
            wrapper.classList.add('dropdown-item')
            $(wrapper).attr({'data-type':'class','data-header':parentName,'filter-data':dropdown_data[0][i]})
            wrapper.innerHTML = 'Class ' + dropdown_data[0][i]
            $(wrapper).click((e)=>{
                getResourceData(e.currentTarget)
            })
            parent.appendChild(wrapper)
        }
        for(let j in dropdown_data[1]){
            let wrapper = document.createElement('div')
            wrapper.classList.add('dropdown-item')
            $(wrapper).attr({'data-type':'subject','data-header':parentName,'filter-data':dropdown_data[1][j]})
            wrapper.innerHTML = dropdown_data[1][j]
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
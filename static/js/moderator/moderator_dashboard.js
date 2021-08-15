// create new practice material

// add new questions
const addNewQuestion = (type) => {
    let parent = document.getElementById('questions-wrapper')
    let wrapper = document.createElement('div')
    if(type == 'long'){
        wrapper.classList.add('question-wrapper','long-question')
        $(wrapper).html('<textarea class="question-text" placeholder="Question"></textarea><div class="delete-ques">Delete</div>')
        $(wrapper).attr('type', 'long')
    }
    if(type == 'mcq'){
        wrapper.classList.add('question-wrapper','mcq-question')
        $(wrapper).html('<input class="question-text placeholder="Question">' +
            '<div class="options-wrapper">' +
                '<input class="option option-a" placeholder="Option A">' +
                '<input class="option option-b" placeholder="Option B">' +
                '<input class="option option-c" placeholder="Option C">' +
                '<input class="option option-d" placeholder="Option D">' +
            '</div>' +
            '<input class="correct-option" placeholder="Correct Option">' +
            '<div class="delete-ques">Delete</div>'
        )
        $(wrapper).attr('type', 'mcq')
    }
    parent.appendChild(wrapper)
    addDeleteListener()
}

$('#add-new-long-ques').click(()=>{addNewQuestion('long')})
$('#add-new-mcq-ques').click(()=>{addNewQuestion('mcq')})


// delete questions
const deleteQues = (e) => {
    question = e.target.parentNode
    $(question).remove()
}

const addDeleteListener = () => {
    let deleteBtns = document.querySelectorAll('.delete-ques')
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', deleteQues)
    });
}

// upload form

// get practice form questions data
const getPracticeQuestionsData = () => {
    let question_data = []
    let questionsList = document.querySelectorAll('.question-wrapper')
    questionsList.forEach(question => {
        let data = {}
        let _type = $(question).attr('type')
        data.type = $(question).attr('type')
        data.questionText = $(question).children(".question-text")[0].value
        if(_type == 'mcq'){
            let optionsList = []
            for(let i=0;i < $($(question).children(".options-wrapper")[0]).children('.option').length;i++){
                optionsList.push($($(question).children(".options-wrapper")[0]).children('.option')[i].value)
            }
            data.optionsList = optionsList
            data.correctOption = $(question).children(".correct-option")[0].value
        }
        question_data.push(data)
    })
    return(question_data)
}

// submit practice form
$('#submit-practice-material').click(()=>{
    questionsData =  JSON.stringify(getPracticeQuestionsData())
    console.log(questionsData)
    $.ajax({
        type: 'POST',
        url: '/moderator/add_practice_resource/',
        data:{
            type: $('#form-title').val(),
            class: $('#practice-resource-class').val(),
            subject: $('#practice-resource-subject').val(),
            title: $('#practice-resource-title').val(),
            description: $('#practice-resource-description').val(),
            questions: questionsData,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
    });
})
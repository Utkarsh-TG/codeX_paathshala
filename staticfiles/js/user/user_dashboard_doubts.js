// initialize firebase
var storage, doubts_data, user_doubts_data, question_id
$.ajax({
    type: 'POST',
    url: '/user/firebase_config/',
    data:{
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },success: (data) => {
        let config = JSON.parse(data.firebase_config)
        firebase.initializeApp(config); // initialize firebase app
        storage = firebase.storage(); // initialize storage bucket
    }
})


// get image file from sha256 data url
function dataURLtoFile(dataurl) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], {type:mime});
}

// initialize quill for text editors
var questionQuill = new Quill('#editor-container', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'blockquote', 'code-block', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }]
      ]
    },
    placeholder: 'Enter question body',
    theme: 'snow'  // or 'bubble'
});


// update doubts data on load
// search - filter questions
$('#doubts-search-btn').click(()=>{
    let searchVal = $('#doubts-filter-search').val().toUpperCase()
    let doubtsWrapper = document.getElementById('doubts-wrapper').childNodes

    for(let i in doubtsWrapper){
        let tags = doubtsWrapper[i].getElementsByClassName('doubt-info-wrapper')[0].getElementsByClassName('doubt-info-inner')[0].getElementsByClassName('tags-wrapper')[0].getElementsByClassName('doubt-tag')
        for(let j in tags){
            tagVal = tags[j].innerHTML.toUpperCase()
            if(tagVal.indexOf(searchVal) > -1){
                doubtsWrapper[i].style.display = ''
                break
            }else{
                doubtsWrapper[i].style.display = 'none'
            }
        }
    }
})

// update search value on tag click
const updateSearchWTag = (e) => {
    let searchVal = e.currentTarget.innerHTML
    $('#doubts-filter-search').val(searchVal)
}

// add listerners to different doubts elements
const addListerners = () => {
    let addTagsListener = () => {
        let tagsBtn = document.querySelectorAll('.doubt-tag')
        //console.log('debug')
        tagsBtn.forEach(btn => {
            btn.addEventListener('click', updateSearchWTag)
        })
    }
    let addReplyListener = () => {
        let replyBtns = document.querySelectorAll('.reply-btn')
        replyBtns.forEach(btn => {
            $(btn).click(()=>{
                replyDoubt(btn, 'reply-btn')
            })
        })
    }
    let addQuestionViewListener =  () => {
        let questionBtns = document.querySelectorAll('.doubt-question-wrapper')
        questionBtns.forEach(btn => {
            $(btn).click(()=>{
                replyDoubt(btn, 'question-btn')
            })
        })
    }
    addTagsListener()
    addReplyListener()
    addQuestionViewListener()
}

// base model for question
const addDoubtHTML = (wrapper, doubt) => {
    $(wrapper).html('<div class=doubt-functions><div class="doubt-user-info"><div class="doubt-user-icon"><svg class="svg-user-icon" width="50px" height="50px" data-jdenticon-value="'+ doubt.user +'"></svg></div><span class="doubt-user-name">'+doubt.user+'</span></div><div class="upvote-wrapper"><span class="upvote-counter">'+ doubt.votes.length +' Upvotes</span></div></div><div class="doubt-info-wrapper"><div class="doubt-question-wrapper">'+ doubt.content +'</div><div class="doubt-info-inner"><div class="doubt-reply-functions"><span class="reply-btn">Reply</span> <span class="reply-counter">'+ doubt.responses.length +' Answers</span></div></div></div>')
    let tags = JSON.parse(doubt.tags)
    let tagsWrapper = document.createElement('div')
    tagsWrapper.classList.add('tags-wrapper')
    for(let i in tags){
        let tag = document.createElement('span')
        tag.classList.add('doubt-tag')
        tag.innerHTML = tags[i]
        tagsWrapper.appendChild(tag)
    }
    $(wrapper).children('.doubt-info-wrapper').children('.doubt-info-inner').append(tagsWrapper)
}

// make/represent elements with doubts data
const generateDoubts = (doubts, user_doubts) => {
    let parent = document.getElementById('doubts-wrapper')
    parent.innerHTML = ''
    for(let i in doubts){
        let wrapper = document.createElement('div')
        wrapper.classList.add('doubt-wrapper', 'doubt')
        addDoubtHTML(wrapper, doubts[i])
        $(wrapper).attr('data-id',doubts[i]._id)
        parent.appendChild(wrapper)
    }
    parent = document.getElementById('user-doubts-wrapper')
    parent.innerHTML = '<span class="section-heading">Your Profile</span>'
    for(let i in user_doubts){
        let wrapper = document.createElement('div')
        wrapper.classList.add('doubt-wrapper', 'user-doubt')
        addDoubtHTML(wrapper, user_doubts[i])
        $(wrapper).attr('data-id',doubts[i]._id)
        parent.appendChild(wrapper)
    }
    $.getScript("https://cdn.jsdelivr.net/npm/jdenticon@3.1.1/dist/jdenticon.min.js", function() {
        console.log("script added successfully")
    })
    addListerners()
}

// get doubts data
const updateDoubtsData = () => {
    $.ajax({
        type: 'POST',
        url: '/user/doubts_data/',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },success: (data) => {
            doubts_data = data.doubts_data
            user_doubts_data = data.user_doubts
            generateDoubts(doubts_data, user_doubts_data)
            if(typeof questionId !== 'undefined'){
                for(let i in doubts_data){
                    if(doubts_data[i]._id == questionId){
                        generateDoubtWindow(doubts_data[i])
                    }
                }
            }
        }
    })
}

updateDoubtsData()


//reply on doubt

//show answers
const generatePreResponses = (data) => {
    let parent = document.getElementById('reply-question-answers-container')
    parent.innerHTML = ''
    //console.log(data)
    for(let i in data){
        answer_wrapper = document.createElement('div')
        answer_wrapper.classList.add('answer-wrapper')
        $(answer_wrapper).html('<div class="answer-user-info-wrapper"><div class="answer-doubt-user-icon"><svg class="svg-user-icon" width="50px" height="50px" data-jdenticon-value="'+ data[i].user +'"></svg></div><span class="answer-doubt-user-name">'+ data[i].user +'</span></div><div class="answer-content-wrapper">'+ data[i].content +'</div>')
        parent.appendChild(answer_wrapper)
    }
    $.getScript("https://cdn.jsdelivr.net/npm/jdenticon@3.1.1/dist/jdenticon.min.js", function() {
        console.log("script added successfully")
    })
}

//generate window to reply
const generateDoubtWindow = (data) => {
    question_id = data._id
    $('#doubt-reply-window').attr('data-id',data._id)
    $('#reply-user-info-wrapper').html('<div class="reply-doubt-user-icon"><svg class="svg-user-icon" width="50px" height="50px" data-jdenticon-value="'+ data.user +'"></svg></div><span class="reply-doubt-user-name">'+ data.user +'</span>')
    $('#upvote-wrapper').html('<div class="reply-upvote-counter">'+ data.votes.length +'<span id="upvote-icon"></span></div><div id="upvote-btn">Upvote</div>')
    $('#reply-question-container').html(data.content)
    if(data.responses.length > 1){
        $('.reply-question-heading').html(data.responses.length + ' Answers')
    }else{
        $('.reply-question-heading').html(data.responses.length + ' Answer')
    }
    tagParent = document.getElementById('reply-question-tags-container')
    let tags = JSON.parse(data.tags)
    tagParent.innerHTML = ''
    for(let i in tags){
        tag_wrapper = document.createElement('span')
        tag_wrapper.classList.add('doubt-tag')
        $(tag_wrapper).html(tags[i])
        tagParent.appendChild(tag_wrapper)
    }
    // show answers
    generatePreResponses(data.responses)
    $.getScript("https://cdn.jsdelivr.net/npm/jdenticon@3.1.1/dist/jdenticon.min.js", function() {
        console.log("script added successfully")
    })
    // get upvote btn click
    $('#upvote-btn').click(()=>{
        questionId = question_id
        $.ajax({
            type: 'POST',
            url: '/user/upvote/',
            data:{
                question: questionId,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },success: (data) => {
                // update doubts data
                updateDoubtsData()
            }
        })
    })
}

//post answer
var answerQuill = new Quill('#reply-editor-container', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'blockquote', 'code-block', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }]
      ]
    },
    placeholder: 'Enter answer body',
    theme: 'snow'  // or 'bubble'
});

$('#reply-post-btn').click(()=>{    
    user = uid
    question = question_id
    images = $('#reply-editor-container .ql-editor img')
    // solutions storage ref
    storageRef = storage.ref('User').child('Doubt').child('Answers').child('Files').child(user);
    let i = 0
    // upload image to firebase storage
    let uploadImage = () => {
        if(i<images.length){
            dateToday = new Date()
            _time = dateToday.toISOString().replace(/[\-\.\:ZT]/g,"").substr(0,14)
            thisref = storageRef.child(_time).put(dataURLtoFile(images[i].src))
            thisref.on('state_changed',function(snapshot) {
                console.log('Done');
            }, function(error) {
                console.log('Error',error);
                i++
                uploadImage()
            }, function() {thisref.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    imageFileURL = downloadURL
                    images[i].src = imageFileURL
                    i++
                    uploadImage()
                });
            });
        }
    }

    uploadImage()

    let interval = setInterval(getImagePostUpdate, 1000);

    function getImagePostUpdate(){
        if(i == images.length){
            clearInterval(interval)
            content = ($('#reply-editor-container .ql-editor').html()).toString()
            if(content != '<p><br></p>' && typeof content != 'undefined'){
                $.ajax({
                    type: 'POST',
                    url: '/user/post_answer/',
                    data:{
                        content: content,
                        question: question,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },success: () => {
                        // show alert posted successfully
                        // clear feilds
                        $('#reply-editor-container .ql-editor').html('')
                        updateDoubtsData()
                    }
                })
            }
        }
    }
})

const replyDoubt = (elem, from) => {
    $('.dropdown-items, #study-material-container, #practice-material-container, #study-resource-window, .doubts-wrapper ,#practice-resource-window, #doubts-function, .ask-doubt-window-wrapper').css({'display':'none'})
    $('#doubt-reply-window').css({'display':'flex'})
    if(from == 'reply-btn'){
        questionId = $(elem).parent().parent().parent().parent().attr('data-id')
    }else if(from == 'question-btn'){
        questionId = $(elem).parent().parent().attr('data-id')
    }
    for(let i in doubts_data){
        if(doubts_data[i]._id == questionId){
            generateDoubtWindow(doubts_data[i])
        }
    }
}

// ask new doubt

// upload question
const uploadDoubt = () => {
    user = uid
    images = $('#editor-container .ql-editor img')
    // firebase storage reference
    storageRef = storage.ref('User').child('Doubt').child('Question').child('Files').child(user);
    let i = 0
    // upload image to firebase storage
    let uploadImage = () => {
        if(i<images.length){
            dateToday = new Date()
            _time = dateToday.toISOString().replace(/[\-\.\:ZT]/g,"").substr(0,14)
            thisref = storageRef.child(_time).put(dataURLtoFile(images[i].src))
            thisref.on('state_changed',function(snapshot) {
                console.log('Done');
            }, function(error) {
                console.log('Error',error);
                i++
                uploadImage()
            }, function() {thisref.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    imageFileURL = downloadURL
                    images[i].src = imageFileURL
                    i++
                    uploadImage()
                });
            });
        }
    }
    uploadImage()

    let interval = setInterval(getPostUpdate, 1000);

    function getPostUpdate(){
        if(i == images.length){
            clearInterval(interval)
            content = ($('#editor-container .ql-editor').html()).toString()
            if(content != '<p><br></p>' && typeof content != 'undefined'){
                tags = $('#doubt-tag-input').val()
                tags = tags.split(',')
                dateToday = new Date()
                id = '#'+dateToday.toISOString().replace(/[\-\.\:ZT]/g,"").substr(0,14)
                tags.push(id)
                $.ajax({
                    type: 'POST',
                    url: '/user/ask_doubt/',
                    data:{
                        content: content,
                        tags: JSON.stringify(tags),
                        id: id,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },success: () => {
                        // show alert posted successfully
                        // clear feilds
                        $('#editor-container .ql-editor').html('')
                        $('#doubt-tag-input').html('')
                        updateDoubtsData()
                    }
                })
            }
        }
    }
}

$('#post-doubt-btn').click(() => {
    $('.dropdown-items, #study-material-container, #practice-material-container, #study-resource-window, #practice-resource-window').css({'display':'none'})
    uploadDoubt()
})

$(document).on('input', '#editor-container', ()=>{
    $('.dropdown-items, #study-material-container, #practice-material-container, #study-resource-window, #practice-resource-window').css({'display':'none'})
})

// get button clicks
$('#ask-new-doubt-btn').click(()=>{
    $('.dropdown-items, #study-material-container, #practice-material-container, #study-resource-window, .doubts-wrapper ,#practice-resource-window, #doubt-reply-window, #doubts-function').css({'display':'none'})
    $('.ask-doubt-window-wrapper').css({'display':'block'})
})

$('#return-ask-doubt-window').click(()=>{
    $('.dropdown-items, #study-material-container, #practice-material-container, #study-resource-window, #practice-resource-window, #doubt-reply-window, .ask-doubt-window-wrapper').css({'display':'none'})
    $('.doubts-wrapper, #doubts-function').css({'display':'flex'})
})
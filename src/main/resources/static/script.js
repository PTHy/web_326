let currentUser;

window.onload = () => {
    getComments();
    changeMode();
};

function changeMode() {
    if (currentUser) {
        $('#user-info').show();
        $('#login-btn').hide();
    }
    else {
        $('#user-info').hide();
        $('#login-btn').show();
    }
}

async function getComments() {
    try {
        const comments = await $.get('/comment');
        this.drawComments(comments);
        console.log(comments);
    } catch (error) {
        console.error(error.message);
    }
}

function drawComments(comments) {
    comments.map( comment => {
        this.drawComment(comment);
    })
}

function drawComment(comment) {
    console.log(comment);
    let buttonContent= '';
    if (comment.userId === currentUser) {
        buttonContent = `<div>
                            '<button onclick=>삭제</button>
'                            <button>수정</button>
                        </div>`
    }
    $('#comments').append(
        `
        <div>
            <img class="comment-image" src="${(comment.storedPath === null) ? "/public/default.jpg" :  `/attachment/comment/${comment.id}`}" alt="사진">
            <div class="user-name">${comment.username}</div>
            <div class="created">${comment.created}</div>
            <div class="content">${comment.content}</div>
            {}
         </div>
       `
    )
}

async function modifyCommentSubmit(id) {
    const modifyComment = {
        id,
        userId: 1,
        content: $(`#comment${id}`).children('.modifyContent').children('.inputContent').val()
    };
    await $.ajax({
        url: '/comment',
        type: 'put',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(modifyComment),
        success: (result) => {
            if(result) {
                /*
                구현 필요
                 */
            }
        }
    })
}

async function deleteComment(id) {
    try {
        await $.ajax({
            url: `comment/${id}`,
            type: 'delete',
            success : (result) => {
                if (result === true)
                    $(`#comment${id}`).remove();
            }
        });
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}

async function uploadFile() {
    if(!$('#upload-file')[0].files.length) {
        alert("파일을 선택해주세요!");
        return;
    }
    const file = $('#upload-file')[0].files[0];
    console.log(file);
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
        const response = await $.ajax({
            type: 'post',
            url: '/attachment',
            data: formData,
            processData: false,
            contentType: false,
        });
        console.log(response);
        $('#upload-file').value = "";
        return response;
    } catch (error) {
        console.log(`[ERROR] uploadFile 오류 ${JSON.stringify(error)}`);
    }
}


async function addComment() {

    const uploadFile = await this.uploadFile();

    if (!uploadFile)
        return;

    const { storedPath, originName } = uploadFile;
    let newComment = {
        userId: currentUser,
        content: $('#comment-content').val(),
        storedPath,
        originName,
    };

    try {
        await $.ajax({
            url: '/comment',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(newComment),
            success: (result) => {
                alert("글 작성에 성공하였습니다");
                clearAddCommentInput();
                drawComment(result);
            }
        });
    } catch (error) {
        console.log( `[ERROR] 글 작성 실패 ${JSON.stringify(error)}`);
        alert("글 작성에 실패하였습니다");
    } finally {
        closeCommentDialog();
    }
}

function clearAddCommentInput() {
    $('#comment-content').val('');
}

function clearModifyInput(id) {
    $(`#comment${id}`).children('.modifyContent').children('.inputContent').val('');
}
function openLoginDialog() {
    if (currentUser) {
        alert("이미 로그인이 되어 있습니다");
        return;
    }
    $('#login-container').show(400);
}

function closeLoginDialog() {
    $('#login-container').hide(1000);
}

function openCommentDialog() {
    if (!chkLogin())
        return;
    $('#comment-container').show(400);
}

function closeCommentDialog() {
    $('#comment-container').hide(1000);
}

function chkLogin() {
    if (!currentUser) {
        alert("로그인이 필요합니다!");
        return false;
    }
    return true;
}

async function login() {
    try {
        const data = {
            id: $('#input-user-id').val(),
            password: $('#input-user-password').val()
        };
        await $.ajax({
            url: '/user/login',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (result) => {
                if(result) {
                    console.log(result);
                    alert("로그인 성공")
                    currentUser = result.id;
                    const imagePath = (result.storedPath === null) ? "/public/default.jpg" :  `/attachment/user/${result.id}`;
                    $('#profile-image').children('img').attr("src", imagePath);
                    $('#user-name').text(result.username);
                    $('#user-email').text(result.email);
                    $('#user-joined').text(result.joined);
                    changeMode();
                } else {
                    alert("로그인 실패");
                }
            }
        })
    } catch (error) {
        console.log(error);
        alert("로그인 실패");
    } finally {
        closeLoginDialog();
        $('#input-user-id').val('');
        $('#input-user-password').val('');
    }
}
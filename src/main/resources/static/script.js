let currentUser;
let modifyContent;

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
    const d = new Date(comment.created);
    console.log(comment);
    let buttonContent= '';
    if (comment.userId === currentUser) {
        buttonContent = `<div>
                            <button onclick="modifyComment(this, ${comment.id})">수정</button>
                            <button onclick="deleteComment(this, ${comment.id})">삭제</button>
                        </div>`
    }
    $('#comments').prepend(
        `
        <div id="comment${comment.id}">
            <img class="comment-image" src="${(comment.storedPath === null) ? "/public/no-image.jpg" :  `/attachment/comment/${comment.id}`}" alt="사진">
            <div class="user-name">${comment.username}</div>
            <div class="created">${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}</div>
            <div class="content">${comment.content}</div>
            ${buttonContent}
         </div>
       `
    )
}



async function modifyComment(button, id) {
    if (!chkLogin())
        return;

    const comment = $(`#comment${id}`);
    if ($(button).text() === '수정') {
        modifyContent = comment.children('.content').html();
        console.log(`modify Content : ${modifyContent}`);
        const input = `<input value="${modifyContent}">`
        console.log(`input : ${input}`);
        comment.children('.content').html(input);
        // comment.find('input').focus();
        $(button).text('확인');
        $(button).next().text('취소');
    } else if ($(button).text() === '확인') {
        const modifyComment = {
            id,
            userId: currentUser,
            content: comment.children('.content').find('input').val(),
        };
        await $.ajax({
            url: '/comment',
            type: 'put',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(modifyComment),
            success: (result) => {
                if(result) {
                    alert('글이 수정되었습니다');
                    comment.children('.content').html(result.content);
                    $(button).text('수정');
                    $(button).next().text('삭제');
                }
            }
        })
    }
}

async function deleteComment(button, id) {
    if (!chkLogin())
        return;

    if ($(button).text() === '삭제') {
        try {
            await $.ajax({
                url: `comment/${id}`,
                type: 'delete',
                success : (result) => {
                    if (result === true)
                        $(`#comment${id}`).remove();
                    alert('글이 삭제되었습니다');
                }
            });
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    } else if ($(button).text() === '취소') {
        const comment = $(`#comment${id}`);
        comment.children('.content').html(modifyContent);
        $(button).text('삭제');
        $(button).prev().text('수정');
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

                    $('#comments').children().remove();
                    getComments();
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
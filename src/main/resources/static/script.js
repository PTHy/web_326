let comments = [];
let users = [];

window.onload = () => {
    getUsers();
    getComments();
}

async function getComments() {
    console.log("아니 뭐냐고");
    try {
       comments = await $.get('/comment');
       this.drawComments();
    } catch (error) {
        console.error(error.message);
    }
}

function drawComments() {
    comments.map( comment => {
        this.drawComment(comment);
    })
}

function drawComment(comment) {
    $('#comments').append(
        `
        <div id= "comment${comment.id}" style="display: flex; border-bottom: solid 1px silver">
            <div style="width: 150px">${comment.username}</div>
            <div class="content" style="width: 350px;">${comment.content}</div>
            <div class="modifyContent" style="width: 350px; display: none;"><input class="inputContent" type="text"></div>
            <div class="modifyMode"><button onclick="deleteComment(${comment.id})">삭제</button></div>
            <div class="modifyMode"><button onclick="changeModifyMode(${comment.id})">수정</button></div>
            <div class="modifySubmit" style="display: none;"><button onclick="modifyCommentSubmit(${comment.id})">완료</button></div>
            <div class="modifySubmit" style="display: none;"><button onclick="cancelModify(${comment.id})">취소</button></div>
        </div> 
        `
    )
}

function cancelModify (id) {
    clearModifyInput(id);
    changeGeneralMode(id);
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
                        applyModify(id);
                        clearModifyInput(id);
                        changeGeneralMode(id);
                    }
                }
            })
}

function applyModify(id) {
    $(`#comment${id}`).children('.content').text($(`#comment${id}`).children('.modifyContent').children('.inputContent').val());
}

function changeModifyMode(id) {
    $(`#comment${id}`).children('.modifyContent').children('.inputContent').val($(`#comment${id}`).children('.content').text());

    const comment = $(`#comment${id}`);
    comment.children('.content').hide();
    comment.children('.modifyMode').hide();
    comment.children('.modifySubmit').show();
    comment.children('.modifyContent').show();
}

function changeGeneralMode(id) {
    const comment = $(`#comment${id}`);
    comment.children('.content').show();
    comment.children('.modifyMode').show();
    comment.children('.modifySubmit').hide();
    comment.children('.modifyContent').hide();
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

async function addComment() {
    try {
        let newComment = {
            userId: 1,
            content: $('#newComment').val(),
        };

        await $.ajax({
                    url: '/comment',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(newComment),
                    success: (result) => {
                        clearAddCommentInput();
                        drawComment(result);
                    }
                });
    } catch (error) {
        console.log( JSON.stringify(error));
    }
}

function clearAddCommentInput() {
    $('#newComment').val('');
}

function clearModifyInput(id) {
    $(`#comment${id}`).children('.modifyContent').children('.inputContent').val('');
}

async function uploadFile(id) {
    const file = $(`#upload-file${id}`)[0].files[0];
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
        console.log(JSON.stringify(error));
    }
}

async function addUser() {
    const username = $('#inputUsername').val();
    const email = $('#inputEmail').val();

    const data = {
        username,
        email
    };
    console.log(data);

    try {
        const response = await $.ajax({
            url: '/user',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (result) => {
                clearAddUserInput();
                drawUser(result);
            }
        });
    } catch (error) {
        console.error(error);
        alert("유저 추가에 실패하였습니다");
    }
}

function drawUsers() {
    users.map( user => {
        this.drawUser(user);
    });
}

function drawUser(user) {
    $('#users').append(
        `
        <div id= "user${user.id}" style="display: flex; border-bottom: solid 1px silver">
            <div style="width: 150px">${user.id}</div>
            <div class="username" style="width: 350px;">${user.username}</div>
            <div class="email" style="width: 350px;">${user.email}</div>
            <div class="profileImage" style="width: 350px; overflow: hidden; text-overflow: ellipsis">${user.profileImage}</div>
            <div class="modifyMode"><button onclick="deleteUser(${user.id})">삭제</button></div>
            <input type="file" id="upload-file${user.id}">
            <div><button onclick="changeProfilePhoto(${user.id})">프로필 사진 업로드</button></div>
        </div> 
        `
    )
}

async function deleteUser(id) {
    try {
        await $.ajax({
            url: `user/${id}`,
            type: 'delete',
            success : (result) => {
                if (result === true)
                    $(`#user${id}`).remove();
            }
        });
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}

async function getUsers() {
    try {
        users = await $.get('/user');
        this.drawUsers();
    } catch (error) {
        console.error(error.message);
    }
}


function clearAddUserInput() {
    $('#inputUsername').val('');
    $('#inputEmail').val('');
}

async function changeProfilePhoto (id) {
    const response = await uploadFile(id);
    const data = {
        id,
        profileImage: response.storedPath
    };

    console.log(data);

    try {
        await $.ajax({
            url: '/user',
            type: 'put',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (result) => {
                if(result)
                    alert("프로필 사진 변경에 성공하였습니다");
                $(`#user${id}`).children('.profileImage').text(result.profileImage);
            }
        })
    } catch (error) {
        console.error(error);
        alert("프로필 사진 변경에 실패하였습니다");
    }
}
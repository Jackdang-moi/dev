function register() {
    $.ajax({
        type: "POST",
        url: "/api/member",
        data: {
            nick_give: $('#nick').val(),
            id_give: $('#id').val(),
            pw_give: $('#pw').val(),
            confirm_give: $('#confirm').val(),
        },
        success: function (response) {
            if (response['result'] == 'success') {
                alert('회원가입이 완료되었습니다.')
                window.location.href = '/login'
            } else {
                alert(response['msg'])
            }
        }
    })
}

const clearEmail = function () {
    document.getElementById('id').value = ""
}

verifyEmail = function () {
    let email = $('#id').val();
    let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (email.match(regExp) == null) {
        clearEmail();
        $('#id').focus();
        alert("올바른 이메일 형식을 사용해주세요!");
    }
}
const clearPW = function () {
    document.getElementById('pw').value = ""
}

check_pw = function () {
    let p1 = $('#pw').val();

    let charac = /^.*(?=^.{6,10}$)(?=.*\d)(?=.*[!@#$%^&+=]).*$/;

    if (p1.match(charac) == null) {
        if (p1.match(charac) == null) {
            clearPW();
            $('#pw').focus();
            alert('비밀번호 규칙을 맞춰주세요!');
        }
    }
}

const clearConfirm = function () {
    document.getElementById('confirm').value = ""
}

function pw_test() {
    let p1 = document.getElementById('pw').value;
    let p2 = document.getElementById('confirm').value;

    if (p1 != p2) {
        clearConfirm();
        $('#confirm').focus();
        alert("비밀번호가 일치하지 않습니다!");
    }
}
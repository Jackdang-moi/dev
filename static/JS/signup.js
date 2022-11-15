function register() {
    $.ajax({
        type: "POST",
        url: "/api/member",
        data: {
            nick_give: $('#nick'),
            id_give: $('#id').val(),
            pw_give: $('#pw').val()
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

verifyEmail = function(){
    let email = $('#id').val();

    let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (email.match(regExp) != null){
        console.log('이메일 형식 확인')
    } else {
        alert("옳바른 이메일 형식을 사용해주세요!");
    }
}

function check_pw(){
    let p1 = $('#pw').val();

    let charac = /^.*(?=^.{6,10}$)(?=.*\d)(?=.*[!@#$%^&+=]).*$/;

    if(p1.match(charac) != null){
        console.log('비밀번호 형식 확인')
    } else {
        alert("비밀번호 규칙을 맞춰주세요!")
    }

}

function pw_test(){
    let p1 = document.getElementById('pw').value;
    let p2 = document.getElementById('confirm').value;

    if (p1 != p2) {
        alert("비밀번호가 일치하지 않습니다!");
        return false;
    } else {
        alert("비밀번호가 일치합니다.");
        return true;
    }
}
$(document).ready(function () {
  handleUpload();
});

function handleUpload() {
  let page_num = window.location.pathname.split("/")[2];

  $.ajax({
    type: "GET",
    url: "/detail",
    data: {},
    success: function (res) {
      console.log(res)
      res.data.map((data) => {
        if (page_num == data.order) {

          let title = data.title;
          let img = data.img;
          console.log(page_num, res.data.order, img);
          let description = data.description;

          html = `
                        <div class="img_container">
                        <img id="img_view" src="${img}" alt="" />
                        </div>
                       
                        <div class="input_field_conatiner">
                            <h2 class="detail_title">${title}</h2>
                            <div id="text_board">
                                ${description}
                            </div>
                            
                        </div>
                        <div class="comment_form">
                        <span class="comment_title">댓글란</span>
                        <span id="commentList_container">
                            <span class="reple_comment"></span>
                        </span>
                        <div class="comment_container">
                          <textarea id="comment_textarea" name="" id="" cols="30" rows="10"></textarea>
                          <button type="button" id="submit_comment_btn" type="button" onclick="comment_upload()">등록</button>
                        </div>
                      </div>
                      <div class="submit_btn_conatiner">
                                  <button class="submit_btn" type="button" onclick=window.location.href="/">돌아가기</button>
                            </div>
                        `;

          let upload_container = document.getElementById("upload_form");
          upload_container.insertAdjacentHTML("beforeend", html);
        }
      });
    },
  });
}

function comment_upload() {
  let comment = document.getElementById("comment_textarea").value;
  let path = window.location.pathname;
  console.log(path);
  $.ajax({
    type: "POST",
    url: `${path}`,
    data: { comment_description: comment ,give_path:path},
    success: function (res) {
      console.log(res);
    },
  });
}

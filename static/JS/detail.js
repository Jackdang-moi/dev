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
                            <div class="submit_btn_conatiner">
                                  <button class="submit_btn" type="button" onclick=window.location.href="/">돌아가기</button>
                            </div>
                        </div>
                        `;

          let upload_container = document.getElementById("upload_form");
          upload_container.insertAdjacentHTML("beforeend", html);
        }
      });
    },
  });
}

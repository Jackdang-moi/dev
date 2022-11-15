$(document).ready(function () {
  handleUpload();
});

function handleUpload() {
  $.ajax({
    type: "GET",
    url: "/detail",
    data: {},
    success: function (res) {
      res.data.slice(-1).map((data) => {
        let title = data.title;
        let img = data.img;
        let description = data.description;
        let html;
        if (document.getElementsByClassName("img_container").value == "") {
          html = `
      
                      <div class="input_field_conatiner">
                          <h2 class="detail_title">${title}</h2>
                          <div id="text_board">
                              ${description}
                          </div>
                          <div class="submit_btn_conatiner">
                                <button class="submit_btn" type="button" onclick="send()">돌아가기</button>
                          </div>
                      </div>
                      `;
        }
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
                                <button class="submit_btn" type="button" onclick="send()">돌아가기</button>
                          </div>
                      </div>
                      `;

        let upload_container = document.getElementById("upload_form");
        upload_container.insertAdjacentHTML("beforeend", html);
      });
    },
  });
}
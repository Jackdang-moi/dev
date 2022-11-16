$(document).ready(function () {
  listing();
});

function listing() {
  $.ajax({
    type: "GET",
    url: "/detail",
    data: {},
    success: function (response) {
      let rows = response["data"];
      for (let i = 0; i < rows.length; i++) {
        let image = rows[i]["img"];
        let title = rows[i]["title"];
        let description = rows[i]["description"];
        let order = rows[i]["order"];

        let temp_html = `
                                    <li>
                                       <div class="image"><img src="${image}" onclick="window.location.href='/detail/${order}'"></div>
                                       <div class="content_container">
                                            <span class="title">${title}</span>
                                            <span class="description">
                                                ${description}
                                            </span>
                                            
                                       </div>
                                    </li>
                               `;
        $(".card_inner").append(temp_html);
      }
    },
  });
}

function logout() {
  $.removeCookie("mytoken");
  window.location.href = "/";
}

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
                                       <div class="image"><img src="${image}"></div>
                                       <div class="content-container">
                                            <div class="title"><h5>${title}</h5></div>
                                            <div class="description">${description}</div>
                                            
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

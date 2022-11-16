function handleImg(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("img_view").setAttribute("src", e.target.result);
      document.getElementById("img_view").style.display = "block";
      document.getElementById("img_text").remove();
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function send() {
  let img = document.getElementById("img_view").src;
  let title = document.getElementById("upload_title").value;
  let description = document.getElementById("upload_textarea").value;

  $.ajax({
    type: "POST",
    url: "/api/upload",
    data: {
      upload_img: img,
      upload_title: title,
      upload_description: description,
    },
    success: function (res) {
      window.location.href = "/";
    },
  });
}

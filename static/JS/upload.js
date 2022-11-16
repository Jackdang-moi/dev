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

let isOn = false;
function send() {
  if (!isOn) {
    isOn = true;
    let img = document.getElementById("img_view").src;
    let title = document.getElementById("upload_title").value;
    let description = document.getElementById("upload_textarea").value;
    if (img.indexOf("api/upload") != -1) {
      img =
        "https://tistory1.daumcdn.net/tistory/3057861/attach/d077cf500eb348cab0fbb8f4a5b7a288";
    }
    setTimeout(() => {
      isOn = false;
    }, 3000);
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
}

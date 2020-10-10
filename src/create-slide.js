let sketch = require("sketch");
let fs = require("@skpm/fs");

export default (
  artboards,
  /* = [{
      object: artboard,
      name: string
      backgroundColor: string,
      bounds: {
        width: px
        height: px
      }]
    }*/
  options, slideName
) => {
  // export file
  let imgFiles = [];
  artboards.map((artboard) => {
    sketch.export(artboard.object, options);
    let img = {
        bounds: artboard.bounds,
        path: options.output + "/" + artboard.name + "@" + options.scales + "x." + options.formats
    }
    imgFiles.push(img);
  });
  let htmlFile = `${options.output}/index.html`;
  console.log(htmlFile)

  console.log(imgFiles);
  // create html
  let html = `<!DOCTYPE html>
  <html>
  <head>
      <title>${slideName} Slides</title>
      <style type="text/css">
      body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          color: #fff;
      }

      .slideshow {
          margin: 0;
          padding: 0;
      }

      .page {
          max-width: 100%;
          max-height: 100%;
          overflow: scroll;
          position: absolute;
          display: none;
      }

      .page.show {
          display: block;
      }

      .alert {
          position: absolute;
          width: 100%;
          text-align: center;
      }

      .alert p {
          width: 200px;
          height: 48px;
          line-height: 48px;
          background: #000000e6;
          border: solid 1px #ffffff20;
          margin: auto;
          margin-top: -50px;
          display: none;
      }

      .alert p.show {
          transform: translateY(49px);
          display: block;
      }
      </style>
  </head>
  <body>
      <div class="slideshow">
          ${imgFiles.map(file => '<section class="page"><img src="'+ file.path + '"width="' + file.bounds.width + 'px" height="'+ file.bounds.height + 'px"></section>').join('\n')}
      </div>
      <div class="alert">
          <p class="reach-end">Reach the end</p>
          <p class="reach-top">Reach the top</p>
      </div>
      <script>
      document.addEventListener("keydown", switchSlide);
      const slides = document.getElementsByClassName("page");
      const alertEnd = document.getElementsByClassName("reach-end");
      const alertTop = document.getElementsByClassName("reach-top");

      let pageNum = 0;
      slides[0].classList.add("show");

      function hideSlide(pageNum) {
          slides[pageNum].classList.remove("show");
      }

      function showSlide(pageNum) {
          slides[pageNum].classList.add("show");
      }

      function nextSlide() {
          hideSlide(pageNum);
          pageNum = pageNum + 1;
          showSlide(pageNum);
      }

      function prevSlide() {
          hideSlide(pageNum);
          pageNum = pageNum - 1;
          showSlide(pageNum);
      }

      function switchSlide(event) {
          let key = event.keyCode;
          // console.log(key)

          // Press key Arrow Right, K, Space switch to the next slide
          if ((key == 39) | (key == 32) | (key == 75)) {
              console.log("Next Slide");
              event.preventDefault();
              if (pageNum < slides.length - 1) {
                  nextSlide();
              } else {
                  console.log("Reach End");
                  alertTop[0].classList.remove("show");
                  alertEnd[0].classList.add("show");
                  setTimeout(function() {
                      alertEnd[0].classList.remove("show");
                  }, 2000);
              }
          }

          // Press Arrow Left, J switch to the previous slide
          if ((key == 37) | (key == 74)) {
              console.log("Prev Slide");
              event.preventDefault();
              if (pageNum > 0) {
                  prevSlide();
              } else {
                  console.log("Reach Top");
                  alertEnd[0].classList.remove("show");
                  alertTop[0].classList.add("show");
                  setTimeout(function() {
                      alertTop[0].classList.remove("show");
                  }, 2000);
              }
          }
      }
      </script>
  </body>
  </html>`;
  // create file
  fs.writeFileSync(htmlFile, html);
  console.log(html)
  // return file
  return htmlFile;
};

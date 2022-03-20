var http = require("http");
var port = 8080;
var fs = require("fs");

var service = http.createServer((req, res) => {
    //code
    let method = req.method;
    let url = req.url;
    let result = `Welcome to Services Node - Method ${method} -url:${url}`;

    if (method == "GET") {
        switch (url) {
            case "/dsTivi":
                result = fs.readFileSync("./data/Danh_sach_Tivi.json", "utf-8");
                res.writeHead(200, { "Content-Type": "text/json; charset=utf8" });
                break;
            case "/dsNguoidung":
                result = fs.readFileSync("./data/Danh_sach_Nguoi_dung.json", "utf-8");
                res.writeHead(200, { "Content-Type": "text/json; charset=utf8" });
                break;
            default:
                if (url.match("\.png$")) {
                    let imgPath = "images/" + url;
                    if (!fs.existsSync(imgPath)) {
                        imgPath = "images/KHAC.png"
                    }
                    let fileStream = fs.createReadStream(imgPath);
                    res.writeHead(200, { "Content-Type": "image/png" })
                    fileStream.pipe(res);
                    return;
                }
                else {
                    result = "API không khả thi";
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf8" });
                }

        }
    } else if (method == "POST") {
        let noi_dung_nhan = ``
        req.on("data", function (data) {
            noi_dung_nhan += data
        });
        if (url == "/themNguoidung") {
            result = "Thêm người dùng";
            res.writeHead(200, { "Content-Type": "text/json; charset=utf8" });
        }
    } else {
        result = "API không khả thi";
        res.writeHead(200, { "Content-Type": "text/json; charset=utf8" });
    }

    res.end(result);
})
service.listen(port, function (error) {
    if (error) {
        console.log(error);
    }
    console.log('Server is running port:' + port);
});
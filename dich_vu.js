const http = require("http");
const port = normalizePort(process.env.PORT || 8080);
const fs = require("fs");

const dich_vu = http.createServer(
    (req, res) => {

        let url = req.url
        let method = req.method
        res.setHeader("Access-Control-Allow-Origin", '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        let kq = `Server nodejs url:${url} - method:${method}`
        if (method == "GET") {
            if (url == "/dsTivi") {
                let path = "./data/Danh_sach_Tivi.json"
                kq = fs.readFileSync(path, "utf8")
                res.end(kq)
            } else if (url == "/dsNguoidung") {
                let path = "./data/Danh_sach_Nguoi_dung.json"
                kq = fs.readFileSync(path, "utf8")
                res.end(kq)
            } else if (req.url.match("\.png$")) {
                let imgPath = `images/${req.url}`
                if (fs.existsSync(imgPath)) {
                    let fileStream = fs.createReadStream(imgPath)
                    res.writeHead(200, { "Content-Type": "image/png" })
                    fileStream.pipe(res)
                } else {
                    imgPath = `images/KHAC.png`
                    let fileStream = fs.createReadStream(imgPath)
                    res.writeHead(200, { "Content-Type": "image/png" })
                    fileStream.pipe(res)
                }
            } else {
                res.end('')
            }
        } else if (method == "POST") {
            let noi_dung_nhan = ``
            req.on("data", function (data) {
                noi_dung_nhan += data
            })

            if (url == "/ThemNguoidung") {
                req.on("end", function () {
                    let kqThem = {
                        "Noi_dung": "Lỗi Cập nhật"
                    }
                    let nguoiDung = JSON.parse(noi_dung_nhan)
                    let path = "./data/Danh_sach_Nguoi_dung.json";
                    let chuoi = fs.readFileSync(path, "utf8");
                    let dsNguoidung = JSON.parse(chuoi);
                    dsNguoidung.push(nguoiDung);
                    fs.writeFileSync(path, JSON.stringify(dsNguoidung), "utf8")
                    kqThem.Noi_dung = true
                    res.end(JSON.stringify(kqThem))

                })
            } else if (url == "/SuaNguoidung") {
                req.on("end", function () {
                    let kqSua = {
                        "Noi_dung": "Lỗi Cập nhật"
                    }
                    let nguoiDung = JSON.parse(noi_dung_nhan)
                    let path = "./data/Danh_sach_Nguoi_dung.json";
                    let chuoi = fs.readFileSync(path, "utf8");
                    let dsNguoidung = JSON.parse(chuoi);
                    let vt = dsNguoidung.findIndex(x => x.Ma_so == nguoiDung.Ma_so);
                    if (vt >= 0) {
                        dsNguoidung[vt].Ho_ten = nguoiDung.Ho_ten
                        fs.writeFileSync(path, JSON.stringify(dsNguoidung), "utf8")
                        kqSua.Noi_dung = true
                        res.end(JSON.stringify(kqSua))
                    } else {
                        res.end(JSON.stringify(kqSua))
                    }
                })
            } else if (url == "/XoaNguoidung") {
                req.on("end", function () {
                    let kqXoa = {
                        "Noi_dung": "Lỗi Cập nhật"
                    }
                    let nguoiDung = JSON.parse(noi_dung_nhan)
                    let path = "./data/Danh_sach_Nguoi_dung.json";
                    let chuoi = fs.readFileSync(path, "utf8");
                    let dsNguoidung = JSON.parse(chuoi);
                    let vt = dsNguoidung.findIndex(x => x.Ma_so == nguoiDung.Ma_so);
                    if (vt >= 0) {
                        dsNguoidung.splice(vt, 1)
                        fs.writeFileSync(path, JSON.stringify(dsNguoidung), "utf8")
                        kqXoa.Noi_dung = true
                        res.end(JSON.stringify(kqXoa))
                    } else {
                        res.end(JSON.stringify(kqXoa))
                    }
                })
            } else {
                res.end('')
            }

        } else {
            res.end(kq)
        }

    }
);

dich_vu.listen(port,
    console.log('Server running http://localhost:' + port)
);

dich_vu.on('error', onError);
dich_vu.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = dich_vu.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
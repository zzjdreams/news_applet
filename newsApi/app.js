var http = require("http");
var fs = require("fs");
var url = require("url");

var server = http.createServer(function(req,res){

    if(req.url != "/favicon.ico"){

        if(req.method == "GET"){

            var urlParams = url.parse(req.url,true);

            var page = urlParams.query.page ? urlParams.query.page : 1;

            var pageSize = urlParams.query.pageSize ? urlParams.query.pageSize : 5;

            if(urlParams.pathname == "/api/news/list"){
                res.writeHeader(200,{
                    'content-type' : 'text/html;charset="utf-8"',
                    'Access-Control-Allow-Origin': '*'
                });

                fs.readFile('./news.json',"utf-8" ,function(err, data) {
                    // 读取文件失败/错误
                    if (err) {
                        throw err;
                    }
                    var data = JSON.parse(data);
                    var resData = [];
                    var startIdx = (page-1)*pageSize;
                    var len = (data.length - startIdx) > pageSize ? pageSize : data.length - startIdx;

                    for(var i=0;i<len;i++){

                        var arr = {
                            "id":data[startIdx+i].id,
                            "title":data[startIdx+i].title,
                            "pic_img":data[startIdx+i].pic_img,
                            "author":data[startIdx+i].author,
                            "time":data[startIdx+i].time,
                            "view_num":data[startIdx+i].view_num
                        };

                        resData.push(arr);
                    }

                    // 读取文件成功
                    res.write(JSON.stringify(resData));
                    res.end();
                });
            }else if(urlParams.pathname == "/api/news"){

                var id = urlParams.query.id;
                if(!id){
                    res.writeHeader(200,{
                        'content-type' : 'text/html;charset="utf-8"',
                        'Access-Control-Allow-Origin': '*'
                    });

                    // 读取文件成功
                    res.write({"code":"err","message":"请求不合法！"});
                    res.end();
                }else{
                    res.writeHeader(200,{
                        'content-type' : 'text/html;charset="utf-8"',
                        'Access-Control-Allow-Origin': '*'
                    });

                    fs.readFile('./news.json',"utf-8" ,function(err, data) {
                        // 读取文件失败/错误
                        if (err) {
                            throw err;
                        }
                        var data = JSON.parse(data);
                        var news = null;
                        var n = -1;
                        for(var i=0;i<data.length;i++){
                            if(id == data[i].id){
                                news = data[i];
                                n = i;
                                break;
                            }
                        }

                        if(!!news){
                            //修改查看数
                            var writeData = data;
                            writeData[n].view_num = writeData[n].view_num + 1;
                            fs.writeFile('./news.json',JSON.stringify(writeData),function(err){
                                console.log("查看数修改写入失败！");
                            });
                        }
                        // 读取文件成功
                        res.write(JSON.stringify(news));
                        res.end();
                    });
                }

            }else{
                res.writeHeader(403,{
                    'content-type' : 'text/html;charset="utf-8"'
                });

                res.write("没有权限操作");
                res.end();
            }

        }else{
            res.writeHeader(403,{
                    'content-type' : 'text/html;charset="utf-8"'
                });

            res.write("拒绝该操作");
            res.end();
        }     

    }
}).listen(8888);


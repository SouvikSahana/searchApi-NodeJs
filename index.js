const axios=require('axios')
const cheerio=require('cheerio')
const express=require('express')
const cors=require('cors')
const fs=require('fs')
const {checkerData, getAttached , timeChange} =require('./similar')

const app=express()
app.use(cors())
const port = process.env.PORT || 5000

app.get('/query',(req,res)=>{
    var url=req.query.search
    var type=req.query.type
    var admin=req.query.password;

    if(url){
        var searchValue=url
        url= url.replace(" ","+");
        //for News & Image Google uses some fixed url..
        var imgUrl="https://www.google.com/search?q="+url+"+photos&sxsrf=ALiCzsZgAfyfb3iRcEE83O1eQmMl9d2QEw:1660452212413&source=lnms&tbm=isch&sa=X&ved=2ahUKEwj276XCwsX5AhUqR2wGHWRDBbgQ_AUoAXoECAEQAw&biw=1920&bih=922&dpr=1"
        var newsUrl="https://www.google.com/search?q="+url+"+&bih=922&biw=1920&hl=en-GB&tbm=nws&sxsrf=ALiCzsY9ZO-r_2e_TkzV9oHnb4PsSaO2NQ%3A1660459437873&ei=rZn4Ypa8NPTW2roPtJ2cuAY&ved=0ahUKEwjWxtS33cX5AhV0q1YBHbQOB2cQ4dUDCA0&uact=5&oq=jervis+&gs_lcp=Cgxnd3Mtd2l6LW5ld3MQAzIICAAQsQMQkQIyBQgAEJECMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgARQyQRY1Ahgvg5oAHAAeACAAaEHiAHLDJIBBzMtMi42LTGYAQCgAQHAAQE&sclient=gws-wiz-news"
        url="https://www.google.com/search?q="+ url;
    
        //save data of searching 
        const d=new Date()
        fs.appendFileSync('history.txt',searchValue+" : "+type+ " : "+d+"\n")

        //for images
        if(type=="images"){
            axios(imgUrl)
        .then(response=>{
            const html= response.data
            const $=cheerio.load(html)
            const images=[]
           $('img',html).each(function(){
            var image=$(this).attr('src')
                if(image){
                    const index=image.indexOf('https')
                        if(index>=0){
                             image=image.slice(index)
                             images.push(image)
                        }
                }
            })
            //If images available in google then send to client
            if(images[0]){
                res.send({
                images: images     
            })
            }else{
            //If images not available in google
                res.send({
                    code:"Your search - "+searchValue+" - did not match any news results."  ,
                    description: "Try another search"
                })
            }
        }) 
        }
         //for links
        else if(type=="links"){
        axios(url)
        .then(response=>{
            const html= response.data
            const $=cheerio.load(html)
            const links=[]
            $('a',html).each(function(){
                 var link=$(this).attr('href')
                if(link){
                    const index=link.indexOf('https')
                    if(index>=0){
                    link=link.slice(index)
                    const arrLength=links.length-1;
                if(arrLength>-1){
                    if( links[arrLength].indexOf(link)>-1 ){
                    }else if(link.indexOf(links[arrLength])>-1){
                        links.pop()
                        links.push(link)
                    }else{
                        links.push(link)
                    }
                }else{
                    links.push(link)
                }
                    }
                }
           })
           if(links[0]){
            res.send({
                links: links     
            })
           }else{
            res.send({
                code:"Your search - "+searchValue+" - did not match any news results."  ,
                description: "Try another search"
            })
           }
        }) 
        }
        //for news
         else if(type=="news"){ 
        axios(newsUrl)
        .then(response=>{
            const html= response.data
            const $=cheerio.load(html)
            const news=[]
            $('.Gx5Zad',html).each(function(){
                var link=$(this).find('a').attr('href')
                const data=$(this).find('.s3v9rd').text()
                const source=$(this).find('.UPmit').text()
                const heading=$(this).find('.vvjwJb').text()
                if(link){
                    const index=link.indexOf('https')
                    if(index>=0){
                    link=link.slice(index)
                    news.push({source,heading,data, link})
                    }
                }
           })
           if(news[0]){
            res.send({
                news: news   
            })
           }else{
            res.send({
                code:"Your search - "+searchValue+" - did not match any news results."  ,
                description: "Try another search"
            })
           }
          
        }) 
        }
        //As We search in google but all links are disabled
        else if(type=="html"){
        axios(url)
        .then(response=>{
            var html= response.data
           html= html.replaceAll('�',"")
           html=  html.replaceAll('href',"atr")
           html=  html.replaceAll('type="submit"','type="button"')
            var $=cheerio.load(html)
           const footer= $('.Srfpq').html()
            $.prototype.printHtml=function(){
                res.send(this.html().replace(footer,""))
            }
           $('html').printHtml()
        }) 
        }
        else if(type=="test"){
        axios(url)
        .then(response=>{
            var html= response.data
            var $=cheerio.load(html)
            $.prototype.printHtml=function(){
                res.send(this.html())
            }
           $('#main').printHtml()
        }) 
         }
          // only for text
         else{
            getAttached(req.query.search)
        axios(url)
        .then(response=>{
            const html= response.data
            const $=cheerio.load(html)
            const webData=[]
            const searchValue= $(".lRVwie").text()
             $('.BNeawe',html).each(function(){
                var text=$(this).text()
                text=text.replaceAll('�'," ")
                text=text.replaceAll('...'," ")
                text=text.replaceAll('\n',"")
                if(searchValue.includes(text) || checkerData.includes(text.toLowerCase())){
                    // console.log(text)
                }else{
                    const arrLength=webData.length-1;
                if(arrLength>-1){
                    if( webData[arrLength].toLowerCase().indexOf(text.toLowerCase())>-1 ){
                    }else if(text.toLowerCase().indexOf(webData[arrLength].toLowerCase())>-1){
                        webData.pop()
                        webData.push(text)
                    }else{
                        webData.push(text)
                    }
                }else{
                    webData.push(text)
                }
                }
                
            })
            if(webData[0]=="Related searches" || webData.length==2){
                res.send({
                    code:"Your search - "+searchValue+" - did not match any news results."  ,
                    description: webData[0]+" : " +webData[1]
                })
               }else if(webData.length>2){
                res.send({
                    text: webData    
                })
               } else{
                res.send({
                    code:"Your search - "+searchValue+" - did not match any news results."  ,
                    description: "Try another search"
                })
               }
        }) 
         }
    }
    //for admin purpose
    else if(admin=="sja12345"){
        fs.readFile('test.txt','utf8',(err,data)=>{
          const array=data.split("\n")
          res.send({
            array
          })
         })         
    }
     //If user not provide any data
    else{
        res.send({
            code: 'Error',
            description: "Please provide some value"
        })
    } 
})

app.get("*",(req,res)=>{
    res.send({
        code:"This is an api website",
        describe: "type  https://search-api-ss.herokuapp.com/query?search=<your search value>&type=<links or images or html or news>"
    })
})

app.listen(port,()=>{
    console.log("Listening..")
})

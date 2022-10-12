//Remmove all unnecessary data of "text" format data
var checkerData=[]

 const similarData= [
    "People also ask",
    "View all",
    "Related searches",
    "View on Twitter",
    "Top stories",
    "View on Twitter",
    "See results about",
    "www.livescience.com › References",
    "www.britannica.com › ... › Businesspeople & Entrepreneurs",
    "Open in Maps",
    "Images",
    "en.wikipedia.org › wiki"
]

const valueChange=[
    "en.wikipedia.org › wiki › #12ss",
    "#12ss - Forbes",
    "www.forbes.com › profile › #12ss", 
    "#12ss ✓",
    "Twitter › #12ss",
    "www.instagram.com › #12ss",
    "#12ss - CNBC",
    "www.cnbc.com › #12ss",
    "#12ss - Business Standard",
    "www.business-standard.com › about › who-is-#12ss",
    "#12ss - Wikipedia",
    "sam.gleske.net › #12ss"

]
const timeChange=[
    "Times Now\n3 hours ago",
    "Moneycontrol\n1 hour ago",
    "The Quint\n1 day ago",
    "Business Insider India\n2 days ago",
    "News18\n21 hours ago",
    "Business Standard\n1 day ago",
    "Republic World\n16 hours ago",
    "Times of India\n2 days ago",
    "HT Tech\n14 hours ago",
    "ThePrint\n2 days ago",
    "Twitter • 6 hours ago",
    "Twitter • 1 day ",
    "The Guardian\n3 hours ago"
]

function getAttached(Value){
    similarData.forEach((text)=>{
        checkerData.push(text.toLowerCase())
    })

    const star=Value.split(" ")
    const type1=star.join("-")
    const type2=star.join("_")
    const type3=star.join("")
    const type4=star.join(" ")
    
valueChange.forEach((text)=>{
    const star1=text.replace('#12ss', type1).toLowerCase()
    const star2=text.replace('#12ss', type2).toLowerCase()
    const star3=text.replace('#12ss', type3).toLowerCase()
    const star4=text.replace('#12ss', type4).toLowerCase()
    checkerData.push(star1)
    checkerData.push(star2)
    checkerData.push(star3)
    checkerData.push(star4)
})
}

module.exports= {checkerData, getAttached , timeChange}
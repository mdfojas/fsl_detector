export const labelMap = {
    1:{name:'A'},
    2:{name:'B'},
    3:{name:'C'},
    4:{name:'D'},
    5:{name:'E'},
    6:{name:'F'},
    7:{name:'G'},
    8:{name:'H'},
    9:{name:'I'},
    10:{name:'K'},
    11:{name:'L'},
    12:{name:'M'},
    13:{name:'N'},
    14:{name:'O'},
    15:{name:'P'},
    16:{name:'Q'},
    17:{name:'R'},
    18:{name:'S'},
    19:{name:'T'},
    20:{name:'U'},
    21:{name:'V'},
    22:{name:'W'},
    23:{name:'X'},
    24:{name:'Y'},
}

export const labels = ["A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y"];

// Define a drawing function
export const drawRect = (setDetectEnabled,scoreUpdate, setScoreUpdate, setScore,score,currentQuestion, boxes, classes, scores, threshold, imgWidth, imgHeight, ctx, isQuiz, setResult)=>{
    const maxScoreIndex = scores.indexOf(Math.max(...scores));
    const possibleSign = labelMap[classes[maxScoreIndex]]['name'];
    if(scores[maxScoreIndex]>= threshold){
        setResult(possibleSign)
    }else{
        // Show that none is detected
        setResult("")
        drawRetry(ctx,imgWidth, imgHeight);
        return
    }
    
    // console.log("Sign detected: ",possibleSign, " --- confidence: ", Math.max(...scores));

    //update the score if it is a quiz, and signer is right
    if(isQuiz){
        if (currentQuestion === possibleSign && scoreUpdate){
            console.log("Updating score")
            setScore(score+1)
        }
        setScoreUpdate(false) //do not update score if already updated, or set it to false so that it wouldnt be updated when the first detecion is false, and the user retried and corrected himself
        setDetectEnabled(false)
    }

    drawBox(boxes[maxScoreIndex], classes[maxScoreIndex], scores[maxScoreIndex], ctx, threshold,isQuiz, currentQuestion,imgWidth, imgHeight)
}

const drawRetry = (ctx,imgWidth, imgHeight )=>{
    const text = "Couldn't detect a sign, please sign again properly."
    ctx.strokeStyle = "red"
    ctx.fillStyle = 'red'
    ctx.font = '29px Arial' 
    ctx.scale(-1, 1);
    ctx.fillText(text, -imgWidth, (imgHeight*.10))
    
}

const drawBox = (box, sign_class, score, ctx, threshold, isQuiz, currentQuestion,imgWidth, imgHeight )=>{
    if(box && sign_class && score>threshold){ 

        // Extract variables
        const [y,x,height,width] = box
        const text = sign_class

        // Set styling, in the quiz mode, if the sign does not match the sign asked, show with red detection
        if(isQuiz && !(currentQuestion === labelMap[sign_class]['name']) ){
            ctx.strokeStyle = "red"
            ctx.fillStyle = 'red'
        }else{
            ctx.strokeStyle = "green"
            ctx.fillStyle = 'green'
        }
        
        ctx.lineWidth = 5 //width of box
        ctx.font = '30px Arial' //font nung detected
        
        // Draw bounding box
        ctx.beginPath()
        
        ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
        ctx.stroke()

        ctx.scale(-1, 1);
        ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(score*100)/100, (-x)*imgWidth*2, y*imgHeight-10)
    }
}
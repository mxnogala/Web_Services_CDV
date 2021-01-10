const parse= (data) => {
    var toJson="{\"";
    var isOpen=false;

        for (let i=0; i<data.length; i++)
           {
               if (data[i]==":")
               {
                    toJson+="\":";
                    let isNumberTmp=parseInt(data[i+1]);
                    let isNumber=isNaN(isNumberTmp);
                   if (isNumber)
                   {
                       toJson+="{\"";
                       isOpen=true;
                   }
                    
               }
               else if (data[i]==";")
               {
                   if(isOpen)
                   {
                       toJson+="}";
                       isOpen=false;
                   }
                   toJson+=",\"";
               }
               else if (data[i]==",")
               {
                   toJson+=",\"";
               }
               else {
                   toJson+=data[i];
               }
           }
           if(isOpen)
               {
                   toJson+="}";
               }
            toJson+="}";
            toJson.trim();

            return JSON.parse(toJson);
}

module.exports= {
    parse,
};

          

class apifeatures{          
      constructor(query,querystr){
        this.query = query;
        this.querystr = querystr;
      }

      filter(){

        let queryString =  JSON.stringify(this.querystr);       // convert req.query into string 
        queryString =  queryString.replace(/\b(gte|gt|lt|lte)\b/g,(match)=> `$${match}`); // age[gte]=34 --> age{gte: 34}
        const queryObj = JSON.parse(queryString);
    
      
       this.query =  this.query.find(queryObj);

        return this;
      }

      sort(){

        if(this.querystr.sort){
            let at = this.querystr.sort.split(',').join(' ');
         this.query =  this.query.sort(at);
          }
        //   else{
        //     this.query = this.query.sort('-createdAt');
        //   }
        return this;
      }

      limitFields(){
        if(this.querystr.fields){
            let queryString =   this.querystr.fields.split(',').join(" ");
             this.query =  this.query.select(queryString);
       }
       else{
        this.query = this.query.select('-__v ');
       }
       return this;
      }
      pagination(){
        // limit and skip.......
        let page = this.querystr.page || 1;
        let limit = this.querystr.limit || 10;
        let skip = (page-1)*limit;

      this.query = this.query.skip(skip).limit(limit);

        // if(this.query.page){
        //     const petcount = await this.query.countDocuments();
        //     if(skip>=petcount){
        //       throw new Error("This page is not found!");
        //     }
        //   }
        return this;
      }
}

module.exports = apifeatures;
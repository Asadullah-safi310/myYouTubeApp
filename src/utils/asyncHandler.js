
//?.........asyncHandler With Promise.resolve .................
const asyncHandler = ( requestHandler )=>{
    (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next)).catch((error)=>{next(error)}); 
    }
}
export { asyncHandler };








//? ...............asyncHandler With Tyr catch .....................
/* 
const asyncHandler = ( fn )=>{  
return async (req, res, next)=> {
     try {
         await fn(req, res, next);
     }
     catch (error){
         res.status( error.code || 500 ).json({
             success: false,
             message: error.message
         })
     }
  }
 }
 export { asyncHandler };
*/





















// Since asyncHandler(fn) returns a new function that also expects (req, res, next), Express passes fn function's parmeters to the new returnning function automatically.

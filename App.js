const {listOfAllRepo}=require('./utilities/gitHubApi.js')

//just call this function by using await
const gitDetails=async()=>{
 console.log(await listOfAllRepo());   
}
gitDetails()
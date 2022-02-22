const { Octokit } = require("@octokit/rest");
const configData = require('../config/gitConfig.json')

const octokit = new Octokit({
  auth: configData.personalToken,
});

//get info of branch
const branch = async (owner, repo) => {
  const data = await octokit.rest.repos.listBranches({
    owner: owner,
    repo: repo,
  })

  let array = []
  let protectBranch = 0
  for (let i = 0; i < data.data.length; i++) {

    array.push(data.data[i].name);
    if (data.data[i].protected) {
      protectBranch += 1
    }

  }
  let result = { 'noOfBranchInWorkingOrgRepo': array.length, 'listOfBranchInWorkingOrgRepo': array, 'protectedBranch': protectBranch }

  return result
}

//get details of collab with permissison
const collaborator = async (owner, repo) => {
  let list = await octokit.rest.repos.listCollaborators({
    owner: owner,
    repo: repo,
  })

  let array = []

  for (let i = 0; i < list.data.length; i++) {
    let permission = ""

    if (list.data[i].permissions.admin) {
      permission += "admin"
    }
    if (list.data[i].permissions.pull) {
      permission += " pull"
    }
    if (list.data[i].permissions.push) {
      permission += " push"
    }
    array.push({ 'name': list.data[i].login, 'permision': permission });


  }
  let result = { 'noOfCollaborator': array.length, 'listOfAllCollaborator': array }

  return result
}


const listOfAllRepo = async () => {
  const data = await octokit.rest.repos.listForAuthenticatedUser({ type: 'all' });

  let array = []


  for (let i = 0; i < data.data.length; i++) {
    let result = {}
    if(data.data[i].permissions.push==true){
    result['REPO'] = data.data[i].full_name
    if (data.data[i].private) {
      result['STATUS'] = 'Private'
    }
    else {
      result['STATUS'] = 'Public'
    }

    let branchDetails = await branch(data.data[i].owner.login, data.data[i].name)
    result['NOOFBranch'] = branchDetails.noOfBranchInWorkingOrgRepo
    result['PROTECTEDBRANCH'] = branchDetails.protectedBranch

    
      let collabDetails = await collaborator(data.data[i].owner.login, data.data[i].name).catch(err => console.log(err))
      result['COLLABORATOR'] = collabDetails.listOfAllCollaborator
    
    array.push(result)

  }
}

  return array

}


module.exports={listOfAllRepo}


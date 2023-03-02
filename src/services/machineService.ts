import axios from 'axios'
import {writeMachineSession} from './sessionService'

export const getMachine = async (machineID: string) => {
  // call api
  const resp = await axios.get(`${process.env.FLY_API_HOSTNAME}/v1/apps/${process.env.FLY_APP_NAME}/machines/${machineID}`, {
    headers: {
      'Authorization': `Bearer ${process.env.FLY_API_TOKEN}`
    }
  })
  return resp.data
}

export const createMachine = async(config: any, id: string) => {
  const conf = JSON.stringify({
    config
  })
  try {
    const resp = await axios({
      method: "POST",
      url: `${process.env.FLY_API_HOSTNAME}/v1/apps/${process.env.FLY_APP_NAME}/machines`,
      headers: {
        'Authorization': `Bearer ${process.env.FLY_API_TOKEN}`
      },
      data: conf
    })
    // write to file
    writeMachineSession(id, resp.data)
    return resp.data
  } catch(err) {
    console.log(err)
    console.log("erroring")
  }
}

export const runQuery = async(query: machineQuery, id: string) => {
  // get rest
  const {method, machineID, config} = query
  console.log("running")
  switch (method) {
    case "GET":
      return await getMachine(machineID as string)
    case "POST":
      return await createMachine(config, id)
    default:
      return Error("no query could be built")
  }
}
import axios from 'axios'

export const getMachine = async (machineID: string) => {
  // call api
  console.log("response", `${process.env.FLY_API_HOSTNAME}/v1/apps/${process.env.FLY_APP_NAME}/machines/${machineID}`)
  const { data } = await axios.get(`${process.env.FLY_API_HOSTNAME}/v1/apps/${process.env.FLY_APP_NAME}/machines/${machineID}`, {
    headers: {
      'Authorization': `Bearer ${process.env.FLY_API_TOKEN}`
    }
  })
  
  return data
}
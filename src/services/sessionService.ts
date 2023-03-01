import fs from "fs"

// move this to db service
export const retrieveMachineSession = async (id: string) => {
  const data = await fs.promises.readFile("./src/data/machines.json", "utf8")
  const jsonified = JSON.parse(data)
  if (jsonified[id] == undefined) {
    throw Error("machine doesn't exist!")
  }
  return jsonified[id].id
}

export const buildMachineQuery = async(id: string) => {
  //read file service
  try {
    // let query: machineQuery
    const machineID = await retrieveMachineSession(id)
    const query: machineQuery = {
      method: "GET",
      machineID
    }
    console.log("query is", query)
    return query
    // return { method: "", machineID: "", config: {} }
  } catch(err) {
    console.log("there was an error", err)
    // generally machine doesn't exist

  }
}
